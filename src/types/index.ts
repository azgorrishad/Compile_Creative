export interface ProcessStep {
  num: string;
  title: string;
  desc: string;
}

export interface CaseStudy {
  id: string;
  name: string;
  industry: string;
  image: string;
  gallery?: string[];
  problem: string;
  decision: string;
  transformation: string;
  result: string;
  meaning: string;
}

export interface FounderProfile {
  name: string;
  role: string;
  metrics: {
    years: string;
    projects: string;
    markets: string;
  };
  primaryImage: string;
  lifestyleImage: string;
  philosophy: string[];
}

export interface ClientProject {
  id: string;
  name: string;
  status: "Active" | "Completed" | "Onboarding";
  stage: string;
  progress: number;
}

export interface TeamTask {
  id: string;
  projectId: string;
  title: string;
  status: "Todo" | "In Progress" | "Review" | "Done";
  assignee: string;
  dueDate: string;
}

export interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isClient: boolean;
}

export interface Invoice {
  id: string;
  projectId: string;
  amount: number;
  status: "Paid" | "Pending" | "Overdue";
  dueDate: string;
}
