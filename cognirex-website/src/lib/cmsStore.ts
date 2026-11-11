import fs from "fs";
import path from "path";
import os from "os";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import { CMS_SECTIONS, DEFAULT_COGNIR_CONTENT } from "@/data/cmsDefaults";
import type { CmsSectionKey, CognirexContentBundle } from "@/types/cms";
import {
  WebsiteContentModel,
  CmsUserModel,
  CmsSettingsModel,
  MediaLibraryModel,
  ContactInquiryModel,
  ConsultationRequestModel,
  CareerApplicationModel,
  ActivityLogModel,
} from "./cmsModels";
import type {
  CareerApplicationSubmission,
  ContactEnquirySubmission,
  MeetingRequestSubmission,
} from "@/types";

function resolveDataDir(): string {
  // In serverless environments (Vercel, AWS Lambda, Cloudflare),
  // process.cwd() is read-only. We safely use os.tmpdir() for local fallback.
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NODE_ENV === "production") {
    return path.join(os.tmpdir(), "cognirex-data");
  }
  return path.join(process.cwd(), ".data");
}

let DATA_DIR = resolveDataDir();
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads", "cms");

type GlobalWithMongoose = typeof globalThis & {
  __cognirexMongoPromise?: Promise<typeof mongoose | null>;
};

function hasValidMongoUri(): boolean {
  const uri = (process.env.MONGODB_URI || "").trim();
  if (!uri) return false;
  if (uri.includes("<username>") || uri.includes("<password>") || uri.includes("<cluster>")) {
    return false;
  }
  return uri.startsWith("mongodb://") || uri.startsWith("mongodb+srv://");
}

export async function ensureDb(): Promise<boolean> {
  if (!hasValidMongoUri()) return false;
  if (mongoose.connection.readyState === 1) return true;

  const g = globalThis as GlobalWithMongoose;
  if (!g.__cognirexMongoPromise) {
    g.__cognirexMongoPromise = mongoose
      .connect(process.env.MONGODB_URI!.trim(), {
        bufferCommands: false,
        serverSelectionTimeoutMS: 4000,
      })
      .catch((err) => {
        console.warn("MongoDB connection failed, falling back to local .data store:", err.message);
        g.__cognirexMongoPromise = undefined;
        return null;
      });
  }

  const conn = await g.__cognirexMongoPromise;
  return Boolean(conn && Number(mongoose.connection.readyState) === 1);
}

// ---------- Local JSON helpers (zero-config dev / fallback store) ----------

function ensureDir(dir: string) {
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  } catch (err) {
    if (dir === DATA_DIR && DATA_DIR !== path.join(os.tmpdir(), "cognirex-data")) {
      DATA_DIR = path.join(os.tmpdir(), "cognirex-data");
      try {
        if (!fs.existsSync(DATA_DIR)) {
          fs.mkdirSync(DATA_DIR, { recursive: true });
        }
      } catch {
        // Safe to ignore in strict read-only environments
      }
    }
  }
}

function readJson<T>(file: string, fallback: T): T {
  try {
    ensureDir(DATA_DIR);
    const full = path.join(DATA_DIR, file);
    if (!fs.existsSync(full)) return fallback;
    return JSON.parse(fs.readFileSync(full, "utf-8")) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(file: string, data: T): void {
  try {
    ensureDir(DATA_DIR);
    fs.writeFileSync(path.join(DATA_DIR, file), JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.warn(`[CMS Store] Non-fatal: could not write local cache file ${file}:`, err);
  }
}

// ---------- Types exposed to CMS API ----------

export interface StoredCmsUser {
  id: string;
  name: string;
  email: string;
  passwordHash?: string;
  googleId?: string;
  role: "super_admin" | "admin" | "editor";
  isActive: boolean;
  avatar: string;
  theme: "light" | "dark";
  lastLoginAt?: string;
}

export interface StoredMediaAsset {
  publicId: string;
  url: string;
  originalName: string;
  size: number;
  mimeType: string;
  width: number;
  height: number;
  usedIn: string[];
  uploadedAt: string;
}

export interface StoredInquiry {
  _id: string;
  fullName: string;
  companyName: string;
  workEmail: string;
  phone: string;
  serviceInterestedIn: string;
  projectBudget?: string;
  projectDescription: string;
  preferredContactMethod: "email" | "phone";
  status: "new" | "read" | "responded" | "closed";
  submittedAt: string;
}

export interface StoredConsultation {
  _id: string;
  fullName: string;
  workEmail: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  meetingType: "online" | "in-person";
  additionalNotes?: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  adminNotes?: string;
  submittedAt: string;
}

export interface StoredCareerApplication {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  positionOfInterest: string;
  experience: string;
  linkedIn?: string;
  resumeFileName?: string;
  shortIntroduction: string;
  status: "new" | "shortlisted" | "interviewing" | "rejected" | "hired";
  adminNotes?: string;
  submittedAt: string;
}

export interface StoredActivity {
  _id: string;
  action: string;
  actorEmail?: string;
  timestamp: string;
}

export interface ContactSettingsInfo {
  hubName: string;
  location: string;
  officeHours: string;
  enquiryEmail: string;
  careersEmail: string;
  linkedinUrl: string;
  twitterUrl: string;
  githubUrl: string;
  responseSla: string;
}

export interface SmtpSettingsInfo {
  host: string;
  port: number;
  user: string;
  pass: string;
  from?: string;
}

// ---------- Activity Logging ----------

export async function logActivity(action: string, actorEmail?: string): Promise<void> {
  const useDb = await ensureDb();
  if (useDb) {
    try {
      await ActivityLogModel.create({ action, actorEmail, timestamp: new Date() });
      return;
    } catch {
      // fall through
    }
  }
  const items = readJson<StoredActivity[]>("cms_activities.json", []);
  items.unshift({
    _id: `ACT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    action,
    actorEmail,
    timestamp: new Date().toISOString(),
  });
  writeJson("cms_activities.json", items.slice(0, 100));
}

export async function listActivities(): Promise<StoredActivity[]> {
  const useDb = await ensureDb();
  if (useDb) {
    const docs = await ActivityLogModel.find().sort({ timestamp: -1 }).limit(50).lean();
    return docs.map((d) => ({
      _id: String(d._id),
      action: d.action,
      actorEmail: d.actorEmail,
      timestamp: new Date(d.timestamp).toISOString(),
    }));
  }
  return readJson<StoredActivity[]>("cms_activities.json", []).slice(0, 50);
}

// ---------- Authorized Emails & Admin Users ----------

function getEnvAuthorizedEmails(): string[] {
  const raw =
    process.env.AUTHORIZED_EMAILS ||
    process.env.SUPER_ADMIN_EMAIL ||
    "admin@cognirexsolutions.com";
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function getPrimarySuperAdminEmail(): string {
  const envSuper = (process.env.SUPER_ADMIN_EMAIL || "").trim().toLowerCase();
  if (envSuper) return envSuper;
  return getEnvAuthorizedEmails()[0] || "admin@cognirexsolutions.com";
}

export async function getAuthorizedEmails(): Promise<string[]> {
  const defaults = getEnvAuthorizedEmails();
  const useDb = await ensureDb();
  if (useDb) {
    let setting = await CmsSettingsModel.findOne({ key: "authorized_emails" }).lean();
    if (!setting) {
      await CmsSettingsModel.create({ key: "authorized_emails", value: defaults });
      return defaults;
    }
    const dbEmails = Array.isArray(setting.value)
      ? setting.value.map((e) => String(e).trim().toLowerCase()).filter(Boolean)
      : defaults;
    return Array.from(new Set([...dbEmails, ...defaults]));
  }
  const settings = readJson<Record<string, unknown>>("cms_settings.json", {});
  const stored = Array.isArray(settings.authorized_emails)
    ? (settings.authorized_emails as string[]).map((e) => e.trim().toLowerCase())
    : [];
  return Array.from(new Set([...defaults, ...stored]));
}

export async function addAuthorizedEmail(email: string, actorEmail?: string): Promise<string[]> {
  const normalized = email.trim().toLowerCase();
  const current = await getAuthorizedEmails();
  if (!current.includes(normalized)) {
    current.push(normalized);
    const useDb = await ensureDb();
    if (useDb) {
      await CmsSettingsModel.findOneAndUpdate(
        { key: "authorized_emails" },
        { key: "authorized_emails", value: current },
        { upsert: true, new: true }
      );
    } else {
      const settings = readJson<Record<string, unknown>>("cms_settings.json", {});
      settings.authorized_emails = current;
      writeJson("cms_settings.json", settings);
    }
    await logActivity(`Authorized CMS admin email: ${normalized}`, actorEmail);
  }
  return current;
}

export async function removeAuthorizedEmail(email: string, actorEmail?: string): Promise<string[]> {
  const normalized = email.trim().toLowerCase();
  const current = await getAuthorizedEmails();
  const updated = current.filter((e) => e !== normalized);
  const useDb = await ensureDb();
  if (useDb) {
    await CmsSettingsModel.findOneAndUpdate(
      { key: "authorized_emails" },
      { key: "authorized_emails", value: updated },
      { upsert: true, new: true }
    );
  } else {
    const settings = readJson<Record<string, unknown>>("cms_settings.json", {});
    settings.authorized_emails = updated;
    writeJson("cms_settings.json", settings);
  }
  await logActivity(`Revoked CMS admin email: ${normalized}`, actorEmail);
  return updated;
}

export async function findOrBootstrapUser(
  email: string,
  profile?: { name?: string; googleId?: string; avatar?: string }
): Promise<StoredCmsUser> {
  const normalized = email.trim().toLowerCase();
  const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD || "Cognirex@Admin2026";
  const superEmail = getPrimarySuperAdminEmail();
  const useDb = await ensureDb();

  if (useDb) {
    let user = await CmsUserModel.findOne({ email: normalized });
    if (!user) {
      const hash = await bcrypt.hash(defaultPassword, 10);
      user = await CmsUserModel.create({
        name: profile?.name || (normalized === superEmail ? "Cognirex Super Admin" : normalized.split("@")[0]),
        email: normalized,
        password: hash,
        googleId: profile?.googleId,
        role: "super_admin",
        isActive: true,
        avatar: profile?.avatar || "/images/product-design-ux.jpg",
        theme: "light",
        lastLoginAt: new Date(),
      });
    } else {
      if (profile?.googleId && !user.googleId) user.googleId = profile.googleId;
      if (profile?.name) user.name = profile.name;
      if (profile?.avatar && user.avatar === "/images/product-design-ux.jpg") user.avatar = profile.avatar;
      user.lastLoginAt = new Date();
      await user.save();
    }
    return {
      id: String(user._id),
      name: user.name,
      email: user.email,
      passwordHash: user.password,
      googleId: user.googleId,
      role: user.role,
      isActive: user.isActive,
      avatar: user.avatar,
      theme: user.theme,
      lastLoginAt: user.lastLoginAt?.toISOString(),
    };
  }

  const users = readJson<StoredCmsUser[]>("cms_users.json", []);
  let existing = users.find((u) => u.email === normalized);
  if (!existing) {
    const hash = await bcrypt.hash(defaultPassword, 10);
    existing = {
      id: `USR-${Date.now()}`,
      name: profile?.name || "Cognirex Admin",
      email: normalized,
      passwordHash: hash,
      googleId: profile?.googleId,
      role: "super_admin",
      isActive: true,
      avatar: profile?.avatar || "/images/product-design-ux.jpg",
      theme: "light",
      lastLoginAt: new Date().toISOString(),
    };
    users.push(existing);
    writeJson("cms_users.json", users);
  } else {
    if (profile?.googleId && !existing.googleId) existing.googleId = profile.googleId;
    if (profile?.name) existing.name = profile.name;
    existing.lastLoginAt = new Date().toISOString();
    writeJson("cms_users.json", users);
  }
  return existing;
}

export async function updateUserProfile(
  email: string,
  updates: { name?: string; avatar?: string; currentPassword?: string; newPassword?: string }
): Promise<{ success: boolean; user?: StoredCmsUser; error?: string }> {
  const normalized = email.trim().toLowerCase();
  const user = await findOrBootstrapUser(normalized);

  if (updates.newPassword) {
    if (!updates.currentPassword || !user.passwordHash) {
      return { success: false, error: "Current password is required to change password." };
    }
    const valid = await bcrypt.compare(updates.currentPassword, user.passwordHash);
    if (!valid) {
      return { success: false, error: "Current password is incorrect." };
    }
  }

  const useDb = await ensureDb();
  if (useDb) {
    const doc = await CmsUserModel.findOne({ email: normalized });
    if (!doc) return { success: false, error: "User not found" };
    if (updates.name) doc.name = updates.name;
    if (updates.avatar) doc.avatar = updates.avatar;
    if (updates.newPassword) doc.password = await bcrypt.hash(updates.newPassword, 10);
    await doc.save();
    await logActivity(`Updated admin profile: ${normalized}`, normalized);
    return {
      success: true,
      user: {
        id: String(doc._id),
        name: doc.name,
        email: doc.email,
        role: doc.role,
        isActive: doc.isActive,
        avatar: doc.avatar,
        theme: doc.theme,
      },
    };
  }

  const users = readJson<StoredCmsUser[]>("cms_users.json", []);
  const idx = users.findIndex((u) => u.email === normalized);
  if (idx === -1) return { success: false, error: "User not found" };
  if (updates.name) users[idx].name = updates.name;
  if (updates.avatar) users[idx].avatar = updates.avatar;
  if (updates.newPassword) users[idx].passwordHash = await bcrypt.hash(updates.newPassword, 10);
  writeJson("cms_users.json", users);
  await logActivity(`Updated admin profile: ${normalized}`, normalized);
  return { success: true, user: users[idx] };
}

// ---------- Website Section Content ----------

export async function getWebsiteSection<K extends CmsSectionKey>(
  section: K
): Promise<CognirexContentBundle[K]> {
  const defaultValue = DEFAULT_COGNIR_CONTENT[section];
  const useDb = await ensureDb();
  if (useDb) {
    const doc = await WebsiteContentModel.findOne({ section }).lean();
    if (doc && doc.data && Object.keys(doc.data).length > 0) {
      return { ...defaultValue, ...(doc.data as Partial<CognirexContentBundle[K]>) };
    }
    return defaultValue;
  }
  const all = readJson<Partial<CognirexContentBundle>>("website_content.json", {});
  const stored = all[section];
  if (stored && typeof stored === "object") {
    return { ...defaultValue, ...stored };
  }
  return defaultValue;
}

export async function getAllWebsiteSections(): Promise<CognirexContentBundle> {
  const result = { ...DEFAULT_COGNIR_CONTENT };
  const useDb = await ensureDb();
  if (useDb) {
    const docs = await WebsiteContentModel.find().lean();
    for (const doc of docs) {
      const key = doc.section as CmsSectionKey;
      if (CMS_SECTIONS.includes(key) && doc.data && Object.keys(doc.data).length > 0) {
        result[key] = { ...result[key], ...(doc.data as object) } as never;
      }
    }
    return result;
  }
  const all = readJson<Partial<CognirexContentBundle>>("website_content.json", {});
  for (const key of CMS_SECTIONS) {
    if (all[key] && typeof all[key] === "object") {
      result[key] = { ...result[key], ...(all[key] as object) } as never;
    }
  }
  return result;
}

export async function saveWebsiteSection<K extends CmsSectionKey>(
  section: K,
  data: CognirexContentBundle[K],
  actorEmail?: string
): Promise<CognirexContentBundle[K]> {
  const useDb = await ensureDb();
  if (useDb) {
    await WebsiteContentModel.findOneAndUpdate(
      { section },
      { section, data: data as unknown as Record<string, unknown> },
      { upsert: true, new: true }
    );
  } else {
    const all = readJson<Partial<CognirexContentBundle>>("website_content.json", {});
    all[section] = data;
    writeJson("website_content.json", all);
  }
  await logActivity(`Updated website section: ${section}`, actorEmail);
  return data;
}

// ---------- Media Library ----------

function isCloudinaryReady(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );
}

export async function listMedia(): Promise<StoredMediaAsset[]> {
  const useDb = await ensureDb();
  if (useDb) {
    const docs = await MediaLibraryModel.find().sort({ uploadedAt: -1 }).lean();
    return docs.map((m) => ({
      publicId: m.publicId,
      url: m.url,
      originalName: m.originalName,
      size: m.size,
      mimeType: m.mimeType,
      width: m.width,
      height: m.height,
      usedIn: m.usedIn || [],
      uploadedAt: new Date(m.uploadedAt).toISOString(),
    }));
  }
  return readJson<StoredMediaAsset[]>("media_library.json", []);
}

export async function saveUploadedMedia(params: {
  base64Url: string;
  name: string;
  size: number;
  type: string;
  usedIn?: string[];
  actorEmail?: string;
}): Promise<StoredMediaAsset> {
  const match = params.base64Url.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) {
    throw new Error("Invalid base64 image payload");
  }
  const mimeType = match[1];
  const base64Body = match[2];
  if (!mimeType.startsWith("image/")) {
    throw new Error("Only image files are accepted");
  }

  let publicId = `cognirex_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
  let finalUrl = params.base64Url;
  let width = 800;
  let height = 600;

  if (isCloudinaryReady()) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    const uploaded = await cloudinary.uploader.upload(params.base64Url, {
      folder: "cognirex_cms",
      resource_type: "image",
    });
    publicId = uploaded.public_id;
    finalUrl = uploaded.secure_url;
    width = uploaded.width || 800;
    height = uploaded.height || 600;
  } else {
    // Save image file cleanly in public/uploads/cms when filesystem is writable
    try {
      ensureDir(UPLOADS_DIR);
      const ext = mimeType.split("/")[1]?.replace("jpeg", "jpg").replace("+xml", "") || "jpg";
      const safeName = `${publicId}.${ext}`;
      const fullPath = path.join(UPLOADS_DIR, safeName);
      fs.writeFileSync(fullPath, Buffer.from(base64Body, "base64"));
      finalUrl = `/uploads/cms/${safeName}`;
      publicId = `local_${safeName}`;
    } catch {
      // Read-only fallback (e.g. serverless) keeps compact data URI
      publicId = `data_${publicId}`;
    }
  }

  const asset: StoredMediaAsset = {
    publicId,
    url: finalUrl,
    originalName: params.name || "uploaded-image.jpg",
    size: params.size || Math.round(base64Body.length * 0.75),
    mimeType,
    width,
    height,
    usedIn: params.usedIn || [],
    uploadedAt: new Date().toISOString(),
  };

  const useDb = await ensureDb();
  if (useDb) {
    await MediaLibraryModel.create(asset);
  } else {
    const existing = readJson<StoredMediaAsset[]>("media_library.json", []);
    existing.unshift(asset);
    writeJson("media_library.json", existing);
  }

  await logActivity(`Uploaded image asset: ${asset.originalName}`, params.actorEmail);
  return asset;
}

export async function deleteMediaAsset(publicId: string, actorEmail?: string): Promise<boolean> {
  if (isCloudinaryReady() && !publicId.startsWith("local_") && !publicId.startsWith("data_")) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    await cloudinary.uploader.destroy(publicId).catch(() => null);
  } else if (publicId.startsWith("local_")) {
    const filename = publicId.replace(/^local_/, "");
    const localFile = path.join(UPLOADS_DIR, path.basename(filename));
    if (fs.existsSync(localFile)) {
      fs.unlinkSync(localFile);
    }
  }

  const useDb = await ensureDb();
  if (useDb) {
    const res = await MediaLibraryModel.deleteOne({ publicId });
    if (res.deletedCount > 0) {
      await logActivity(`Deleted media asset: ${publicId}`, actorEmail);
      return true;
    }
    return false;
  }

  const existing = readJson<StoredMediaAsset[]>("media_library.json", []);
  const next = existing.filter((m) => m.publicId !== publicId);
  if (next.length === existing.length) return false;
  writeJson("media_library.json", next);
  await logActivity(`Deleted media asset: ${publicId}`, actorEmail);
  return true;
}

// ---------- Inquiries (Project Enquiries) ----------

export async function recordInquiryFromWebsite(
  enquiry: ContactEnquirySubmission
): Promise<{ success: boolean; id: string; message: string }> {
  const id = `ENQ-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  try {
    const useDb = await ensureDb();
    if (useDb) {
      await ContactInquiryModel.create({
        externalId: id,
        ...enquiry,
        status: "new",
        submittedAt: new Date(),
      });
    }
  } catch (dbErr) {
    console.warn("[CMS Store] DB inquiry creation non-fatal error:", dbErr);
  }

  // Maintain local fallback without throwing
  try {
    const list = readJson<Array<ContactEnquirySubmission & { status?: string }>>(
      "contact_enquiries.json",
      []
    );
    list.unshift({
      ...enquiry,
      id,
      status: "new",
      createdAt: new Date().toISOString(),
    });
    writeJson("contact_enquiries.json", list);
  } catch (fsErr) {
    console.warn("[CMS Store] Local file inquiry write non-fatal error:", fsErr);
  }

  return {
    success: true,
    id,
    message:
      "Your enquiry has been received and logged securely. Our consulting team will contact you shortly.",
  };
}

export async function listInquiries(): Promise<StoredInquiry[]> {
  const useDb = await ensureDb();
  if (useDb) {
    const docs = await ContactInquiryModel.find().sort({ submittedAt: -1 }).lean();
    return docs.map((d) => ({
      _id: String(d._id),
      fullName: d.fullName,
      companyName: d.companyName,
      workEmail: d.workEmail,
      phone: d.phone,
      serviceInterestedIn: d.serviceInterestedIn,
      projectBudget: d.projectBudget,
      projectDescription: d.projectDescription,
      preferredContactMethod: d.preferredContactMethod,
      status: d.status || "new",
      submittedAt: new Date(d.submittedAt).toISOString(),
    }));
  }
  const items = readJson<Array<ContactEnquirySubmission & { status?: StoredInquiry["status"] }>>(
    "contact_enquiries.json",
    []
  );
  return items.map((d, idx) => ({
    _id: d.id || `ENQ-LOCAL-${idx}`,
    fullName: d.fullName,
    companyName: d.companyName,
    workEmail: d.workEmail,
    phone: d.phone,
    serviceInterestedIn: d.serviceInterestedIn,
    projectBudget: d.projectBudget,
    projectDescription: d.projectDescription,
    preferredContactMethod: d.preferredContactMethod,
    status: d.status || "new",
    submittedAt: d.createdAt || new Date().toISOString(),
  }));
}

export async function updateInquiryStatus(
  id: string,
  status: StoredInquiry["status"],
  actorEmail?: string
): Promise<StoredInquiry | null> {
  const useDb = await ensureDb();
  if (useDb) {
    const doc = await ContactInquiryModel.findByIdAndUpdate(id, { status }, { new: true }).lean();
    if (!doc) return null;
    await logActivity(`Updated enquiry status (${status}): ${doc.fullName}`, actorEmail);
    return {
      _id: String(doc._id),
      fullName: doc.fullName,
      companyName: doc.companyName,
      workEmail: doc.workEmail,
      phone: doc.phone,
      serviceInterestedIn: doc.serviceInterestedIn,
      projectBudget: doc.projectBudget,
      projectDescription: doc.projectDescription,
      preferredContactMethod: doc.preferredContactMethod,
      status: doc.status,
      submittedAt: new Date(doc.submittedAt).toISOString(),
    };
  }
  const items = readJson<Array<ContactEnquirySubmission & { status?: StoredInquiry["status"] }>>(
    "contact_enquiries.json",
    []
  );
  const idx = items.findIndex((i) => i.id === id);
  if (idx === -1) return null;
  items[idx].status = status;
  writeJson("contact_enquiries.json", items);
  await logActivity(`Updated enquiry status (${status}): ${items[idx].fullName}`, actorEmail);
  return (await listInquiries())[idx];
}

export async function deleteInquiry(id: string, actorEmail?: string): Promise<boolean> {
  const useDb = await ensureDb();
  if (useDb) {
    const res = await ContactInquiryModel.findByIdAndDelete(id);
    if (res) {
      await logActivity(`Deleted contact enquiry: ${res.fullName}`, actorEmail);
      return true;
    }
    return false;
  }
  const items = readJson<ContactEnquirySubmission[]>("contact_enquiries.json", []);
  const next = items.filter((i) => i.id !== id);
  if (next.length === items.length) return false;
  writeJson("contact_enquiries.json", next);
  await logActivity(`Deleted contact enquiry: ${id}`, actorEmail);
  return true;
}

// ---------- Consultations (Meeting Requests) ----------

export async function isSlotAvailable(date: string, time: string): Promise<boolean> {
  const useDb = await ensureDb();
  if (useDb) {
    const existing = await ConsultationRequestModel.findOne({
      preferredDate: date,
      preferredTime: time,
      status: { $ne: "cancelled" },
    }).lean();
    return !existing;
  }
  const list = readJson<MeetingRequestSubmission[]>("meeting_requests.json", []);
  return !list.some((m) => m.preferredDate === date && m.preferredTime === time);
}

export async function recordConsultationFromWebsite(
  request: Omit<MeetingRequestSubmission, "id" | "createdAt" | "status">
): Promise<{ success: boolean; id?: string; message: string; isConflict?: boolean }> {
  let available = true;
  try {
    available = await isSlotAvailable(request.preferredDate, request.preferredTime);
  } catch {
    available = true;
  }

  if (!available) {
    return {
      success: false,
      isConflict: true,
      message: `The selected slot on ${request.preferredDate} at ${request.preferredTime} is already reserved. Please select an alternate time slot.`,
    };
  }

  const id = `MTG-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  try {
    const useDb = await ensureDb();
    if (useDb) {
      await ConsultationRequestModel.create({
        externalId: id,
        ...request,
        status: "confirmed",
        submittedAt: new Date(),
      });
    }
  } catch (dbErr) {
    console.warn("[CMS Store] DB consultation creation non-fatal error:", dbErr);
  }

  try {
    const list = readJson<MeetingRequestSubmission[]>("meeting_requests.json", []);
    list.unshift({
      ...request,
      id,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    });
    writeJson("meeting_requests.json", list);
  } catch (fsErr) {
    console.warn("[CMS Store] Local file consultation write non-fatal error:", fsErr);
  }

  return {
    success: true,
    id,
    message:
      "Consultation meeting booked successfully! A calendar confirmation and meeting details have been dispatched.",
  };
}

export async function listConsultations(): Promise<StoredConsultation[]> {
  const useDb = await ensureDb();
  if (useDb) {
    const docs = await ConsultationRequestModel.find().sort({ submittedAt: -1 }).lean();
    return docs.map((d) => ({
      _id: String(d._id),
      fullName: d.fullName,
      workEmail: d.workEmail,
      phone: d.phone,
      preferredDate: d.preferredDate,
      preferredTime: d.preferredTime,
      meetingType: d.meetingType,
      additionalNotes: d.additionalNotes,
      status: d.status || "pending",
      adminNotes: d.adminNotes || "",
      submittedAt: new Date(d.submittedAt).toISOString(),
    }));
  }
  const list = readJson<
    Array<
      Omit<MeetingRequestSubmission, "status"> & {
        status?: StoredConsultation["status"];
        adminNotes?: string;
      }
    >
  >("meeting_requests.json", []);
  return list.map((d, idx) => ({
    _id: d.id || `MTG-LOCAL-${idx}`,
    fullName: d.fullName,
    workEmail: d.workEmail,
    phone: d.phone,
    preferredDate: d.preferredDate,
    preferredTime: d.preferredTime,
    meetingType: d.meetingType,
    additionalNotes: d.additionalNotes,
    status: d.status || "confirmed",
    adminNotes: d.adminNotes || "",
    submittedAt: d.createdAt || new Date().toISOString(),
  }));
}

export async function updateConsultation(
  id: string,
  updates: { status?: StoredConsultation["status"]; adminNotes?: string },
  actorEmail?: string
): Promise<StoredConsultation | null> {
  const useDb = await ensureDb();
  if (useDb) {
    const doc = await ConsultationRequestModel.findByIdAndUpdate(id, updates, { new: true }).lean();
    if (!doc) return null;
    await logActivity(`Updated consultation booking (${doc.fullName})`, actorEmail);
    return {
      _id: String(doc._id),
      fullName: doc.fullName,
      workEmail: doc.workEmail,
      phone: doc.phone,
      preferredDate: doc.preferredDate,
      preferredTime: doc.preferredTime,
      meetingType: doc.meetingType,
      additionalNotes: doc.additionalNotes,
      status: doc.status,
      adminNotes: doc.adminNotes,
      submittedAt: new Date(doc.submittedAt).toISOString(),
    };
  }

  const list = readJson<
    Array<
      Omit<MeetingRequestSubmission, "status"> & {
        status?: StoredConsultation["status"];
        adminNotes?: string;
      }
    >
  >("meeting_requests.json", []);
  const idx = list.findIndex((b) => b.id === id);
  if (idx === -1) return null;
  if (updates.status !== undefined) list[idx].status = updates.status;
  if (updates.adminNotes !== undefined) list[idx].adminNotes = updates.adminNotes;
  writeJson("meeting_requests.json", list);
  await logActivity(`Updated consultation booking (${list[idx].fullName})`, actorEmail);
  return (await listConsultations())[idx];
}

export async function deleteConsultation(id: string, actorEmail?: string): Promise<boolean> {
  const useDb = await ensureDb();
  if (useDb) {
    const res = await ConsultationRequestModel.findByIdAndDelete(id);
    if (res) {
      await logActivity(`Deleted consultation booking: ${res.fullName}`, actorEmail);
      return true;
    }
    return false;
  }
  const list = readJson<MeetingRequestSubmission[]>("meeting_requests.json", []);
  const next = list.filter((b) => b.id !== id);
  if (next.length === list.length) return false;
  writeJson("meeting_requests.json", next);
  await logActivity(`Deleted consultation booking: ${id}`, actorEmail);
  return true;
}

// ---------- Career Applications ----------

export async function recordCareerApplicationFromWebsite(
  application: CareerApplicationSubmission
): Promise<{ success: boolean; id: string; message: string }> {
  const id = `APP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  try {
    const useDb = await ensureDb();
    if (useDb) {
      await CareerApplicationModel.create({
        externalId: id,
        fullName: application.fullName,
        email: application.email,
        phone: application.phone,
        positionOfInterest: application.positionOfInterest,
        experience: application.experience,
        linkedIn: application.linkedIn,
        resumeFileName: application.resumeFileName,
        shortIntroduction: application.shortIntroduction,
        privacyConsent: application.privacyConsent,
        status: "new",
        submittedAt: new Date(),
      });
    }
  } catch (dbErr) {
    console.warn("[CMS Store] DB career creation non-fatal error:", dbErr);
  }

  try {
    const list = readJson<Array<CareerApplicationSubmission & { status?: string }>>(
      "career_applications.json",
      []
    );
    list.unshift({
      ...application,
      id,
      status: "new",
      resumeBase64: application.resumeBase64 ? "[STORED_SECURELY]" : undefined,
      createdAt: new Date().toISOString(),
    });
    writeJson("career_applications.json", list);
  } catch (fsErr) {
    console.warn("[CMS Store] Local file career write non-fatal error:", fsErr);
  }

  return {
    success: true,
    id,
    message: "Your application has been received and stored in our applicant database.",
  };
}

export async function listCareerApplications(): Promise<StoredCareerApplication[]> {
  const useDb = await ensureDb();
  if (useDb) {
    const docs = await CareerApplicationModel.find().sort({ submittedAt: -1 }).lean();
    return docs.map((d) => ({
      _id: String(d._id),
      fullName: d.fullName,
      email: d.email,
      phone: d.phone,
      positionOfInterest: d.positionOfInterest,
      experience: d.experience,
      linkedIn: d.linkedIn,
      resumeFileName: d.resumeFileName,
      shortIntroduction: d.shortIntroduction,
      status: d.status || "new",
      adminNotes: d.adminNotes || "",
      submittedAt: new Date(d.submittedAt).toISOString(),
    }));
  }
  const list = readJson<
    Array<
      CareerApplicationSubmission & {
        status?: StoredCareerApplication["status"];
        adminNotes?: string;
      }
    >
  >("career_applications.json", []);
  return list.map((d, idx) => ({
    _id: d.id || `APP-LOCAL-${idx}`,
    fullName: d.fullName,
    email: d.email,
    phone: d.phone,
    positionOfInterest: d.positionOfInterest,
    experience: d.experience,
    linkedIn: d.linkedIn,
    resumeFileName: d.resumeFileName,
    shortIntroduction: d.shortIntroduction,
    status: d.status || "new",
    adminNotes: d.adminNotes || "",
    submittedAt: d.createdAt || new Date().toISOString(),
  }));
}

export async function updateCareerApplication(
  id: string,
  updates: { status?: StoredCareerApplication["status"]; adminNotes?: string },
  actorEmail?: string
): Promise<StoredCareerApplication | null> {
  const useDb = await ensureDb();
  if (useDb) {
    const doc = await CareerApplicationModel.findByIdAndUpdate(id, updates, { new: true }).lean();
    if (!doc) return null;
    await logActivity(`Updated career application (${doc.fullName})`, actorEmail);
    return {
      _id: String(doc._id),
      fullName: doc.fullName,
      email: doc.email,
      phone: doc.phone,
      positionOfInterest: doc.positionOfInterest,
      experience: doc.experience,
      linkedIn: doc.linkedIn,
      resumeFileName: doc.resumeFileName,
      shortIntroduction: doc.shortIntroduction,
      status: doc.status,
      adminNotes: doc.adminNotes,
      submittedAt: new Date(doc.submittedAt).toISOString(),
    };
  }
  const list = readJson<
    Array<
      CareerApplicationSubmission & {
        status?: StoredCareerApplication["status"];
        adminNotes?: string;
      }
    >
  >("career_applications.json", []);
  const idx = list.findIndex((a) => a.id === id);
  if (idx === -1) return null;
  if (updates.status !== undefined) list[idx].status = updates.status;
  if (updates.adminNotes !== undefined) list[idx].adminNotes = updates.adminNotes;
  writeJson("career_applications.json", list);
  await logActivity(`Updated career application (${list[idx].fullName})`, actorEmail);
  return (await listCareerApplications())[idx];
}

export async function deleteCareerApplication(id: string, actorEmail?: string): Promise<boolean> {
  const useDb = await ensureDb();
  if (useDb) {
    const res = await CareerApplicationModel.findByIdAndDelete(id);
    if (res) {
      await logActivity(`Deleted career application: ${res.fullName}`, actorEmail);
      return true;
    }
    return false;
  }
  const list = readJson<CareerApplicationSubmission[]>("career_applications.json", []);
  const next = list.filter((a) => a.id !== id);
  if (next.length === list.length) return false;
  writeJson("career_applications.json", next);
  await logActivity(`Deleted career application: ${id}`, actorEmail);
  return true;
}

// ---------- Global Settings ----------

const DEFAULT_CONTACT_SETTINGS: ContactSettingsInfo = {
  hubName: "Cognirex Engineering Hub",
  location: "India (Nationwide & Global clients)",
  officeHours: "Monday–Friday, 9:30 AM–6:30 PM IST",
  enquiryEmail: process.env.SMTP_TO_EMAIL || "contact@cognirexsolutions.com",
  careersEmail: process.env.SMTP_TO_CAREERS_EMAIL || "careers@cognirexsolutions.com",
  linkedinUrl: "https://www.linkedin.com/company/cognirex-solutions",
  twitterUrl: "https://x.com/cognirex",
  githubUrl: "https://github.com/cognirex-solutions",
  responseSla: "Within 24 Business Hours",
};

const DEFAULT_SMTP_SETTINGS: SmtpSettingsInfo = {
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT || 587),
  user: process.env.SMTP_USER || "",
  pass: process.env.SMTP_PASS ? "••••••••••••••••" : "",
  from: process.env.SMTP_FROM || process.env.EMAIL_FROM || "",
};

export async function getGlobalSettings(): Promise<{
  contactInfo: ContactSettingsInfo;
  authorizedEmails: string[];
  smtp: SmtpSettingsInfo;
}> {
  const authorizedEmails = await getAuthorizedEmails();
  const useDb = await ensureDb();
  if (useDb) {
    const contactDoc = await CmsSettingsModel.findOne({ key: "contact_info" }).lean();
    const smtpDoc = await CmsSettingsModel.findOne({ key: "smtp" }).lean();
    return {
      contactInfo: contactDoc
        ? { ...DEFAULT_CONTACT_SETTINGS, ...(contactDoc.value as Partial<ContactSettingsInfo>) }
        : DEFAULT_CONTACT_SETTINGS,
      authorizedEmails,
      smtp: smtpDoc
        ? {
            ...DEFAULT_SMTP_SETTINGS,
            ...(smtpDoc.value as Partial<SmtpSettingsInfo>),
            pass: (smtpDoc.value as Partial<SmtpSettingsInfo>)?.pass ? "••••••••••••••••" : "",
          }
        : DEFAULT_SMTP_SETTINGS,
    };
  }
  const settings = readJson<{
    contact_info?: Partial<ContactSettingsInfo>;
    smtp?: Partial<SmtpSettingsInfo>;
  }>("cms_settings.json", {});
  return {
    contactInfo: { ...DEFAULT_CONTACT_SETTINGS, ...(settings.contact_info || {}) },
    authorizedEmails,
    smtp: {
      ...DEFAULT_SMTP_SETTINGS,
      ...(settings.smtp || {}),
      pass: settings.smtp?.pass ? "••••••••••••••••" : DEFAULT_SMTP_SETTINGS.pass,
    },
  };
}

export async function getRawSmtpSettings(): Promise<Partial<SmtpSettingsInfo>> {
  const useDb = await ensureDb();
  if (useDb) {
    const doc = await CmsSettingsModel.findOne({ key: "smtp" }).lean();
    return (doc?.value as Partial<SmtpSettingsInfo>) || {};
  }
  const settings = readJson<{ smtp?: Partial<SmtpSettingsInfo> }>("cms_settings.json", {});
  return settings.smtp || {};
}

export async function updateContactSettings(
  data: Partial<ContactSettingsInfo>,
  actorEmail?: string
): Promise<ContactSettingsInfo> {
  const current = (await getGlobalSettings()).contactInfo;
  const merged = { ...current, ...data };
  const useDb = await ensureDb();
  if (useDb) {
    await CmsSettingsModel.findOneAndUpdate(
      { key: "contact_info" },
      { key: "contact_info", value: merged },
      { upsert: true, new: true }
    );
  } else {
    const settings = readJson<Record<string, unknown>>("cms_settings.json", {});
    settings.contact_info = merged;
    writeJson("cms_settings.json", settings);
  }
  // Keep site_brand synchronized for officeHours / location / socials
  const brand = await getWebsiteSection("site_brand");
  await saveWebsiteSection(
    "site_brand",
    {
      ...brand,
      locationLabel: merged.location,
      officeHours: merged.officeHours,
      linkedinUrl: merged.linkedinUrl,
      twitterUrl: merged.twitterUrl,
      githubUrl: merged.githubUrl,
    },
    actorEmail
  );
  await logActivity("Updated global contact & brand settings", actorEmail);
  return merged;
}

export async function updateSmtpSettings(
  data: Partial<SmtpSettingsInfo>,
  actorEmail?: string
): Promise<SmtpSettingsInfo> {
  const existing = await getRawSmtpSettings();
  const merged: SmtpSettingsInfo = {
    host: data.host ?? existing.host ?? process.env.SMTP_HOST ?? "smtp.gmail.com",
    port: Number(data.port ?? existing.port ?? process.env.SMTP_PORT ?? 587),
    user: data.user ?? existing.user ?? process.env.SMTP_USER ?? "",
    pass:
      data.pass && !data.pass.includes("••")
        ? data.pass
        : existing.pass || process.env.SMTP_PASS || "",
    from: data.from ?? existing.from ?? process.env.SMTP_FROM ?? "",
  };

  const useDb = await ensureDb();
  if (useDb) {
    await CmsSettingsModel.findOneAndUpdate(
      { key: "smtp" },
      { key: "smtp", value: merged },
      { upsert: true, new: true }
    );
  } else {
    const settings = readJson<Record<string, unknown>>("cms_settings.json", {});
    settings.smtp = merged;
    writeJson("cms_settings.json", settings);
  }
  await logActivity("Updated SMTP email configuration", actorEmail);
  return { ...merged, pass: merged.pass ? "••••••••••••••••" : "" };
}
