export type CmsSectionKey =
  | 'site_brand'
  | 'hero'
  | 'about'
  | 'solutions'
  | 'why_choose_us'
  | 'process'
  | 'industries'
  | 'innovation'
  | 'contact_section'
  | 'careers';

export interface CmsNavLink {
  title: string;
  href: string;
  isCta?: boolean;
}

export interface SiteBrandSection {
  name: string;
  shortName: string;
  tagline: string;
  headerSubtitle: string;
  footerDescription: string;
  locationLabel: string;
  officeHours: string;
  linkedinUrl: string;
  twitterUrl: string;
  githubUrl: string;
  navItems: CmsNavLink[];
}

export interface CapabilityStripItem {
  icon: string;
  title: string;
  desc: string;
}

export interface HeroSectionData {
  headlineLine1: string;
  headlineHighlight: string;
  description: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  heroImage: string;
  heroImageAlt: string;
  imageBadge: string;
  imageCaption: string;
  capabilityStrip: CapabilityStripItem[];
}

export interface AboutHighlight {
  icon: string;
  title: string;
  desc: string;
}

export interface AboutValueItem {
  name: string;
  desc: string;
  icon: string;
}

export interface AboutCapabilityItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  image: string;
}

export interface AboutSectionData {
  badge: string;
  headingLine1: string;
  headingHighlight: string;
  storyText: string;
  aboutImage: string;
  aboutImageAlt: string;
  floatingBadgeTitle: string;
  floatingBadgeSubtitle: string;
  highlights: AboutHighlight[];
  missionBadge: string;
  missionTitle: string;
  missionQuote: string;
  missionSubtext: string;
  visionBadge: string;
  visionTitle: string;
  visionQuote: string;
  visionSubtext: string;
  calloutEyebrow: string;
  calloutQuote: string;
  calloutDescription: string;
  valuesBadge: string;
  valuesTitle: string;
  valuesDescription: string;
  values: AboutValueItem[];
  capabilitiesBadge: string;
  capabilitiesTitle: string;
  capabilitiesDescription: string;
  capabilities: AboutCapabilityItem[];
}

export interface PrimaryServiceCard {
  id: string;
  title: string;
  shortLine: string;
  description: string;
  icon: string;
  ctaLabel: string;
  includes: string[];
}

export interface BusinessNeedCard {
  title: string;
  serviceTitle: string;
  desc: string;
}

export interface SolutionsSectionData {
  badge: string;
  title: string;
  description: string;
  primaryServices: PrimaryServiceCard[];
  businessNeedsBadge: string;
  businessNeedsTitle: string;
  businessNeeds: BusinessNeedCard[];
}

export interface WhyChooseUsItem {
  title: string;
  description: string;
  icon: string;
}

export interface WhyChooseUsSectionData {
  badge: string;
  title: string;
  description: string;
  reasons: WhyChooseUsItem[];
}

export interface ProcessStageData {
  id: string;
  number: string;
  title: string;
  description: string;
  panelOffsetClass?: string;
}

export interface ProcessSectionData {
  badge: string;
  title: string;
  description: string;
  stages: ProcessStageData[];
}

export interface IndustryCardData {
  id: string;
  title: string;
  description: string;
  icon: string;
  image: string;
  keyOutcomes: string[];
}

export interface IndustriesSectionData {
  badge: string;
  title: string;
  description: string;
  items: IndustryCardData[];
}

export interface InnovationTechItem {
  name: string;
  description: string;
  icon: string;
}

export interface ResponsiblePillarItem {
  title: string;
  description: string;
  icon: string;
}

export interface InnovationSectionData {
  exploreBadge: string;
  exploreTitle: string;
  exploreDescription: string;
  emergingTechs: InnovationTechItem[];
  integrityBadge: string;
  integrityTitle: string;
  integrityDescription: string;
  responsiblePillars: ResponsiblePillarItem[];
}

export interface ContactInfoCard {
  title: string;
  description: string;
  icon: string;
}

export interface ContactSectionData {
  homeBadge: string;
  homeTitle: string;
  homeDescription: string;
  homeCtaLabel: string;
  trustBadge1: string;
  trustBadge2: string;
  portalBadge: string;
  portalTitle: string;
  portalDescription: string;
  portalCards: ContactInfoCard[];
  confidentialityTitle: string;
  confidentialityText: string;
}

export interface CareerOpeningItem {
  id: string;
  title: string;
  department: string;
  type: string;
  location: string;
  description: string;
  requirements: string[];
}

export interface CareersSectionData {
  badge: string;
  title: string;
  description: string;
  emptyBadge: string;
  emptyTitle: string;
  emptyDescription: string;
  formPrompt: string;
  openings: CareerOpeningItem[];
  footerCtaTitle: string;
  footerCtaDescription: string;
}

export interface CognirexContentBundle {
  site_brand: SiteBrandSection;
  hero: HeroSectionData;
  about: AboutSectionData;
  solutions: SolutionsSectionData;
  why_choose_us: WhyChooseUsSectionData;
  process: ProcessSectionData;
  industries: IndustriesSectionData;
  innovation: InnovationSectionData;
  contact_section: ContactSectionData;
  careers: CareersSectionData;
}

export interface CmsMediaAsset {
  publicId: string;
  url: string;
  originalName: string;
  size: number;
  mimeType: string;
  width?: number;
  height?: number;
  usedIn?: string[];
  uploadedAt: string;
}

export interface CmsInquiry {
  _id: string;
  fullName: string;
  companyName: string;
  workEmail: string;
  phone: string;
  serviceInterestedIn: string;
  projectBudget?: string;
  projectDescription: string;
  preferredContactMethod?: string;
  status: 'new' | 'read' | 'responded' | 'closed';
  submittedAt: string;
}

export interface CmsConsultation {
  _id: string;
  fullName: string;
  workEmail: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  meetingType: string;
  additionalNotes?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  adminNotes?: string;
  submittedAt: string;
}

export interface CmsCareerApplication {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  positionOfInterest: string;
  experience: string;
  linkedIn?: string;
  resumeFileName?: string;
  shortIntroduction: string;
  status: 'new' | 'shortlisted' | 'interviewing' | 'rejected' | 'hired';
  adminNotes?: string;
  submittedAt: string;
}

export interface CmsActivityItem {
  _id?: string;
  action: string;
  actorEmail?: string;
  timestamp: string;
}
