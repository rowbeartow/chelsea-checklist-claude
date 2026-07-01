export type TemplateJourneyType = "buyer" | "seller";
export type ClientJourneyType = "buyer" | "seller" | "buyer_seller";
export type RecommendationType = "recommended" | "optional" | "backup";

export type RichContent = {
  json: Record<string, unknown>;
  html: string;
};

export type Vendor = {
  id: string;
  name: string;
  category: string;
  contactName?: string;
  phone?: string;
  email?: string;
  website?: string;
  clientFacingNote: string;
  serviceArea: string;
  isActive: boolean;
  siteDomain?: string;
  siteFaviconUrl?: string;
  siteImageUrl?: string;
};

export type VendorRecommendation = {
  id: string;
  vendorId: string;
  note: string;
  recommendationType: RecommendationType;
  sortOrder: number;
};

export type ChecklistTask = {
  id: string;
  title: string;
  helperText: string;
  richContent: RichContent;
  callChelseaNote?: string;
  isRequired: boolean;
  sortOrder: number;
  isComplete: boolean;
  vendorRecommendations: VendorRecommendation[];
};

export type ChecklistStage = {
  id: string;
  journeyTrack?: TemplateJourneyType;
  title: string;
  shortDescription: string;
  richContent: RichContent;
  sortOrder: number;
  isCurrent: boolean;
  tasks: ChecklistTask[];
  vendorRecommendations: VendorRecommendation[];
};

export type ClientChecklist = {
  id: string;
  privateLinkToken: string;
  clientName: string;
  clientEmail?: string;
  journeyType: ClientJourneyType;
  status: "active" | "archived";
  stages: ChecklistStage[];
};

export type MasterTemplate = {
  id: string;
  name: string;
  journeyType: TemplateJourneyType;
  version: number;
  stages: ChecklistStage[];
};

export type TemplateSummary = {
  id: string;
  name: string;
  journeyType: TemplateJourneyType;
  stageCount: number;
  taskCount: number;
};
