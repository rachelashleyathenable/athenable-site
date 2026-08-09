export const siteConfig = {
  name: "Athenable",
  tagline: "Élargissez votre vision. Affinez vos décisions.",
  siteUrl: "https://athenable.app",
  linkedin: "https://www.linkedin.com/in/rachel-a-84b718253/",
  email: "RachelAshley@Athenable.onmicrosoft.com",
  calendly: "https://calendly.com/rachelashley-athenable/30min",
  instagram: "https://www.instagram.com/a.thenable/",
  youtube: "https://www.youtube.com/@athenable-v4r",
  communityUrl: "https://www.reddit.com/r/AnalyseEtDecision",
  // TODO: remplacer par l'ID de la vidéo YouTube de démonstration (partie après "v=" dans l'URL)
  demoVideoId: "",
  // TODO: remplacer par l'ID de la vidéo YouTube "Découvrez notre vision" (page À propos)
  visionVideoId: "",
  methodologyUrl: "https://www.reddit.com/r/AnalyseEtDecision",
  // En attendant que l'app Athenable Starter soit prête, redirige vers le groupe LinkedIn communautaire
  starterAppUrl: "https://www.linkedin.com/groups/35150004/",
  // TODO: remplacer par le vrai lien de connexion Microsoft / app Athenable for Business
  businessLoginUrl: "https://REMPLACER_LIEN_ATHENABLE_BUSINESS",
} as const;

export const navLinks = [
  { href: "/", key: "home" },
  { href: "/services", key: "services" },
  { href: "/a-propos", key: "about" },
  { href: "/blog", key: "blog" },
] as const;
