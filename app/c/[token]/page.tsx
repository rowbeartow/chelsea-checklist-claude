import { notFound } from "next/navigation";
import { ClientChecklist } from "@/components/ClientChecklist";
import { getClientChecklistByToken } from "@/lib/data/checklists";

type ClientChecklistPageProps = {
  params: Promise<{
    token: string;
  }>;
};

export default async function ClientChecklistPage({ params }: ClientChecklistPageProps) {
  const { token } = await params;
  const checklist = await getClientChecklistByToken(token);

  if (!checklist) {
    notFound();
  }

  return <ClientChecklist checklist={checklist} />;
}
