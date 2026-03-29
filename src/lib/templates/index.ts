export type TemplateId =
  | "technical-documentation"
  | "risk-management"
  | "data-governance"
  | "human-oversight"
  | "post-market-monitoring"
  | "transparency-disclosure";

export interface Template {
  id: TemplateId;
  title: string;
  description: string;
  article: string;
  sections: TemplateSection[];
}

export interface TemplateSection {
  id: string;
  title: string;
  description: string;
  placeholder: string;
}

export const TEMPLATES: Record<TemplateId, Template> = {
  "technical-documentation": {
    id: "technical-documentation",
    title: "Technical Documentation (Annex IV)",
    description: "Required technical documentation for high-risk AI systems under Article 11.",
    article: "Article 11",
    sections: [
      {
        id: "general-description",
        title: "General Description",
        description: "A general description of the AI system including its intended purpose.",
        placeholder: "Describe the AI system, its intended purpose, and the problems it addresses.",
      },
      {
        id: "design-process",
        title: "Design Process and Development",
        description: "Description of the design choices, assumptions, and methods used.",
        placeholder: "Describe the design process, training methodology, and key decisions made.",
      },
      {
        id: "system-requirements",
        title: "System Requirements",
        description: "Hardware and software requirements for deployment.",
        placeholder: "List minimum hardware requirements, software dependencies, and infrastructure needs.",
      },
    ],
  },
  "risk-management": {
    id: "risk-management",
    title: "Risk Management System (Article 9)",
    description: "Documentation for the risk management system required by Article 9.",
    article: "Article 9",
    sections: [
      {
        id: "risk-identification",
        title: "Risk Identification",
        description: "Known and foreseeable risks associated with the AI system.",
        placeholder: "Identify all known and reasonably foreseeable risks.",
      },
      {
        id: "risk-estimation",
        title: "Risk Estimation and Evaluation",
        description: "Assessment of identified risks.",
        placeholder: "Estimate the probability and severity of each identified risk.",
      },
      {
        id: "risk-mitigation",
        title: "Risk Mitigation Measures",
        description: "Measures taken to address identified risks.",
        placeholder: "Describe specific measures implemented to eliminate or reduce each risk.",
      },
    ],
  },
  "data-governance": {
    id: "data-governance",
    title: "Data and Data Governance (Article 10)",
    description: "Data governance practices documentation for training, validation, and testing datasets.",
    article: "Article 10",
    sections: [
      {
        id: "data-sources",
        title: "Data Sources",
        description: "Description of data sources used for training.",
        placeholder: "List all data sources, their provenance, and how data was collected.",
      },
      {
        id: "data-quality",
        title: "Data Quality Measures",
        description: "Measures taken to ensure data quality.",
        placeholder: "Describe data quality checks, bias detection, and validation procedures.",
      },
    ],
  },
  "human-oversight": {
    id: "human-oversight",
    title: "Human Oversight Measures (Article 14)",
    description: "Documentation of human oversight mechanisms built into the AI system.",
    article: "Article 14",
    sections: [
      {
        id: "oversight-mechanisms",
        title: "Oversight Mechanisms",
        description: "Technical measures enabling human oversight.",
        placeholder: "Describe override capabilities, stop functions, and monitoring dashboards.",
      },
      {
        id: "operator-instructions",
        title: "Operator Instructions",
        description: "Instructions for persons assigned to oversee the system.",
        placeholder: "Provide clear instructions on how human operators should monitor and intervene.",
      },
    ],
  },
  "post-market-monitoring": {
    id: "post-market-monitoring",
    title: "Post-Market Monitoring Plan (Article 72)",
    description: "Plan for actively monitoring the AI system after market placement.",
    article: "Article 72",
    sections: [
      {
        id: "monitoring-objectives",
        title: "Monitoring Objectives",
        description: "Goals and KPIs for post-market monitoring.",
        placeholder: "Define what metrics will be tracked and what thresholds trigger corrective action.",
      },
      {
        id: "data-collection",
        title: "Data Collection Methods",
        description: "How monitoring data will be collected.",
        placeholder: "Describe logging infrastructure, feedback channels, and incident reporting mechanisms.",
      },
    ],
  },
  "transparency-disclosure": {
    id: "transparency-disclosure",
    title: "Transparency Disclosure (Article 13 / Article 50)",
    description: "Transparency information to be provided to deployers and users.",
    article: "Article 13",
    sections: [
      {
        id: "capabilities",
        title: "Capabilities and Limitations",
        description: "Clear description of what the system can and cannot do.",
        placeholder: "Describe the system's capabilities, accuracy, and known limitations.",
      },
      {
        id: "user-disclosure",
        title: "User Disclosure",
        description: "Information to disclose to end users.",
        placeholder: "Draft the disclosure text users will see when interacting with the AI system.",
      },
    ],
  },
};

export function getTemplate(id: TemplateId): Template {
  return TEMPLATES[id];
}

export function getAllTemplates(): Template[] {
  return Object.values(TEMPLATES);
}

export const TEMPLATE_IDS = Object.keys(TEMPLATES) as TemplateId[];
