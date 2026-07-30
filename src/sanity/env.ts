export const apiVersion = "2025-01-01";

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "0000placeholder";

if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
  // eslint-disable-next-line no-console
  console.warn(
    "NEXT_PUBLIC_SANITY_PROJECT_ID is not set — Sanity requests will fail until it's configured.",
  );
}
