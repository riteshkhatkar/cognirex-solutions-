const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { OAuth2Client } = require('google-auth-library');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const {
  WebsiteContent,
  CmsUser,
  CmsSettings,
  MediaLibrary,
  ContactInquiry,
  ConsultationRequest,
  CareerApplication,
  ActivityLog,
} = require('./models/CmsModels');

const app = express();
const PORT = Number(process.env.PORT || 5000);
const JWT_SECRET = process.env.JWT_SECRET || 'cognirex_cms_dev_jwt_secret_2026';
const GOOGLE_CLIENT_ID = (process.env.GOOGLE_CLIENT_ID || '').trim();
const googleClient = GOOGLE_CLIENT_ID ? new OAuth2Client(GOOGLE_CLIENT_ID) : null;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '15mb' }));

async function getAuthorizedEmails() {
  const defaults = (process.env.AUTHORIZED_EMAILS || process.env.SUPER_ADMIN_EMAIL || 'admin@cognirexsolutions.com')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  const doc = await CmsSettings.findOne({ key: 'authorized_emails' }).lean();
  if (!doc || !Array.isArray(doc.value)) return defaults;
  return Array.from(new Set([...doc.value.map((e) => String(e).toLowerCase()), ...defaults]));
}

async function authMiddleware(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7).trim() : '';
    if (!token) return res.status(401).json({ success: false, error: 'Missing authentication token' });
    const payload = jwt.verify(token, JWT_SECRET);
    const authorized = await getAuthorizedEmails();
    if (!authorized.includes(String(payload.email).toLowerCase())) {
      return res.status(403).json({ success: false, error: 'Unauthorized email address' });
    }
    const user = await CmsUser.findOne({ email: String(payload.email).toLowerCase() });
    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, error: 'Account inactive or missing' });
    }
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }
}

// Public content endpoints
app.get('/api/public/content/all', async (_req, res) => {
  const docs = await WebsiteContent.find().lean();
  const out = {};
  for (const d of docs) out[d.section] = d.data;
  res.json(out);
});

app.get('/api/public/content/:section', async (req, res) => {
  const doc = await WebsiteContent.findOne({ section: req.params.section }).lean();
  if (!doc) return res.status(404).json({ success: false, error: 'Section not found' });
  res.json(doc.data);
});

// Auth endpoints
app.get('/api/cms/auth/config', (_req, res) => {
  res.json({ googleClientId: GOOGLE_CLIENT_ID });
});

app.post('/api/cms/auth/login', async (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');
  const authorized = await getAuthorizedEmails();
  if (!authorized.includes(email)) {
    return res.status(403).json({ success: false, error: 'Email is not authorized' });
  }
  const user = await CmsUser.findOne({ email });
  if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ success: false, error: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: String(user._id), email: user.email, role: user.role }, JWT_SECRET, {
    expiresIn: '7d',
  });
  res.json({
    success: true,
    token,
    user: { id: String(user._id), name: user.name, email: user.email, role: user.role, avatar: user.avatar },
  });
});

app.post('/api/cms/auth/google', async (req, res) => {
  const credential = String(req.body?.credential || '');
  if (!googleClient || !credential) {
    return res.status(400).json({ success: false, error: 'Google OAuth not configured on standalone server' });
  }
  const ticket = await googleClient.verifyIdToken({ idToken: credential, audience: GOOGLE_CLIENT_ID });
  const payload = ticket.getPayload();
  const email = String(payload?.email || '').toLowerCase();
  const authorized = await getAuthorizedEmails();
  if (!authorized.includes(email)) {
    return res.status(403).json({ success: false, error: `${email} is not whitelisted` });
  }
  let user = await CmsUser.findOne({ email });
  if (!user) {
    user = await CmsUser.create({
      name: payload?.name || 'Cognirex Admin',
      email,
      googleId: payload?.sub,
      avatar: payload?.picture || '',
      role: 'admin',
    });
  }
  const token = jwt.sign({ id: String(user._id), email: user.email, role: user.role }, JWT_SECRET, {
    expiresIn: '7d',
  });
  res.json({
    success: true,
    token,
    user: { id: String(user._id), name: user.name, email: user.email, role: user.role, avatar: user.avatar },
  });
});

app.get('/api/cms/auth/me', authMiddleware, (req, res) => {
  const u = req.user;
  res.json({
    success: true,
    user: { id: String(u._id), name: u.name, email: u.email, role: u.role, avatar: u.avatar, theme: u.theme },
  });
});

app.post('/api/cms/auth/logout', (_req, res) => res.json({ success: true }));

// Section CRUD
app.get('/api/cms/content/:section', authMiddleware, async (req, res) => {
  const doc = await WebsiteContent.findOne({ section: req.params.section }).lean();
  res.json(doc ? doc.data : {});
});

app.put('/api/cms/content/:section', authMiddleware, async (req, res) => {
  const saved = await WebsiteContent.findOneAndUpdate(
    { section: req.params.section },
    { section: req.params.section, data: req.body },
    { upsert: true, new: true }
  );
  await ActivityLog.create({ action: `Updated section ${req.params.section}`, actorEmail: req.user.email });
  res.json({ success: true, section: req.params.section, data: saved.data });
});

// Media CRUD
app.get('/api/cms/media', authMiddleware, async (_req, res) => {
  const assets = await MediaLibrary.find().sort({ uploadedAt: -1 }).lean();
  res.json(assets);
});

app.delete('/api/cms/media/:publicId', authMiddleware, async (req, res) => {
  await MediaLibrary.findOneAndDelete({ publicId: decodeURIComponent(req.params.publicId) });
  res.json({ success: true });
});

// Leads & Apps & Activities
app.get('/api/cms/inquiries', authMiddleware, async (_req, res) => {
  res.json(await ContactInquiry.find().sort({ submittedAt: -1 }).lean());
});

app.get('/api/cms/consultations', authMiddleware, async (_req, res) => {
  res.json(await ConsultationRequest.find().sort({ submittedAt: -1 }).lean());
});

app.get('/api/cms/applications', authMiddleware, async (_req, res) => {
  res.json(await CareerApplication.find().sort({ submittedAt: -1 }).lean());
});

app.get('/api/cms/activities', authMiddleware, async (_req, res) => {
  res.json(await ActivityLog.find().sort({ timestamp: -1 }).limit(50).lean());
});

// Static CMS SPA serving
const distDir = path.resolve(__dirname, '../dist');
if (fs.existsSync(distDir)) {
  app.use('/cms', express.static(distDir));
  app.get('/cms/*', (_req, res) => {
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

async function start() {
  const uri = process.env.MONGODB_URI;
  if (uri && uri.startsWith('mongodb')) {
    await mongoose.connect(uri);
    console.log('Standalone Express server connected to MongoDB');
  } else {
    console.warn('MONGODB_URI not configured; configure cms/.env for standalone Express persistence.');
  }
  app.listen(PORT, () => {
    console.log(`Cognirex Standalone CMS Server listening on http://localhost:${PORT}/cms`);
  });
}

start().catch((err) => {
  console.error('Standalone server startup failed:', err);
  process.exit(1);
});
