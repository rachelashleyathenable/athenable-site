export type AdSuggestion = {
  id: string;
  headline: string;
  description: string;
  keywords: string[];
};

export interface AdsProvider {
  getConnectionStatus(): Promise<{ connected: boolean; reason?: string }>;
  getSuggestions(): Promise<AdSuggestion[]>;
}

export const adsProvider: AdsProvider = {
  async getConnectionStatus() {
    return { connected: false, reason: "no_google_ads_account" };
  },
  async getSuggestions() {
    return [];
  },
};
