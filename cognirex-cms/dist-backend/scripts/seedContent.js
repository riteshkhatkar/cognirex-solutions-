const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const { WebsiteContent, CmsUser, CmsSettings, ActivityLog } = require('../models/CmsModels');

// Extract sections cleanly from root JSON / defaults if available or use built-in loader
async function loadDefaultsBundle() {
  const localWebsiteContent = path.resolve(__dirname, '../../../.data/website_content.json');
  if (fs.existsSync(localWebsiteContent)) {
    return JSON.parse(fs.readFileSync(localWebsiteContent, 'utf-8'));
  }
  return {};
}

async function seedDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri || !uri.startsWith('mongodb')) {
    console.error('Missing valid MONGODB_URI in cms/.env. Set MONGODB_URI first, then run npm run seed.');
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log('Connected to MongoDB for Cognirex Solutions CMS seeding.');

  const superEmail = (process.env.SUPER_ADMIN_EMAIL || 'admin@cognirexsolutions.com')
    .trim()
    .toLowerCase();
  const authorizedList = (process.env.AUTHORIZED_EMAILS || superEmail)
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  await CmsSettings.findOneAndUpdate(
    { key: 'authorized_emails' },
    { key: 'authorized_emails', value: Array.from(new Set([superEmail, ...authorizedList])) },
    { upsert: true, new: true }
  );

  const defaultPass = process.env.ADMIN_DEFAULT_PASSWORD || 'Cognirex@Admin2026';
  const existingAdmin = await CmsUser.findOne({ email: superEmail });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(defaultPass, 10);
    await CmsUser.create({
      name: 'Cognirex Super Admin',
      email: superEmail,
      password: hashedPassword,
      role: 'superadmin',
      isActive: true,
    });
    console.log(`Seeded Super Admin account: ${superEmail}`);
  }

  const bundle = await loadDefaultsBundle();
  for (const [section, data] of Object.entries(bundle)) {
    await WebsiteContent.findOneAndUpdate(
      { section },
      { section, data },
      { upsert: true, new: true }
    );
    console.log(`Seeded section: ${section}`);
  }

  await ActivityLog.create({
    action: 'Initialized & seeded Cognirex Solutions CMS MongoDB database',
    actorEmail: superEmail,
    timestamp: new Date(),
  });

  await mongoose.disconnect();
  console.log('Cognirex CMS MongoDB seed completed.');
}

seedDatabase().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
