import { ContactEnquirySubmission, CareerApplicationSubmission, MeetingRequestSubmission } from "@/types";
import {
  isSlotAvailable,
  recordCareerApplicationFromWebsite,
  recordConsultationFromWebsite,
  recordInquiryFromWebsite,
} from "@/lib/cmsStore";

// In-memory rate limiting map: IP -> timestamp[]
const rateLimitStore = new Map<string, number[]>();

export function checkRateLimit(ip: string, maxRequests = 5, windowMs = 60 * 1000): boolean {
  const now = Date.now();
  const timestamps = rateLimitStore.get(ip) || [];
  const validTimestamps = timestamps.filter((time) => now - time < windowMs);

  if (validTimestamps.length >= maxRequests) {
    return false; // Rate limit exceeded
  }

  validTimestamps.push(now);
  rateLimitStore.set(ip, validTimestamps);
  return true;
}

// Contact Enquiries (synced with Cognirex CMS Store / MongoDB)
export async function saveContactEnquiry(
  enquiry: ContactEnquirySubmission
): Promise<{ success: boolean; id: string; message: string }> {
  return recordInquiryFromWebsite(enquiry);
}

// Career Applications (synced with Cognirex CMS Store / MongoDB)
export async function saveCareerApplication(
  application: CareerApplicationSubmission
): Promise<{ success: boolean; id: string; message: string }> {
  return recordCareerApplicationFromWebsite(application);
}

// Meeting Requests & Double-booking protection (synced with Cognirex CMS Store / MongoDB)
export async function checkSlotAvailability(date: string, time: string): Promise<boolean> {
  return isSlotAvailable(date, time);
}

export async function saveMeetingRequest(
  request: Omit<MeetingRequestSubmission, "id" | "createdAt" | "status">
): Promise<{ success: boolean; id?: string; message: string; isConflict?: boolean }> {
  return recordConsultationFromWebsite(request);
}
