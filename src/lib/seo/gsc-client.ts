import { google } from "googleapis";
import { siteConfig } from "@/lib/site-config";

let cached: ReturnType<typeof google.searchconsole> | null = null;

function getClient() {
  if (!cached) {
    const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;

    if (!email || !privateKey) {
      throw new Error(
        "Missing environment variables: GOOGLE_SERVICE_ACCOUNT_EMAIL / GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY",
      );
    }

    const auth = new google.auth.JWT({
      email,
      key: privateKey.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
    });

    cached = google.searchconsole({ version: "v1", auth });
  }
  return cached;
}

export async function fetchSearchAnalytics(input: { startDate: string; endDate: string }) {
  const siteUrl = process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL ?? `sc-domain:${new URL(siteConfig.siteUrl).hostname}`;

  const res = await getClient().searchanalytics.query({
    siteUrl,
    requestBody: {
      startDate: input.startDate,
      endDate: input.endDate,
      dimensions: ["query", "page", "date"],
      rowLimit: 1000,
    },
  });

  return res.data.rows ?? [];
}
