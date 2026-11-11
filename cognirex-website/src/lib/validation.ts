import { z } from "zod";

export const contactSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(100),
  companyName: z.string().min(2, "Company name must be at least 2 characters").max(100),
  workEmail: z.string().email("Please provide a valid work email address"),
  phone: z
    .string()
    .min(7, "Please enter a valid phone number")
    .max(20, "Phone number is too long")
    .regex(/^[0-9+\-\s()]+$/, "Phone number contains invalid characters"),
  serviceInterestedIn: z.string().min(1, "Please select a service of interest"),
  projectBudget: z.string().optional(),
  projectDescription: z
    .string()
    .min(10, "Please provide a brief description (at least 10 characters)")
    .max(2000, "Description exceeds maximum length"),
  preferredContactMethod: z.enum(["email", "phone"], {
    errorMap: () => ({ message: "Please select your preferred contact method" }),
  }),
  privacyConsent: z.boolean().refine((val) => val === true, {
    message: "You must acknowledge and consent to our privacy policy",
  }),
  honeypot: z.string().optional(),
});

export const careerSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(100),
  email: z.string().email("Please provide a valid email address"),
  phone: z
    .string()
    .min(7, "Please enter a valid phone number")
    .max(20, "Phone number is too long")
    .regex(/^[0-9+\-\s()]+$/, "Phone number contains invalid characters"),
  positionOfInterest: z.string().min(1, "Please select the position you are applying for"),
  experience: z.string().min(1, "Please indicate your years of experience"),
  linkedIn: z
    .string()
    .url("Please enter a valid URL (e.g. https://linkedin.com/in/username)")
    .optional()
    .or(z.literal("")),
  resumeFileName: z.string().min(3, "Please attach a resume file"),
  resumeBase64: z.string().min(10, "Resume file content is missing or corrupt"),
  shortIntroduction: z
    .string()
    .min(20, "Please share a brief introduction about your background (minimum 20 characters)")
    .max(1500, "Introduction cannot exceed 1500 characters"),
  privacyConsent: z.boolean().refine((val) => val === true, {
    message: "You must consent to resume processing",
  }),
  honeypot: z.string().optional(),
});

export const meetingSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(100),
  workEmail: z.string().email("Please provide a valid work email address"),
  phone: z
    .string()
    .min(7, "Please enter a valid phone number")
    .max(20, "Phone number is too long")
    .regex(/^[0-9+\-\s()]+$/, "Phone number contains invalid characters"),
  preferredDate: z.string().min(1, "Please select a preferred meeting date").refine((val) => {
    const selected = new Date(val);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selected >= today;
  }, "Preferred date cannot be in the past"),
  preferredTime: z.string().min(1, "Please select a preferred time slot"),
  meetingType: z.enum(["online", "in-person"], {
    errorMap: () => ({ message: "Please specify meeting format" }),
  }),
  additionalNotes: z.string().max(500, "Notes cannot exceed 500 characters").optional(),
  privacyConsent: z.boolean().refine((val) => val === true, {
    message: "Please agree to communication terms",
  }),
  honeypot: z.string().optional(),
});
