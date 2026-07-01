import { clientChecklists, vendors } from "@/lib/seed-data";
import type { ClientChecklist, ClientJourneyType, Vendor, VendorRecommendation } from "@/lib/types";

export function getChecklistByToken(token: string): ClientChecklist | undefined {
  return clientChecklists.find((checklist) => checklist.privateLinkToken === token);
}

export function getVendorById(id: string): Vendor | undefined {
  return vendors.find((vendor) => vendor.id === id && vendor.isActive);
}

export function resolveRecommendations(recommendations: VendorRecommendation[]) {
  return recommendations
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((recommendation) => ({
      recommendation,
      vendor: getVendorById(recommendation.vendorId)
    }))
    .filter((item): item is { recommendation: VendorRecommendation; vendor: Vendor } => Boolean(item.vendor));
}

export function getProgress(checklist: ClientChecklist) {
  const tasks = checklist.stages.flatMap((stage) => stage.tasks);
  const complete = tasks.filter((task) => task.isComplete).length;

  return {
    complete,
    total: tasks.length,
    percent: tasks.length === 0 ? 0 : Math.round((complete / tasks.length) * 100)
  };
}

export function getJourneyLabel(journeyType: ClientJourneyType) {
  if (journeyType === "buyer_seller") {
    return "Buyer + seller journey";
  }

  return `${journeyType} journey`;
}
