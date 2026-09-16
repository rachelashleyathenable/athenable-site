import React, { useState, useEffect, useMemo } from "react";
import { GraduationCap, Users, BookOpen, ArrowRight, X, Presentation, ChevronLeft, ChevronRight, TrendingUp, ClipboardCheck } from "lucide-react";
const LOGO_SRC = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAD1CAYAAAC/Wit4AAD23klEQVR4nOy9d7wdV3U2/Ky198w55zbdq967ZKu4Su5NMhgMBAwhhpBOeghddL3/1v7XjW9v0aP93z/9r/l/xX0BAOB0ADg9BwAAAAAA";
const NAVY = "#1F3864";
const TEAL = "#0F6E56";
const MINT = "#5DCAA5";
const ROLE_OPTIONS = [
  { code: "Employé", desc: "Voit uniquement son propre profil." },
  { code: "Manager", desc: "Voit son profil et celui de son équipe." },
  { code: "CEO", desc: "Voit tous les profils de l'entreprise (protégé par mot de passe)." },
];
const CEO_PASSWORD = "jesuisnovaheritage";
const DISC_OPTIONS = [
  { code: "Rouge", color: "#C0392B", light: "#FBEAE9", celeb: "Steve Jobs", trait: "Direct, orienté résultat, décide vite" },
  { code: "Jaune", color: "#C99A1E", light: "#FBF3E0", celeb: "Oprah Winfrey", trait: "Sociable, enthousiaste, motive les autres" },
  { code: "Vert", color: "#1E7A4C", light: "#E9F5EE", celeb: "Mahatma Gandhi", trait: "Posé, à l'écoute, stabilise le groupe" },
  { code: "Bleu", color: "#1F5FA8", light: "#E7EFF9", celeb: "Marie Curie", trait: "Précise, rigoureuse, orientée méthode" },
];
const MBTI_CELEB = {
  INTJ: "Nikola Tesla", INTP: "Albert Einstein", ENTJ: "Franklin D. Roosevelt", ENTP: "Thomas Edison",
  INFJ: "Martin Luther King Jr.", INFP: "J.R.R. Tolkien", ENFJ: "Barack Obama", ENFP: "Walt Disney",
  ISTJ: "George Washington", ISFJ: "Mère Teresa", ESTJ: "Henry Ford", ESFJ: "Taylor Swift",
  ISTP: "Clint Eastwood", ISFP: "Bob Dylan", ESTP: "Ernest Hemingway", ESFP: "Marilyn Monroe",
};
const MBTI_LIST = Object.keys(MBTI_CELEB);
const PROFILE_DETAILS = [
  { code: "Rouge", forces: ["Décide vite, prend les choses en main sous pression", "Va droit au but, fait avancer les sujets bloqués", "À l'aise pour trancher quand il faut choisir"],
    faiblesses: ["Peut sembler cassant ou impatient", "Passe parfois trop vite sur les détails", "Écoute moins bien quand ça va lentement"] },
  { code: "Jaune", forces: ["Motive et embarque le reste de l'équipe", "Bon communicant, convaincant à l'oral", "S'adapte facilement à une nouvelle situation"],
    faiblesses: ["Peut manquer de suivi dans le détail", "Se disperse sur plusieurs sujets à la fois", "Sous-estime parfois les délais réels"] },
  { code: "Vert", forces: ["Fiable, stabilise l'équipe dans les moments tendus", "Écoute vraiment avant de réagir", "Bon pour désamorcer une tension"],
    faiblesses: ["Peut freiner un changement nécessaire", "Évite parfois le conflit même quand il faudrait le nommer", "Prend du temps avant de se décider"] },
  { code: "Bleu", forces: ["Rigoureux, fiable sur les chiffres et les détails", "Anticipe les erreurs avant qu'elles arrivent", "Documente et structure naturellement"],
    faiblesses: ["Peut ralentir une décision qui doit aller vite", "Parait parfois froid ou trop critique", "A du mal avec l'approximation, même utile"] },
];
const TRAINING_SITUATIONS = [
  "Le responsable commercial engage des discussions avec un nouvel intervenant technique sans en informer le responsable juridique, pourtant chargé de valider les modalités avant tout engagement.",
  "Après chaque réunion, le compte-rendu ne remonte pas de façon systématique. La crainte principale : que des décisions importantes se perdent avant d'arriver aux bonnes personnes.",
  "Les membres de l'équipe avancent chacun sur leurs dossiers sans point de coordination régulier, ce qui crée des doublons ou des oublis entre les différents pôles.",
];
const SCIENTIFIC_SOURCES = {
  DISC: [
    { t: "Physiotherapy students' DiSC behaviour styles can be used to predict the likelihood of success in clinical placements", a: "PMC, 2019", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6798476/" },
    { t: "DISC assessment — synthèse (théorie de Marston, étude allemande TBS-DTk sur Persolog, 2013)", a: "Wikipedia", url: "https://en.wikipedia.org/wiki/DISC_assessment" },
    { t: "DISC Testing: Reliability and Validity (référence au « Roodt Report »)", a: "Discus Online", url: "https://www.discusonline.com/en-us/disc/disc-reliability-validity.php" },
    { t: "Using the DiSC Personality Assessment to Enhance Organizational Development", a: "Thèse, University of Mississippi (eGrove)", url: "https://egrove.olemiss.edu/cgi/viewcontent.cgi?article=4067&context=etd" },
    { t: "How Reliable Is the DISC Personality Test?", a: "HR Profiling Solutions", url: "https://hrprofilingsolutions.com.au/blogs/aus-blog/how-reliable-is-the-disc-personality-test/" },
  ],
  MBTI: [
    { t: "A 25-Year Review and Psychometric Synthesis of the Myers–Briggs Type Indicator (MBTI) – Form M", a: "Erford et al., Journal of Counseling & Development, 2025", url: "https://onlinelibrary.wiley.com/doi/10.1002/jcad.70006" },
    { t: "MBTI Reliability and Validity (synthèse citant Capraro & Capraro 2002, Moyle & Hackston 2018)", a: "The Myers-Briggs Company", url: "https://www.myersbriggs.org/research-and-library/validity-reliability/" },
    { t: "Validity and Reliability of the Myers-Briggs Personality Type Indicator", a: "Randall et al., 2017", url: "https://gwern.net/doc/psychology/personality/2017-randall.pdf" },
    { t: "What the Myers-Briggs Type Indicator Overlooks", a: "Honors thesis, Liberty University", url: "https://digitalcommons.liberty.edu/cgi/viewcontent.cgi?article=2294&context=honors" },
    { t: "MBTI Test: Is Myers-Briggs Test Valid? According to Science", a: "Science of People", url: "https://www.scienceofpeople.com/myers-briggs-valid/" },
  ],
  HEXACO: [
    { t: "The International Personality Item Pool and the future of public-domain personality measures", a: "Goldberg, L.R. et al., Journal of Research in Personality, 40, 84-96 (2006)", url: "https://ipip.ori.org/" },
    { t: "O*NET Content Model — Work Styles (référentiel utilisé par le Département du Travail américain)", a: "National Center for O*NET Development", url: "https://www.onetonline.org/find/descriptor/browse/Work_Styles/" },
  ],
};
const DISC_QUIZ = [
  { q: "Un délai serré approche et le dossier n'est pas prêt. Ta première réaction :", options: ["Je réorganise tout de suite les priorités et je tranche ce qu'on laisse tomber.", "Je rassemble l'équipe pour trouver ensemble une solution motivante.", "Je vérifie calmement avec chacun où ça bloque avant d'agir.", "Je reprends le planning en détail pour identifier précisément l'origine du retard."] },
  { q: "On te demande de déléguer une tâche importante. Tu as tendance à :", options: ["La confier et laisser la personne se débrouiller, je vérifierai le résultat final.", "L'expliquer avec enthousiasme pour donner envie à la personne de s'investir.", "Prendre le temps de m'assurer que la personne se sent à l'aise avant de la laisser faire.", "Fournir des instructions très précises et un cadre détaillé."] },
  { q: "Un collègue a commis une erreur qui coûte du temps à l'équipe. Tu :", options: ["Le dis directement, sans détour, pour que ça ne se reproduise pas.", "Dédramatise d'abord, puis on en parle ensemble sans plomber l'ambiance.", "Prends le collègue à part discrètement pour ne pas le mettre en difficulté devant le groupe.", "Analyses ce qui a précisément conduit à l'erreur avant d'en parler."] },
  { q: "En réunion, quelqu'un coupe systématiquement la parole aux autres. Tu :", options: ["Recadre directement, sur le moment.", "Détends l'atmosphère avec humour pour redonner la parole sans confrontation.", "Attends la fin pour en reparler en privé avec la personne.", "Notes le pattern et proposes une règle claire pour les prochaines réunions."] },
  { q: "Un nouveau membre rejoint l'équipe. Ta façon de l'accueillir :", options: ["Direct au but : je lui donne ses objectifs et le laisse prendre ses marques vite.", "Je le présente à tout le monde avec enthousiasme et crée du lien tout de suite.", "Je prends le temps de m'assurer qu'il se sent bien avant de le lancer dans le travail.", "Je lui prépare une documentation complète pour qu'il ait tous les repères."] },
  { q: "Tu dois négocier un délai supplémentaire avec un client mécontent. Tu :", options: ["Vas droit au but et proposes une solution ferme rapidement.", "Mises sur la relation et le dialogue pour désamorcer la tension.", "Écoutes longuement ses préoccupations avant de proposer quoi que ce soit.", "Prépares des arguments chiffrés et précis avant l'échange."] },
  { q: "Une décision doit être prise vite, sans toutes les informations. Tu :", options: ["Tranches, quitte à ajuster plus tard.", "Demandes l'avis du groupe pour décider ensemble.", "Préfères attendre un peu plus d'informations si possible.", "Es mal à l'aise de décider sans données complètes."] },
  { q: "Pendant un brainstorming, tu es plutôt du genre à :", options: ["Proposer vite une solution concrète et avancer.", "Lancer plein d'idées, même farfelues, pour stimuler le groupe.", "Écouter et faire la synthèse des idées des autres.", "Poser des questions pour vérifier la faisabilité de chaque idée."] },
  { q: "Un projet est terminé avec succès. Ta façon de célébrer :", options: ["Passer vite au projet suivant, la victoire parle d'elle-même.", "Organiser un moment convivial pour marquer le coup avec l'équipe.", "Remercier chacun individuellement pour sa contribution.", "Faire un bilan détaillé de ce qui a bien fonctionné."] },
  { q: "Le planning change au dernier moment. Ta réaction :", options: ["Je m'adapte vite, ce n'est pas un problème.", "Je vois ça comme une occasion de faire les choses différemment.", "Ça me déstabilise un peu, j'ai besoin d'un moment pour intégrer le changement.", "Je veux comprendre pourquoi le changement est nécessaire avant de l'accepter."] },
  { q: "Tu diriges une réunion qui part dans tous les sens. Tu :", options: ["Recadres fermement sur l'ordre du jour.", "Relances la dynamique en valorisant les idées qui émergent.", "Laisses la discussion suivre son cours, quitte à revenir au sujet plus tard.", "Ramènes la discussion à l'agenda écrit, point par point."] },
  { q: "Un membre de l'équipe semble démotivé depuis quelques jours. Tu :", options: ["Lui demandes directement ce qui ne va pas et ce qu'il faut pour avancer.", "Passes du temps informel avec lui pour recréer du lien.", "Observes discrètement avant d'aller lui parler, en douceur.", "Cherches à comprendre s'il y a un problème concret (charge, outil, process)."] },
  { q: "Face à un risque à prendre pour saisir une opportunité, tu :", options: ["Fonces, le risque fait partie du jeu.", "Convaincs l'équipe de tenter le coup ensemble.", "Préfères la prudence, sauf si le groupe est vraiment aligné.", "Veux d'abord évaluer précisément les conséquences possibles."] },
  { q: "Ton style pour donner un feedback difficile :", options: ["Direct et court, sans tourner autour du pot.", "Enrobé de positif pour que ça passe mieux.", "Doux et patient, en laissant de la place à la réaction de l'autre.", "Factuel, appuyé sur des exemples précis."] },
  { q: "Un collègue te contredit ouvertement en réunion. Tu :", options: ["Défends ton point de vue fermement, tout de suite.", "Cherches un terrain d'entente sur le ton de la discussion.", "Évites d'envenimer et reprends le sujet plus tard en privé.", "Demandes des faits précis pour trancher objectivement."] },
  { q: "Pour organiser ta semaine de travail, tu :", options: ["Avances au fur et à mesure des priorités, sans plan rigide.", "Restes flexible, selon les opportunités et les gens que tu croises.", "Préfères une routine stable, prévisible.", "Planifies chaque tâche à l'avance, avec de la marge."] },
  { q: "Ton équipe doit choisir entre deux options stratégiques. Tu :", options: ["Pousses pour une décision rapide, on ajustera en marche.", "Veux que tout le monde se sente entendu avant de trancher.", "Cherches le consensus, même si ça prend du temps.", "Compares les deux options avec des critères précis avant de choisir."] },
  { q: "Quand un projet stagne, ta première réaction :", options: ["Reprendre les commandes et relancer la machine.", "Remobiliser l'équipe autour de la vision du projet.", "Comprendre calmement ce qui bloque chez chacun.", "Identifier précisément où se situe le blocage dans le processus."] },
  { q: "Ta façon de gérer plusieurs tâches en même temps :", options: ["Passer vite de l'une à l'autre selon l'urgence.", "Suivre l'énergie du moment, selon ce qui motive le plus.", "Terminer une chose avant de passer à la suivante, sans se disperser.", "Suivre une liste précise et cocher au fur et à mesure."] },
  { q: "Face à un imprévu majeur dans un dossier client, tu :", options: ["Réagis vite, quitte à improviser une solution.", "Rassures le client avec de l'énergie positive pendant que tu cherches la solution.", "Restes calme et rassures tout le monde avant d'agir.", "Analyses la situation en détail avant de proposer quoi que ce soit."] },
];
const DISC_POLES = ["Rouge", "Jaune", "Vert", "Bleu"];
const MBTI_QUIZ = [
  { dich: "EI", q: "Après une longue réunion, tu te sens plutôt :", options: [["Ressourcé, prêt à enchaîner avec d'autres échanges.", "E"], ["Vidé, tu as besoin d'un moment seul pour recharger.", "I"]] },
  { dich: "EI", q: "Pour résoudre un problème complexe, tu préfères :", options: [["En discuter à voix haute avec quelqu'un.", "E"], ["Y réfléchir seul d'abord, avant d'en parler.", "I"]] },
  { dich: "EI", q: "Dans une nouvelle équipe, tu :", options: [["Vas naturellement vers les autres pour faire connaissance vite.", "E"], ["Préfères observer un peu avant de t'exprimer.", "I"]] },
  { dich: "EI", q: "Un vendredi soir après une semaine intense, tu préfères :", options: [["Sortir et voir du monde pour décompresser.", "E"], ["Rester au calme, seul ou avec très peu de monde.", "I"]] },
  { dich: "EI", q: "En réunion, tu formules tes idées plutôt :", options: [["En les développant à voix haute, au fil de la discussion.", "E"], ["Après y avoir réfléchi, une fois qu'elles sont claires dans ta tête.", "I"]] },
  { dich: "SN", q: "Pour comprendre un nouveau projet, tu commences par :", options: [["Les détails concrets : qui fait quoi, avec quel budget, pour quand.", "S"], ["La vision d'ensemble : pourquoi ce projet, où il nous mène.", "N"]] },
  { dich: "SN", q: "Tu fais plus confiance à :", options: [["Ce que l'expérience concrète t'a déjà montré.", "S"], ["Ton intuition sur où les choses vont évoluer.", "N"]] },
  { dich: "SN", q: "Face à un rapport, tu regardes en premier :", options: [["Les chiffres et les faits précis.", "S"], ["Les tendances et ce qu'ils annoncent pour la suite.", "N"]] },
  { dich: "SN", q: "On te décrit plutôt comme quelqu'un de :", options: [["Pragmatique, ancré dans le concret.", "S"], ["Plein d'idées, tourné vers les possibles.", "N"]] },
  { dich: "SN", q: "Quand tu expliques quelque chose, tu as tendance à :", options: [["Détailler étape par étape, dans l'ordre.", "S"], ["Partir du concept général, quitte à revenir sur les détails après.", "N"]] },
  { dich: "TF", q: "Pour trancher un désaccord dans l'équipe, tu t'appuies d'abord sur :", options: [["La logique : qu'est-ce qui est objectivement le plus efficace.", "T"], ["L'impact humain : comment chacun va vivre la décision.", "F"]] },
  { dich: "TF", q: "Donner un avis critique à un collègue, pour toi c'est :", options: [["Normal, si c'est justifié par les faits.", "T"], ["Délicat, tu veux d'abord penser à comment il va le recevoir.", "F"]] },
  { dich: "TF", q: "Une bonne décision, pour toi, c'est avant tout une décision :", options: [["Cohérente et justifiable.", "T"], ["Qui respecte les gens concernés.", "F"]] },
  { dich: "TF", q: "Face à un conflit d'équipe, ta priorité :", options: [["Trouver qui a raison sur le fond.", "T"], ["Préserver la relation entre les personnes.", "F"]] },
  { dich: "TF", q: "On te dit parfois que tu es :", options: [["Un peu trop direct ou froid.", "T"], ["Un peu trop sensible aux réactions des autres.", "F"]] },
  { dich: "JP", q: "Ton rapport au planning :", options: [["Tu aimes avoir un plan clair et t'y tenir.", "J"], ["Tu préfères garder les options ouvertes le plus longtemps possible.", "P"]] },
  { dich: "JP", q: "Une tâche non terminée en fin de journée, ça te :", options: [["Dérange, tu préfères clore les choses.", "J"], ["Ne dérange pas forcément, tu peux la reprendre plus tard sereinement.", "P"]] },
  { dich: "JP", q: "Face à un changement de dernière minute, tu :", options: [["Le vis comme une perturbation à gérer.", "J"], ["T'adaptes assez naturellement, ça fait partie du jeu.", "P"]] },
  { dich: "JP", q: "Ton bureau ou ton espace de travail est plutôt :", options: [["Organisé, avec un système clair.", "J"], ["Vivant, avec plusieurs choses en cours en même temps.", "P"]] },
  { dich: "JP", q: "Tu préfères un travail où :", options: [["Les objectifs et les délais sont clairs dès le départ.", "J"], ["Il y a de la place pour ajuster en cours de route.", "P"]] },
];
const HEXACO_DOMAINS = [
  { code: "H", label: "Honnêteté-Humilité", short: "Sincère, ne cherche pas à impressionner ou à profiter des autres." },
  { code: "E", label: "Émotivité", short: "Sensibilité au stress, besoin de soutien, empathie." },
  { code: "X", label: "Extraversion", short: "Aisance sociale, énergie, goût du contact." },
  { code: "A", label: "Agréabilité", short: "Indulgence, patience, souplesse relationnelle." },
  { code: "C", label: "Conscienciosité", short: "Organisation, rigueur, discipline dans le travail." },
  { code: "O", label: "Ouverture", short: "Curiosité intellectuelle, goût pour la nouveauté et les idées." },
];
const HEXACO_ITEMS = [
  { id: "H1", domain: "H", facet: "Sincérité", text: "Je ne prétends pas être plus que ce que je suis.", reverse: false },
  { id: "H2", domain: "H", facet: "Sincérité", text: "J'utilise la flatterie pour arriver à mes fins.", reverse: true },
  { id: "H3", domain: "H", facet: "Sincérité", text: "Je fais semblant de me soucier des autres.", reverse: true },
  { id: "H4", domain: "H", facet: "Équité", text: "Je ne prendrais jamais quelque chose qui ne m'appartient pas.", reverse: false },
  { id: "H5", domain: "H", facet: "Équité", text: "Je triche pour progresser.", reverse: true },
  { id: "H6", domain: "H", facet: "Équité", text: "Je ne regretterais pas mon comportement si je profitais impulsivement de quelqu'un.", reverse: true },
  { id: "H7", domain: "H", facet: "Non-avidité", text: "Je m'intéresse surtout à l'argent.", reverse: true },
  { id: "H8", domain: "H", facet: "Non-avidité", text: "J'aime le luxe.", reverse: true },
  { id: "H9", domain: "H", facet: "Modestie", text: "Je crois que je suis meilleur(e) que les autres.", reverse: true },
  { id: "H10", domain: "H", facet: "Modestie", text: "Je me considère comme une personne ordinaire.", reverse: false },
  { id: "E1", domain: "E", facet: "Peur", text: "J'aurais peur de marcher dans un quartier à forte criminalité.", reverse: false },
  { id: "E2", domain: "E", facet: "Peur", text: "Je suis prêt(e) à prendre des risques.", reverse: true },
  { id: "E3", domain: "E", facet: "Peur", text: "Je fais face au danger avec assurance.", reverse: true },
  { id: "E4", domain: "E", facet: "Anxiété", text: "Je m'inquiète facilement.", reverse: false },
  { id: "E5", domain: "E", facet: "Anxiété", text: "Je me sens vite stressé(e).", reverse: false },
  { id: "E6", domain: "E", facet: "Anxiété", text: "Je reste calme sous pression.", reverse: true },
  { id: "E7", domain: "E", facet: "Dépendance", text: "J'ai besoin de l'approbation des autres.", reverse: false },
  { id: "E8", domain: "E", facet: "Dépendance", text: "J'ai souvent besoin d'aide.", reverse: false },
  { id: "E9", domain: "E", facet: "Sentimentalité", text: "Je ressens les émotions des autres.", reverse: false },
  { id: "E10", domain: "E", facet: "Sentimentalité", text: "Je suis profondément touché(e) par le malheur des autres.", reverse: false },
  { id: "X1", domain: "X", facet: "Expressivité sociale", text: "Je parle beaucoup.", reverse: false },
  { id: "X2", domain: "X", facet: "Expressivité sociale", text: "Je n'aime pas attirer l'attention sur moi.", reverse: true },
  { id: "X3", domain: "X", facet: "Expressivité sociale", text: "Je garde mes émotions pour moi.", reverse: true },
  { id: "X4", domain: "X", facet: "Assurance sociale", text: "Je me sens à l'aise avec les gens.", reverse: false },
  { id: "X5", domain: "X", facet: "Assurance sociale", text: "J'ai des aptitudes de leader.", reverse: false },
  { id: "X6", domain: "X", facet: "Assurance sociale", text: "J'aurais peur de faire un discours en public.", reverse: true },
  { id: "X7", domain: "X", facet: "Sociabilité", text: "Je me fais des amis facilement.", reverse: false },
  { id: "X8", domain: "X", facet: "Sociabilité", text: "J'apprécie rarement d'être avec des gens.", reverse: true },
  { id: "X9", domain: "X", facet: "Vivacité", text: "Je suis généralement actif/active et plein(e) d'énergie.", reverse: false },
  { id: "X10", domain: "X", facet: "Vivacité", text: "Je me sens souvent triste ou déprimé(e).", reverse: true },
  { id: "A1", domain: "A", facet: "Indulgence", text: "J'essaie de pardonner et d'oublier.", reverse: false },
  { id: "A2", domain: "A", facet: "Indulgence", text: "Je garde rancune.", reverse: true },
  { id: "A3", domain: "A", facet: "Indulgence", text: "Je me méfie des gens.", reverse: true },
  { id: "A4", domain: "A", facet: "Douceur", text: "Je me plains rarement.", reverse: false },
  { id: "A5", domain: "A", facet: "Douceur", text: "Je juge rapidement les autres.", reverse: true },
  { id: "A6", domain: "A", facet: "Douceur", text: "J'ai la langue acérée.", reverse: true },
  { id: "A7", domain: "A", facet: "Flexibilité", text: "Je m'adapte facilement.", reverse: false },
  { id: "A8", domain: "A", facet: "Flexibilité", text: "Je ne supporte pas d'être contredit(e).", reverse: true },
  { id: "A9", domain: "A", facet: "Patience", text: "Je suis généralement une personne patiente.", reverse: false },
  { id: "A10", domain: "A", facet: "Patience", text: "Je me mets facilement en colère.", reverse: true },
  { id: "C1", domain: "C", facet: "Organisation", text: "Je garde les choses en ordre.", reverse: false },
  { id: "C2", domain: "C", facet: "Organisation", text: "J'aime l'ordre.", reverse: false },
  { id: "C3", domain: "C", facet: "Organisation", text: "Je laisse traîner mes affaires.", reverse: true },
  { id: "C4", domain: "C", facet: "Diligence", text: "Je travaille dur.", reverse: false },
  { id: "C5", domain: "C", facet: "Diligence", text: "Je me pousse très fort pour réussir.", reverse: false },
  { id: "C6", domain: "C", facet: "Diligence", text: "J'en fais juste assez pour m'en sortir.", reverse: true },
  { id: "C7", domain: "C", facet: "Perfectionnisme", text: "Je prête attention aux détails.", reverse: false },
  { id: "C8", domain: "C", facet: "Perfectionnisme", text: "Je ne prête pas assez attention aux détails.", reverse: true },
  { id: "C9", domain: "C", facet: "Prudence", text: "Je fais des plans et je m'y tiens.", reverse: false },
  { id: "C10", domain: "C", facet: "Prudence", text: "Je prends des décisions irréfléchies.", reverse: true },
  { id: "O1", domain: "O", facet: "Appréciation esthétique", text: "Je crois en l'importance de l'art.", reverse: false },
  { id: "O2", domain: "O", facet: "Appréciation esthétique", text: "Je vois de la beauté dans des choses que d'autres ne remarquent pas.", reverse: false },
  { id: "O3", domain: "O", facet: "Appréciation esthétique", text: "Je n'aime pas l'art.", reverse: true },
  { id: "O4", domain: "O", facet: "Curiosité intellectuelle", text: "Je m'intéresse aux sciences.", reverse: false },
  { id: "O5", domain: "O", facet: "Curiosité intellectuelle", text: "J'aime lire des contenus exigeants.", reverse: false },
  { id: "O6", domain: "O", facet: "Curiosité intellectuelle", text: "J'évite les lectures difficiles.", reverse: true },
  { id: "O7", domain: "O", facet: "Créativité", text: "J'ai une imagination fertile.", reverse: false },
  { id: "O8", domain: "O", facet: "Créativité", text: "Je déborde d'idées.", reverse: false },
  { id: "O9", domain: "O", facet: "Non-conventionnalité", text: "Je sais que mes idées surprennent parfois les gens.", reverse: false },
  { id: "O10", domain: "O", facet: "Non-conventionnalité", text: "J'aime être perçu(e) comme conventionnel(le).", reverse: true },
];
const HEXACO_LIKERT = [
  { v: 1, label: "Fortement en désaccord" },
  { v: 2, label: "Plutôt en désaccord" },
  { v: 3, label: "Neutre" },
  { v: 4, label: "Plutôt d'accord" },
  { v: 5, label: "Fortement d'accord" },
];
function scoreHexaco(answers) {
  const sums = { H: 0, E: 0, X: 0, A: 0, C: 0, O: 0 };
  const counts = { H: 0, E: 0, X: 0, A: 0, C: 0, O: 0 };
  HEXACO_ITEMS.forEach((item) => {
    const raw = answers[item.id];
    if (!raw) return;
    const val = item.reverse ? 6 - raw : raw;
    sums[item.domain] += val;
    counts[item.domain] += 1;
  });
  const scores = {};
  Object.keys(sums).forEach((d) => {
    scores[d] = counts[d] ? +(sums[d] / counts[d]).toFixed(2) : null;
  });
  return scores;
}
// Formate les scores IPIP-HEXACO d'une personne pour les inclure dans un
// prompt — réutilisé par toutes les fonctions de génération IA (synthèses,
// étude de cas, entraînement) pour que les scores, quand ils existent,
// nourrissent systématiquement l'analyse plutôt que seulement certaines.
function hexacoPromptLines(scores) {
  if (!scores) return "";
  return HEXACO_DOMAINS.map((d) => `- ${d.label} : ${scores[d.code] != null ? scores[d.code].toFixed(1) : "-"}/5`).join("\n");
}
const VISION_QUESTIONS = [
  "Comment décrirais-tu, en une phrase, la mission de Nova Heritage ?",
  "Quel rôle penses-tu jouer dans cette mission, au-delà de ta fiche de poste ?",
  "Qu'est-ce que ce travail t'apporte à toi, en tant que personne, au-delà du salaire ?",
  "Quelle serait, pour toi, une preuve concrète que tu as trouvé ta place dans l'équipe ?",
  "Si tu devais changer une seule chose dans la façon dont l'équipe fonctionne aujourd'hui, ce serait quoi ?",
];
const PRESENTATIONS = [];
const SESSION1_SLIDES = [
  { type: "title", title: "Mieux se connaître pour mieux performer dans un cadre professionnel", subtitle: "Session de lancement — 30 minutes" },
  { type: "bullets", title: "Ce qu'on va faire ensemble", items: [
    "Une mission en deux volets : structurer l'organisation, et former l'équipe aux bons réflexes.",
    "L'objectif n'est pas d'ajouter des outils pour le principe, mais de résoudre des frictions qu'on vit déjà.",
    "Ça se construit progressivement, module par module, pas d'un coup.",
  ]},
  { type: "situation", title: "Situation 1", text: TRAINING_SITUATIONS[0] },
  { type: "situation", title: "Situation 2", text: TRAINING_SITUATIONS[1] },
  { type: "situation", title: "Situation 3", text: TRAINING_SITUATIONS[2] },
  ...PROFILE_DETAILS.map((pr) => ({ type: "profile", code: pr.code, forces: pr.forces, faiblesses: pr.faiblesses })),
  { type: "bullets", title: "À vous de jouer", items: [
    "On tire une situation réelle à jouer à deux, chacun dans son profil couleur.",
    "Objectif : repérer, pendant l'échange, une force et une faiblesse de son profil qui s'exprime.",
    "Chacun réagit naturellement, sans préparer de réponse « correcte ».",
    "La scène est enregistrée pour qu'on puisse la revoir ensemble.",
  ]},
  { type: "bullets", title: "Devoir avant mercredi", items: [
    "Passer un test de personnalité type MBTI (16personalities.com, environ 15 minutes).",
    "Noter son type, identifier 2-3 points de vigilance liés à ce profil.",
    "Mercredi : une bibliographie personnalisée sera partagée à chacun selon son résultat.",
  ]},
  { type: "bullets", title: "La suite", items: [
    "Mercredi : correction du quiz couleurs + résultats MBTI + bibliographie",
    "Jeudi : mise en situation avec les profils identifiés",
    "Semaine prochaine : Module B — le reporting par les situations réelles",
  ]},
];
function discFriction(a, b) {
  if (a === b) return "Même profil dominant : bonne compréhension mutuelle, mais risque d'angle mort partagé.";
  const key = [a, b].sort().join("+");
  const table = {
    "Jaune+Rouge": "Tous deux orientés action, mais l'un veut trancher vite, l'autre veut d'abord embarquer tout le monde.",
    "Rouge+Vert": "Rythme opposé : décision rapide contre besoin de stabilité.",
    "Bleu+Rouge": "Vitesse contre rigueur : l'un veut avancer, l'autre veut d'abord vérifier.",
    "Jaune+Vert": "L'un est dans le mouvement, l'autre dans la régularité — bonne complémentarité si le rythme est respecté.",
    "Bleu+Jaune": "L'un communique par l'enthousiasme, l'autre par la précision — risque de malentendu.",
    "Bleu+Vert": "Profils proches, tous deux prudents — peu de friction, bonne base de collaboration.",
  };
  return table[key] || "Combinaison à observer en situation réelle.";
}
function frictionScore(a, b) {
  if (a === b) return 1;
  const key = [a, b].sort().join("+");
  const high = ["Rouge+Vert", "Bleu+Rouge"];
  const low = ["Bleu+Vert"];
  if (high.includes(key)) return 3;
  if (low.includes(key)) return 0.5;
  return 1.7;
}
// Chapitre 2 du Module A — "Mieux se connaître pour mieux travailler ensemble".
// Reprend les 3 mêmes situations que le chapitre 1, mais chaque situation est
// relue à travers un mécanisme identifié par la recherche sur la diversité de
// personnalités en équipe (sources listées dans MODULE_A_CH2_SOURCES / onglet
// Ressources), plutôt que comme une faute individuelle isolée.
const CH2_CORRECTIONS = [
  "Un profil prudent, intégré au bon moment dans la boucle, repère des risques qu'un profil plus rapide ne voit pas — c'est un mécanisme documenté par la recherche, pas une lourdeur administrative.",
  "Le format uniforme est souvent la vraie cause de la non-circulation de l'information, pas la paresse : une personne au profil Bleu veut un tableau et des chiffres clairs, une personne au profil Jaune retient mieux un résumé oral, en direct.",
  "Les équipes les plus performantes ont presque toujours deux profils clés qui font le lien entre les pôles : quelqu'un de bon communicant, et quelqu'un d'empathique qui désamorce les tensions sans qu'on le lui demande.",
];
const MODULE_A_CH2_SOURCES = [
  { t: "Team Personality Diversity, Group Creativity, and Innovativeness in Organizational Teams", a: "Bechtoldt & Nijstad, Semantic Scholar", url: "https://www.semanticscholar.org/paper/Team-Personality-Diversity,-Group-Creativity,-and-Bechtoldt-Nijstad/176aca55436cd9b3b7325c8ea2266febf87fc573" },
  { t: "Exploring the link between students' MBTI personality types and design team performance", a: "Cambridge Core, Proceedings of the Design Society, 2025", url: "https://www.cambridge.org/core/journals/proceedings-of-the-design-society/article/exploring-the-link-between-students-mbti-personality-types-and-design-team-performance/E1FD7E1E5A8320657271FDF1FD201A81" },
  { t: "Do Teams Work Best with Different Personality Types—or the Same?", a: "DiSC Profile (cite une étude Wiley sur le coût de la mauvaise cohésion d'équipe)", url: "https://www.discprofile.com/blog/team-building-performance/teams-similar-or-different-styles" },
];
const CH2_FORMAT_OPTIONS = [
  "Un tableau ou des chiffres clairs",
  "Un résumé oral, en direct",
  "Une liste à puces, condensée",
  "Un mail détaillé, que je peux relire",
];
const CH2_ROLE_OPTIONS = ["C'est plutôt moi le garde-fou", "C'est plutôt moi le moteur", "Aucun des deux ne se dégage"];
SCIENTIFIC_SOURCES["ÉQUIPE"] = MODULE_A_CH2_SOURCES;
// Support pour les présentations des chapitres 2 et 3, même si les sessions
// correspondantes n'ont pas encore été données en présentiel — ce sont des
// decks prévisionnels, construits sur le même contenu que les devoirs.
const CH2_GUIDE_QUESTIONS = [
  "Qui, dans l'équipe, aurait dû être consulté avant que ça avance ? Qu'est-ce qui a empêché cette consultation ?",
  "Quel format chacun de vous préfère-t-il vraiment recevoir ? Est-ce qu'on impose aujourd'hui un format unique à tout le monde ?",
  "Qui, dans l'équipe, fait déjà spontanément le lien entre les pôles ? Pourquoi ce lien ne se fait-il pas plus souvent ?",
];
const SESSION2_SLIDES = [
  { type: "title", title: "Mieux se connaître pour mieux travailler ensemble", subtitle: "Chapitre 2 — Module A" },
  { type: "bullets", title: "Ce qu'on va faire ensemble", items: [
    "Sur base des 3 situations du chapitre 1, on va identifier ensemble comment la personnalité de chacun impacte la dynamique de travail.",
    "L'objectif est de vous amener à auto-manager les points de friction pour faciliter le workflow.",
  ]},
  { type: "situation2", title: "Situation 1", text: TRAINING_SITUATIONS[0] },
  { type: "question", title: "À vous", text: CH2_GUIDE_QUESTIONS[0] },
  { type: "correction", title: "Ce que dit la recherche", text: CH2_CORRECTIONS[0] },
  { type: "situation2", title: "Situation 2", text: TRAINING_SITUATIONS[1] },
  { type: "question", title: "À vous", text: CH2_GUIDE_QUESTIONS[1] },
  { type: "correction", title: "Ce que dit la recherche", text: CH2_CORRECTIONS[1] },
  { type: "situation2", title: "Situation 3", text: TRAINING_SITUATIONS[2] },
  { type: "question", title: "À vous", text: CH2_GUIDE_QUESTIONS[2] },
  { type: "correction", title: "Ce que dit la recherche", text: CH2_CORRECTIONS[2] },
  { type: "bullets", title: "Testons la dynamique, en direct", items: [
    "On forme des duos de profils différents (ex. un Rouge avec un Vert, un Bleu avec un Jaune).",
    "Chaque duo a 3 minutes pour se répartir un mini-scénario fictif : qui décide, qui valide, qui informe qui.",
    "On observe, sans intervenir, où ça frotte naturellement entre les deux profils.",
    "Debrief collectif : qu'est-ce qui a été facile, qu'est-ce qui a coincé, et pourquoi.",
  ]},
  { type: "bullets", title: "Le devoir, en 4 temps", items: [
    "Sur base des 3 situations, rédiger le reporting de la réunion dans le style que le coéquipier choisi comprendra le mieux.",
    "Choisir le format de reporting qui le fait vraiment lire, lui (tableau, oral, liste, mail).",
    "Pour chaque coéquipier, dire qui est plutôt le garde-fou et qui est plutôt le moteur.",
    "Identifier qui, dans l'équipe, fait déjà le lien entre les pôles.",
  ]},
  { type: "bullets", title: "Sources", items: MODULE_A_CH2_SOURCES.map((s) => `${s.t} — ${s.a}`) },
];
const SESSION3_SLIDES = [
  { type: "title", title: "Étude de cas — l'équipe au miroir", subtitle: "Chapitre 3 — Module A" },
  { type: "bullets", title: "Le principe", items: [
    "Ce chapitre n'a pas de contenu figé à l'avance : l'étude de cas est générée à partir des réponses réelles des chapitres 1 et 2.",
    "Elle met en scène plusieurs membres de l'équipe dans un scénario plausible, construit pour faire ressortir les dynamiques déjà repérées.",
    "Elle se termine par 3 questions de discussion, pensées pour un débriefing en groupe.",
  ]},
  { type: "bullets", title: "Ce qu'elle utilise", items: [
    "Les profils DISC et MBTI de chacun.",
    "Les forces et zones de vigilance identifiées au chapitre 1.",
    "Les formats de reporting, les rôles de garde-fou / moteur et de lien entre pôles identifiés au chapitre 2.",
  ]},
  { type: "bullets", title: "Avant cette session", items: [
    "Les chapitres 1 et 2 doivent être complétés par un maximum de personnes.",
    "Plus il y a de devoirs remplis, plus l'étude de cas générée est fine et personnalisée.",
  ]},
];
PRESENTATIONS.push({
  id: "module-a",
  title: "Module A",
  subtitle: "Se connaître pour mieux se comprendre",
  chapters: [
    { id: "ch1", title: "Chapitre 1", subtitle: "Mieux se connaître pour mieux performer dans un cadre professionnel", slides: SESSION1_SLIDES },
    { id: "ch2", title: "Chapitre 2", subtitle: "Mieux se connaître pour mieux travailler ensemble", slides: SESSION2_SLIDES },
    { id: "ch3", title: "Chapitre 3", subtitle: "Étude de cas — l'équipe au miroir", slides: SESSION3_SLIDES },
  ],
});
async function storageSetWithRetry(key, value, attempts = 5) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try {
      await window.storage.set(key, value, true);
      return;
    } catch (e) {
      lastErr = e;
      if (i < attempts - 1) await new Promise((r) => setTimeout(r, 600 * (i + 1)));
    }
  }
  throw lastErr;
}
async function exportAllData() {
  const prefixes = ["nh_profiles:", "nh_devoir1:", "nh_devoir2:"];
  const entries = [];
  for (const p of prefixes) {
    try {
      const listRes = await window.storage.list(p, true);
      const keys = (listRes && listRes.keys) || [];
      for (const k of keys) {
        try {
          const r = await window.storage.get(k, true);
          if (r && r.value != null) entries.push({ key: k, value: r.value });
        } catch (e) {}
      }
    } catch (e) {}
  }
  const blob = new Blob([JSON.stringify({ entries }, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "nova-heritage-donnees.json";
  a.click();
  URL.revokeObjectURL(url);
}
const Logo = () => (
  <>
    <div style={{ display: "flex", alignItems: "center", gap: 8, position: "fixed", top: 20, left: 24, zIndex: 50 }}>
      <img src={LOGO_SRC} alt="Athenable" style={{ width: 34, height: 34, objectFit: "contain" }} />
      <span style={{ fontWeight: 600, color: NAVY, fontSize: 15, fontFamily: "Georgia, serif" }}>Athenable</span>
    </div>
    <button
      onClick={exportAllData}
      title="Télécharger toutes les données (profils, devoirs) en fichier"
      style={{ position: "fixed", bottom: 20, right: 20, zIndex: 50, background: "#fff", border: "1.5px solid " + NAVY, color: NAVY, borderRadius: 999, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer", boxShadow: "0 1px 4px rgba(0,0,0,0.12)" }}
    >
      ⬇ Exporter mes données
    </button>
  </>
);
export default function App() {
  const [stage, setStage] = useState("name");
  const [name, setName] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [disc, setDisc] = useState(null);
  const [mbti, setMbti] = useState(null);
  const [role, setRole] = useState(null);
  const [equipe, setEquipe] = useState("");
  const [activeTab, setActiveTab] = useState("presentations");
  const [presentationView, setPresentationView] = useState("list");
  const [activePresModule, setActivePresModule] = useState(null);
  const [activeSlides, setActiveSlides] = useState(SESSION1_SLIDES);
  const [slideIndex, setSlideIndex] = useState(0);
  const [profiles, setProfiles] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formationView, setFormationView] = useState("path");
  const ALL_QUIZ = [...DISC_QUIZ.map((q) => ({ ...q, kind: "disc" })), ...MBTI_QUIZ.map((q) => ({ ...q, kind: "mbti" }))];
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [visionAnswers, setVisionAnswers] = useState(Array(VISION_QUESTIONS.length).fill(""));
  const [devoirSaving, setDevoirSaving] = useState(false);
  const [pastedDisc, setPastedDisc] = useState("");
  const [pastedMbti, setPastedMbti] = useState("");
  const [synthesis, setSynthesis] = useState(null);
  const [synthesizing, setSynthesizing] = useState(false);
  const [synthesisError, setSynthesisError] = useState("");
  const [showReconnect, setShowReconnect] = useState(false);
  const [reconnectInput, setReconnectInput] = useState("");
  const [reconnectError, setReconnectError] = useState("");
  const [reconnecting, setReconnecting] = useState(false);
  const [pendingCeoReconnect, setPendingCeoReconnect] = useState(null);
  const [ceoPasswordInput, setCeoPasswordInput] = useState("");
  const [ceoPasswordError, setCeoPasswordError] = useState("");
  const [hexacoAnswers, setHexacoAnswers] = useState({});
  const [hexacoPage, setHexacoPage] = useState(0);
  const [hexacoResults, setHexacoResults] = useState(null);
  const [hexacoSaving, setHexacoSaving] = useState(false);
  const [hexacoError, setHexacoError] = useState("");
  const [memberSynthesizing, setMemberSynthesizing] = useState(false);
  const [memberSynthesisError, setMemberSynthesisError] = useState("");
  const [goalInput, setGoalInput] = useState("");
  const [goalDeadlineInput, setGoalDeadlineInput] = useState("");
  const [savingGoal, setSavingGoal] = useState(false);
  const [goalError, setGoalError] = useState("");
  const [evalDrafts, setEvalDrafts] = useState({});
  const [quarterlyDraft, setQuarterlyDraft] = useState("");
  const [onboardingError, setOnboardingError] = useState("");
  const [ch2ReportTarget, setCh2ReportTarget] = useState(null);
  const [ch2ReportText, setCh2ReportText] = useState("");
  const [ch2Format, setCh2Format] = useState(null);
  const [ch2TeammateAnswers, setCh2TeammateAnswers] = useState({});
  const [ch2Connector, setCh2Connector] = useState("");
  const [ch2Synthesis, setCh2Synthesis] = useState(null);
  const [ch2Synthesizing, setCh2Synthesizing] = useState(false);
  const [ch2Error, setCh2Error] = useState("");
  const [ch2Saving, setCh2Saving] = useState(false);
  const [ch3CaseStudy, setCh3CaseStudy] = useState(null);
  const [ch3Generating, setCh3Generating] = useState(false);
  const [ch3Error, setCh3Error] = useState("");
  const [ch3Answers, setCh3Answers] = useState({});
  const [ch3PasteFlags, setCh3PasteFlags] = useState({});
  const [ch3Correction, setCh3Correction] = useState(null);
  const [ch3Correcting, setCh3Correcting] = useState(false);
  const [ch3CorrectionError, setCh3CorrectionError] = useState("");
  const [trainingScenario, setTrainingScenario] = useState(null);
  const [trainingGenerating, setTrainingGenerating] = useState(false);
  const [trainingAnswer, setTrainingAnswer] = useState("");
  const [trainingCorrection, setTrainingCorrection] = useState(null);
  const [trainingCorrecting, setTrainingCorrecting] = useState(false);
  const [trainingError, setTrainingError] = useState("");
  const [ch2Correction, setCh2Correction] = useState(null);
  const [ch2Correcting, setCh2Correcting] = useState(false);
  const [ch2CorrectionError, setCh2CorrectionError] = useState("");
  const [goalDraftText, setGoalDraftText] = useState({});
  const [goalDraftDeadline, setGoalDraftDeadline] = useState({});
  const [goalDraftSaving, setGoalDraftSaving] = useState({});
  const [goalDraftError, setGoalDraftError] = useState({});
  const [quarterlyDrafts, setQuarterlyDrafts] = useState({});
  const [managerAssessmentDrafts, setManagerAssessmentDrafts] = useState({});
  const [managerAssessmentSaving, setManagerAssessmentSaving] = useState({});
  const [showSelfAssessmentForm, setShowSelfAssessmentForm] = useState(false);
  const [selfAssessmentDraft, setSelfAssessmentDraft] = useState("");
  const [savingSelfAssessment, setSavingSelfAssessment] = useState(false);
  const [teamSynthesis, setTeamSynthesis] = useState(null);
  const [teamSynthesizing, setTeamSynthesizing] = useState(false);
  const [teamSynthesisError, setTeamSynthesisError] = useState("");
  const [selectedMgmtMember, setSelectedMgmtMember] = useState(null);
  const [mgmtSubTab, setMgmtSubTab] = useState("distribute");
  async function loadProfiles() {
    try {
      const listRes = await window.storage.list("nh_profiles:", true);
      const keys = listRes && listRes.keys ? listRes.keys : [];
      const loaded = [];
      for (const k of keys) {
        try {
          const r = await window.storage.get(k, true);
          if (r && r.value) loaded.push({ ...JSON.parse(r.value), _key: k });
        } catch (e) {}
      }
      setProfiles(loaded);
    } catch (e) {
      setProfiles([]);
    }
  }
  async function deleteProfile(key) {
    try {
      await window.storage.delete(key, true);
      setSelectedMember(null);
      await loadProfiles();
    } catch (e) {}
  }
  async function resetTeam() {
    setResetting(true);
    try {
      for (const p of visibleProfiles) {
        if (p._key) { try { await window.storage.delete(p._key, true); } catch (e) {} }
        try { await window.storage.delete("nh_devoir1:" + p.name.toLowerCase().trim().replace(/\s+/g, "_"), true); } catch (e) {}
      }
      await loadProfiles();
    } catch (e) {}
    setResetting(false);
    setResetConfirm(false);
  }
  useEffect(() => {
    if (stage === "app") loadProfiles();
  }, [stage]);
  async function handleReconnect() {
    if (!reconnectInput.trim()) return;
    setReconnecting(true);
    setReconnectError("");
    try {
      const listRes = await window.storage.list("nh_profiles:", true);
      const keys = listRes && listRes.keys ? listRes.keys : [];
      let best = null;
      for (const k of keys) {
        try {
          const r = await window.storage.get(k, true);
          if (r && r.value) {
            const p = JSON.parse(r.value);
            if (p.name && p.name.toLowerCase().trim() === reconnectInput.toLowerCase().trim()) {
              if (!best || (p.addedAt || 0) > (best.addedAt || 0)) best = p;
            }
          }
        } catch (e) {}
      }
      if (best) {
        if (best.role === "CEO") {
          setPendingCeoReconnect(best);
          setCeoPasswordInput("");
          setCeoPasswordError("");
        } else {
          setName(best.name);
          setDisc(best.disc);
          setMbti(best.mbti);
          setRole(best.role || "Employé");
          setEquipe(best.equipe || "");
          setStage("app");
        }
      } else {
        setReconnectError("Aucun profil trouvé avec ce nom. Tu peux commencer une nouvelle session ci-dessus.");
      }
    } catch (e) {
      setReconnectError("Impossible de vérifier pour le moment. Réessaie.");
    }
    setReconnecting(false);
  }
  function confirmCeoReconnect() {
    if (!pendingCeoReconnect) return;
    if (ceoPasswordInput !== CEO_PASSWORD) {
      setCeoPasswordError("Mot de passe incorrect.");
      return;
    }
    const best = pendingCeoReconnect;
    setName(best.name);
    setDisc(best.disc);
    setMbti(best.mbti);
    setRole("CEO");
    setEquipe(best.equipe || "");
    setPendingCeoReconnect(null);
    setCeoPasswordInput("");
    setCeoPasswordError("");
    setStage("app");
  }
  async function finishOnboarding(finalMbti) {
    setLoading(true);
    setOnboardingError("");
    try {
      if (!window.storage || typeof window.storage.set !== "function") {
        throw new Error("le stockage n'est pas disponible dans cet environnement");
      }
      const entry = { name, disc, mbti: finalMbti, role, equipe: equipe.trim(), addedAt: Date.now() };
      const key = "nh_profiles:" + name.toLowerCase().trim().replace(/\s+/g, "_") + "_" + Date.now();
      await storageSetWithRetry(key, JSON.stringify(entry));
      const check = await window.storage.get(key, true);
      if (!check || !check.value) {
        throw new Error("l'enregistrement n'a pas été confirmé par le stockage");
      }
      setStage("app");
    } catch (e) {
      setOnboardingError("Le profil n'a pas pu être enregistré (" + (e && e.message ? e.message : "erreur inconnue") + "). Réessaie.");
    }
    setLoading(false);
  }
  function tallyResults() {
    const discTally = { Rouge: 0, Jaune: 0, Vert: 0, Bleu: 0 };
    const mbtiTally = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
    quizAnswers.forEach((ans, i) => {
      const item = ALL_QUIZ[i];
      if (!item || ans === undefined) return;
      if (item.kind === "disc") {
        const color = DISC_POLES[ans];
        if (color) discTally[color] += 1;
      } else {
        const pole = item.options[ans] && item.options[ans][1];
        if (pole) mbtiTally[pole] += 1;
      }
    });
    return { discTally, mbtiTally };
  }
  async function runSynthesis(overrideHexacoScores) {
    setSynthesizing(true);
    setSynthesisError("");
    try {
      const { discTally, mbtiTally } = tallyResults();
      const discStr = Object.entries(discTally).map(([k, v]) => `${k}: ${v}/20`).join(", ");
      const mbtiStr = `E${mbtiTally.E}/I${mbtiTally.I}  S${mbtiTally.S}/N${mbtiTally.N}  T${mbtiTally.T}/F${mbtiTally.F}  J${mbtiTally.J}/P${mbtiTally.P}`;
      const hexacoScores = overrideHexacoScores || (myProfileRecord && myProfileRecord.hexaco && myProfileRecord.hexaco.scores) || hexacoResults || null;
      const hexacoBlock = hexacoScores
        ? `\nScores IPIP-HEXACO déclarés par la personne (échelle 1 à 5, complémentaire au DISC/MBTI, couvre notamment l'honnêteté-humilité) :\n${hexacoPromptLines(hexacoScores)}\nIntègre ces scores dans l'analyse UNIQUEMENT s'ils apportent une nuance concrète et utile (par exemple un score d'Honnêteté-Humilité qui éclaire le rapport à la mise en avant de soi ou à la délégation) ; ignore-les s'ils n'ajoutent rien de plus que le DISC/MBTI.\n`
        : "";
      const prompt = `Tu es un coach en gestion d'équipe qui s'adresse directement à un employé de Nova Heritage, en français, en le tutoyant.
Profil DISC déclaré par la personne : ${disc}
Type MBTI déclaré par la personne : ${mbti}
Tendances observées dans un quiz de 40 mises en situation professionnelles (gestion d'équipe) :
- Répartition DISC des réponses : ${discStr}
- Répartition MBTI des réponses : ${mbtiStr}
Résultat du test DISC collé par la personne (peut être vide) :
"""
${pastedDisc || "(rien de collé)"}
"""
Résultat du test MBTI collé par la personne (peut être vide) :
"""
${pastedMbti || "(rien de collé)"}
"""
${hexacoBlock}Réponds UNIQUEMENT avec un objet JSON valide, sans markdown, sans backticks, sans texte autour, au format exact suivant :
{"forces": ["...", "...", "..."], "vigilance": ["...", "...", "..."], "conseil": "..."}
- "forces" : 3 forces concrètes pour le travail en équipe, une phrase courte chacune, sans tiret ni numéro au début.
- "vigilance" : 3 zones de vigilance concrètes, une phrase courte chacune, sans tiret ni numéro au début.
- "conseil" : un conseil pratique de 2-3 phrases pour mieux travailler avec le reste de l'équipe de Nova Heritage.
Appuie-toi sur les éléments fournis plutôt que sur des généralités. Ton chaleureux mais honnête, pas complaisant. Tutoie la personne.`;
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await response.json();
      const text = (data.content || []).map((c) => c.text || "").join("\n").trim();
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setSynthesis(parsed);
      // Sauvegarde immédiate : l'analyse forces/vigilance/conseil est le
      // seul contenu conservé du chapitre 1, donc on la persiste dès qu'elle
      // est générée plutôt que d'attendre une étape supplémentaire.
      try {
        await mergeIntoProfile(name, disc, mbti, { synthesis: parsed, synthesisAt: Date.now() });
        await loadProfiles();
      } catch (e) {}
    } catch (e) {
      setSynthesisError("La synthèse n'a pas pu être générée. Réessaie dans un instant.");
    }
    setSynthesizing(false);
    setFormationView("synthesis");
  }
  async function mergeIntoProfile(targetName, fallbackDisc, fallbackMbti, extra) {
    const listRes = await window.storage.list("nh_profiles:", true);
    const keys = (listRes && listRes.keys) || [];
    let mine = null;
    for (const k of keys) {
      try {
        const r = await window.storage.get(k, true);
        if (r && r.value) {
          const p = JSON.parse(r.value);
          if (p.name && p.name === targetName) {
            if (!mine || (p.addedAt || 0) > (mine.addedAt || 0)) mine = { ...p, _key: k };
          }
        }
      } catch (e) {}
    }
    if (mine && mine._key) {
      const { _key, ...rest } = mine;
      const updated = { ...rest, ...extra };
      await storageSetWithRetry(mine._key, JSON.stringify(updated));
      return updated;
    }
    const key = "nh_profiles:" + targetName.toLowerCase().trim().replace(/\s+/g, "_") + "_" + Date.now();
    const entry = { name: targetName, disc: fallbackDisc || null, mbti: fallbackMbti || null, addedAt: Date.now(), ...extra };
    await storageSetWithRetry(key, JSON.stringify(entry));
    return entry;
  }
  async function runCh2Synthesis() {
    setCh2Synthesizing(true);
    setCh2Error("");
    try {
      const teammateLines = Object.entries(ch2TeammateAnswers)
        .map(([teammate, ans]) => `- Avec ${teammate} : ${ans}`)
        .join("\n") || "(aucune réponse)";
      const situationLines = TRAINING_SITUATIONS.map((s, i) => `Situation ${i + 1} : ${s}\nPiste de recherche associée (non montrée à la personne pendant le devoir) : ${CH2_CORRECTIONS[i]}`).join("\n\n");
      const reportBlock = `Le devoir demandait de rédiger le reporting de la réunion (regroupant les 3 situations ci-dessus), dans le style que le coéquipier choisi comprendra le mieux.
Coéquipier visé : ${ch2ReportTarget || "(non choisi)"}
Reporting rédigé par la personne :
"""
${ch2ReportText || "(vide)"}
"""`;
      const hexacoScores2 = (myProfileRecord && myProfileRecord.hexaco && myProfileRecord.hexaco.scores) || hexacoResults || null;
      const hexacoBlock2 = hexacoScores2
        ? `\nScores IPIP-HEXACO déclarés par la personne (échelle 1 à 5) :\n${hexacoPromptLines(hexacoScores2)}\nIntègre-les UNIQUEMENT s'ils apportent une nuance concrète utile à la collaboration en équipe (par exemple Agréabilité ou Émotivité, pertinents pour la gestion des frictions) ; ignore-les sinon.\n`
        : "";
      const prompt = `Tu es un coach en gestion d'équipe qui s'adresse directement à un employé de Nova Heritage, en français, en le tutoyant.
C'est le chapitre 2 d'un module de formation ("Mieux se connaître pour mieux travailler ensemble"), qui suit un premier chapitre où la personne a déjà travaillé sur sa propre connaissance de soi (profil DISC : ${disc}, type MBTI : ${mbti}).
Ce chapitre porte sur la collaboration concrète avec le reste de l'équipe, à partir de 3 situations vécues chez Nova Heritage et de mécanismes issus de la recherche sur la diversité de personnalités en équipe.

${situationLines}

${reportBlock}
${hexacoBlock2}
Format de reporting qui fait vraiment lire la personne : ${ch2Format || "(non renseigné)"}

Réponses sur qui est le garde-fou / le moteur avec chaque coéquipier :
${teammateLines}

Qui joue le rôle de lien entre les pôles selon la personne : ${ch2Connector || "(vide)"}

Réponds UNIQUEMENT avec un objet JSON valide, sans markdown, sans backticks, sans texte autour, au format exact suivant :
{"forces": ["...", "...", "..."], "vigilance": ["...", "...", "..."], "conseil": "..."}
- "forces" : 3 forces concrètes de cette personne pour la collaboration en équipe, basées sur ses réponses, une phrase courte chacune.
- "vigilance" : 3 zones de vigilance concrètes pour mieux travailler avec les autres, une phrase courte chacune.
- "conseil" : un conseil pratique de 2-3 phrases, orienté action, pour améliorer la collaboration avec le reste de l'équipe de Nova Heritage.
Ton chaleureux mais honnête, pas complaisant. Tutoie la personne.`;
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await response.json();
      const text = (data.content || []).map((c) => c.text || "").join("\n").trim();
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setCh2Synthesis(parsed);
      setFormationView("ch2-synthesis");
    } catch (e) {
      setCh2Error("La synthèse n'a pas pu être générée. Réessaie dans un instant.");
    }
    setCh2Synthesizing(false);
  }
  async function saveDevoir2() {
    setCh2Saving(true);
    try {
      const key = "nh_devoir2:" + name.toLowerCase().trim().replace(/\s+/g, "_");
      const payload = { name, reportTarget: ch2ReportTarget, reportText: ch2ReportText, format: ch2Format, teammateAnswers: ch2TeammateAnswers, connector: ch2Connector, synthesis: ch2Synthesis, completedAt: Date.now() };
      await storageSetWithRetry(key, JSON.stringify(payload));
      await mergeIntoProfile(name, disc, mbti, { chapter2: payload });
      await loadProfiles();
    } catch (e) {}
    setCh2Saving(false);
    setFormationView("ch2-summary");
  }
  // Correction de l'exercice principal du chapitre 2 (le reporting rédigé
  // pour un coéquipier précis) — même logique que la correction du chapitre 3.
  async function runCh2Correction() {
    setCh2Correcting(true);
    setCh2CorrectionError("");
    try {
      const prompt = `Tu es un formateur qui corrige un exercice d'écriture pour un employé de Nova Heritage, en français, en le tutoyant.
La personne devait rédiger le reporting d'une réunion (basée sur 3 situations vécues chez Nova Heritage), dans le style que le coéquipier choisi comprendra le mieux.
Coéquipier visé : ${ch2ReportTarget || "(non choisi)"}
Reporting rédigé par la personne :
"""
${ch2ReportText || "(vide)"}
"""

Réponds UNIQUEMENT avec un objet JSON valide, sans markdown, sans backticks, sans texte autour, au format exact suivant :
{"feedback": "...", "score": 0}
- "feedback" : un retour honnête et constructif sur ce reporting (2-3 phrases) : est-il vraiment adapté au style du coéquipier visé, clair, actionnable ?
- "score" : un score entre 0 et 10.
Prose simple, sans astérisques ni tirets de liste inutiles.`;
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 600,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await response.json();
      const text = (data.content || []).map((c) => c.text || "").join("\n").trim();
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setCh2Correction({ feedback: stripMarkdownArtifacts(parsed.feedback || ""), score: parsed.score });
    } catch (e) {
      setCh2CorrectionError("La correction n'a pas pu être générée. Réessaie dans un instant.");
    }
    setCh2Correcting(false);
  }
  // Chapitre 3 : étude de cas générée à partir des devoirs 1 et 2 réellement
  // faits par l'équipe visible pour la personne connectée (même périmètre que
  // l'onglet Équipe : soi-même pour un Employé, l'équipe pour un Manager, tout
  // le monde pour le CEO). Non stockée : régénérable à volonté, à la demande.
  // Nettoyage anti-markdown en filet de sécurité : même si le prompt demande
  // du texte brut, un modèle peut encore glisser des ** ou des tirets de
  // liste — on les retire avant affichage plutôt que de les montrer tels
  // quels dans une zone en texte brut (pre-wrap).
  function stripMarkdownArtifacts(text) {
    if (!text) return text;
    return text
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/^[ \t]*[-•][ \t]+/gm, "")
      .replace(/[ \t]+-[ \t]+/g, " ")
      .trim();
  }
  async function runCaseStudy() {
    setCh3Generating(true);
    setCh3Error("");
    setCh3Answers({});
    setCh3PasteFlags({});
    setCh3Correction(null);
    setCh3CorrectionError("");
    try {
      const teamBlock = ch3Eligible.map((p) => {
        const lines = [`- ${p.name} — DISC : ${p.disc || "?"}, MBTI : ${p.mbti || "?"}`];
        if (p.hexaco && p.hexaco.scores) {
          lines.push(`  IPIP-HEXACO (échelle 1 à 5) :\n${hexacoPromptLines(p.hexaco.scores).split("\n").map((l) => "  " + l).join("\n")}`);
        }
        if (p.synthesis) {
          lines.push(`  Chapitre 1 (connaissance de soi) — forces : ${(p.synthesis.forces || []).join(" / ")} ; vigilance : ${(p.synthesis.vigilance || []).join(" / ")}`);
        }
        if (p.chapter2) {
          lines.push(`  Chapitre 2 (travailler ensemble) — format préféré : ${p.chapter2.format || "?"} ; lien entre pôles selon cette personne : ${p.chapter2.connector || "?"}`);
          if (p.chapter2.synthesis) {
            lines.push(`  Synthèse chapitre 2 — forces : ${(p.chapter2.synthesis.forces || []).join(" / ")} ; vigilance : ${(p.chapter2.synthesis.vigilance || []).join(" / ")}`);
          }
        }
        return lines.join("\n");
      }).join("\n\n");
      const prompt = `Tu es un formateur qui écrit une étude de cas pour une formation en entreprise chez Nova Heritage, en français.
Voici les données réellement collectées sur l'équipe pendant les chapitres 1 et 2 du module de formation. Utilise les scores IPIP-HEXACO, quand ils existent, pour rendre les dynamiques plus précises et les personnages plus crédibles (par exemple une Honnêteté-Humilité basse peut nourrir une tendance à s'attribuer le mérite, une Conscienciosité élevée peut nourrir de la rigueur ou de la rigidité) — sans jamais les mentionner explicitement ni utiliser leur nom technique dans le texte, seulement leurs effets concrets sur le comportement :

${teamBlock}

Écris une étude de cas courte (400-600 mots) : un scénario professionnel plausible et concret impliquant plusieurs des personnes ci-dessus, construit pour faire ressortir naturellement les dynamiques, forces et frictions identifiées dans leurs réponses (formats de reporting différents, rôles de garde-fou/moteur, qui fait le lien entre pôles). Utilise les vrais prénoms.
Ajoute ensuite 3 questions de discussion ouvertes pour un débriefing en groupe.
Réponds UNIQUEMENT avec un objet JSON valide, sans markdown, sans backticks, sans texte autour, au format exact suivant :
{"case_study": "...", "questions": ["...", "...", "..."]}
Le texte doit être en prose simple, en français, ton professionnel mais engageant : pas d'astérisques, pas de gras, pas de titres, pas de tirets de liste inutiles à l'intérieur de "case_study" ni des questions.`;
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1500,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await response.json();
      const text = (data.content || []).map((c) => c.text || "").join("\n").trim();
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setCh3CaseStudy({
        case_study: stripMarkdownArtifacts(parsed.case_study || ""),
        questions: (parsed.questions || []).map(stripMarkdownArtifacts),
      });
      setFormationView("ch3-result");
    } catch (e) {
      setCh3Error("L'étude de cas n'a pas pu être générée. Réessaie dans un instant.");
    }
    setCh3Generating(false);
  }
  // Correction des réponses aux 3 questions de l'étude de cas : feedback +
  // score par question, plus des pistes pour aller plus loin. Les liens
  // YouTube ne sont jamais inventés — ce sont des URL de recherche réelles
  // (toujours valides) construites à partir des requêtes suggérées par l'IA ;
  // la documentation renvoie vers les sources déjà vérifiées de l'onglet
  // Ressources plutôt que vers des liens générés à la volée.
  async function runCh3Correction() {
    setCh3Correcting(true);
    setCh3CorrectionError("");
    try {
      const qaBlock = (ch3CaseStudy.questions || []).map((q, i) => `Question ${i + 1} : ${q}\nRéponse de l'équipe : ${ch3Answers[i] || "(vide)"}`).join("\n\n");
      const prompt = `Tu es un formateur qui corrige le débriefing d'une étude de cas de formation en entreprise chez Nova Heritage, en français.
Voici l'étude de cas :
"""
${ch3CaseStudy.case_study}
"""

Voici les questions de discussion et les réponses données par l'équipe :

${qaBlock}

Réponds UNIQUEMENT avec un objet JSON valide, sans markdown, sans backticks, sans texte autour, au format exact suivant :
{"per_question": [{"feedback": "...", "score": 0}, {"feedback": "...", "score": 0}, {"feedback": "...", "score": 0}], "overall_score": 0, "youtube_queries": ["...", "...", "..."]}
- "per_question" : un objet par question, dans le même ordre, avec un retour honnête et constructif sur la réponse donnée (2-3 phrases) et un score entre 0 et 10.
- "overall_score" : un score global entre 0 et 10 sur la qualité de l'analyse d'équipe.
- "youtube_queries" : 3 requêtes de recherche courtes (3-6 mots), en français ou en anglais selon ce qui donnera les meilleurs résultats, pour trouver sur YouTube des vidéos qui expliquent les phénomènes en jeu dans cette étude de cas (diversité de personnalités en équipe, gestion des frictions, communication interpersonnelle). Ne donne jamais d'URL, uniquement des requêtes de recherche.
Prose simple, sans astérisques ni tirets de liste inutiles.`;
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1200,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await response.json();
      const text = (data.content || []).map((c) => c.text || "").join("\n").trim();
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setCh3Correction({
        perQuestion: (parsed.per_question || []).map((q) => ({ feedback: stripMarkdownArtifacts(q.feedback || ""), score: q.score })),
        overallScore: parsed.overall_score,
        youtubeQueries: (parsed.youtube_queries || []).map(stripMarkdownArtifacts),
      });
    } catch (e) {
      setCh3CorrectionError("La correction n'a pas pu être générée. Réessaie dans un instant.");
    }
    setCh3Correcting(false);
  }
  async function saveHexaco() {
    setHexacoSaving(true);
    setHexacoError("");
    try {
      const scores = scoreHexaco(hexacoAnswers);
      const hexacoPayload = { scores, answers: hexacoAnswers, completedAt: new Date().toISOString() };
      await mergeIntoProfile(name, disc, mbti, { hexaco: hexacoPayload });
      await loadProfiles();
      setHexacoResults(scores);
      if (synthesis) {
        // Le chapitre 1 a déjà une synthèse : on la régénère tout de suite
        // avec ces nouveaux scores plutôt que de laisser la personne cliquer
        // sur un bouton "régénérer" séparé.
        await runSynthesis(scores);
      } else {
        setFormationView("hexaco-results");
      }
    } catch (e) {
      setHexacoError("L'enregistrement a échoué (" + (e && e.message ? e.message : "erreur inconnue") + "). Tes réponses n'ont pas été perdues, réessaie.");
    }
    setHexacoSaving(false);
  }
  // Mode entraînement (chapitre 1) : une situation générée à partir du
  // profil de la personne et des sources déjà vérifiées de l'app, avec un
  // profil DISC différent en face ; la personne rédige une action, puis
  // demande une correction avec score et une action-modèle.
  async function runTrainingScenario() {
    setTrainingGenerating(true);
    setTrainingError("");
    setTrainingAnswer("");
    setTrainingCorrection(null);
    try {
      const docBlock = MODULE_A_CH2_SOURCES.map((s) => `- ${s.t} (${s.a})`).join("\n");
      const hexacoScoresT = (myProfileRecord && myProfileRecord.hexaco && myProfileRecord.hexaco.scores) || hexacoResults || null;
      const hexacoBlockT = hexacoScoresT ? `\nScores IPIP-HEXACO de la personne (échelle 1 à 5) :\n${hexacoPromptLines(hexacoScoresT)}\n` : "";
      const prompt = `Tu es un formateur qui prépare un exercice d'entraînement pour un employé de Nova Heritage, en français.
Profil DISC de la personne : ${disc}
Type MBTI de la personne : ${mbti}
${hexacoBlockT}Documentation de référence sur laquelle t'appuyer (diversité de personnalités en équipe) :
${docBlock}

Génère une situation professionnelle courte et concrète (3-5 phrases), propre à cette personne (adaptée à son propre profil, y compris ses scores IPIP-HEXACO si présents), où elle doit interagir avec un ou une collègue d'un profil DISC différent du sien, choisi au hasard parmi Rouge, Jaune, Vert, Bleu (jamais le même que celui de la personne). La situation doit poser un vrai problème à résoudre, pas juste une description.
Réponds UNIQUEMENT avec un objet JSON valide, sans markdown, sans backticks, sans texte autour, au format exact suivant :
{"situation": "...", "facing_profile": "Rouge"}
"facing_profile" doit être exactement un des 4 mots : Rouge, Jaune, Vert, Bleu.`;
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 500,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await response.json();
      const text = (data.content || []).map((c) => c.text || "").join("\n").trim();
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setTrainingScenario({ situation: stripMarkdownArtifacts(parsed.situation || ""), facing_profile: parsed.facing_profile });
    } catch (e) {
      setTrainingError("La situation n'a pas pu être générée. Réessaie dans un instant.");
    }
    setTrainingGenerating(false);
  }
  async function runTrainingCorrection() {
    if (!trainingScenario) return;
    setTrainingCorrecting(true);
    setTrainingError("");
    try {
      const hexacoScoresTC = (myProfileRecord && myProfileRecord.hexaco && myProfileRecord.hexaco.scores) || hexacoResults || null;
      const hexacoBlockTC = hexacoScoresTC ? `\nScores IPIP-HEXACO de la personne (échelle 1 à 5) :\n${hexacoPromptLines(hexacoScoresTC)}\n` : "";
      const prompt = `Tu es un formateur qui corrige un exercice d'entraînement pour un employé de Nova Heritage, en français, en le tutoyant.
Profil DISC de la personne : ${disc}
Type MBTI de la personne : ${mbti}
${hexacoBlockTC}Situation : ${trainingScenario.situation}
Profil en face de la personne : ${trainingScenario.facing_profile}
Action proposée par la personne : ${trainingAnswer}

Réponds UNIQUEMENT avec un objet JSON valide, sans markdown, sans backticks, sans texte autour, au format exact suivant :
{"feedback": "...", "score": 0, "model_action": "..."}
- "feedback" : un retour honnête et constructif sur l'action proposée, compte tenu du profil en face (2-3 phrases), tutoiement.
- "score" : un score entre 0 et 10.
- "model_action" : une action possible, adaptée au profil en face, à titre d'exemple (2-3 phrases).
Prose simple, sans astérisques ni tirets de liste inutiles.`;
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 700,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await response.json();
      const text = (data.content || []).map((c) => c.text || "").join("\n").trim();
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setTrainingCorrection({
        feedback: stripMarkdownArtifacts(parsed.feedback || ""),
        score: parsed.score,
        model_action: stripMarkdownArtifacts(parsed.model_action || ""),
      });
    } catch (e) {
      setTrainingError("La correction n'a pas pu être générée. Réessaie dans un instant.");
    }
    setTrainingCorrecting(false);
  }
  async function runMemberSynthesis(member) {
    setMemberSynthesizing(true);
    setMemberSynthesisError("");
    try {
      const hexacoScores = member.hexaco && member.hexaco.scores;
      const hexacoBlock = hexacoScores
        ? `Scores IPIP-HEXACO déclarés (échelle 1 à 5, complémentaire au DISC/MBTI) :\n${HEXACO_DOMAINS.map((d) => `- ${d.label} : ${hexacoScores[d.code] != null ? hexacoScores[d.code].toFixed(1) : "-"}/5`).join("\n")}\n`
        : "";
      const prompt = `Tu es un coach en gestion d'équipe qui aide un manager de Nova Heritage à mieux comprendre un membre de son équipe. Réponds en français, EN PARLANT DE cette personne à la troisième personne (pas en t'adressant à elle).
Nom : ${member.name}
Profil DISC : ${member.disc || "non renseigné"}
Type MBTI : ${member.mbti || "non renseigné"}
${hexacoBlock}Réponds UNIQUEMENT avec un objet JSON valide, sans markdown, sans backticks, sans texte autour, au format exact suivant :
{"forces": ["...", "...", "..."], "vigilance": ["...", "...", "..."], "conseil": "..."}
- "forces" : 3 forces concrètes de cette personne pour le travail en équipe, une phrase courte chacune, sans tiret ni numéro au début.
- "vigilance" : 3 zones de vigilance concrètes à surveiller en la/le managant, une phrase courte chacune.
- "conseil" : un conseil pratique de 2-3 phrases pour le manager qui travaille avec cette personne.
Appuie-toi sur les éléments fournis plutôt que sur des généralités. Ton professionnel et honnête, pas complaisant.`;
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await response.json();
      const text = (data.content || []).map((c) => c.text || "").join("\n").trim();
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      await mergeIntoProfile(member.name, member.disc, member.mbti, { synthesis: parsed, synthesisAt: Date.now() });
      await loadProfiles();
      setSelectedMember((prev) => (prev && prev.name === member.name ? { ...prev, synthesis: parsed, synthesisAt: Date.now() } : prev));
    } catch (e) {
      setMemberSynthesisError("La synthèse n'a pas pu être générée. Réessaie dans un instant.");
    }
    setMemberSynthesizing(false);
  }
  const GOAL_STATUSES = ["à faire", "faite", "évaluée"];
  async function addGoal(member) {
    if (!goalInput.trim()) return;
    setSavingGoal(true);
    setGoalError("");
    try {
      const newGoal = {
        id: Date.now() + "_" + Math.random().toString(36).slice(2, 7),
        text: goalInput.trim(),
        deadline: goalDeadlineInput || null,
        status: "à faire",
        evaluation: null,
        createdAt: Date.now(),
      };
      const updatedGoals = [...(member.goals || []), newGoal];
      await mergeIntoProfile(member.name, member.disc, member.mbti, { goals: updatedGoals });
      await loadProfiles();
      setSelectedMember((prev) => (prev && prev.name === member.name ? { ...prev, goals: updatedGoals } : prev));
      setGoalInput("");
      setGoalDeadlineInput("");
    } catch (e) {
      setGoalError("L'objectif n'a pas pu être enregistré. Réessaie.");
    }
    setSavingGoal(false);
  }
  async function setGoalStatus(member, goalId, newStatus) {
    const updatedGoals = (member.goals || []).map((g) => (g.id === goalId ? { ...g, status: newStatus } : g));
    try {
      await mergeIntoProfile(member.name, member.disc, member.mbti, { goals: updatedGoals });
      await loadProfiles();
      setSelectedMember((prev) => (prev && prev.name === member.name ? { ...prev, goals: updatedGoals } : prev));
    } catch (e) {}
  }
  async function markOwnGoalDone(goalId) {
    if (!myProfileRecord) return;
    const updatedGoals = (myProfileRecord.goals || []).map((g) => (g.id === goalId ? { ...g, status: "faite" } : g));
    try {
      await mergeIntoProfile(name, disc, mbti, { goals: updatedGoals });
      await loadProfiles();
    } catch (e) {}
  }
  async function saveGoalEvaluation(member, goalId, text) {
    const updatedGoals = (member.goals || []).map((g) => (g.id === goalId ? { ...g, status: "évaluée", evaluation: text, evaluatedAt: Date.now() } : g));
    try {
      await mergeIntoProfile(member.name, member.disc, member.mbti, { goals: updatedGoals });
      await loadProfiles();
      setSelectedMember((prev) => (prev && prev.name === member.name ? { ...prev, goals: updatedGoals } : prev));
    } catch (e) {}
  }
  async function deleteGoal(member, goalId) {
    const updatedGoals = (member.goals || []).filter((g) => g.id !== goalId);
    try {
      await mergeIntoProfile(member.name, member.disc, member.mbti, { goals: updatedGoals });
      await loadProfiles();
      setSelectedMember((prev) => (prev && prev.name === member.name ? { ...prev, goals: updatedGoals } : prev));
    } catch (e) {}
  }
  async function saveQuarterlyEvaluation(member, text) {
    try {
      const payload = { text, setAt: Date.now() };
      await mergeIntoProfile(member.name, member.disc, member.mbti, { quarterlyEvaluation: payload });
      await loadProfiles();
      setSelectedMember((prev) => (prev && prev.name === member.name ? { ...prev, quarterlyEvaluation: payload } : prev));
    } catch (e) {}
  }
  // Onglet "Gestion des équipes" : distribution d'objectifs indépendante par
  // carte membre (pas besoin de sélectionner d'abord une personne comme dans
  // "Mon équipe"), avec un brouillon de texte/échéance propre à chaque nom
  // pour éviter que plusieurs formulaires ouverts en même temps ne se marchent
  // dessus.
  async function addGoalFor(member) {
    const text = (goalDraftText[member.name] || "").trim();
    if (!text) return;
    setGoalDraftSaving((prev) => ({ ...prev, [member.name]: true }));
    setGoalDraftError((prev) => ({ ...prev, [member.name]: "" }));
    try {
      const newGoal = {
        id: Date.now() + "_" + Math.random().toString(36).slice(2, 7),
        text,
        deadline: goalDraftDeadline[member.name] || null,
        status: "à faire",
        evaluation: null,
        createdAt: Date.now(),
      };
      const updatedGoals = [...(member.goals || []), newGoal];
      await mergeIntoProfile(member.name, member.disc, member.mbti, { goals: updatedGoals });
      await loadProfiles();
      setSelectedMember((prev) => (prev && prev.name === member.name ? { ...prev, goals: updatedGoals } : prev));
      setGoalDraftText((prev) => ({ ...prev, [member.name]: "" }));
      setGoalDraftDeadline((prev) => ({ ...prev, [member.name]: "" }));
    } catch (e) {
      setGoalDraftError((prev) => ({ ...prev, [member.name]: "L'objectif n'a pas pu être enregistré. Réessaie." }));
    }
    setGoalDraftSaving((prev) => ({ ...prev, [member.name]: false }));
  }
  async function saveManagerAssessment(member, text) {
    setManagerAssessmentSaving((prev) => ({ ...prev, [member.name]: true }));
    try {
      const payload = { text, setAt: Date.now() };
      await mergeIntoProfile(member.name, member.disc, member.mbti, { managerAssessment: payload });
      await loadProfiles();
      setSelectedMember((prev) => (prev && prev.name === member.name ? { ...prev, managerAssessment: payload } : prev));
    } catch (e) {}
    setManagerAssessmentSaving((prev) => ({ ...prev, [member.name]: false }));
  }
  async function saveSelfAssessment() {
    setSavingSelfAssessment(true);
    try {
      const payload = { text: selfAssessmentDraft, setAt: Date.now() };
      await mergeIntoProfile(name, disc, mbti, { selfAssessment: payload });
      await loadProfiles();
      setShowSelfAssessmentForm(false);
    } catch (e) {}
    setSavingSelfAssessment(false);
  }
  // Forces/faiblesses au niveau de l'équipe (composition DISC/MBTI, pas
  // synthèse individuelle) — visible dans "Mon équipe" dès que plus d'une
  // personne partage le même périmètre visible.
  async function runTeamSynthesis() {
    setTeamSynthesizing(true);
    setTeamSynthesisError("");
    try {
      const teamBlock = visibleProfiles.map((p) => {
        const hexacoLine = p.hexaco && p.hexaco.scores
          ? ` ; HEXACO — Honnêteté-Humilité : ${p.hexaco.scores.H != null ? p.hexaco.scores.H.toFixed(1) : "-"}/5, Conscienciosité : ${p.hexaco.scores.C != null ? p.hexaco.scores.C.toFixed(1) : "-"}/5`
          : "";
        return `- ${p.name} — DISC : ${p.disc || "?"}, MBTI : ${p.mbti || "?"}${hexacoLine}`;
      }).join("\n");
      const prompt = `Tu es un coach en gestion d'équipe qui analyse la composition d'une équipe de Nova Heritage, en français.
Voici les profils des ${visibleProfiles.length} personnes de cette équipe :

${teamBlock}

Réponds UNIQUEMENT avec un objet JSON valide, sans markdown, sans backticks, sans texte autour, au format exact suivant :
{"forces": ["...", "...", "...", "..."], "faiblesses": ["...", "...", "...", "..."]}
- "forces" : 4 forces de cette équipe, au niveau collectif, basées sur la composition réelle des profils DISC/MBTI ci-dessus (diversité ou concentration de certains profils, complémentarités), une phrase courte chacune.
- "faiblesses" : 4 faiblesses ou risques de cette équipe, au même niveau collectif (angles morts partagés, profils sur-représentés ou absents, frictions probables), une phrase courte chacune.
Sois concret et spécifique à cette composition précise, pas générique. Ton professionnel, honnête, pas complaisant.`;
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await response.json();
      const text = (data.content || []).map((c) => c.text || "").join("\n").trim();
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setTeamSynthesis(parsed);
    } catch (e) {
      setTeamSynthesisError("La génération n'a pas pu aboutir. Réessaie dans un instant.");
    }
    setTeamSynthesizing(false);
  }
  async function handlePhotoUpload(member, file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        await mergeIntoProfile(member.name, member.disc, member.mbti, { photo: reader.result });
        await loadProfiles();
        setSelectedMember((prev) => (prev && prev.name === member.name ? { ...prev, photo: reader.result } : prev));
      } catch (e) {}
    };
    reader.readAsDataURL(file);
  }
  const discInfo = disc ? DISC_OPTIONS.find((d) => d.code === disc) : null;
  const myProfileRecord = profiles.filter((p) => p.name === name).sort((a, b) => (b.addedAt || 0) - (a.addedAt || 0))[0] || null;
  const myNotDoneGoals = ((myProfileRecord && myProfileRecord.goals) || []).filter((g) => g.status === "à faire");
  const myDoneUnevaluatedGoals = ((myProfileRecord && myProfileRecord.goals) || []).filter((g) => g.status === "faite");
  const myEvaluatedGoals = ((myProfileRecord && myProfileRecord.goals) || []).filter((g) => g.status === "évaluée");
  useEffect(() => {
    setQuarterlyDraft((selectedMember && selectedMember.quarterlyEvaluation && selectedMember.quarterlyEvaluation.text) || "");
  }, [selectedMember && selectedMember.name]);
  const hexacoDomainCode = HEXACO_DOMAINS[hexacoPage] ? HEXACO_DOMAINS[hexacoPage].code : "H";
  const hexacoPageItems = HEXACO_ITEMS.filter((it) => it.domain === hexacoDomainCode);
  const hexacoPageComplete = hexacoPageItems.every((it) => hexacoAnswers[it.id] !== undefined);
  const visibleProfiles = useMemo(() => {
    if (role === "CEO") return profiles;
    if (role === "Manager") return profiles.filter((p) => p.equipe && p.equipe === equipe);
    return profiles.filter((p) => p.name === name);
  }, [profiles, role, equipe, name]);
  const ch3Eligible = useMemo(() => visibleProfiles.filter((p) => p.synthesis || p.chapter2), [visibleProfiles]);
  const orbitData = useMemo(() => {
    if (visibleProfiles.length === 0) return [];
    return visibleProfiles.map((p, idx) => {
      const others = visibleProfiles.filter((_, j) => j !== idx);
      const avgScore = others.length ? others.reduce((s, o) => s + frictionScore(p.disc, o.disc), 0) / others.length : 1;
      const radius = 70 + avgScore * 35;
      const duration = 22 + idx * 6;
      const startAngle = (360 / visibleProfiles.length) * idx;
      const dInfo = DISC_OPTIONS.find((d) => d.code === p.disc) || DISC_OPTIONS[0];
      return { ...p, radius, duration, startAngle, dInfo };
    });
  }, [visibleProfiles]);
  useEffect(() => {
    if (role === "Employé" && !selectedMember && orbitData.length > 0) {
      setSelectedMember(orbitData[0]);
    }
  }, [role, orbitData, selectedMember]);
  const wrap = { minHeight: "100vh", background: "#F6F7F5", fontFamily: "'Inter', system-ui, sans-serif", color: "#20242B" };
  if (stage !== "app") {
    return (
      <div style={wrap}>
        <Logo />
        <div style={{ maxWidth: 560, margin: "0 auto", padding: "140px 24px 60px", textAlign: "center" }}>
          {stage === "name" && (
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 600, color: NAVY, marginBottom: 28, lineHeight: 1.4 }}>
                Bonjour, membre de Nova Heritage.<br />Comment est-ce que tu t'appelles ?
              </h1>
              <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                <input
                  autoFocus
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && nameInput.trim()) { setName(nameInput.trim()); setStage("name-confirm"); } }}
                  placeholder="Ton prénom"
                  style={{ padding: "12px 16px", borderRadius: 10, border: "1px solid #D9DEE7", fontSize: 15, width: 240 }}
                />
                <button
                  onClick={() => { if (nameInput.trim()) { setName(nameInput.trim()); setStage("name-confirm"); } }}
                  style={{ padding: "12px 20px", borderRadius: 10, border: "none", background: NAVY, color: "white", fontSize: 15, fontWeight: 500, cursor: "pointer" }}
                >
                  Continuer
                </button>
              </div>
              <div style={{ marginTop: 22 }}>
                {!showReconnect && (
                  <button onClick={() => setShowReconnect(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, fontSize: 13.5, fontWeight: 500, color: "#1F6FEB" }}>
                    Je pense me rappeler de toi, tu veux te reconnecter ?
                  </button>
                )}
                {showReconnect && (
                  <div style={{ marginTop: 6 }}>
                    <p style={{ fontSize: 13.5, fontWeight: 500, color: "#1F6FEB", marginBottom: 10 }}>Je pense me rappeler de toi, tu veux te reconnecter ?</p>
                    <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                      <input
                        value={reconnectInput}
                        onChange={(e) => setReconnectInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") handleReconnect(); }}
                        placeholder="Ton prénom déjà utilisé"
                        style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #D9DEE7", fontSize: 14, width: 220 }}
                      />
                      <button onClick={handleReconnect} disabled={reconnecting}
                        style={{ padding: "10px 16px", borderRadius: 10, border: "none", background: "#1F6FEB", color: "white", fontSize: 14, fontWeight: 500, cursor: "pointer" }}>
                        {reconnecting ? "..." : "Me reconnecter"}
                      </button>
                    </div>
                    {reconnectError && <p style={{ fontSize: 12.5, color: "#A32D2D", marginTop: 8 }}>{reconnectError}</p>}
                    {pendingCeoReconnect && (
                      <div style={{ marginTop: 14, padding: 14, borderRadius: 10, border: "1px solid #D9DEE7", background: "#FAFBFA", maxWidth: 280, marginLeft: "auto", marginRight: "auto" }}>
                        <p style={{ fontSize: 13, color: "#565C66", marginBottom: 8 }}>Ce profil est CEO — mot de passe requis.</p>
                        <input
                          type="password"
                          value={ceoPasswordInput}
                          onChange={(e) => { setCeoPasswordInput(e.target.value); setCeoPasswordError(""); }}
                          onKeyDown={(e) => { if (e.key === "Enter") confirmCeoReconnect(); }}
                          placeholder="Mot de passe CEO"
                          style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #D9DEE7", fontSize: 14, width: "100%", marginBottom: 8 }}
                        />
                        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                          <button onClick={confirmCeoReconnect} style={{ padding: "8px 14px", borderRadius: 10, border: "none", background: "#1F6FEB", color: "white", fontSize: 13.5, fontWeight: 500, cursor: "pointer" }}>
                            Confirmer
                          </button>
                          <button onClick={() => { setPendingCeoReconnect(null); setCeoPasswordInput(""); setCeoPasswordError(""); }} style={{ padding: "8px 14px", borderRadius: 10, border: "1px solid #D9DEE7", background: "white", fontSize: 13.5, cursor: "pointer" }}>
                            Annuler
                          </button>
                        </div>
                        {ceoPasswordError && <p style={{ fontSize: 12.5, color: "#A32D2D", marginTop: 8 }}>{ceoPasswordError}</p>}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
          {stage === "name-confirm" && (
            <div>
              <p style={{ fontSize: 22, color: NAVY, fontWeight: 500, marginBottom: 32 }}>Merci {name} !</p>
              <button onClick={() => setStage("role")} style={{ padding: "12px 24px", borderRadius: 10, border: "none", background: TEAL, color: "white", fontSize: 15, fontWeight: 500, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 }}>
                Continuer <ArrowRight size={16} />
              </button>
            </div>
          )}
          {stage === "role" && (
            <div style={{ textAlign: "left" }}>
              <h2 style={{ fontSize: 22, fontWeight: 600, color: NAVY, marginBottom: 8, textAlign: "center" }}>Quelle est ta fonction ?</h2>
              <p style={{ fontSize: 13, color: "#9098A3", marginBottom: 22, textAlign: "center" }}>Ça détermine quels profils tu pourras voir dans l'onglet "Mon équipe".</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {ROLE_OPTIONS.map((r) => (
                  <button key={r.code} onClick={() => setRole(r.code)}
                    style={{ padding: "16px 14px", borderRadius: 12, border: role === r.code ? "2px solid " + TEAL : "1px solid #E3E6E2", background: role === r.code ? "#E1F5EE" : "white", cursor: "pointer", textAlign: "left" }}>
                    <div style={{ fontWeight: 600, color: NAVY, fontSize: 14.5 }}>{r.code}</div>
                    <div style={{ fontSize: 12, color: "#565C66", marginTop: 3 }}>{r.desc}</div>
                  </button>
                ))}
              </div>
              {role === "CEO" && (
                <div style={{ marginTop: 20, maxWidth: 340 }}>
                  <label style={{ fontSize: 12.5, color: "#565C66", display: "block", marginBottom: 5 }}>Mot de passe CEO</label>
                  <input type="password" value={ceoPasswordInput}
                    onChange={(e) => { setCeoPasswordInput(e.target.value); setCeoPasswordError(""); }}
                    placeholder="Mot de passe"
                    style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #D9DEE7", fontSize: 14.5, width: "100%" }} />
                  {ceoPasswordError && <p style={{ fontSize: 12.5, color: "#A32D2D", marginTop: 6 }}>{ceoPasswordError}</p>}
                </div>
              )}
              {(role === "Employé" || role === "Manager") && (
                <div style={{ marginTop: 20, maxWidth: 340 }}>
                  <label style={{ fontSize: 12.5, color: "#565C66", display: "block", marginBottom: 5 }}>Équipe</label>
                  <input value={equipe} onChange={(e) => setEquipe(e.target.value)} placeholder="ex : Équipe Douala, Équipe Yaoundé..."
                    style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #D9DEE7", fontSize: 14.5, width: "100%" }} />
                </div>
              )}
              <div style={{ textAlign: "center" }}>
                <button disabled={!role || ((role === "Employé" || role === "Manager") && !equipe.trim())}
                  onClick={() => {
                    if (role === "CEO") {
                      if (ceoPasswordInput !== CEO_PASSWORD) { setCeoPasswordError("Mot de passe incorrect."); return; }
                    }
                    setStage("disc");
                  }}
                  style={{ marginTop: 24, padding: "12px 24px", borderRadius: 10, border: "none",
                    background: (role && !((role === "Employé" || role === "Manager") && !equipe.trim())) ? TEAL : "#C9CFC9",
                    color: "white", fontSize: 15, fontWeight: 500,
                    cursor: (role && !((role === "Employé" || role === "Manager") && !equipe.trim())) ? "pointer" : "not-allowed",
                    display: "inline-flex", alignItems: "center", gap: 8 }}>
                  Continuer <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}
          {stage === "disc" && (
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 600, color: NAVY, marginBottom: 24 }}>Sélectionne ton type DISC</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {DISC_OPTIONS.map((d) => (
                  <button key={d.code} onClick={() => setDisc(d.code)}
                    style={{ padding: "20px 14px", borderRadius: 12, border: disc === d.code ? "2px solid " + d.color : "1px solid #E3E6E2", background: d.light, cursor: "pointer", textAlign: "left" }}>
                    <div style={{ width: 30, height: 30, borderRadius: "50%", background: d.color, marginBottom: 10 }} />
                    <div style={{ fontWeight: 600, color: d.color, fontSize: 15 }}>{d.code}</div>
                    <div style={{ fontSize: 12.5, color: "#565C66", marginTop: 2 }}>{d.trait}</div>
                  </button>
                ))}
              </div>
              {discInfo && (
                <div style={{ marginTop: 24, padding: 18, borderRadius: 12, background: discInfo.light, border: "1px solid " + discInfo.color }}>
                  <p style={{ fontSize: 13, color: "#565C66", marginBottom: 4 }}>Une célébrité avec ce profil</p>
                  <p style={{ fontSize: 18, fontWeight: 600, color: discInfo.color, margin: 0 }}>{discInfo.celeb}</p>
                </div>
              )}
              <button disabled={!disc} onClick={() => setStage("mbti")}
                style={{ marginTop: 24, padding: "12px 24px", borderRadius: 10, border: "none", background: disc ? TEAL : "#C9CFC9", color: "white", fontSize: 15, fontWeight: 500, cursor: disc ? "pointer" : "not-allowed", display: "inline-flex", alignItems: "center", gap: 8 }}>
                Continuer <ArrowRight size={16} />
              </button>
            </div>
          )}
          {stage === "mbti" && (
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 600, color: NAVY, marginBottom: 24 }}>Sélectionne ton MBTI</h2>
              <select
                value={mbti || ""}
                onChange={(e) => setMbti(e.target.value)}
                style={{ padding: "12px 16px", borderRadius: 10, border: "1px solid #D9DEE7", fontSize: 15, width: "100%", maxWidth: 320 }}
              >
                <option value="">Choisir un type</option>
                {MBTI_LIST.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
              {mbti && (
                <div style={{ marginTop: 24, padding: 18, borderRadius: 12, background: "#EEEDFE", border: "1px solid #7F77DD" }}>
                  <p style={{ fontSize: 13, color: "#565C66", marginBottom: 4 }}>Une célébrité avec ce type</p>
                  <p style={{ fontSize: 18, fontWeight: 600, color: "#3C3489", margin: 0 }}>{MBTI_CELEB[mbti]}</p>
                </div>
              )}
              <div>
                <button disabled={!mbti || loading} onClick={() => finishOnboarding(mbti)}
                  style={{ marginTop: 24, padding: "12px 24px", borderRadius: 10, border: "none", background: mbti ? NAVY : "#C9CFC9", color: "white", fontSize: 15, fontWeight: 500, cursor: mbti ? "pointer" : "not-allowed", display: "inline-flex", alignItems: "center", gap: 8 }}>
                  {loading ? "Enregistrement..." : "Terminer"} <ArrowRight size={16} />
                </button>
                {onboardingError && <p style={{ fontSize: 13, color: "#A32D2D", marginTop: 12 }}>{onboardingError}</p>}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
  const TabButton = ({ id, icon: Icon, label }) => (
    <button onClick={() => setActiveTab(id)}
      style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 10, border: "none", cursor: "pointer",
        background: activeTab === id ? NAVY : "transparent", color: activeTab === id ? "white" : "#565C66", fontSize: 14.5, fontWeight: 500 }}>
      <Icon size={16} /> {label}
    </button>
  );
  return (
    <div style={wrap}>
      <Logo />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "90px 24px 60px" }}>
        <nav style={{ display: "flex", gap: 8, marginBottom: 32, background: "white", padding: 6, borderRadius: 12, border: "1px solid #E3E6E2", width: "fit-content" }}>
          <TabButton id="presentations" icon={Presentation} label="Présentations" />
          <TabButton id="formation" icon={GraduationCap} label="Formation" />
          <TabButton id="team" icon={Users} label="Mon équipe" />
          <TabButton id="management" icon={ClipboardCheck} label="Gestion des équipes" />
          <TabButton id="evolution" icon={TrendingUp} label="Mon évolution" />
          <TabButton id="resources" icon={BookOpen} label="Ressources" />
        </nav>
        {activeTab === "presentations" && presentationView === "list" && (
          <div style={{ background: "white", borderRadius: 14, border: "1px solid #E3E6E2", padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: NAVY, marginBottom: 4 }}>Présentations</h3>
            <p style={{ fontSize: 13.5, color: "#565C66", marginBottom: 18 }}>Les présentations déjà faites en session, à revoir à tout moment.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {PRESENTATIONS.map((p) => (
                <button key={p.id} onClick={() => { setActivePresModule(p); setPresentationView("module"); }}
                  style={{ textAlign: "left", border: "1px solid #E3E6E2", borderRadius: 12, padding: 16, cursor: "pointer", background: "white", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 4px" }}>{p.title}</p>
                    <p style={{ fontSize: 14.5, fontWeight: 500, color: NAVY, margin: 0 }}>{p.subtitle}</p>
                  </div>
                  <ArrowRight size={18} color="#9098A3" />
                </button>
              ))}
            </div>
          </div>
        )}
        {activeTab === "presentations" && presentationView === "module" && activePresModule && (
          <div style={{ background: "white", borderRadius: 14, border: "1px solid #E3E6E2", padding: 24 }}>
            <button onClick={() => setPresentationView("list")} style={{ background: "none", border: "none", color: "#9098A3", fontSize: 13, cursor: "pointer", marginBottom: 14, padding: 0 }}>&larr; Retour aux présentations</button>
            <p style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 4px" }}>{activePresModule.title}</p>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: NAVY, marginBottom: 18 }}>{activePresModule.subtitle}</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {activePresModule.chapters.map((c) => (
                <button key={c.id} onClick={() => { setActiveSlides(c.slides); setSlideIndex(0); setPresentationView("viewer"); }}
                  style={{ textAlign: "left", border: "1px solid #E3E6E2", borderRadius: 12, padding: 16, cursor: "pointer", background: "white", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 4px" }}>{c.title}</p>
                    <p style={{ fontSize: 14.5, fontWeight: 500, color: NAVY, margin: 0 }}>{c.subtitle}</p>
                  </div>
                  <ArrowRight size={18} color="#9098A3" />
                </button>
              ))}
            </div>
          </div>
        )}
        {activeTab === "presentations" && presentationView === "viewer" && (
          <div>
            <button onClick={() => setPresentationView("module")} style={{ background: "none", border: "none", color: "#9098A3", fontSize: 13, cursor: "pointer", marginBottom: 14, padding: 0 }}>&larr; Retour aux chapitres</button>
            <div style={{ background: NAVY, borderRadius: 14, padding: 40, minHeight: 320, display: "flex", flexDirection: "column", justifyContent: "center", color: "white" }}>
              {activeSlides[slideIndex].type === "title" && (
                <div>
                  <h2 style={{ fontSize: 26, fontWeight: 600, margin: "0 0 12px", lineHeight: 1.35 }}>{activeSlides[slideIndex].title}</h2>
                  <p style={{ fontSize: 15, color: "#C3CEDF", margin: 0 }}>{activeSlides[slideIndex].subtitle}</p>
                </div>
              )}
              {activeSlides[slideIndex].type === "bullets" && (
                <div>
                  <h3 style={{ fontSize: 20, fontWeight: 600, margin: "0 0 20px" }}>{activeSlides[slideIndex].title}</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {activeSlides[slideIndex].items.map((it, i) => (
                      <p key={i} style={{ fontSize: 15, margin: 0, color: "#E4E9F2" }}>•  {it}</p>
                    ))}
                  </div>
                </div>
              )}
              {activeSlides[slideIndex].type === "situation" && (
                <div>
                  <p style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5, color: MINT, fontWeight: 600, margin: "0 0 10px" }}>{activeSlides[slideIndex].title}</p>
                  <p style={{ fontSize: 17, lineHeight: 1.6, margin: "0 0 18px" }}>{activeSlides[slideIndex].text}</p>
                  <p style={{ fontSize: 14, fontStyle: "italic", color: "#C3CEDF", margin: 0 }}>Comment interprétez-vous cette situation ? Qu'auriez-vous mis en place pour la gérer ?</p>
                </div>
              )}
              {activeSlides[slideIndex].type === "situation2" && (
                <div>
                  <p style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5, color: MINT, fontWeight: 600, margin: "0 0 10px" }}>{activeSlides[slideIndex].title}</p>
                  <p style={{ fontSize: 17, lineHeight: 1.6, margin: 0 }}>{activeSlides[slideIndex].text}</p>
                </div>
              )}
              {activeSlides[slideIndex].type === "correction" && (
                <div>
                  <p style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5, color: MINT, fontWeight: 600, margin: "0 0 14px" }}>{activeSlides[slideIndex].title}</p>
                  <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 12, padding: 18, borderLeft: "3px solid " + MINT }}>
                    <p style={{ fontSize: 16, lineHeight: 1.65, margin: 0, color: "#E4E9F2" }}>{activeSlides[slideIndex].text}</p>
                  </div>
                </div>
              )}
              {activeSlides[slideIndex].type === "question" && (
                <div>
                  <p style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5, color: MINT, fontWeight: 600, margin: "0 0 14px" }}>{activeSlides[slideIndex].title}</p>
                  <p style={{ fontSize: 20, lineHeight: 1.55, margin: 0, fontWeight: 500 }}>{activeSlides[slideIndex].text}</p>
                </div>
              )}
              {activeSlides[slideIndex].type === "profile" && (
                <div>
                  <h3 style={{ fontSize: 20, fontWeight: 600, margin: "0 0 18px", color: (DISC_OPTIONS.find((d) => d.code === activeSlides[slideIndex].code) || {}).color }}>
                    Profil {activeSlides[slideIndex].code}
                  </h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 600, color: MINT, margin: "0 0 8px", textTransform: "uppercase" }}>Forces</p>
                      {activeSlides[slideIndex].forces.map((f, i) => <p key={i} style={{ fontSize: 13.5, margin: "0 0 8px", color: "#E4E9F2" }}>{f}</p>)}
                    </div>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 600, color: "#F2A79B", margin: "0 0 8px", textTransform: "uppercase" }}>Faiblesses</p>
                      {activeSlides[slideIndex].faiblesses.map((f, i) => <p key={i} style={{ fontSize: 13.5, margin: "0 0 8px", color: "#E4E9F2" }}>{f}</p>)}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14 }}>
              <button onClick={() => setSlideIndex(Math.max(0, slideIndex - 1))} disabled={slideIndex === 0}
                style={{ display: "flex", alignItems: "center", gap: 4, padding: "8px 14px", borderRadius: 8, border: "1px solid #D9DEE7", background: "white", cursor: slideIndex === 0 ? "default" : "pointer", opacity: slideIndex === 0 ? 0.4 : 1, fontSize: 13.5 }}>
                <ChevronLeft size={16} /> Précédent
              </button>
              <span style={{ fontSize: 12.5, color: "#9098A3" }}>{slideIndex + 1} / {activeSlides.length}</span>
              <button onClick={() => setSlideIndex(Math.min(activeSlides.length - 1, slideIndex + 1))} disabled={slideIndex === activeSlides.length - 1}
                style={{ display: "flex", alignItems: "center", gap: 4, padding: "8px 14px", borderRadius: 8, border: "1px solid #D9DEE7", background: "white", cursor: slideIndex === activeSlides.length - 1 ? "default" : "pointer", opacity: slideIndex === activeSlides.length - 1 ? 0.4 : 1, fontSize: 13.5 }}>
                Suivant <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
        {activeTab === "formation" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {formationView === "path" && (
              <>
              <div style={{ background: "white", borderRadius: 14, border: "1px solid #E3E6E2", padding: 32 }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: NAVY, marginBottom: 4 }}>Parcours de formation</h3>
                <p style={{ fontSize: 13.5, color: "#565C66", marginBottom: 32 }}>Clique sur le module A pour commencer.</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, flexWrap: "wrap" }}>
                  {["A", "B", "C", "D", "E"].map((letter, i) => (
                    <React.Fragment key={letter}>
                      {i > 0 && <div style={{ width: 44, height: 0, borderTop: "2px dashed #C9CFC9", flexShrink: 0 }} />}
                      {letter === "A" && (
                        <button onClick={() => setFormationView("module-a")}
                          style={{ width: 64, height: 64, borderRadius: "50%", background: TEAL, color: "white", border: "none",
                            fontSize: 20, fontWeight: 700, cursor: "pointer", flexShrink: 0 }}>
                          A
                        </button>
                      )}
                      {["B", "C", "D"].includes(letter) && (
                        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#EDEFEC", color: "#A6ACA3", border: "1px dashed #C9CFC9",
                          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700, flexShrink: 0 }}>
                          {letter}
                        </div>
                      )}
                      {letter === "E" && (
                        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#EDEFEC", border: "1px dashed #C9CFC9",
                          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, filter: "blur(3.5px)", userSelect: "none" }}>
                          <span style={{ fontSize: 20, fontWeight: 700, color: "#A6ACA3" }}>E</span>
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "center", gap: 40, marginTop: 10 }}>
                  <span style={{ fontSize: 12, color: TEAL, fontWeight: 500, width: 64, textAlign: "center" }}>disponible</span>
                  <span style={{ fontSize: 12, color: "#A6ACA3", width: 64, textAlign: "center" }}>à venir</span>
                  <span style={{ fontSize: 12, color: "#A6ACA3", width: 64, textAlign: "center" }}>à venir</span>
                  <span style={{ fontSize: 12, color: "#A6ACA3", width: 64, textAlign: "center" }}>à venir</span>
                  <span style={{ fontSize: 12, color: "#A6ACA3", width: 64, textAlign: "center" }}>?</span>
                </div>
              </div>
              <div style={{ background: "white", borderRadius: 14, border: "1px solid #E3E6E2", padding: 24 }}>
                <p style={{ fontSize: 11, color: TEAL, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Module complémentaire — optionnel</p>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: NAVY, marginBottom: 6 }}>Test de personnalité IPIP-HEXACO</h3>
                <p style={{ fontSize: 13.5, color: "#565C66", marginBottom: 14, lineHeight: 1.5 }}>
                  60 questions, structure alignée sur le référentiel « Work Styles » d'O*NET. Ça complète le DISC et le MBTI sur une dimension qu'ils ne couvrent pas directement : l'honnêteté-humilité.
                </p>
                {myProfileRecord && myProfileRecord.hexaco && (
                  <p style={{ fontSize: 12.5, color: TEAL, fontWeight: 500, marginBottom: 10 }}>Déjà complété.</p>
                )}
                <button onClick={() => { setHexacoAnswers({}); setHexacoPage(0); setFormationView("hexaco-intro"); }}
                  style={{ padding: "10px 18px", borderRadius: 10, border: "1px solid " + TEAL, background: "white", color: TEAL, fontSize: 13.5, fontWeight: 500, cursor: "pointer" }}>
                  {myProfileRecord && myProfileRecord.hexaco ? "Refaire le test" : "Découvrir ce module"}
                </button>
              </div>
              </>
            )}
            {formationView === "module-a" && (
              <div style={{ background: "white", borderRadius: 14, border: "1px solid #E3E6E2", padding: 24 }}>
                <button onClick={() => setFormationView("path")} style={{ background: "none", border: "none", color: "#9098A3", fontSize: 13, cursor: "pointer", marginBottom: 14, padding: 0 }}>&larr; Retour au parcours</button>
                <p style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5, color: TEAL, fontWeight: 600, marginBottom: 6 }}>Module A</p>
                <h2 style={{ fontSize: 20, fontWeight: 600, color: NAVY, margin: "0 0 6px" }}>Se connaître pour mieux se comprendre</h2>
                <p style={{ fontSize: 14, color: "#565C66", marginBottom: 22, lineHeight: 1.6 }}>Trois chapitres, à faire dans l'ordre.</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <button onClick={() => setFormationView("devoir1-intro")}
                    style={{ textAlign: "left", border: "1px solid #E3E6E2", borderRadius: 12, padding: 16, cursor: "pointer", background: "white", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 4px" }}>Chapitre 1{myProfileRecord && myProfileRecord.synthesis ? " — terminé" : ""}</p>
                      <p style={{ fontSize: 14.5, fontWeight: 500, color: NAVY, margin: 0 }}>Mieux se connaître pour mieux performer dans un cadre professionnel</p>
                    </div>
                    <ArrowRight size={18} color="#9098A3" />
                  </button>
                  <button onClick={() => setFormationView("ch2-intro")}
                    style={{ textAlign: "left", border: "1px solid #E3E6E2", borderRadius: 12, padding: 16, cursor: "pointer", background: "white", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 4px" }}>Chapitre 2{myProfileRecord && myProfileRecord.chapter2 ? " — terminé" : ""}</p>
                      <p style={{ fontSize: 14.5, fontWeight: 500, color: NAVY, margin: 0 }}>Mieux se connaître pour mieux travailler ensemble</p>
                    </div>
                    <ArrowRight size={18} color="#9098A3" />
                  </button>
                  <button onClick={() => setFormationView("ch3-intro")}
                    style={{ textAlign: "left", border: "1px solid #E3E6E2", borderRadius: 12, padding: 16, cursor: "pointer", background: "white", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 4px" }}>Chapitre 3</p>
                      <p style={{ fontSize: 14.5, fontWeight: 500, color: NAVY, margin: 0 }}>Étude de cas — l'équipe au miroir</p>
                    </div>
                    <ArrowRight size={18} color="#9098A3" />
                  </button>
                </div>
              </div>
            )}
            {formationView === "devoir1-intro" && (
              <div style={{ background: "white", borderRadius: 14, border: "1px solid #E3E6E2", padding: 24 }}>
                <button onClick={() => setFormationView("module-a")} style={{ background: "none", border: "none", color: "#9098A3", fontSize: 13, cursor: "pointer", marginBottom: 14, padding: 0 }}>&larr; Retour aux chapitres</button>
                <p style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5, color: TEAL, fontWeight: 600, marginBottom: 6 }}>Chapitre 1</p>
                <h2 style={{ fontSize: 20, fontWeight: 600, color: NAVY, margin: "0 0 14px" }}>Devoir 1 : Mieux se connaître</h2>
                <p style={{ fontSize: 14, color: "#565C66", marginBottom: 10, lineHeight: 1.6 }}>
                  Tu vas faire un petit quiz de 40 mises en situation (gestion d'équipe). Ce n'est pas un examen : c'est là pour t'aider à mieux comprendre tes limites selon ton profil DISC et ton type MBTI. Ensuite, tu colles le résultat de ton test, et je t'en fais une synthèse. Enfin, quelques questions ouvertes sur ta vision de Nova Heritage.
                </p>
                <p style={{ fontSize: 15, fontWeight: 600, color: NAVY, marginTop: 18, marginBottom: 14 }}>Tu es prêt ?</p>
                <button onClick={() => setFormationView("quiz")} style={{ padding: "12px 22px", borderRadius: 10, border: "none", background: NAVY, color: "white", fontSize: 14.5, fontWeight: 500, cursor: "pointer" }}>
                  Je suis prêt
                </button>
              </div>
            )}
            {formationView === "quiz" && (
              <div style={{ background: "white", borderRadius: 14, border: "1px solid #E3E6E2", padding: 24 }}>
                <p style={{ fontSize: 12, color: "#9098A3", marginBottom: 6 }}>Question {quizIndex + 1} / {ALL_QUIZ.length}</p>
                <p style={{ fontSize: 11, color: TEAL, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 14 }}>
                  {ALL_QUIZ[quizIndex].kind === "disc" ? "Volet DISC" : "Volet MBTI"}
                </p>
                <h3 style={{ fontSize: 17, fontWeight: 600, color: NAVY, marginBottom: 18, lineHeight: 1.5 }}>{ALL_QUIZ[quizIndex].q}</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {(ALL_QUIZ[quizIndex].kind === "disc" ? ALL_QUIZ[quizIndex].options : ALL_QUIZ[quizIndex].options.map((o) => o[0])).map((opt, i) => (
                    <button key={i}
                      onClick={() => {
                        const next = [...quizAnswers]; next[quizIndex] = i; setQuizAnswers(next);
                        if (quizIndex < ALL_QUIZ.length - 1) setQuizIndex(quizIndex + 1);
                        else setFormationView("paste-result");
                      }}
                      style={{ textAlign: "left", padding: "12px 14px", borderRadius: 10, cursor: "pointer", fontSize: 14,
                        border: quizAnswers[quizIndex] === i ? "2px solid " + TEAL : "1px solid #E3E6E2",
                        background: quizAnswers[quizIndex] === i ? "#E1F5EE" : "white", color: "#33383F" }}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {formationView === "paste-result" && (
              <div style={{ background: "white", borderRadius: 14, border: "1px solid #E3E6E2", padding: 28 }}>
                <h3 style={{ fontSize: 19, fontWeight: 600, color: NAVY, marginBottom: 8 }}>Une dernière chose</h3>
                <p style={{ fontSize: 14, color: "#565C66", marginBottom: 24, lineHeight: 1.6 }}>
                  Si tu as déjà fait ces tests, colle le résultat ci-dessous. Sinon, fais-le maintenant — ça ne prend que quelques minutes.
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>DISC</p>
                    <textarea value={pastedDisc} onChange={(e) => setPastedDisc(e.target.value)} rows={7}
                      placeholder="Colle ici le résultat de ton test DISC..."
                      style={{ width: "100%", padding: 12, borderRadius: 10, border: "1px solid #D9DEE7", fontSize: 13, fontFamily: "inherit", resize: "vertical", marginBottom: 10 }} />
                    <a href="https://mesformations-business.com/test-disc-personnalite-couleur-gratuit/" target="_blank" rel="noopener noreferrer"
                      style={{ display: "inline-block", padding: "9px 16px", borderRadius: 8, border: "1px solid #D9DEE7", fontSize: 13, color: NAVY, textDecoration: "none", fontWeight: 500 }}>
                      Faire le test DISC &rarr;
                    </a>
                  </div>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 600, color: "#3C3489", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>MBTI</p>
                    <textarea value={pastedMbti} onChange={(e) => setPastedMbti(e.target.value)} rows={7}
                      placeholder="Colle ici le résultat de ton test MBTI..."
                      style={{ width: "100%", padding: 12, borderRadius: 10, border: "1px solid #D9DEE7", fontSize: 13, fontFamily: "inherit", resize: "vertical", marginBottom: 10 }} />
                    <a href="https://www.16personalities.com/fr/test-de-personnalite" target="_blank" rel="noopener noreferrer"
                      style={{ display: "inline-block", padding: "9px 16px", borderRadius: 8, border: "1px solid #D9DEE7", fontSize: 13, color: NAVY, textDecoration: "none", fontWeight: 500 }}>
                      Faire le test MBTI &rarr;
                    </a>
                  </div>
                </div>
                {synthesisError && <p style={{ fontSize: 13, color: "#A32D2D", marginTop: 16 }}>{synthesisError}</p>}
                <button disabled={synthesizing} onClick={runSynthesis}
                  style={{ marginTop: 22, padding: "12px 22px", borderRadius: 10, border: "none", background: NAVY, color: "white", fontSize: 14.5, fontWeight: 500, cursor: "pointer" }}>
                  {synthesizing ? "Analyse en cours..." : "Analyser mon profil"}
                </button>
              </div>
            )}
            {formationView === "synthesis" && synthesis && (
              <div style={{ background: "white", borderRadius: 14, border: "1px solid #E3E6E2", padding: 28 }}>
                <p style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5, color: TEAL, fontWeight: 600, marginBottom: 18 }}>Ta synthèse</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                  <div style={{ background: "#E1F5EE", borderRadius: 12, padding: 18 }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: "#085041", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 }}>Forces</p>
                    {(synthesis.forces || []).map((f, i) => (
                      <p key={i} style={{ fontSize: 13.5, color: "#04342C", lineHeight: 1.55, margin: i === 0 ? 0 : "10px 0 0" }}>{f}</p>
                    ))}
                  </div>
                  <div style={{ background: "#FBEAE9", borderRadius: 12, padding: 18 }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: "#A32D2D", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 }}>Zones de vigilance</p>
                    {(synthesis.vigilance || []).map((f, i) => (
                      <p key={i} style={{ fontSize: 13.5, color: "#501313", lineHeight: 1.55, margin: i === 0 ? 0 : "10px 0 0" }}>{f}</p>
                    ))}
                  </div>
                </div>
                <div style={{ background: NAVY, borderRadius: 12, padding: 20, marginBottom: 22 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: MINT, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Conseil</p>
                  <p style={{ fontSize: 14.5, color: "white", lineHeight: 1.7, margin: 0 }}>{synthesis.conseil}</p>
                </div>
                <p style={{ fontSize: 12.5, color: "#2E8B6E", fontWeight: 500, marginBottom: 18 }}>✓ Enregistrée dans ton profil.</p>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button onClick={() => setFormationView("summary")} style={{ padding: "12px 22px", borderRadius: 10, border: "none", background: TEAL, color: "white", fontSize: 14.5, fontWeight: 500, cursor: "pointer" }}>
                    Terminer le chapitre 1
                  </button>
                  <button onClick={() => { setTrainingScenario(null); setTrainingAnswer(""); setTrainingCorrection(null); setTrainingError(""); setFormationView("training"); }}
                    style={{ padding: "12px 22px", borderRadius: 10, border: "1px solid " + NAVY, background: "white", color: NAVY, fontSize: 14.5, fontWeight: 500, cursor: "pointer" }}>
                    S'entraîner
                  </button>
                </div>
              </div>
            )}
            {formationView === "training" && (
              <div style={{ background: "white", borderRadius: 14, border: "1px solid #E3E6E2", padding: 28 }}>
                <button onClick={() => setFormationView("synthesis")} style={{ background: "none", border: "none", color: "#9098A3", fontSize: 13, cursor: "pointer", marginBottom: 14, padding: 0 }}>&larr; Retour à ma synthèse</button>
                <p style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5, color: TEAL, fontWeight: 600, marginBottom: 6 }}>S'entraîner</p>
                <p style={{ fontSize: 13.5, color: "#565C66", marginBottom: 20, lineHeight: 1.6 }}>
                  Une situation générée à partir de ton profil et de la documentation, avec un profil en face de toi. Rédige l'action que tu mettrais en place, puis fais-toi corriger.
                </p>
                {!trainingScenario && !trainingGenerating && (
                  <button onClick={runTrainingScenario} style={{ padding: "12px 22px", borderRadius: 10, border: "none", background: NAVY, color: "white", fontSize: 14.5, fontWeight: 500, cursor: "pointer" }}>
                    Générer une situation
                  </button>
                )}
                {trainingGenerating && <p style={{ fontSize: 13.5, color: "#9098A3" }}>Génération en cours...</p>}
                {trainingError && <p style={{ fontSize: 13, color: "#A32D2D", marginBottom: 14 }}>{trainingError}</p>}
                {trainingScenario && (
                  <div>
                    <div style={{ background: "#F5F8F6", borderRadius: 12, padding: 18, marginBottom: 16 }}>
                      <p style={{ fontSize: 11, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 8px" }}>
                        Profil en face de toi : {trainingScenario.facing_profile}
                      </p>
                      <p style={{ fontSize: 14, color: "#33383F", lineHeight: 1.65, margin: 0, whiteSpace: "pre-wrap" }}>{trainingScenario.situation}</p>
                    </div>
                    <p style={{ fontSize: 13, fontWeight: 500, color: "#33383F", marginBottom: 8 }}>Quelle action mets-tu en place, compte tenu de ce profil ?</p>
                    <textarea rows={4} value={trainingAnswer} onChange={(e) => setTrainingAnswer(e.target.value)}
                      placeholder="Ton action..."
                      style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #D9DEE7", fontSize: 13.5, fontFamily: "inherit", resize: "vertical", boxSizing: "border-box", marginBottom: 14 }} />
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      <button disabled={trainingCorrecting || !trainingAnswer.trim()} onClick={runTrainingCorrection}
                        style={{ padding: "10px 18px", borderRadius: 10, border: "none", background: trainingAnswer.trim() ? TEAL : "#C9CFC9", color: "white", fontSize: 13.5, fontWeight: 500, cursor: trainingAnswer.trim() ? "pointer" : "not-allowed" }}>
                        {trainingCorrecting ? "Correction en cours..." : "Corriger ma réponse"}
                      </button>
                      <button disabled={trainingGenerating} onClick={runTrainingScenario}
                        style={{ padding: "10px 18px", borderRadius: 10, border: "1px solid #D9DEE7", background: "white", fontSize: 13.5, cursor: "pointer" }}>
                        Nouvelle situation
                      </button>
                    </div>
                    {trainingCorrection && (
                      <div style={{ marginTop: 18 }}>
                        <div style={{ background: "#F5F8F6", borderRadius: 10, padding: 14, marginBottom: 10, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
                          <p style={{ fontSize: 13, color: "#33383F", lineHeight: 1.6, margin: 0 }}>{trainingCorrection.feedback}</p>
                          <span style={{ fontSize: 13, fontWeight: 700, color: TEAL, flexShrink: 0 }}>{trainingCorrection.score}/10</span>
                        </div>
                        {trainingCorrection.model_action && (
                          <div style={{ background: NAVY, borderRadius: 10, padding: 14 }}>
                            <p style={{ fontSize: 11, fontWeight: 600, color: MINT, textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 6px" }}>Une action possible</p>
                            <p style={{ fontSize: 13, color: "white", lineHeight: 1.6, margin: 0 }}>{trainingCorrection.model_action}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            {formationView === "summary" && (
              <div style={{ background: "white", borderRadius: 14, border: "1px solid #E3E6E2", padding: 28 }}>
                <h3 style={{ fontSize: 19, fontWeight: 600, color: NAVY, marginBottom: 10 }}>Merci {name} !</h3>
                <p style={{ fontSize: 14, color: "#565C66", lineHeight: 1.6, marginBottom: 22 }}>
                  Devoir 1 terminé. <span style={{ fontStyle: "italic" }}>(On va en discuter ensemble mercredi avec toute l'équipe.)</span>
                </p>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button onClick={() => setFormationView("module-a")} style={{ padding: "10px 18px", borderRadius: 10, border: "1px solid #D9DEE7", background: "white", fontSize: 13.5, cursor: "pointer" }}>
                    Retour aux chapitres
                  </button>
                  <button onClick={() => setFormationView("ch2-intro")} style={{ padding: "10px 18px", borderRadius: 10, border: "none", background: TEAL, color: "white", fontSize: 13.5, fontWeight: 500, cursor: "pointer" }}>
                    Passer au chapitre 2
                  </button>
                </div>
              </div>
            )}
            {formationView === "ch2-intro" && (
              <div style={{ background: "white", borderRadius: 14, border: "1px solid #E3E6E2", padding: 24 }}>
                <button onClick={() => setFormationView("module-a")} style={{ background: "none", border: "none", color: "#9098A3", fontSize: 13, cursor: "pointer", marginBottom: 14, padding: 0 }}>&larr; Retour aux chapitres</button>
                <p style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5, color: TEAL, fontWeight: 600, marginBottom: 6 }}>Chapitre 2</p>
                <h2 style={{ fontSize: 20, fontWeight: 600, color: NAVY, margin: "0 0 14px" }}>Mieux se connaître pour mieux travailler ensemble</h2>
                <p style={{ fontSize: 14, color: "#565C66", marginBottom: 14, lineHeight: 1.6 }}>
                  Au chapitre 1, tu as découvert ton propre profil. Ici, on regarde comment ce profil rencontre ceux du reste de l'équipe — à partir des mêmes 3 situations vécues chez Nova Heritage.
                </p>
                <button onClick={() => setFormationView("ch2-situations")} style={{ padding: "12px 22px", borderRadius: 10, border: "none", background: NAVY, color: "white", fontSize: 14.5, fontWeight: 500, cursor: "pointer" }}>
                  Je suis prêt
                </button>
              </div>
            )}
            {formationView === "ch2-situations" && (
              <div style={{ background: "white", borderRadius: 14, border: "1px solid #E3E6E2", padding: 24 }}>
                <button onClick={() => setFormationView("module-a")} style={{ background: "none", border: "none", color: "#9098A3", fontSize: 13, cursor: "pointer", marginBottom: 14, padding: 0 }}>&larr; Retour aux chapitres</button>
                <p style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5, color: TEAL, fontWeight: 600, marginBottom: 6 }}>Chapitre 2 — les 3 situations</p>
                <p style={{ fontSize: 13.5, color: "#565C66", marginBottom: 18, lineHeight: 1.6 }}>Voici les 3 situations vécues chez Nova Heritage.</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {TRAINING_SITUATIONS.map((s, i) => (
                    <div key={i} style={{ border: "1px solid #E3E6E2", borderRadius: 12, padding: 16 }}>
                      <p style={{ fontSize: 11, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 8px" }}>Situation {i + 1}</p>
                      <p style={{ fontSize: 13.5, color: "#33383F", lineHeight: 1.6, margin: 0 }}>{s}</p>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 22 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: NAVY, marginBottom: 6 }}>Le devoir</p>
                  <p style={{ fontSize: 13.5, color: "#565C66", marginBottom: 14, lineHeight: 1.6 }}>
                    Sur base des situations qu'on a vues, fais le reporting de la réunion dans le style que ton coéquipier comprendra le mieux. Choisis d'abord pour qui tu écris.
                  </p>
                  {visibleProfiles.filter((p) => p.name !== name).length === 0 && (
                    <p style={{ fontSize: 13.5, color: "#9098A3", marginBottom: 14 }}>Personne d'autre n'est encore dans ton équipe — tu pourras revenir compléter cette section plus tard.</p>
                  )}
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
                    {visibleProfiles.filter((p) => p.name !== name).map((p) => (
                      <button key={p.name} onClick={() => setCh2ReportTarget(p.name)}
                        style={{ padding: "8px 14px", borderRadius: 10, cursor: "pointer", fontSize: 13,
                          border: ch2ReportTarget === p.name ? "2px solid " + TEAL : "1px solid #E3E6E2",
                          background: ch2ReportTarget === p.name ? "#E1F5EE" : "white", color: "#33383F" }}>
                        {p.name}
                      </button>
                    ))}
                  </div>
                  <textarea value={ch2ReportText} onChange={(e) => setCh2ReportText(e.target.value)} rows={6}
                    placeholder={ch2ReportTarget ? `Le reporting, dans le style que ${ch2ReportTarget} comprendra le mieux...` : "Choisis d'abord un coéquipier, puis rédige ton reporting ici..."}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #D9DEE7", fontSize: 13.5, fontFamily: "inherit", resize: "vertical", boxSizing: "border-box" }} />
                </div>
                <div style={{ marginTop: 20 }}>
                  <p style={{ fontSize: 13, fontWeight: 500, color: "#33383F", marginBottom: 10 }}>Quel format te fait vraiment lire un compte-rendu, toi ?</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {CH2_FORMAT_OPTIONS.map((opt) => (
                      <button key={opt} onClick={() => setCh2Format(opt)}
                        style={{ textAlign: "left", padding: "10px 14px", borderRadius: 10, cursor: "pointer", fontSize: 13.5,
                          border: ch2Format === opt ? "2px solid " + TEAL : "1px solid #E3E6E2",
                          background: ch2Format === opt ? "#E1F5EE" : "white", color: "#33383F" }}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
                <button disabled={!ch2Format || !ch2ReportTarget || !ch2ReportText.trim()} onClick={() => setFormationView("ch2-teammates")}
                  style={{ marginTop: 20, padding: "12px 22px", borderRadius: 10, border: "none",
                    background: (ch2Format && ch2ReportTarget && ch2ReportText.trim()) ? TEAL : "#C9CFC9", color: "white", fontSize: 14.5, fontWeight: 500,
                    cursor: (ch2Format && ch2ReportTarget && ch2ReportText.trim()) ? "pointer" : "not-allowed" }}>
                  Continuer
                </button>
              </div>
            )}
            {formationView === "ch2-teammates" && (
              <div style={{ background: "white", borderRadius: 14, border: "1px solid #E3E6E2", padding: 24 }}>
                <button onClick={() => setFormationView("module-a")} style={{ background: "none", border: "none", color: "#9098A3", fontSize: 13, cursor: "pointer", marginBottom: 14, padding: 0 }}>&larr; Retour aux chapitres</button>
                <p style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5, color: TEAL, fontWeight: 600, marginBottom: 6 }}>Chapitre 2 — face à chaque coéquipier</p>
                <p style={{ fontSize: 13.5, color: "#565C66", marginBottom: 18, lineHeight: 1.6 }}>
                  Pour chaque personne de l'équipe, la dynamique déjà repérée entre vos profils, et une question : qui joue le garde-fou, qui joue le moteur ?
                </p>
                {visibleProfiles.filter((p) => p.name !== name).length === 0 && (
                  <p style={{ fontSize: 13.5, color: "#9098A3", marginBottom: 18 }}>Personne d'autre n'est encore dans ton équipe — tu pourras revenir compléter cette section plus tard.</p>
                )}
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {visibleProfiles.filter((p) => p.name !== name).map((p) => (
                    <div key={p.name} style={{ border: "1px solid #E3E6E2", borderRadius: 12, padding: 14 }}>
                      <p style={{ fontSize: 14, fontWeight: 600, color: NAVY, margin: "0 0 6px" }}>{p.name}</p>
                      <p style={{ fontSize: 12.5, color: "#565C66", lineHeight: 1.5, margin: "0 0 10px" }}>{discFriction(disc, p.disc)}</p>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {CH2_ROLE_OPTIONS.map((opt) => (
                          <button key={opt} onClick={() => setCh2TeammateAnswers({ ...ch2TeammateAnswers, [p.name]: opt })}
                            style={{ padding: "8px 12px", borderRadius: 8, cursor: "pointer", fontSize: 12.5,
                              border: ch2TeammateAnswers[p.name] === opt ? "2px solid " + TEAL : "1px solid #E3E6E2",
                              background: ch2TeammateAnswers[p.name] === opt ? "#E1F5EE" : "white", color: "#33383F" }}>
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 20 }}>
                  <p style={{ fontSize: 13, fontWeight: 500, color: "#33383F", marginBottom: 8 }}>Dans l'équipe, qui joue déjà le rôle de lien entre les pôles — bon communicant, ou empathique qui désamorce les tensions ?</p>
                  <textarea value={ch2Connector} onChange={(e) => setCh2Connector(e.target.value)} rows={2}
                    placeholder="Ta réponse..."
                    style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #D9DEE7", fontSize: 13.5, fontFamily: "inherit", resize: "vertical", boxSizing: "border-box" }} />
                </div>
                {ch2Error && <p style={{ fontSize: 13, color: "#A32D2D", marginTop: 16 }}>{ch2Error}</p>}
                <button disabled={ch2Synthesizing} onClick={runCh2Synthesis}
                  style={{ marginTop: 20, padding: "12px 22px", borderRadius: 10, border: "none", background: NAVY, color: "white", fontSize: 14.5, fontWeight: 500, cursor: "pointer" }}>
                  {ch2Synthesizing ? "Analyse en cours..." : "Analyser ma collaboration"}
                </button>
              </div>
            )}
            {formationView === "ch2-synthesis" && ch2Synthesis && (
              <div style={{ background: "white", borderRadius: 14, border: "1px solid #E3E6E2", padding: 28 }}>
                <p style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5, color: TEAL, fontWeight: 600, marginBottom: 18 }}>Ta synthèse — travailler avec les autres</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                  <div style={{ background: "#E1F5EE", borderRadius: 12, padding: 18 }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: "#085041", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 }}>Forces</p>
                    {(ch2Synthesis.forces || []).map((f, i) => (
                      <p key={i} style={{ fontSize: 13.5, color: "#04342C", lineHeight: 1.55, margin: i === 0 ? 0 : "10px 0 0" }}>{f}</p>
                    ))}
                  </div>
                  <div style={{ background: "#FBEAE9", borderRadius: 12, padding: 18 }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: "#A32D2D", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 }}>Zones de vigilance</p>
                    {(ch2Synthesis.vigilance || []).map((f, i) => (
                      <p key={i} style={{ fontSize: 13.5, color: "#501313", lineHeight: 1.55, margin: i === 0 ? 0 : "10px 0 0" }}>{f}</p>
                    ))}
                  </div>
                </div>
                <div style={{ background: NAVY, borderRadius: 12, padding: 20, marginBottom: 22 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: MINT, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Conseil</p>
                  <p style={{ fontSize: 14.5, color: "white", lineHeight: 1.7, margin: 0 }}>{ch2Synthesis.conseil}</p>
                </div>
                <div style={{ marginBottom: 22 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: 0.5, margin: 0 }}>Ton reporting, corrigé</p>
                    <button disabled={ch2Correcting} onClick={runCh2Correction} style={{ fontSize: 12.5, color: ch2Correcting ? "#9098A3" : TEAL, background: "none", border: "none", cursor: ch2Correcting ? "not-allowed" : "pointer", fontWeight: 500 }}>
                      {ch2Correcting ? "Correction..." : ch2Correction ? "Corriger à nouveau" : "Corriger mes réponses"}
                    </button>
                  </div>
                  {ch2CorrectionError && <p style={{ fontSize: 12.5, color: "#A32D2D", margin: "0 0 10px" }}>{ch2CorrectionError}</p>}
                  {ch2Correction && (
                    <div style={{ background: "#F5F8F6", borderRadius: 10, padding: 14, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
                      <p style={{ fontSize: 13, color: "#33383F", lineHeight: 1.6, margin: 0 }}>{ch2Correction.feedback}</p>
                      <span style={{ fontSize: 13, fontWeight: 700, color: TEAL, flexShrink: 0 }}>{ch2Correction.score}/10</span>
                    </div>
                  )}
                </div>
                <button disabled={ch2Saving} onClick={saveDevoir2} style={{ padding: "12px 22px", borderRadius: 10, border: "none", background: TEAL, color: "white", fontSize: 14.5, fontWeight: 500, cursor: "pointer" }}>
                  {ch2Saving ? "Enregistrement..." : "Terminer le chapitre 2"}
                </button>
              </div>
            )}
            {formationView === "ch2-summary" && (
              <div style={{ background: "white", borderRadius: 14, border: "1px solid #E3E6E2", padding: 28 }}>
                <h3 style={{ fontSize: 19, fontWeight: 600, color: NAVY, marginBottom: 10 }}>Merci {name} !</h3>
                <p style={{ fontSize: 14, color: "#565C66", lineHeight: 1.6, marginBottom: 22 }}>
                  Chapitre 2 terminé. Tes réponses viendront nourrir l'étude de cas du chapitre 3, construite à partir de ce que toute l'équipe aura répondu.
                </p>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button onClick={() => setFormationView("module-a")} style={{ padding: "10px 18px", borderRadius: 10, border: "1px solid #D9DEE7", background: "white", fontSize: 13.5, cursor: "pointer" }}>
                    Retour aux chapitres
                  </button>
                  <button onClick={() => setFormationView("ch3-intro")} style={{ padding: "10px 18px", borderRadius: 10, border: "none", background: TEAL, color: "white", fontSize: 13.5, fontWeight: 500, cursor: "pointer" }}>
                    Voir le chapitre 3
                  </button>
                </div>
              </div>
            )}
            {formationView === "ch3-intro" && (
              <div style={{ background: "white", borderRadius: 14, border: "1px solid #E3E6E2", padding: 24 }}>
                <button onClick={() => setFormationView("module-a")} style={{ background: "none", border: "none", color: "#9098A3", fontSize: 13, cursor: "pointer", marginBottom: 14, padding: 0 }}>&larr; Retour aux chapitres</button>
                <p style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5, color: TEAL, fontWeight: 600, marginBottom: 6 }}>Chapitre 3</p>
                <h2 style={{ fontSize: 20, fontWeight: 600, color: NAVY, margin: "0 0 14px" }}>Étude de cas — l'équipe au miroir</h2>
                <p style={{ fontSize: 14, color: "#565C66", marginBottom: 10, lineHeight: 1.6 }}>
                  Cette étude de cas n'est pas écrite à l'avance : elle est générée à partir des réponses réellement données par l'équipe aux chapitres 1 et 2 — profils, frictions repérées, formats de reporting, rôles de garde-fou et de lien entre les pôles.
                </p>
                <p style={{ fontSize: 13, color: "#9098A3", marginBottom: 18, lineHeight: 1.6 }}>
                  {ch3Eligible.length} personne(s) de ton équipe visible ont au moins une donnée exploitable pour l'instant. Plus il y a de devoirs complétés, plus l'étude de cas sera fine.
                </p>
                {ch3Error && <p style={{ fontSize: 13, color: "#A32D2D", marginBottom: 14 }}>{ch3Error}</p>}
                <button disabled={ch3Generating || ch3Eligible.length === 0} onClick={runCaseStudy}
                  style={{ padding: "12px 22px", borderRadius: 10, border: "none", background: ch3Eligible.length === 0 ? "#C9CFC9" : NAVY, color: "white", fontSize: 14.5, fontWeight: 500, cursor: ch3Eligible.length === 0 ? "not-allowed" : "pointer" }}>
                  {ch3Generating ? "Génération en cours..." : "Générer l'étude de cas"}
                </button>
              </div>
            )}
            {formationView === "ch3-result" && ch3CaseStudy && (
              <div style={{ background: "white", borderRadius: 14, border: "1px solid #E3E6E2", padding: 28 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                  <p style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5, color: TEAL, fontWeight: 600, margin: 0 }}>Chapitre 3 — étude de cas</p>
                  <button disabled={ch3Generating} onClick={runCaseStudy} style={{ fontSize: 12.5, color: TEAL, background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}>
                    {ch3Generating ? "Régénération..." : "Régénérer"}
                  </button>
                </div>
                <div style={{ background: "#F5F8F6", borderRadius: 12, padding: 22, whiteSpace: "pre-wrap", fontSize: 14, color: "#33383F", lineHeight: 1.7, marginBottom: 20 }}>
                  {ch3CaseStudy.case_study}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                  {(ch3CaseStudy.questions || []).map((q, i) => {
                    const pq = ch3Correction && ch3Correction.perQuestion && ch3Correction.perQuestion[i];
                    return (
                      <div key={i} style={{ border: "1px solid #E3E6E2", borderRadius: 12, padding: 16 }}>
                        <p style={{ fontSize: 11, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 8px" }}>Question {i + 1}</p>
                        <p style={{ fontSize: 14, color: "#33383F", lineHeight: 1.55, margin: "0 0 12px" }}>{q}</p>
                        <textarea rows={3} value={ch3Answers[i] || ""}
                          onChange={(e) => setCh3Answers((prev) => ({ ...prev, [i]: e.target.value }))}
                          onPaste={() => setCh3PasteFlags((prev) => ({ ...prev, [i]: true }))}
                          placeholder="Réponse de l'équipe..."
                          style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #D9DEE7", fontSize: 13.5, fontFamily: "inherit", resize: "vertical", boxSizing: "border-box" }} />
                        {ch3PasteFlags[i] && (
                          <p style={{ fontSize: 11.5, color: "#A32D2D", margin: "6px 0 0" }}>⚠ Texte collé détecté — possible réponse préparée avec une IA plutôt qu'écrite en direct.</p>
                        )}
                        {pq && (
                          <div style={{ marginTop: 12, background: "#F5F8F6", borderRadius: 10, padding: 12 }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                              <p style={{ fontSize: 11, fontWeight: 600, color: NAVY, textTransform: "uppercase", letterSpacing: 0.5, margin: 0 }}>Correction</p>
                              {pq.score != null && <span style={{ fontSize: 12, fontWeight: 700, color: TEAL }}>{pq.score}/10</span>}
                            </div>
                            <p style={{ fontSize: 12.5, color: "#33383F", lineHeight: 1.55, margin: 0 }}>{pq.feedback}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div style={{ marginTop: 20 }}>
                  {ch3CorrectionError && <p style={{ fontSize: 13, color: "#A32D2D", marginBottom: 10 }}>{ch3CorrectionError}</p>}
                  <button disabled={ch3Correcting} onClick={runCh3Correction}
                    style={{ padding: "12px 22px", borderRadius: 10, border: "none", background: NAVY, color: "white", fontSize: 14.5, fontWeight: 500, cursor: ch3Correcting ? "not-allowed" : "pointer" }}>
                    {ch3Correcting ? "Correction en cours..." : ch3Correction ? "Corriger à nouveau" : "Corriger mes réponses"}
                  </button>
                </div>
                {ch3Correction && (
                  <div style={{ marginTop: 20 }}>
                    <div style={{ background: NAVY, borderRadius: 12, padding: 20, marginBottom: 18, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <p style={{ fontSize: 14, color: "white", margin: 0, fontWeight: 500 }}>Score global de l'analyse</p>
                      <p style={{ fontSize: 24, color: MINT, margin: 0, fontWeight: 700 }}>{ch3Correction.overallScore}/10</p>
                    </div>
                    <p style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>Pour aller plus loin</p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                      <div>
                        <p style={{ fontSize: 12, fontWeight: 600, color: "#565C66", marginBottom: 8 }}>Vidéos à regarder</p>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          {(ch3Correction.youtubeQueries || []).map((q, i) => (
                            <a key={i} href={`https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`} target="_blank" rel="noopener noreferrer"
                              style={{ display: "block", border: "1px solid #E3E6E2", borderRadius: 10, padding: 10, textDecoration: "none" }}>
                              <p style={{ fontSize: 12.5, fontWeight: 500, color: "#1F6FEB", margin: 0 }}>Chercher sur YouTube : "{q}"</p>
                            </a>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p style={{ fontSize: 12, fontWeight: 600, color: "#565C66", marginBottom: 8 }}>Documentation à lire</p>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          {MODULE_A_CH2_SOURCES.map((s, i) => (
                            <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
                              style={{ display: "block", border: "1px solid #E3E6E2", borderRadius: 10, padding: 10, textDecoration: "none" }}>
                              <p style={{ fontSize: 12.5, fontWeight: 600, color: "#1F6FEB", margin: "0 0 2px", lineHeight: 1.4 }}>{s.t}</p>
                              <p style={{ fontSize: 11, color: "#9098A3", margin: 0 }}>{s.a}</p>
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <button onClick={() => setFormationView("module-a")} style={{ marginTop: 20, padding: "10px 18px", borderRadius: 10, border: "1px solid #D9DEE7", background: "white", fontSize: 13.5, cursor: "pointer" }}>
                  Retour aux chapitres
                </button>
              </div>
            )}
            {formationView === "hexaco-intro" && (
              <div style={{ background: "white", borderRadius: 14, border: "1px solid #E3E6E2", padding: 24 }}>
                <button onClick={() => setFormationView("path")} style={{ background: "none", border: "none", color: "#9098A3", fontSize: 13, cursor: "pointer", marginBottom: 14, padding: 0 }}>&larr; Retour au parcours</button>
                <p style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5, color: TEAL, fontWeight: 600, marginBottom: 6 }}>Module complémentaire — optionnel</p>
                <h2 style={{ fontSize: 20, fontWeight: 600, color: NAVY, margin: "0 0 14px" }}>Test de personnalité IPIP-HEXACO</h2>
                <p style={{ fontSize: 14, color: "#565C66", marginBottom: 10, lineHeight: 1.6 }}>
                  Un questionnaire de 60 affirmations (6 dimensions, 10 par dimension), construit à partir d'items publics de l'International Personality Item Pool (IPIP). Ça vient compléter le DISC et le MBTI sur une dimension qu'ils ne couvrent pas directement : l'honnêteté-humilité. Ce n'est pas un examen, il n'y a pas de bonne ou de mauvaise réponse.
                </p>
                <p style={{ fontSize: 13, color: "#9098A3", marginBottom: 18, lineHeight: 1.6 }}>
                  Environ 8-10 minutes. Ce module est facultatif — tu peux le faire maintenant, plus tard, ou pas du tout, ça ne bloque rien d'autre.
                </p>
                <button onClick={() => setFormationView("hexaco-quiz")} style={{ padding: "12px 22px", borderRadius: 10, border: "none", background: NAVY, color: "white", fontSize: 14.5, fontWeight: 500, cursor: "pointer" }}>
                  Commencer
                </button>
              </div>
            )}
            {formationView === "hexaco-quiz" && (
              <div style={{ background: "white", borderRadius: 14, border: "1px solid #E3E6E2", padding: 24 }}>
                <p style={{ fontSize: 12, color: "#9098A3", marginBottom: 6 }}>Page {hexacoPage + 1} / {HEXACO_DOMAINS.length}</p>
                <p style={{ fontSize: 11, color: TEAL, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>
                  {HEXACO_DOMAINS[hexacoPage].label}
                </p>
                <h3 style={{ fontSize: 14.5, fontWeight: 500, color: "#565C66", marginBottom: 22, lineHeight: 1.5 }}>{HEXACO_DOMAINS[hexacoPage].short}</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  {hexacoPageItems.map((item) => (
                    <div key={item.id}>
                      <p style={{ fontSize: 14, color: "#33383F", marginBottom: 10, lineHeight: 1.5 }}>{item.text}</p>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {HEXACO_LIKERT.map((opt) => (
                          <button key={opt.v}
                            onClick={() => setHexacoAnswers({ ...hexacoAnswers, [item.id]: opt.v })}
                            style={{ padding: "8px 12px", borderRadius: 8, cursor: "pointer", fontSize: 12.5,
                              border: hexacoAnswers[item.id] === opt.v ? "2px solid " + TEAL : "1px solid #E3E6E2",
                              background: hexacoAnswers[item.id] === opt.v ? "#E1F5EE" : "white", color: "#33383F" }}>
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 26 }}>
                  <button disabled={hexacoPage === 0} onClick={() => setHexacoPage(hexacoPage - 1)}
                    style={{ padding: "10px 18px", borderRadius: 10, border: "1px solid #D9DEE7", background: "white", fontSize: 13.5,
                      cursor: hexacoPage === 0 ? "not-allowed" : "pointer", opacity: hexacoPage === 0 ? 0.5 : 1 }}>
                    &larr; Précédent
                  </button>
                  <button disabled={!hexacoPageComplete || hexacoSaving}
                    onClick={() => {
                      if (hexacoPage < HEXACO_DOMAINS.length - 1) setHexacoPage(hexacoPage + 1);
                      else saveHexaco();
                    }}
                    style={{ padding: "10px 18px", borderRadius: 10, border: "none", fontSize: 13.5, fontWeight: 500,
                      background: hexacoPageComplete ? TEAL : "#C9CFC9", color: "white", cursor: hexacoPageComplete ? "pointer" : "not-allowed" }}>
                    {hexacoPage < HEXACO_DOMAINS.length - 1 ? "Suivant →" : (hexacoSaving ? "Enregistrement..." : "Terminer")}
                  </button>
                </div>
                {hexacoError && (
                  <p style={{ fontSize: 13, color: "#A32D2D", marginTop: 14, lineHeight: 1.5 }}>{hexacoError}</p>
                )}
              </div>
            )}
            {formationView === "hexaco-results" && hexacoResults && (
              <div style={{ background: "white", borderRadius: 14, border: "1px solid #E3E6E2", padding: 28 }}>
                <p style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5, color: TEAL, fontWeight: 600, marginBottom: 4 }}>Tes résultats IPIP-HEXACO</p>
                <p style={{ fontSize: 12.5, color: "#2E8B6E", fontWeight: 500, marginBottom: 18 }}>✓ Résultats enregistrés dans ton profil — ils resteront visibles si tu reviens plus tard ou si tu te reconnectes avec ton nom.</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {HEXACO_DOMAINS.map((d) => {
                    const score = hexacoResults[d.code];
                    const pct = score != null ? ((score - 1) / 4) * 100 : 0;
                    return (
                      <div key={d.code}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                          <span style={{ fontSize: 13.5, fontWeight: 600, color: NAVY }}>{d.label}</span>
                          <span style={{ fontSize: 13, color: "#565C66" }}>{score != null ? score.toFixed(1) : "-"} / 5</span>
                        </div>
                        <p style={{ fontSize: 12, color: "#9098A3", margin: "0 0 6px" }}>{d.short}</p>
                        <div style={{ width: "100%", height: 8, borderRadius: 4, background: "#EDEFEC" }}>
                          <div style={{ width: pct + "%", height: 8, borderRadius: 4, background: TEAL }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ marginTop: 22, padding: 14, borderRadius: 10, background: "#F5F8F6", border: "1px solid #E3E6E2" }}>
                  <p style={{ fontSize: 12.5, fontWeight: 600, color: NAVY, margin: "0 0 6px" }}>Concrètement, à quoi ça sert ?</p>
                  <p style={{ fontSize: 12.5, color: "#565C66", lineHeight: 1.6, margin: 0 }}>
                    Ces scores nourrissent ta synthèse IA (forces / points de vigilance / conseil) en plus du DISC et du MBTI — clique sur "Régénérer ma synthèse" ci-dessous pour qu'elle en tienne compte. Ils servent aussi de repère pour la gestion d'équipe : l'Honnêteté-Humilité, absente du DISC et du MBTI, éclaire le rapport à la mise en avant de soi et à l'intégrité — un indice utile, entre autres, avant de déléguer une responsabilité sensible (budget, relation client) sans supervision rapprochée. Émotivité et Conscienciosité aident à anticiper le stress sous pression et le besoin de cadre. Ce sont des indices à croiser avec l'observation réelle, pas un verdict.
                  </p>
                </div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 18 }}>
                  <button onClick={() => setFormationView("path")} style={{ padding: "10px 18px", borderRadius: 10, border: "1px solid #D9DEE7", background: "white", fontSize: 13.5, cursor: "pointer" }}>
                    Retour au parcours
                  </button>
                  <button onClick={() => setActiveTab("team")} style={{ padding: "10px 18px", borderRadius: 10, border: "none", background: TEAL, color: "white", fontSize: 13.5, fontWeight: 500, cursor: "pointer" }}>
                    Voir mon équipe
                  </button>
                  <button disabled={synthesizing} onClick={runSynthesis} style={{ padding: "10px 18px", borderRadius: 10, border: "none", background: NAVY, color: "white", fontSize: 13.5, fontWeight: 500, cursor: synthesizing ? "not-allowed" : "pointer", opacity: synthesizing ? 0.7 : 1 }}>
                    {synthesizing ? "Régénération..." : "Régénérer ma synthèse avec ces résultats"}
                  </button>
                </div>
                {synthesisError && (
                  <p style={{ fontSize: 12.5, color: "#A32D2D", marginTop: 10 }}>{synthesisError}</p>
                )}
              </div>
            )}
          </div>
        )}
        {activeTab === "team" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ background: "white", borderRadius: 14, border: "1px solid #E3E6E2", padding: 24 }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 4 }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: NAVY, margin: 0 }}>Mon équipe</h3>
                {role !== "Employé" && !resetConfirm && (
                  <button onClick={() => setResetConfirm(true)} style={{ background: "none", border: "none", color: "#A6ACA3", fontSize: 12, cursor: "pointer", padding: 0 }}>
                    Réinitialiser {role === "CEO" ? "tous les profils" : "l'équipe"}
                  </button>
                )}
                {role !== "Employé" && resetConfirm && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 12, color: "#A32D2D" }}>Retirer les {visibleProfiles.length} profil(s) visible(s) ici ?</span>
                    <button disabled={resetting} onClick={resetTeam} style={{ fontSize: 12, fontWeight: 600, color: "white", background: "#A32D2D", border: "none", borderRadius: 6, padding: "5px 10px", cursor: "pointer" }}>
                      {resetting ? "..." : "Confirmer"}
                    </button>
                    <button onClick={() => setResetConfirm(false)} style={{ fontSize: 12, color: "#9098A3", background: "none", border: "none", cursor: "pointer" }}>Annuler</button>
                  </div>
                )}
              </div>
              <p style={{ fontSize: 12, color: "#9098A3", marginBottom: 16 }}>
                {role === "CEO" && "Fonction : CEO — tous les profils de l'entreprise sont visibles ici."}
                {role === "Manager" && `Fonction : Manager — profils visibles : équipe "${equipe}".`}
                {role === "Employé" && "Fonction : Employé — seul ton propre profil est visible ici. Ton manager et le CEO voient les profils de l'équipe."}
              </p>
              <p style={{ fontSize: 13.5, color: "#565C66", marginBottom: 20 }}>
                {role === "Employé" ? "Ton profil, comme il apparaît dans l'équipe." : "Clique sur un membre pour voir en détail son profil."}
              </p>
              {orbitData.length === 0 && <p style={{ fontSize: 14, color: "#9098A3" }}>Personne d'autre n'a encore rejoint ce périmètre.</p>}
              {orbitData.length > 0 && (
                <div style={{ position: "relative", width: "100%", height: 420, margin: "0 auto", maxWidth: 420 }}>
                  <style>{`
                    @keyframes nh-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                    @keyframes nh-spin-rev { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
                  `}</style>
                  <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 46, height: 46, borderRadius: "50%", background: NAVY, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, zIndex: 2 }}>
                    Équipe
                  </div>
                  {orbitData.map((m) => (
                    <div key={m.name + m.addedAt}
                      style={{ position: "absolute", top: "50%", left: "50%", width: m.radius * 2, height: m.radius * 2, marginLeft: -m.radius, marginTop: -m.radius,
                        animation: `nh-spin ${m.duration}s linear infinite`, animationDelay: `-${(m.startAngle / 360) * m.duration}s` }}>
                      <button onClick={() => { setSelectedMember(m); setDeleteConfirm(false); }}
                        style={{ position: "absolute", top: 0, left: "50%", transform: "translate(-50%,-50%)",
                          animation: `nh-spin-rev ${m.duration}s linear infinite`, animationDelay: `-${(m.startAngle / 360) * m.duration}s`,
                          width: 46, height: 46, borderRadius: "50%", background: m.dInfo.color, border: selectedMember && selectedMember.name === m.name ? "3px solid " + NAVY : "2px solid white",
                          color: "white", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {m.name.slice(0, 2).toUpperCase()}
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {selectedMember && (
                <div style={{ marginTop: 16, padding: 16, borderRadius: 12, border: "1px solid #E3E6E2", background: "#FAFBFA", position: "relative" }}>
                  <button onClick={() => { setSelectedMember(null); setDeleteConfirm(false); }} style={{ position: "absolute", top: 10, right: 10, background: "none", border: "none", cursor: "pointer", color: "#9098A3" }}><X size={16} /></button>
                  <p style={{ fontWeight: 600, color: NAVY, fontSize: 15, margin: "0 0 8px" }}>{selectedMember.name}</p>
                  <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, padding: "3px 9px", borderRadius: 6, color: "white", background: selectedMember.dInfo.color }}>{selectedMember.disc}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, padding: "3px 9px", borderRadius: 6, color: "#3C3489", background: "#EEEDFE" }}>{selectedMember.mbti}</span>
                  </div>
                  {selectedMember.hexaco && selectedMember.hexaco.scores && (
                    <div style={{ marginBottom: 12, padding: 10, borderRadius: 10, background: "white", border: "1px solid #E3E6E2" }}>
                      <p style={{ fontSize: 11, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 8px" }}>IPIP-HEXACO</p>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {HEXACO_DOMAINS.map((d) => {
                          const score = selectedMember.hexaco.scores[d.code];
                          const pct = score != null ? ((score - 1) / 4) * 100 : 0;
                          return (
                            <div key={d.code} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <span style={{ fontSize: 11, color: "#565C66", width: 130, flexShrink: 0 }}>{d.label}</span>
                              <div style={{ flex: 1, height: 6, borderRadius: 3, background: "#EDEFEC" }}>
                                <div style={{ width: pct + "%", height: 6, borderRadius: 3, background: TEAL }} />
                              </div>
                              <span style={{ fontSize: 11, color: "#9098A3", width: 24, textAlign: "right", flexShrink: 0 }}>{score != null ? score.toFixed(1) : "-"}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: selectedMember.synthesis ? 8 : 0 }}>
                      <p style={{ fontSize: 11, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: 0.5, margin: 0 }}>Synthèse du profil</p>
                      <button disabled={memberSynthesizing} onClick={() => runMemberSynthesis(selectedMember)}
                        style={{ fontSize: 11.5, color: memberSynthesizing ? "#9098A3" : TEAL, background: "none", border: "none", cursor: memberSynthesizing ? "not-allowed" : "pointer", padding: 0, fontWeight: 500 }}>
                        {memberSynthesizing ? "Génération..." : selectedMember.synthesis ? "Régénérer" : "Générer une synthèse"}
                      </button>
                    </div>
                    {memberSynthesisError && (
                      <p style={{ fontSize: 12, color: "#A32D2D", margin: "6px 0 0" }}>{memberSynthesisError}</p>
                    )}
                    {selectedMember.synthesis && (
                      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>
                        <div style={{ background: "#E1F5EE", borderRadius: 10, padding: 12 }}>
                          <p style={{ fontSize: 10.5, fontWeight: 600, color: "#085041", textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 6px" }}>Forces</p>
                          {(selectedMember.synthesis.forces || []).map((f, i) => (
                            <p key={i} style={{ fontSize: 12.5, color: "#04342C", lineHeight: 1.5, margin: i === 0 ? 0 : "6px 0 0" }}>{f}</p>
                          ))}
                        </div>
                        <div style={{ background: "#FBEAE9", borderRadius: 10, padding: 12 }}>
                          <p style={{ fontSize: 10.5, fontWeight: 600, color: "#A32D2D", textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 6px" }}>Zones de vigilance</p>
                          {(selectedMember.synthesis.vigilance || []).map((f, i) => (
                            <p key={i} style={{ fontSize: 12.5, color: "#501313", lineHeight: 1.5, margin: i === 0 ? 0 : "6px 0 0" }}>{f}</p>
                          ))}
                        </div>
                        <div style={{ background: NAVY, borderRadius: 10, padding: 12 }}>
                          <p style={{ fontSize: 10.5, fontWeight: 600, color: MINT, textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 6px" }}>Conseil</p>
                          <p style={{ fontSize: 12.5, color: "white", lineHeight: 1.6, margin: 0 }}>{selectedMember.synthesis.conseil}</p>
                        </div>
                      </div>
                    )}
                    {!selectedMember.synthesis && !memberSynthesizing && (
                      <p style={{ fontSize: 12.5, color: "#9098A3", margin: "6px 0 0" }}>Pas encore de synthèse pour {selectedMember.name}.</p>
                    )}
                  </div>
                  {role !== "Employé" && (
                    <div style={{ marginBottom: 12 }}>
                      <p style={{ fontSize: 11, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 8px" }}>Objectifs</p>
                      {(selectedMember.goals || []).length === 0 && (
                        <p style={{ fontSize: 12.5, color: "#9098A3", margin: "0 0 8px" }}>Aucun objectif fixé pour le moment.</p>
                      )}
                      {(selectedMember.goals || []).length > 0 && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
                          {(selectedMember.goals || []).slice().sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0)).map((g) => {
                            const statusStyle = g.status === "évaluée"
                              ? { bg: "#E1F5EE", color: "#085041" }
                              : g.status === "faite"
                              ? { bg: "#FFF3D6", color: "#8A6100" }
                              : { bg: "#EDEFEC", color: "#565C66" };
                            return (
                              <div key={g.id} style={{ padding: 10, borderRadius: 10, background: "white", border: "1px solid #E3E6E2" }}>
                                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                                  <div style={{ flex: 1 }}>
                                    <p style={{ fontSize: 13, color: "#33383F", margin: "0 0 4px" }}>{g.text}</p>
                                    {g.deadline && <p style={{ fontSize: 11, color: "#9098A3", margin: 0 }}>Échéance : {g.deadline}</p>}
                                  </div>
                                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
                                    <select value={g.status} onChange={(e) => setGoalStatus(selectedMember, g.id, e.target.value)}
                                      style={{ fontSize: 10.5, fontWeight: 600, padding: "3px 6px", borderRadius: 6, border: "none", cursor: "pointer", background: statusStyle.bg, color: statusStyle.color, textTransform: "uppercase", letterSpacing: 0.3 }}>
                                      {GOAL_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                    <button onClick={() => deleteGoal(selectedMember, g.id)} style={{ fontSize: 10.5, color: "#A32D2D", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                                      Retirer
                                    </button>
                                  </div>
                                </div>
                                {g.status === "évaluée" && (
                                  <div style={{ marginTop: 8 }}>
                                    <textarea rows={2} value={evalDrafts[g.id] !== undefined ? evalDrafts[g.id] : (g.evaluation || "")}
                                      onChange={(e) => setEvalDrafts((prev) => ({ ...prev, [g.id]: e.target.value }))}
                                      placeholder="Évaluation de cette tâche"
                                      style={{ width: "100%", padding: "6px 8px", borderRadius: 6, border: "1px solid #D9DEE7", fontSize: 12, fontFamily: "inherit", resize: "vertical", boxSizing: "border-box" }} />
                                    <button onClick={() => saveGoalEvaluation(selectedMember, g.id, evalDrafts[g.id] !== undefined ? evalDrafts[g.id] : (g.evaluation || ""))}
                                      style={{ marginTop: 4, fontSize: 11, fontWeight: 500, padding: "4px 10px", borderRadius: 6, border: "none", background: NAVY, color: "white", cursor: "pointer" }}>
                                      Enregistrer l'évaluation
                                    </button>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 4 }}>
                        <input value={goalInput} onChange={(e) => setGoalInput(e.target.value)}
                          onKeyDown={(e) => { if (e.key === "Enter" && goalInput.trim()) addGoal(selectedMember); }}
                          placeholder={`Nouvel objectif pour ${selectedMember.name}`}
                          style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid #D9DEE7", fontSize: 12.5, fontFamily: "inherit" }} />
                        <div style={{ display: "flex", gap: 6 }}>
                          <input type="date" value={goalDeadlineInput} onChange={(e) => setGoalDeadlineInput(e.target.value)}
                            style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid #D9DEE7", fontSize: 12.5, flex: 1, fontFamily: "inherit" }} />
                          <button disabled={savingGoal || !goalInput.trim()} onClick={() => addGoal(selectedMember)}
                            style={{ padding: "8px 14px", borderRadius: 8, border: "none", background: !goalInput.trim() ? "#C7CBD1" : NAVY, color: "white", fontSize: 12.5, fontWeight: 500, cursor: !goalInput.trim() ? "not-allowed" : "pointer", whiteSpace: "nowrap" }}>
                            {savingGoal ? "..." : "Ajouter"}
                          </button>
                        </div>
                        {goalError && <p style={{ fontSize: 11.5, color: "#A32D2D", margin: 0 }}>{goalError}</p>}
                      </div>
                    </div>
                  )}
                  {role !== "Employé" && (
                    <div style={{ marginBottom: 12, paddingTop: 12, borderTop: "1px solid #E3E6E2" }}>
                      <p style={{ fontSize: 11, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 8px" }}>Évaluation trimestrielle</p>
                      <textarea rows={3} value={quarterlyDraft} onChange={(e) => setQuarterlyDraft(e.target.value)}
                        placeholder={`Évaluation trimestrielle de ${selectedMember.name}`}
                        style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid #D9DEE7", fontSize: 12.5, fontFamily: "inherit", resize: "vertical", boxSizing: "border-box" }} />
                      <button onClick={() => saveQuarterlyEvaluation(selectedMember, quarterlyDraft)}
                        style={{ marginTop: 6, fontSize: 12, fontWeight: 500, padding: "6px 12px", borderRadius: 7, border: "none", background: NAVY, color: "white", cursor: "pointer" }}>
                        Enregistrer l'évaluation trimestrielle
                      </button>
                    </div>
                  )}
                  {visibleProfiles.filter((p) => p.name !== selectedMember.name).map((p, i) => (
                    <p key={i} style={{ fontSize: 13, color: "#565C66", margin: "4px 0" }}>
                      <span style={{ fontWeight: 500, color: "#33383F" }}>Avec {p.name} :</span> {discFriction(selectedMember.disc, p.disc)}
                    </p>
                  ))}
                  <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid #E3E6E2" }}>
                    {!deleteConfirm && (
                      <button onClick={() => setDeleteConfirm(true)} style={{ fontSize: 12, color: "#A32D2D", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                        Supprimer ce profil
                      </button>
                    )}
                    {deleteConfirm && (
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 12, color: "#A32D2D" }}>Supprimer le profil de {selectedMember.name} ?</span>
                        <button onClick={() => deleteProfile(selectedMember._key)} style={{ fontSize: 12, fontWeight: 600, color: "white", background: "#A32D2D", border: "none", borderRadius: 6, padding: "5px 10px", cursor: "pointer" }}>
                          Confirmer
                        </button>
                        <button onClick={() => setDeleteConfirm(false)} style={{ fontSize: 12, color: "#9098A3", background: "none", border: "none", cursor: "pointer" }}>Annuler</button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            {orbitData.length > 1 && (
              <div style={{ background: "white", borderRadius: 14, border: "1px solid #E3E6E2", padding: 24 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: NAVY, margin: 0 }}>Forces et faiblesses de l'équipe</h3>
                  <button disabled={teamSynthesizing} onClick={runTeamSynthesis}
                    style={{ fontSize: 12.5, fontWeight: 500, color: teamSynthesizing ? "#9098A3" : TEAL, background: "none", border: "none", cursor: teamSynthesizing ? "not-allowed" : "pointer" }}>
                    {teamSynthesizing ? "Génération..." : teamSynthesis ? "Régénérer" : "Générer"}
                  </button>
                </div>
                <p style={{ fontSize: 13, color: "#565C66", marginBottom: 16 }}>Basé sur les profils DISC{visibleProfiles.some((p) => p.mbti) ? " et MBTI" : ""} de {orbitData.length} personnes visibles ici.</p>
                {teamSynthesisError && <p style={{ fontSize: 13, color: "#A32D2D", marginBottom: 12 }}>{teamSynthesisError}</p>}
                {!teamSynthesis && !teamSynthesizing && (
                  <p style={{ fontSize: 13.5, color: "#9098A3" }}>Pas encore générée.</p>
                )}
                {teamSynthesis && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div style={{ background: "#E1F5EE", borderRadius: 12, padding: 18 }}>
                      <p style={{ fontSize: 12, fontWeight: 600, color: "#085041", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 }}>Forces de l'équipe</p>
                      {(teamSynthesis.forces || []).map((f, i) => (
                        <p key={i} style={{ fontSize: 13.5, color: "#04342C", lineHeight: 1.55, margin: i === 0 ? 0 : "10px 0 0" }}>{f}</p>
                      ))}
                    </div>
                    <div style={{ background: "#FBEAE9", borderRadius: 12, padding: 18 }}>
                      <p style={{ fontSize: 12, fontWeight: 600, color: "#A32D2D", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 }}>Faiblesses de l'équipe</p>
                      {(teamSynthesis.faiblesses || []).map((f, i) => (
                        <p key={i} style={{ fontSize: 13.5, color: "#501313", lineHeight: 1.55, margin: i === 0 ? 0 : "10px 0 0" }}>{f}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        {activeTab === "management" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ background: "white", borderRadius: 14, border: "1px solid #E3E6E2", padding: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: NAVY, margin: "0 0 20px" }}>Gestion des équipes</h3>
              {visibleProfiles.length === 0 && <p style={{ fontSize: 14, color: "#9098A3" }}>Personne n'a encore rejoint ce périmètre.</p>}
              {!selectedMgmtMember && visibleProfiles.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {visibleProfiles.map((m) => {
                    const mDInfo = DISC_OPTIONS.find((d) => d.code === m.disc) || DISC_OPTIONS[0];
                    return (
                      <button key={m.name} onClick={() => { setSelectedMgmtMember(m); setMgmtSubTab("distribute"); }}
                        style={{ textAlign: "left", border: "1px solid #E3E6E2", borderRadius: 12, padding: 14, cursor: "pointer", background: "white", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <p style={{ fontWeight: 600, color: NAVY, fontSize: 14.5, margin: 0 }}>{m.name}</p>
                          <span style={{ fontSize: 10.5, fontWeight: 600, padding: "2px 7px", borderRadius: 6, color: "white", background: mDInfo.color }}>{m.disc}</span>
                          <span style={{ fontSize: 10.5, fontWeight: 600, padding: "2px 7px", borderRadius: 6, color: "#3C3489", background: "#EEEDFE" }}>{m.mbti}</span>
                        </div>
                        <ArrowRight size={16} color="#9098A3" />
                      </button>
                    );
                  })}
                </div>
              )}
              {selectedMgmtMember && (() => {
                const m = visibleProfiles.find((p) => p.name === selectedMgmtMember.name) || selectedMgmtMember;
                const mDInfo = DISC_OPTIONS.find((d) => d.code === m.disc) || DISC_OPTIONS[0];
                const mQuarterly = quarterlyDrafts[m.name] !== undefined ? quarterlyDrafts[m.name] : ((m.quarterlyEvaluation && m.quarterlyEvaluation.text) || "");
                const canDistribute = role === "Manager" || role === "CEO";
                const canEvaluate = role === "Manager";
                return (
                  <div>
                    <button onClick={() => setSelectedMgmtMember(null)} style={{ background: "none", border: "none", color: "#9098A3", fontSize: 13, cursor: "pointer", marginBottom: 14, padding: 0 }}>&larr; Retour aux noms</button>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
                      <p style={{ fontWeight: 600, color: NAVY, fontSize: 17, margin: 0 }}>{m.name}</p>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 6, color: "white", background: mDInfo.color }}>{m.disc}</span>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 6, color: "#3C3489", background: "#EEEDFE" }}>{m.mbti}</span>
                    </div>
                    <div style={{ display: "flex", gap: 8, marginBottom: 20, background: "#F5F8F6", padding: 5, borderRadius: 10, width: "fit-content" }}>
                      <button onClick={() => setMgmtSubTab("distribute")}
                        style={{ padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500,
                          background: mgmtSubTab === "distribute" ? NAVY : "transparent", color: mgmtSubTab === "distribute" ? "white" : "#565C66" }}>
                        Distribuer une tâche
                      </button>
                      <button onClick={() => setMgmtSubTab("evaluate")}
                        style={{ padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500,
                          background: mgmtSubTab === "evaluate" ? NAVY : "transparent", color: mgmtSubTab === "evaluate" ? "white" : "#565C66" }}>
                        Donner une évaluation
                      </button>
                    </div>
                    {mgmtSubTab === "distribute" && (
                      <div>
                        {canDistribute && (
                          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 20 }}>
                            <input value={goalDraftText[m.name] || ""} onChange={(e) => setGoalDraftText((prev) => ({ ...prev, [m.name]: e.target.value }))}
                              onKeyDown={(e) => { if (e.key === "Enter" && (goalDraftText[m.name] || "").trim()) addGoalFor(m); }}
                              placeholder={`Nouvel objectif pour ${m.name}`}
                              style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid #D9DEE7", fontSize: 13.5, fontFamily: "inherit" }} />
                            <div style={{ display: "flex", gap: 6 }}>
                              <input type="date" value={goalDraftDeadline[m.name] || ""} onChange={(e) => setGoalDraftDeadline((prev) => ({ ...prev, [m.name]: e.target.value }))}
                                style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid #D9DEE7", fontSize: 13.5, flex: 1, fontFamily: "inherit" }} />
                              <button disabled={goalDraftSaving[m.name] || !(goalDraftText[m.name] || "").trim()} onClick={() => addGoalFor(m)}
                                style={{ padding: "10px 16px", borderRadius: 8, border: "none", background: !(goalDraftText[m.name] || "").trim() ? "#C7CBD1" : TEAL, color: "white", fontSize: 13.5, fontWeight: 500, cursor: !(goalDraftText[m.name] || "").trim() ? "not-allowed" : "pointer", whiteSpace: "nowrap" }}>
                                {goalDraftSaving[m.name] ? "..." : "Distribuer"}
                              </button>
                            </div>
                            {goalDraftError[m.name] && <p style={{ fontSize: 11.5, color: "#A32D2D", margin: 0 }}>{goalDraftError[m.name]}</p>}
                          </div>
                        )}
                        <p style={{ fontSize: 11, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 10px" }}>Tâches déjà distribuées</p>
                        {(m.goals || []).length === 0 && <p style={{ fontSize: 12.5, color: "#9098A3", margin: 0 }}>Aucune tâche distribuée pour le moment.</p>}
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          {(m.goals || []).slice().sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0)).map((g) => {
                            const statusStyle = g.status === "évaluée" ? { bg: "#E1F5EE", color: "#085041" } : g.status === "faite" ? { bg: "#FFF3D6", color: "#8A6100" } : { bg: "#EDEFEC", color: "#565C66" };
                            return (
                              <div key={g.id} style={{ padding: 10, borderRadius: 10, background: "#FAFBFA", border: "1px solid #E3E6E2", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                                <div style={{ flex: 1 }}>
                                  <p style={{ fontSize: 13, color: "#33383F", margin: "0 0 4px" }}>{g.text}</p>
                                  {g.deadline && <p style={{ fontSize: 11, color: "#9098A3", margin: 0 }}>Échéance : {g.deadline}</p>}
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
                                  <span style={{ fontSize: 10.5, fontWeight: 600, padding: "3px 6px", borderRadius: 6, background: statusStyle.bg, color: statusStyle.color, textTransform: "uppercase", letterSpacing: 0.3 }}>{g.status}</span>
                                  {canDistribute && (
                                    <button onClick={() => deleteGoal(m, g.id)} style={{ fontSize: 10.5, color: "#A32D2D", background: "none", border: "none", cursor: "pointer", padding: 0 }}>Retirer</button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    {mgmtSubTab === "evaluate" && (
                      <div>
                        <p style={{ fontSize: 11, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 10px" }}>Objectifs</p>
                        {(m.goals || []).length === 0 && <p style={{ fontSize: 12.5, color: "#9098A3", margin: "0 0 16px" }}>Aucun objectif à évaluer pour le moment.</p>}
                        {(m.goals || []).length > 0 && (
                          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                            {(m.goals || []).slice().sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0)).map((g) => {
                              const statusStyle = g.status === "évaluée" ? { bg: "#E1F5EE", color: "#085041" } : g.status === "faite" ? { bg: "#FFF3D6", color: "#8A6100" } : { bg: "#EDEFEC", color: "#565C66" };
                              return (
                                <div key={g.id} style={{ padding: 10, borderRadius: 10, background: "#FAFBFA", border: "1px solid #E3E6E2" }}>
                                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                                    <div style={{ flex: 1 }}>
                                      <p style={{ fontSize: 13, color: "#33383F", margin: "0 0 4px" }}>{g.text}</p>
                                      {g.deadline && <p style={{ fontSize: 11, color: "#9098A3", margin: 0 }}>Échéance : {g.deadline}</p>}
                                    </div>
                                    {canEvaluate ? (
                                      <select value={g.status} onChange={(e) => setGoalStatus(m, g.id, e.target.value)}
                                        style={{ fontSize: 10.5, fontWeight: 600, padding: "3px 6px", borderRadius: 6, border: "none", cursor: "pointer", background: statusStyle.bg, color: statusStyle.color, textTransform: "uppercase", letterSpacing: 0.3, flexShrink: 0 }}>
                                        {GOAL_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                                      </select>
                                    ) : (
                                      <span style={{ fontSize: 10.5, fontWeight: 600, padding: "3px 6px", borderRadius: 6, background: statusStyle.bg, color: statusStyle.color, textTransform: "uppercase", letterSpacing: 0.3, flexShrink: 0 }}>{g.status}</span>
                                    )}
                                  </div>
                                  {g.status === "évaluée" && canEvaluate && (
                                    <div style={{ marginTop: 8 }}>
                                      <textarea rows={2} value={evalDrafts[g.id] !== undefined ? evalDrafts[g.id] : (g.evaluation || "")}
                                        onChange={(e) => setEvalDrafts((prev) => ({ ...prev, [g.id]: e.target.value }))}
                                        placeholder="Évaluation de cette tâche"
                                        style={{ width: "100%", padding: "6px 8px", borderRadius: 6, border: "1px solid #D9DEE7", fontSize: 12, fontFamily: "inherit", resize: "vertical", boxSizing: "border-box" }} />
                                      <button onClick={() => saveGoalEvaluation(m, g.id, evalDrafts[g.id] !== undefined ? evalDrafts[g.id] : (g.evaluation || ""))}
                                        style={{ marginTop: 4, fontSize: 11, fontWeight: 500, padding: "4px 10px", borderRadius: 6, border: "none", background: NAVY, color: "white", cursor: "pointer" }}>
                                        Enregistrer l'évaluation
                                      </button>
                                    </div>
                                  )}
                                  {g.status === "évaluée" && !canEvaluate && g.evaluation && (
                                    <p style={{ fontSize: 12, color: "#565C66", lineHeight: 1.5, margin: "8px 0 0" }}>{g.evaluation}</p>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                        <div style={{ paddingTop: 16, borderTop: "1px solid #E3E6E2" }}>
                          <p style={{ fontSize: 11, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 8px" }}>Évaluation trimestrielle</p>
                          {canEvaluate ? (
                            <>
                              <textarea rows={3} value={mQuarterly} onChange={(e) => setQuarterlyDrafts((prev) => ({ ...prev, [m.name]: e.target.value }))}
                                placeholder={`Évaluation trimestrielle de ${m.name}`}
                                style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid #D9DEE7", fontSize: 12.5, fontFamily: "inherit", resize: "vertical", boxSizing: "border-box" }} />
                              <button onClick={() => saveQuarterlyEvaluation(m, mQuarterly)}
                                style={{ marginTop: 6, fontSize: 12, fontWeight: 500, padding: "6px 12px", borderRadius: 7, border: "none", background: NAVY, color: "white", cursor: "pointer" }}>
                                Enregistrer l'évaluation trimestrielle
                              </button>
                            </>
                          ) : m.quarterlyEvaluation && m.quarterlyEvaluation.text ? (
                            <p style={{ fontSize: 12.5, color: "#565C66", lineHeight: 1.55, margin: 0 }}>{m.quarterlyEvaluation.text}</p>
                          ) : (
                            <p style={{ fontSize: 12.5, color: "#9098A3", margin: 0 }}>Pas encore d'évaluation trimestrielle.</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        )}
        {activeTab === "evolution" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ background: "white", borderRadius: 14, border: "1px solid #E3E6E2", padding: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: NAVY, margin: "0 0 20px" }}>Mon évolution</h3>
              {!myProfileRecord && (
                <p style={{ fontSize: 14, color: "#9098A3" }}>Ton profil n'est pas encore enregistré.</p>
              )}
              {myProfileRecord && (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
                    <label style={{ cursor: "pointer", position: "relative" }} title="Changer ta photo de profil">
                      {myProfileRecord.photo ? (
                        <img src={myProfileRecord.photo} alt={myProfileRecord.name}
                          style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover", border: "2px solid #E3E6E2", display: "block" }} />
                      ) : (
                        <div style={{ width: 64, height: 64, borderRadius: "50%", background: (discInfo && discInfo.color) || NAVY, color: "white",
                          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 600 }}>
                          {myProfileRecord.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <input type="file" accept="image/*" style={{ display: "none" }}
                        onChange={(e) => handlePhotoUpload(myProfileRecord, e.target.files && e.target.files[0])} />
                    </label>
                    <div>
                      <p style={{ fontSize: 17, fontWeight: 600, color: NAVY, margin: "0 0 2px" }}>{myProfileRecord.name}</p>
                      <p style={{ fontSize: 12, color: "#9098A3", margin: 0 }}>Clique sur ta photo pour la changer</p>
                    </div>
                  </div>

                  <div style={{ marginBottom: 22 }}>
                    <p style={{ fontSize: 11, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 10px" }}>Tâches pas faites</p>
                    {myNotDoneGoals.length === 0 && <p style={{ fontSize: 12.5, color: "#9098A3", margin: 0 }}>Rien pour le moment.</p>}
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {myNotDoneGoals.map((g) => (
                        <div key={g.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: 10, borderRadius: 10, background: "#FAFBFA", border: "1px solid #E3E6E2" }}>
                          <div>
                            <p style={{ fontSize: 13, color: "#33383F", margin: "0 0 4px" }}>{g.text}</p>
                            {g.deadline && <p style={{ fontSize: 11, color: "#9098A3", margin: 0 }}>Échéance : {g.deadline}</p>}
                          </div>
                          <button onClick={() => markOwnGoalDone(g.id)}
                            style={{ fontSize: 11.5, fontWeight: 500, padding: "5px 10px", borderRadius: 7, border: "none", background: TEAL, color: "white", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}>
                            Marquer comme faite
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: 22 }}>
                    <p style={{ fontSize: 11, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 10px" }}>Tâches faites, non évaluées</p>
                    {myDoneUnevaluatedGoals.length === 0 && <p style={{ fontSize: 12.5, color: "#9098A3", margin: 0 }}>Rien pour le moment.</p>}
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {myDoneUnevaluatedGoals.map((g) => (
                        <div key={g.id} style={{ padding: 10, borderRadius: 10, background: "#FFF3D6", border: "1px solid #F0DFAF" }}>
                          <p style={{ fontSize: 13, color: "#4A3800", margin: "0 0 4px" }}>{g.text}</p>
                          {g.deadline && <p style={{ fontSize: 11, color: "#8A6100", margin: "0 0 4px" }}>Échéance : {g.deadline}</p>}
                          <p style={{ fontSize: 11, color: "#8A6100", margin: 0, fontStyle: "italic" }}>En attente de l'évaluation de ton manager.</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: 22 }}>
                    <p style={{ fontSize: 11, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 10px" }}>Tâches évaluées</p>
                    {myEvaluatedGoals.length === 0 && <p style={{ fontSize: 12.5, color: "#9098A3", margin: 0 }}>Rien pour le moment.</p>}
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {myEvaluatedGoals.map((g) => (
                        <div key={g.id} style={{ padding: 10, borderRadius: 10, background: "#E1F5EE", border: "1px solid #BFE6D8" }}>
                          <p style={{ fontSize: 13, fontWeight: 500, color: "#04342C", margin: "0 0 4px" }}>{g.text}</p>
                          {g.deadline && <p style={{ fontSize: 11, color: "#085041", margin: "0 0 4px" }}>Échéance : {g.deadline}</p>}
                          {g.evaluation && <p style={{ fontSize: 12.5, color: "#04342C", margin: 0, lineHeight: 1.5 }}>{g.evaluation}</p>}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ paddingTop: 16, borderTop: "1px solid #E3E6E2" }}>
                    <p style={{ fontSize: 11, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 8px" }}>Évaluation trimestrielle</p>
                    {myProfileRecord.quarterlyEvaluation && myProfileRecord.quarterlyEvaluation.text ? (
                      <div style={{ background: NAVY, borderRadius: 10, padding: 14 }}>
                        <p style={{ fontSize: 13, color: "white", lineHeight: 1.6, margin: 0 }}>{myProfileRecord.quarterlyEvaluation.text}</p>
                      </div>
                    ) : (
                      <p style={{ fontSize: 12.5, color: "#9098A3", margin: 0 }}>Pas encore d'évaluation trimestrielle.</p>
                    )}
                  </div>

                  <div style={{ paddingTop: 16, marginTop: 16, borderTop: "1px solid #E3E6E2" }}>
                    <p style={{ fontSize: 11, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 8px" }}>Avant la réunion d'évaluation</p>
                    {myProfileRecord.managerAssessment && myProfileRecord.managerAssessment.text && (
                      <div style={{ background: "#F5F8F6", borderRadius: 10, padding: 12, marginBottom: 12 }}>
                        <p style={{ fontSize: 11.5, fontWeight: 600, color: "#565C66", margin: "0 0 6px" }}>Avis de ton manager</p>
                        <p style={{ fontSize: 12.5, color: "#33383F", lineHeight: 1.55, margin: 0 }}>{myProfileRecord.managerAssessment.text}</p>
                      </div>
                    )}
                    {myProfileRecord.selfAssessment && myProfileRecord.selfAssessment.text && !showSelfAssessmentForm && (
                      <div style={{ background: "#E1F5EE", borderRadius: 10, padding: 12, marginBottom: 10 }}>
                        <p style={{ fontSize: 11.5, fontWeight: 600, color: "#085041", margin: "0 0 6px" }}>Ton avis</p>
                        <p style={{ fontSize: 12.5, color: "#04342C", lineHeight: 1.55, margin: 0 }}>{myProfileRecord.selfAssessment.text}</p>
                      </div>
                    )}
                    {!showSelfAssessmentForm && (
                      <button onClick={() => { setSelfAssessmentDraft((myProfileRecord.selfAssessment && myProfileRecord.selfAssessment.text) || ""); setShowSelfAssessmentForm(true); }}
                        style={{ padding: "9px 16px", borderRadius: 9, border: "1px solid " + TEAL, background: "white", color: TEAL, fontSize: 12.5, fontWeight: 500, cursor: "pointer" }}>
                        {myProfileRecord.selfAssessment && myProfileRecord.selfAssessment.text ? "Modifier mon avis" : "Donner mon avis sur mes résultats"}
                      </button>
                    )}
                    {showSelfAssessmentForm && (
                      <div>
                        <p style={{ fontSize: 12, color: "#9098A3", marginBottom: 8, lineHeight: 1.5 }}>Ce que tu écris ici sera visible par ton manager, pour préparer la discussion de vive voix lors de votre réunion d'évaluation.</p>
                        <textarea rows={4} value={selfAssessmentDraft} onChange={(e) => setSelfAssessmentDraft(e.target.value)}
                          placeholder="Ton avis sur tes résultats..."
                          style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid #D9DEE7", fontSize: 12.5, fontFamily: "inherit", resize: "vertical", boxSizing: "border-box" }} />
                        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                          <button disabled={savingSelfAssessment} onClick={saveSelfAssessment}
                            style={{ fontSize: 12, fontWeight: 500, padding: "6px 12px", borderRadius: 7, border: "none", background: TEAL, color: "white", cursor: "pointer" }}>
                            {savingSelfAssessment ? "Enregistrement..." : "Enregistrer mon avis"}
                          </button>
                          <button onClick={() => setShowSelfAssessmentForm(false)} style={{ fontSize: 12, color: "#9098A3", background: "none", border: "none", cursor: "pointer" }}>Annuler</button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
        {activeTab === "resources" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ background: "white", borderRadius: 14, border: "1px solid #E3E6E2", padding: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: NAVY, marginBottom: 4 }}>Articles scientifiques</h3>
              <p style={{ fontSize: 13.5, color: "#565C66", marginBottom: 18 }}>Les sources utilisées pour construire le devoir du Module A — accessibles directement, pas besoin de compte ni d'IA pour les lire.</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 20 }}>
                {["DISC", "MBTI", "HEXACO", "ÉQUIPE"].map((k) => (
                  <div key={k}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>{k}</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {SCIENTIFIC_SOURCES[k].map((s, i) => (
                        <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
                          style={{ display: "block", border: "1px solid #E3E6E2", borderRadius: 10, padding: 12, textDecoration: "none" }}>
                          <p style={{ fontSize: 13.5, fontWeight: 600, color: "#1F6FEB", margin: "0 0 4px", lineHeight: 1.4 }}>{s.t}</p>
                          <p style={{ fontSize: 12, color: "#9098A3", margin: 0 }}>{s.a}</p>
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
