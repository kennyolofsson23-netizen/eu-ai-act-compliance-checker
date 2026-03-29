import { ArticleReference } from "./types";

export const ARTICLES: ArticleReference[] = [
  {
    id: "art5",
    number: "Article 5",
    title: "Prohibited AI Practices",
    summary:
      "Lists AI practices that are absolutely prohibited in the EU, including subliminal manipulation, social scoring by public authorities, and (with exceptions) real-time remote biometric identification in public spaces.",
    url: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689#art_5",
  },
  {
    id: "art6",
    number: "Article 6",
    title: "Classification Rules for High-Risk AI Systems",
    summary:
      "Defines when an AI system must be classified as high-risk: (1) safety components of regulated products, and (2) standalone AI systems listed in Annex III.",
    url: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689#art_6",
  },
  {
    id: "art9",
    number: "Article 9",
    title: "Risk Management System",
    summary:
      "Requires providers of high-risk AI systems to establish a risk management system throughout the system's lifecycle, identifying and mitigating risks to health, safety, and fundamental rights.",
    url: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689#art_9",
  },
  {
    id: "art10",
    number: "Article 10",
    title: "Data and Data Governance",
    summary:
      "High-risk AI systems using training data must implement data governance practices ensuring data quality, representativeness, and freedom from discriminatory bias.",
    url: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689#art_10",
  },
  {
    id: "art11",
    number: "Article 11",
    title: "Technical Documentation",
    summary:
      "Providers must create and maintain comprehensive technical documentation (Annex IV) before placing a high-risk AI system on the market.",
    url: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689#art_11",
  },
  {
    id: "art12",
    number: "Article 12",
    title: "Record-Keeping",
    summary:
      "High-risk AI systems must have automatic logging capabilities enabling post-market monitoring and investigation of incidents.",
    url: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689#art_12",
  },
  {
    id: "art13",
    number: "Article 13",
    title: "Transparency and Provision of Information to Deployers",
    summary:
      "High-risk AI systems must be transparent enough for deployers to understand capabilities and limitations. Instructions for use must be provided.",
    url: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689#art_13",
  },
  {
    id: "art14",
    number: "Article 14",
    title: "Human Oversight",
    summary:
      "High-risk AI systems must enable effective human oversight, allowing individuals to monitor, understand, intervene, and override system outputs.",
    url: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689#art_14",
  },
  {
    id: "art15",
    number: "Article 15",
    title: "Accuracy, Robustness and Cybersecurity",
    summary:
      "High-risk AI systems must achieve appropriate levels of accuracy, be robust against errors, and protected against adversarial manipulation.",
    url: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689#art_15",
  },
  {
    id: "art17",
    number: "Article 17",
    title: "Quality Management System",
    summary:
      "Providers must establish a documented quality management system covering strategy, design procedures, testing, post-market monitoring, and incident reporting.",
    url: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689#art_17",
  },
  {
    id: "art43",
    number: "Article 43",
    title: "Conformity Assessment",
    summary:
      "High-risk AI systems must undergo conformity assessment before market placement — either self-assessment or third-party assessment depending on the use case.",
    url: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689#art_43",
  },
  {
    id: "art49",
    number: "Article 49",
    title: "Registration",
    summary:
      "High-risk AI systems must be registered in the EU database for high-risk AI systems before market placement or deployment.",
    url: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689#art_49",
  },
  {
    id: "art50",
    number: "Article 50",
    title: "Transparency Obligations for Certain AI Systems",
    summary:
      "Providers of chatbots, deepfake generators, and emotion recognition systems must inform users they are interacting with AI and label AI-generated content.",
    url: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689#art_50",
  },
  {
    id: "art53",
    number: "Article 53",
    title: "Obligations for GPAI Model Providers",
    summary:
      "GPAI model providers must maintain technical documentation, comply with copyright law, publish training data summaries, and cooperate with regulators.",
    url: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689#art_53",
  },
  {
    id: "art55",
    number: "Article 55",
    title: "Obligations for GPAI Models with Systemic Risk",
    summary:
      "GPAI models trained with >10^25 FLOPs must additionally perform adversarial testing, report serious incidents to the AI Office, and implement cybersecurity measures.",
    url: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689#art_55",
  },
  {
    id: "art72",
    number: "Article 72",
    title: "Post-Market Monitoring by Providers of High-Risk AI Systems",
    summary:
      "Providers must actively collect and review data on system performance in real-world use to identify risks and trigger corrective actions.",
    url: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689#art_72",
  },
  {
    id: "annex3",
    number: "Annex III",
    title: "High-Risk AI Systems",
    summary:
      "Lists the eight categories of high-risk AI applications: biometrics, critical infrastructure, education, employment, essential services, law enforcement, migration, justice.",
    url: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689#anx_III",
  },
];

export const ARTICLE_MAP = new Map(ARTICLES.map((a) => [a.id, a]));
