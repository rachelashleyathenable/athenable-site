export const metadata = {
  title: "Politique de confidentialité — Athenable",
};

export default function ConfidentialitePage() {
  return (
    <div className="mx-auto max-w-[720px] px-5 py-24 sm:px-8">
      <h1 className="mb-8 font-display text-3xl font-bold text-navy">
        Politique de confidentialité
      </h1>
      <div className="space-y-6 text-[15.5px] leading-relaxed text-ink-muted">
        <p>
          {/* TODO: compléter avec la vraie politique de confidentialité (données collectées via le quiz et le formulaire de contact, durée de conservation, droits RGPD, etc.) */}
          Athenable collecte votre prénom et votre adresse email lorsque vous complétez notre
          quiz ou notre formulaire de contact, dans le seul but de vous adresser nos analyses et
          opportunités.
        </p>
        <p>
          Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification et de
          suppression de vos données. Pour l&apos;exercer, contactez-nous : [email à préciser].
        </p>
      </div>
    </div>
  );
}
