import { Resend } from "resend";

let cached: Resend | null = null;

export function getResend() {
  if (!cached) {
    cached = new Resend(process.env.RESEND_API_KEY || "re_dummy_build_time_key");
  }
  return cached;
}

export const NOTIFY_FROM = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
export const NOTIFY_TO = process.env.RESEND_TO_EMAIL ?? "";
