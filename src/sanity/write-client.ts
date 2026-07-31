import { createClient, type SanityClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "./env";

let cached: SanityClient | null = null;

export function getWriteClient(): SanityClient {
  if (!cached) {
    if (!process.env.SANITY_API_TOKEN) {
      throw new Error("Missing environment variable: SANITY_API_TOKEN");
    }
    cached = createClient({
      projectId,
      dataset,
      apiVersion,
      token: process.env.SANITY_API_TOKEN,
      useCdn: false,
    });
  }
  return cached;
}
