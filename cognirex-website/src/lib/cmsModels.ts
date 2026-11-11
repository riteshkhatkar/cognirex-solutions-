import mongoose, { Schema, type Model, type Document } from "mongoose";

export interface IWebsiteContent extends Document {
  section: string;
  data: Record<string, unknown>;
  lastUpdatedBy?: mongoose.Types.ObjectId;
  updatedAt: Date;
}

const WebsiteContentSchema = new Schema<IWebsiteContent>(
  {
    section: { type: String, required: true, unique: true, trim: true, lowercase: true },
    data: { type: Schema.Types.Mixed, required: true, default: {} },
    lastUpdatedBy: { type: Schema.Types.ObjectId, ref: "CMSUser" },
  },
  { timestamps: true, collection: "website_content" }
);

export interface ICmsUser extends Document {
  name: string;
  email: string;
  password?: string;
  googleId?: string;
  role: "super_admin" | "admin" | "editor";
  isActive: boolean;
  avatar: string;
  theme: "light" | "dark";
  lastLoginAt?: Date;
  sessions: { token: string; device: string; createdAt: Date; expiresAt: Date }[];
}

const CmsUserSchema = new Schema<ICmsUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String },
    googleId: { type: String },
    role: { type: String, enum: ["super_admin", "admin", "editor"], default: "super_admin" },
    isActive: { type: Boolean, default: true },
    avatar: { type: String, default: "/images/product-design-ux.jpg" },
    theme: { type: String, enum: ["light", "dark"], default: "light" },
    lastLoginAt: { type: Date },
    sessions: [
      {
        token: String,
        device: String,
        createdAt: Date,
        expiresAt: Date,
      },
    ],
  },
  { timestamps: true, collection: "cms_users" }
);

export interface ICmsSettings extends Document {
  key: string;
  value: unknown;
  updatedBy?: mongoose.Types.ObjectId;
}

const CmsSettingsSchema = new Schema<ICmsSettings>(
  {
    key: { type: String, required: true, unique: true, trim: true },
    value: { type: Schema.Types.Mixed, required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: "CMSUser" },
  },
  { timestamps: true, collection: "cms_settings" }
);

export interface IMediaLibrary extends Document {
  publicId: string;
  url: string;
  originalName: string;
  size: number;
  mimeType: string;
  width: number;
  height: number;
  usedIn: string[];
  uploadedBy?: mongoose.Types.ObjectId;
  uploadedAt: Date;
}

const MediaLibrarySchema = new Schema<IMediaLibrary>(
  {
    publicId: { type: String, required: true, unique: true },
    url: { type: String, required: true },
    originalName: { type: String, required: true },
    size: { type: Number, default: 0 },
    mimeType: { type: String, default: "image/jpeg" },
    width: { type: Number, default: 800 },
    height: { type: Number, default: 600 },
    usedIn: { type: [String], default: [] },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "CMSUser" },
    uploadedAt: { type: Date, default: Date.now },
  },
  { timestamps: true, collection: "media_library" }
);

export interface IContactInquiry extends Document {
  externalId: string;
  fullName: string;
  companyName: string;
  workEmail: string;
  phone: string;
  serviceInterestedIn: string;
  projectBudget?: string;
  projectDescription: string;
  preferredContactMethod: "email" | "phone";
  privacyConsent: boolean;
  status: "new" | "read" | "responded" | "closed";
  submittedAt: Date;
}

const ContactInquirySchema = new Schema<IContactInquiry>(
  {
    externalId: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    companyName: { type: String, required: true },
    workEmail: { type: String, required: true },
    phone: { type: String, required: true },
    serviceInterestedIn: { type: String, required: true },
    projectBudget: { type: String },
    projectDescription: { type: String, required: true },
    preferredContactMethod: { type: String, enum: ["email", "phone"], default: "email" },
    privacyConsent: { type: Boolean, default: true },
    status: { type: String, enum: ["new", "read", "responded", "closed"], default: "new" },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true, collection: "contact_inquiries" }
);

export interface IConsultationRequest extends Document {
  externalId: string;
  fullName: string;
  workEmail: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  meetingType: "online" | "in-person";
  additionalNotes?: string;
  privacyConsent: boolean;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  adminNotes?: string;
  submittedAt: Date;
}

const ConsultationRequestSchema = new Schema<IConsultationRequest>(
  {
    externalId: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    workEmail: { type: String, required: true },
    phone: { type: String, required: true },
    preferredDate: { type: String, required: true },
    preferredTime: { type: String, required: true },
    meetingType: { type: String, enum: ["online", "in-person"], default: "online" },
    additionalNotes: { type: String },
    privacyConsent: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "confirmed",
    },
    adminNotes: { type: String, default: "" },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true, collection: "consultation_requests" }
);

export interface ICareerApplication extends Document {
  externalId: string;
  fullName: string;
  email: string;
  phone: string;
  positionOfInterest: string;
  experience: string;
  linkedIn?: string;
  resumeFileName?: string;
  shortIntroduction: string;
  privacyConsent: boolean;
  status: "new" | "shortlisted" | "interviewing" | "rejected" | "hired";
  adminNotes?: string;
  submittedAt: Date;
}

const CareerApplicationSchema = new Schema<ICareerApplication>(
  {
    externalId: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    positionOfInterest: { type: String, required: true },
    experience: { type: String, required: true },
    linkedIn: { type: String },
    resumeFileName: { type: String },
    shortIntroduction: { type: String, required: true },
    privacyConsent: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ["new", "shortlisted", "interviewing", "rejected", "hired"],
      default: "new",
    },
    adminNotes: { type: String, default: "" },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true, collection: "career_applications" }
);

export interface IActivityLog extends Document {
  action: string;
  actorEmail?: string;
  timestamp: Date;
}

const ActivityLogSchema = new Schema<IActivityLog>(
  {
    action: { type: String, required: true },
    actorEmail: { type: String },
    timestamp: { type: Date, default: Date.now },
  },
  { collection: "activity_logs" }
);

export const WebsiteContentModel: Model<IWebsiteContent> =
  mongoose.models.WebsiteContent || mongoose.model("WebsiteContent", WebsiteContentSchema);

export const CmsUserModel: Model<ICmsUser> =
  mongoose.models.CMSUser || mongoose.model("CMSUser", CmsUserSchema);

export const CmsSettingsModel: Model<ICmsSettings> =
  mongoose.models.CMSSettings || mongoose.model("CMSSettings", CmsSettingsSchema);

export const MediaLibraryModel: Model<IMediaLibrary> =
  mongoose.models.MediaLibrary || mongoose.model("MediaLibrary", MediaLibrarySchema);

export const ContactInquiryModel: Model<IContactInquiry> =
  mongoose.models.ContactInquiry || mongoose.model("ContactInquiry", ContactInquirySchema);

export const ConsultationRequestModel: Model<IConsultationRequest> =
  mongoose.models.ConsultationRequest ||
  mongoose.model("ConsultationRequest", ConsultationRequestSchema);

export const CareerApplicationModel: Model<ICareerApplication> =
  mongoose.models.CareerApplication ||
  mongoose.model("CareerApplication", CareerApplicationSchema);

export const ActivityLogModel: Model<IActivityLog> =
  mongoose.models.ActivityLog || mongoose.model("ActivityLog", ActivityLogSchema);
