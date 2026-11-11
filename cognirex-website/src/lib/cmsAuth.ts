import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import {
  findOrBootstrapUser,
  getAuthorizedEmails,
  getPrimarySuperAdminEmail,
  logActivity,
  type StoredCmsUser,
} from "./cmsStore";

const JWT_SECRET = process.env.JWT_SECRET || "cognirex_cms_dev_jwt_secret_2026";
const GOOGLE_CLIENT_ID = (process.env.GOOGLE_CLIENT_ID || "").trim();
const googleClient = GOOGLE_CLIENT_ID ? new OAuth2Client(GOOGLE_CLIENT_ID) : null;

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

export function signAccessToken(user: StoredCmsUser): string {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
    expiresIn: "7d",
  });
}

export function verifyAccessToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

export async function requireCmsAuth(
  req: NextRequest
): Promise<{ user: StoredCmsUser; error?: undefined } | { user?: undefined; error: NextResponse }> {
  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";

  if (!token) {
    return {
      error: NextResponse.json(
        { success: false, error: "Unauthorized: Missing authentication token" },
        { status: 401 }
      ),
    };
  }

  const payload = verifyAccessToken(token);
  if (!payload || !payload.email) {
    return {
      error: NextResponse.json(
        { success: false, error: "Unauthorized: Invalid or expired session token" },
        { status: 401 }
      ),
    };
  }

  const authorized = await getAuthorizedEmails();
  if (!authorized.includes(payload.email.toLowerCase())) {
    return {
      error: NextResponse.json(
        { success: false, error: "Forbidden: Account email is no longer authorized" },
        { status: 403 }
      ),
    };
  }

  const user = await findOrBootstrapUser(payload.email);
  if (!user.isActive) {
    return {
      error: NextResponse.json(
        { success: false, error: "Unauthorized: Admin account deactivated" },
        { status: 401 }
      ),
    };
  }

  return { user };
}

export async function authenticateWithCredentials(
  email: string,
  password: string
): Promise<{ ok: true; token: string; user: StoredCmsUser } | { ok: false; status: number; error: string }> {
  const normalized = email.trim().toLowerCase();
  if (!normalized || !password) {
    return { ok: false, status: 400, error: "Email and password are required." };
  }

  const authorized = await getAuthorizedEmails();
  if (!authorized.includes(normalized)) {
    return {
      ok: false,
      status: 403,
      error: "Forbidden: Email address is not authorized in CMS Settings.",
    };
  }

  const user = await findOrBootstrapUser(normalized);
  if (!user.passwordHash) {
    return { ok: false, status: 401, error: "Password authentication not set for this account." };
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    return { ok: false, status: 401, error: "Invalid email or password." };
  }

  const token = signAccessToken(user);
  await logActivity(`Logged in via credentials: ${user.email}`, user.email);
  return { ok: true, token, user };
}

export async function authenticateWithGoogle(
  credential: string
): Promise<{ ok: true; token: string; user: StoredCmsUser } | { ok: false; status: number; error: string }> {
  if (!credential) {
    return { ok: false, status: 400, error: "Google credential token is required." };
  }

  let email = "";
  let name = "Cognirex Admin";
  let googleId = "";
  let avatar = "";

  const allowDevBypass =
    process.env.NODE_ENV !== "production" &&
    (!GOOGLE_CLIENT_ID || credential === "dev_local_token");

  if (allowDevBypass && credential === "dev_local_token") {
    email = getPrimarySuperAdminEmail();
    name = "Cognirex Super Admin";
    googleId = `dev_google_${email}`;
  } else if (googleClient) {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload?.email) {
      return { ok: false, status: 400, error: "Invalid Google token payload." };
    }
    email = payload.email.toLowerCase().trim();
    name = payload.name || "Cognirex Admin";
    googleId = payload.sub;
    avatar = payload.picture || "";
  } else {
    return {
      ok: false,
      status: 400,
      error: "Google OAuth Client ID is not configured. Use Email/Password login or configure GOOGLE_CLIENT_ID in .env.",
    };
  }

  const authorized = await getAuthorizedEmails();
  if (!authorized.includes(email)) {
    return {
      ok: false,
      status: 403,
      error: `Forbidden: ${email} is not whitelisted in CMS Settings.`,
    };
  }

  const user = await findOrBootstrapUser(email, { name, googleId, avatar });
  const token = signAccessToken(user);
  await logActivity(`Logged in via Google OAuth: ${user.email}`, user.email);
  return { ok: true, token, user };
}
