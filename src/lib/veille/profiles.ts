// Profils de veille financement, un par client "Athenable pour entreprise".
// Le texte décrit le projet pour que la recherche cible les bons appels.

export type VeilleProfile = {
  slug: string; // même slug que dans src/lib/clients.ts
  name: string;
  description: string;
};

export const VEILLE_PROFILES: readonly VeilleProfile[] = [
  {
    slug: "minova",
    name: "Minova",
    description: `Minova (Bruxelles, Belgique), projet porté par Alessia Reimann.
Produit : des bandes dessinées papier (16 pages, format A5) pour les enfants hospitalisés de 8 à 12 ans, qui leur expliquent un soin médical, complétées par des lunettes de réalité augmentée qui animent la BD. Première BD : la pose d'une sonde naso-gastrique ; sortie prévue le 1er décembre 2026.
Domaines : santé de l'enfant, pédiatrie et hôpitaux, innovation sociale, éducation à la santé, édition / BD, réalité augmentée, entrepreneuriat féminin, économie sociale.
Zone : Région de Bruxelles-Capitale en priorité, puis Wallonie et Fédération Wallonie-Bruxelles, Belgique fédérale, puis Europe.
Stade : démarrage, premiers prototypes, recherche de premiers financements non dilutifs (subventions, prix, appels à projets, fondations, mécénat, bourses).`,
  },
] as const;

export function getVeilleProfile(slug: string): VeilleProfile | null {
  return VEILLE_PROFILES.find((p) => p.slug === slug) ?? null;
}
