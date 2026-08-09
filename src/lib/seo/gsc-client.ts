import { google } from "googleapis";
import { ExternalAccountClient } from "google-auth-library";
import { getVercelOidcToken } from "@vercel/oidc";
import { siteConfig } from "@/lib/site-config";

let cached: ReturnType<typeof google.searchconsole> | null = null;

function getClient() {
  if (!cached) {
    const projectNumber = process.env.GCP_PROJECT_NUMBER;
    const serviceAccountEmail = process.env.GCP_SERVICE_ACCOUNT_EMAIL;
    const poolId = process.env.GCP_WORKLOAD_IDENTITY_POOL_ID;
    const providerId = process.env.GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID;

    if (!projectNumber || !serviceAccountEmail || !poolId || !providerId) {
      throw new Error(
        "Missing environment variables: GCP_PROJECT_NUMBER / GCP_SERVICE_ACCOUNT_EMAIL / GCP_WORKLOAD_IDENTITY_POOL_ID / GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID",
      );
    }

    // Exchanges the Vercel deployment's OIDC token for short-lived Google credentials —
    // pool/provider and service account must live in the SAME GCP project.
    const authClient = ExternalAccountClient.fromJSON({
      type: "external_account",
      audience: `//iam.googleapis.com/projects/${projectNumber}/locations/global/workloadIdentityPools/${poolId}/providers/${providerId}`,
      subject_token_type: "urn:ietf:params:oauth:token-type:jwt",
      token_url: "https://sts.googleapis.com/v1/token",
      service_account_impersonation_url: `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${serviceAccountEmail}:generateAccessToken`,
      subject_token_supplier: {
        getSubjectToken: () => getVercelOidcToken(),
      },
      scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
    });

    if (!authClient) {
      throw new Error("Failed to create GCP Workload Identity Federation client");
    }

    cached = google.searchconsole({ version: "v1", auth: authClient });
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
