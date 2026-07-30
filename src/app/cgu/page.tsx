export const metadata = {
  title: "Conditions générales d'utilisation — Athenable",
};

export default function CguPage() {
  return (
    <div className="mx-auto max-w-[720px] px-5 py-24 sm:px-8">
      <h1 className="mb-8 font-display text-3xl font-bold text-navy">
        Conditions générales d&apos;utilisation
      </h1>
      <div className="space-y-6 text-[15.5px] leading-relaxed text-ink-muted">
        <p>
          {/* TODO: compléter avec les vraies CGU (accès au site, propriété intellectuelle, responsabilité, droit applicable) */}
          L&apos;utilisation du site Athenable implique l&apos;acceptation pleine et entière des
          présentes conditions générales d&apos;utilisation.
        </p>
      </div>
    </div>
  );
}
