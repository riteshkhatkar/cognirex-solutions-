const mongoose = require('mongoose');

const WebsiteContentSchema = new mongoose.Schema(
  {
    section: { type: String, required: true, unique: true, index: true },
    data: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

const CmsUserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String },
    googleId: { type: String },
    role: { type: String, enum: ['super_admin', 'admin', 'editor'], default: 'admin' },
    isActive: { type: Boolean, default: true },
    avatar: { type: String, default: '' },
    theme: { type: String, enum: ['light', 'dark'], default: 'light' },
  },
  { timestamps: true }
);

const CmsSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    value: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

const MediaLibrarySchema = new mongoose.Schema(
  {
    publicId: { type: String, required: true, unique: true },
    url: { type: String, required: true },
    originalName: { type: String, required: true },
    size: { type: Number, default: 0 },
    mimeType: { type: String, default: 'image/jpeg' },
    width: { type: Number, default: 800 },
    height: { type: Number, default: 600 },
    usedIn: { type: [String], default: [] },
    uploadedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const ContactInquirySchema = new mongoose.Schema(
  {
    externalId: { type: String },
    fullName: { type: String, required: true },
    companyName: { type: String, required: true },
    workEmail: { type: String, required: true },
    phone: { type: String, required: true },
    serviceInterestedIn: { type: String, required: true },
    projectBudget: { type: String },
    projectDescription: { type: String, required: true },
    preferredContactMethod: { type: String, default: 'Email' },
    status: { type: String, enum: ['new', 'read', 'responded', 'closed'], default: 'new' },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const ConsultationRequestSchema = new mongoose.Schema(
  {
    externalId: { type: String },
    fullName: { type: String, required: true },
    workEmail: { type: String, required: true },
    phone: { type: String, required: true },
    preferredDate: { type: String, required: true },
    preferredTime: { type: String, required: true },
    meetingType: { type: String, required: true },
    additionalNotes: { type: String },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'confirmed',
    },
    adminNotes: { type: String, default: '' },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const CareerApplicationSchema = new mongoose.Schema(
  {
    externalId: { type: String },
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
      enum: ['new', 'shortlisted', 'interviewing', 'rejected', 'hired'],
      default: 'new',
    },
    adminNotes: { type: String, default: '' },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const ActivityLogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  actorEmail: { type: String },
  timestamp: { type: Date, default: Date.now },
});

module.exports = {
  WebsiteContent:
    mongoose.models.WebsiteContent || mongoose.model('WebsiteContent', WebsiteContentSchema),
  CmsUser: mongoose.models.CmsUser || mongoose.model('CmsUser', CmsUserSchema),
  CmsSettings: mongoose.models.CmsSettings || mongoose.model('CmsSettings', CmsSettingsSchema),
  MediaLibrary:
    mongoose.models.MediaLibrary || mongoose.model('MediaLibrary', MediaLibrarySchema),
  ContactInquiry:
    mongoose.models.ContactInquiry || mongoose.model('ContactInquiry', ContactInquirySchema),
  ConsultationRequest:
    mongoose.models.ConsultationRequest ||
    mongoose.model('ConsultationRequest', ConsultationRequestSchema),
  CareerApplication:
    mongoose.models.CareerApplication ||
    mongoose.model('CareerApplication', CareerApplicationSchema),
  ActivityLog: mongoose.models.ActivityLog || mongoose.model('ActivityLog', ActivityLogSchema),
};
