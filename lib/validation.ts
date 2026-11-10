import { z } from "zod";

export const leadSchema = z
  .object({
    name: z.string().trim().min(2, "Please enter your name.").max(100),
    email: z.string().trim().email("Please enter a valid email address.").max(200),
    company: z.string().trim().min(2, "Please enter your company name.").max(150),
    country: z.string().trim().max(100).optional().default(""),
    interest: z.string().trim().min(2, "Please choose what you need help with.").max(100),
    companySize: z.string().trim().max(50).optional().default(""),
    budget: z.string().trim().max(50).optional().default(""),
    timeline: z.string().trim().max(50).optional().default(""),
    message: z.string().trim().min(10, "Please tell us a little more (at least 10 characters).").max(3000),
    contactMethod: z.enum(["email", "phone", "whatsapp"]).default("email"),
    phone: z.string().trim().max(40).optional().default(""),
    consent: z.literal(true, { errorMap: () => ({ message: "Please accept the privacy policy." }) }),
    website: z.string().max(0).optional().default(""),
    sourcePath: z.string().max(300).optional().default(""),
    referrer: z.string().max(500).optional().default(""),
  })
  .superRefine((data, ctx) => {
    if (data.contactMethod !== "email" && data.phone.replace(/[^0-9]/g, "").length < 7) {
      ctx.addIssue({ code: "custom", path: ["phone"], message: "Please add a phone number for the selected contact method." });
    }
  });

export type Lead = z.infer<typeof leadSchema>;
