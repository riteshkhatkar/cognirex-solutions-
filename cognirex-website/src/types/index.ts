export interface NavItem {
  title: string;
  href: string;
  isCta?: boolean;
}

export interface PrimaryService {
  id: string;
  title: string;
  shortLine: string;
  description: string;
  icon: string;
  href: string;
  includes: string[];
  ctaLabel: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  icon: string;
  capabilities: string[];
  businessApplications: string[];
  shortLine?: string;
  includes?: string[];
}

export interface CapabilityArea {
  id: string;
  title: string;
  description: string;
  icon: string;
  image?: string;
}

export interface CareerItem {
  id: string;
  title: string;
  department: string;
  type: string;
  location: string;
  description: string;
  requirements: string[];
  isSample?: boolean;
}

export interface IndustryItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  image: string;
  keyOutcomes: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  isDemo?: boolean;
}

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  badge: string;
  image: string;
  demoUrl?: string;
}

export interface ContactEnquirySubmission {
  id?: string;
  fullName: string;
  companyName: string;
  workEmail: string;
  phone: string;
  serviceInterestedIn: string;
  projectBudget?: string;
  projectDescription: string;
  preferredContactMethod: 'email' | 'phone';
  privacyConsent: boolean;
  createdAt?: string;
}

export interface CareerApplicationSubmission {
  id?: string;
  fullName: string;
  email: string;
  phone: string;
  positionOfInterest: string;
  experience: string;
  linkedIn?: string;
  resumeFileName?: string;
  resumeBase64?: string;
  shortIntroduction: string;
  privacyConsent: boolean;
  createdAt?: string;
}

export interface MeetingRequestSubmission {
  id?: string;
  fullName: string;
  workEmail: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  meetingType: 'online' | 'in-person';
  additionalNotes?: string;
  privacyConsent: boolean;
  status: 'confirmed' | 'pending_confirmation';
  createdAt?: string;
}
