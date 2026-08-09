import { adsProvider } from "@/lib/seo/ads-provider";
import { AdCopyGenerator } from "@/components/ad-copy-generator";

export const dynamic = "force-dynamic";

export default async function AdsPage() {
  const status = await adsProvider.getConnectionStatus();

  return (
    <div>
      <AdCopyGenerator />

      <div className="rounded-2xl border border-line bg-ice p-8">
        <h2 className="mb-3 font-display text-lg font-bold text-navy">Google Ads — non connecté</h2>
        <p className="mb-5 text-[14.5px] text-ink-muted">
          Aucun compte Google Ads n&apos;est encore relié. La publication automatique des annonces (création,
          budgets, ciblage) nécessitera de connecter un compte plus tard — l&apos;IA ne pourra jamais dépenser ou
          appliquer de changement seule, tout passera par ta validation ici. En attendant, utilise le générateur
          ci-dessus pour rédiger tes annonces et publie-les manuellement sur ads.google.com.
        </p>
        <div className="text-[13.5px] text-ink-muted">
          <p className="mb-2 font-semibold text-ink">Étapes pour activer la publication automatique :</p>
          <ol className="list-decimal space-y-1 pl-5">
            <li>Créer un compte Google Ads (ads.google.com)</li>
            <li>Faire une demande de token développeur Google Ads API</li>
            <li>Configurer OAuth + lier le compte au projet</li>
          </ol>
        </div>
        <p className="mt-5 text-[12px] text-ink-muted">Statut technique : {status.reason}</p>
      </div>
    </div>
  );
}
