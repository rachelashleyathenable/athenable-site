export const metadata = {
  title: "Mentions légales — Athenable",
};

export default function MentionsLegalesPage() {
  return (
    <div className="mx-auto max-w-[720px] px-5 py-24 sm:px-8">
      <h1 className="mb-8 font-display text-3xl font-bold text-navy">Mentions légales</h1>
      <div className="space-y-6 text-[15.5px] leading-relaxed text-ink-muted">
        <p>
          {/* TODO: compléter avec les informations légales réelles de la société Athenable */}
          Éditeur du site : Athenable — [forme juridique à préciser], [adresse à préciser].
        </p>
        <p>Directeur de la publication : [à préciser].</p>
        <p>Hébergement : Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis.</p>
        <p>Contact : [email à préciser].</p>
      </div>
    </div>
  );
}
