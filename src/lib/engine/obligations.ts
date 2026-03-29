import { Obligation, RiskLevel, UserRole } from "./types";

const HIGH_RISK_PROVIDER_OBLIGATIONS: Obligation[] = [
  {
    id: "risk-mgmt",
    title: "Risk Management System",
    article: "Article 9",
    summary:
      "Establish and maintain a risk management system throughout the AI system lifecycle.",
    practicalMeaning:
      "Document identified risks, mitigation measures, and residual risks. Review after each significant change.",
    appliesToRole: ["provider"],
    riskLevels: ["high"],
  },
  {
    id: "data-governance",
    title: "Data and Data Governance",
    article: "Article 10",
    summary:
      "Implement data governance practices for training, validation, and testing datasets.",
    practicalMeaning:
      "Audit training data for quality, bias, and representativeness. Document data sources and processing.",
    appliesToRole: ["provider"],
    riskLevels: ["high"],
  },
  {
    id: "tech-docs",
    title: "Technical Documentation",
    article: "Article 11",
    summary:
      "Create and maintain comprehensive technical documentation (Annex IV format).",
    practicalMeaning:
      "Prepare documentation covering system design, training data, performance metrics, and limitations before market placement.",
    appliesToRole: ["provider"],
    riskLevels: ["high"],
  },
  {
    id: "logging",
    title: "Automatic Logging",
    article: "Article 12",
    summary:
      "Implement automatic logging capabilities for post-market monitoring.",
    practicalMeaning:
      "Ensure the system logs inputs, outputs, and key decision steps to enable incident investigation.",
    appliesToRole: ["provider"],
    riskLevels: ["high"],
  },
  {
    id: "transparency-deployer",
    title: "Transparency to Deployers",
    article: "Article 13",
    summary:
      "Provide sufficient transparency for deployers to understand and use the system correctly.",
    practicalMeaning:
      "Supply instructions for use, capability descriptions, and limitation disclosures with the system.",
    appliesToRole: ["provider"],
    riskLevels: ["high"],
  },
  {
    id: "human-oversight",
    title: "Human Oversight Design",
    article: "Article 14",
    summary:
      "Design systems to enable effective human oversight of AI outputs.",
    practicalMeaning:
      "Implement override mechanisms, explainability features, and alerting so humans can intervene when needed.",
    appliesToRole: ["provider"],
    riskLevels: ["high"],
  },
  {
    id: "accuracy",
    title: "Accuracy, Robustness and Cybersecurity",
    article: "Article 15",
    summary:
      "Achieve appropriate accuracy levels and protect against adversarial manipulation.",
    practicalMeaning:
      "Run benchmark tests, red-team adversarial inputs, and implement security controls against model attacks.",
    appliesToRole: ["provider"],
    riskLevels: ["high"],
  },
  {
    id: "qms",
    title: "Quality Management System",
    article: "Article 17",
    summary: "Establish a documented quality management system.",
    practicalMeaning:
      "Document processes covering strategy, design, testing, post-market monitoring, and incident reporting.",
    appliesToRole: ["provider"],
    riskLevels: ["high"],
  },
  {
    id: "conformity",
    title: "Conformity Assessment",
    article: "Article 43",
    summary:
      "Undergo conformity assessment before placing the system on the market.",
    practicalMeaning:
      "Complete self-assessment or engage a notified body, then affix CE marking and issue EU declaration of conformity.",
    appliesToRole: ["provider"],
    riskLevels: ["high"],
  },
  {
    id: "registration",
    title: "EU Database Registration",
    article: "Article 49",
    summary:
      "Register the AI system in the EU database for high-risk AI systems.",
    practicalMeaning:
      "Submit required information to the EU AI database at https://ec.europa.eu/AI before market placement.",
    appliesToRole: ["provider"],
    riskLevels: ["high"],
  },
  {
    id: "post-market",
    title: "Post-Market Monitoring",
    article: "Article 72",
    summary:
      "Actively collect and review data on system performance in real-world use.",
    practicalMeaning:
      "Set up monitoring pipelines, define KPIs, and trigger corrective action when performance degrades.",
    appliesToRole: ["provider"],
    riskLevels: ["high"],
  },
];

const HIGH_RISK_DEPLOYER_OBLIGATIONS: Obligation[] = [
  {
    id: "human-oversight-deployer",
    title: "Implement Human Oversight",
    article: "Article 14",
    summary:
      "Ensure effective human oversight measures are in place when using the system.",
    practicalMeaning:
      "Assign qualified staff to monitor AI outputs, establish escalation processes, and log override decisions.",
    appliesToRole: ["deployer"],
    riskLevels: ["high"],
  },
  {
    id: "fundamental-rights-impact",
    title: "Fundamental Rights Impact Assessment",
    article: "Article 27",
    summary:
      "Conduct a fundamental rights impact assessment before deployment.",
    practicalMeaning:
      "Assess potential impacts on fundamental rights and document findings before going live.",
    appliesToRole: ["deployer"],
    riskLevels: ["high"],
  },
];

const LIMITED_RISK_OBLIGATIONS: Obligation[] = [
  {
    id: "transparency-users",
    title: "Transparency to Users",
    article: "Article 50",
    summary: "Inform users they are interacting with an AI system.",
    practicalMeaning:
      "Display a clear, prominent disclosure that the system is AI-powered. Label AI-generated content.",
    appliesToRole: ["provider", "deployer", "importer", "distributor"],
    riskLevels: ["limited"],
  },
];

const UNACCEPTABLE_OBLIGATION: Obligation = {
  id: "cease-prohibited",
  title: "Cease Prohibited Practice Immediately",
  article: "Article 5",
  summary:
    "The practice identified is prohibited under Article 5. It must be discontinued.",
  practicalMeaning:
    "Stop development, deployment, and use of this AI system immediately. Seek legal counsel regarding penalties.",
  appliesToRole: ["provider", "deployer", "importer", "distributor"],
  riskLevels: ["unacceptable"],
};

const HIGH_RISK_IMPORTER_OBLIGATIONS: Obligation[] = [
  {
    id: "importer-verify-conformity",
    title: "Verify Provider Conformity",
    article: "Article 23",
    summary:
      "Before placing a high-risk AI system on the market, verify the provider has completed the conformity assessment and prepared required documentation.",
    practicalMeaning:
      "Check CE marking, EU declaration of conformity, and technical documentation are in place before importing the system.",
    appliesToRole: ["importer"],
    riskLevels: ["high"],
  },
  {
    id: "importer-registration",
    title: "Ensure EU Database Registration",
    article: "Article 23",
    summary:
      "Verify the AI system is registered in the EU database before market placement.",
    practicalMeaning:
      "Confirm the provider has registered the system in the EU AI Act database (https://ec.europa.eu/AI).",
    appliesToRole: ["importer"],
    riskLevels: ["high"],
  },
  {
    id: "importer-storage-conditions",
    title: "Maintain Safe Storage and Transport",
    article: "Article 23",
    summary:
      "Ensure storage and transport conditions do not jeopardize the system's compliance.",
    practicalMeaning:
      "Document storage/transport procedures and verify they do not affect the system's conformity with the EU AI Act.",
    appliesToRole: ["importer"],
    riskLevels: ["high"],
  },
];

const HIGH_RISK_DISTRIBUTOR_OBLIGATIONS: Obligation[] = [
  {
    id: "distributor-verify-ce",
    title: "Verify CE Marking and Documentation",
    article: "Article 24",
    summary:
      "Before making a high-risk AI system available on the market, verify it bears the CE marking and is accompanied by required documentation.",
    practicalMeaning:
      "Check that the AI system has CE marking, EU declaration of conformity, and instructions in the correct language for the target market.",
    appliesToRole: ["distributor"],
    riskLevels: ["high"],
  },
  {
    id: "distributor-cooperate",
    title: "Cooperate with Competent Authorities",
    article: "Article 24",
    summary: "Cooperate with national competent authorities on request.",
    practicalMeaning:
      "Provide information and documentation to market surveillance authorities when requested, and keep records of complaints and non-conformities.",
    appliesToRole: ["distributor"],
    riskLevels: ["high"],
  },
];

function getHighRiskObligations(role: UserRole): Obligation[] {
  if (role === "deployer") {
    return HIGH_RISK_DEPLOYER_OBLIGATIONS;
  }
  if (role === "importer") {
    return HIGH_RISK_IMPORTER_OBLIGATIONS;
  }
  if (role === "distributor") {
    return HIGH_RISK_DISTRIBUTOR_OBLIGATIONS;
  }
  return HIGH_RISK_PROVIDER_OBLIGATIONS;
}

export function getObligationsForLevel(
  level: RiskLevel,
  role: UserRole,
): Obligation[] {
  switch (level) {
    case "unacceptable":
      return [UNACCEPTABLE_OBLIGATION];
    case "high":
      return getHighRiskObligations(role);
    case "limited":
      return LIMITED_RISK_OBLIGATIONS.filter((o) =>
        o.appliesToRole.includes(role),
      );
    case "minimal":
      return [];
  }
}
