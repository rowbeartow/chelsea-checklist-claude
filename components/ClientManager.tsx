"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { Copy, ExternalLink, Plus } from "lucide-react";
import { getJourneyLabel } from "@/lib/checklist";
import type { ClientChecklist, ClientJourneyType, MasterTemplate, TemplateJourneyType } from "@/lib/types";

type ClientManagerProps = {
  initialClients: ClientChecklist[];
  templates: MasterTemplate[];
};

type ClientDraft = {
  name: string;
  email: string;
  journeyType: ClientJourneyType;
  buyerTemplateId: string;
  sellerTemplateId: string;
};

const defaultDraft: ClientDraft = {
  name: "",
  email: "",
  journeyType: "buyer",
  buyerTemplateId: "",
  sellerTemplateId: ""
};

function makeToken(name: string) {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 28);

  return `${slug || "client"}-${Math.random().toString(36).slice(2, 8)}`;
}

export function ClientManager({ initialClients, templates }: ClientManagerProps) {
  const buyerTemplate = templates.find((template) => template.journeyType === "buyer");
  const sellerTemplate = templates.find((template) => template.journeyType === "seller");
  const [clients, setClients] = useState<ClientChecklist[]>(initialClients);
  const [draft, setDraft] = useState<ClientDraft>({
    ...defaultDraft,
    buyerTemplateId: buyerTemplate?.id ?? "",
    sellerTemplateId: sellerTemplate?.id ?? ""
  });
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [createStatus, setCreateStatus] = useState<string | null>(null);

  const availableTemplates = useMemo(
    () => ({
      buyer: templates.filter((template) => template.journeyType === "buyer"),
      seller: templates.filter((template) => template.journeyType === "seller")
    }),
    [templates]
  );

  function updateDraft<K extends keyof ClientDraft>(key: K, value: ClientDraft[K]) {
    setDraft((current) => ({
      ...current,
      [key]: value
    }));
  }

  function getStagesForDraft() {
    const selectedTemplates: MasterTemplate[] = [];

    if (draft.journeyType === "buyer" || draft.journeyType === "buyer_seller") {
      const template = templates.find((item) => item.id === draft.buyerTemplateId);
      if (template) {
        selectedTemplates.push(template);
      }
    }

    if (draft.journeyType === "seller" || draft.journeyType === "buyer_seller") {
      const template = templates.find((item) => item.id === draft.sellerTemplateId);
      if (template) {
        selectedTemplates.push(template);
      }
    }

    return selectedTemplates.flatMap((template) =>
      template.stages.map((stage, index) => ({
        ...stage,
        journeyTrack: template.journeyType as TemplateJourneyType,
        isCurrent: index === 0 && template === selectedTemplates[0],
        tasks: stage.tasks.map((task) => ({
          ...task,
          isComplete: false
        }))
      }))
    );
  }

  async function createClient(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreateStatus(null);

    const token = makeToken(draft.name);
    const client: ClientChecklist = {
      id: `client-${Date.now()}`,
      privateLinkToken: token,
      clientName: draft.name,
      clientEmail: draft.email,
      journeyType: draft.journeyType,
      status: "active",
      stages: getStagesForDraft()
    };

    setClients((current) => [client, ...current]);
    setDraft({
      ...defaultDraft,
      buyerTemplateId: buyerTemplate?.id ?? "",
      sellerTemplateId: sellerTemplate?.id ?? ""
    });

    try {
      const response = await fetch("/api/admin/clients", {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify(draft)
      });
      const payload = (await response.json()) as { message?: string; error?: string; token?: string };
      setCreateStatus(response.ok ? payload.message ?? "Client created." : payload.error ?? "Client creation failed.");
    } catch {
      setCreateStatus("Client creation failed.");
    }
  }

  async function copyLink(token: string) {
    const link = `${window.location.origin}/c/${token}`;

    await navigator.clipboard?.writeText(link);
    setCopiedToken(token);
  }

  return (
    <section className="grid gap-5 xl:grid-cols-[360px_1fr]">
      <section className="rounded-lg border border-line bg-white p-5 shadow-soft">
        <p className="text-sm font-semibold text-accent">Client checklists</p>
        <h1 className="mt-1 text-2xl font-semibold">Create from templates</h1>
        <p className="mt-2 text-sm leading-6 text-ink/68">
          Create a checklist from the buyer or seller template and share the private link with your client.
        </p>

        <form className="mt-5 grid gap-4" onSubmit={createClient}>
          <label className="grid gap-2 text-sm font-bold">
            Client name
            <input
              className="rounded-md border border-line px-3 py-2 text-sm font-normal outline-none focus:border-accent"
              onChange={(event) => updateDraft("name", event.target.value)}
              required
              value={draft.name}
            />
          </label>
          <label className="grid gap-2 text-sm font-bold">
            Email
            <input
              className="rounded-md border border-line px-3 py-2 text-sm font-normal outline-none focus:border-accent"
              onChange={(event) => updateDraft("email", event.target.value)}
              type="email"
              value={draft.email}
            />
          </label>
          <label className="grid gap-2 text-sm font-bold">
            Journey type
            <select
              className="rounded-md border border-line px-3 py-2 text-sm font-normal outline-none focus:border-accent"
              onChange={(event) => updateDraft("journeyType", event.target.value as ClientJourneyType)}
              value={draft.journeyType}
            >
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
              <option value="buyer_seller">Buyer + seller</option>
            </select>
          </label>
          {(draft.journeyType === "buyer" || draft.journeyType === "buyer_seller") && (
            <label className="grid gap-2 text-sm font-bold">
              Buyer template
              <select
                className="rounded-md border border-line px-3 py-2 text-sm font-normal outline-none focus:border-accent"
                onChange={(event) => updateDraft("buyerTemplateId", event.target.value)}
                value={draft.buyerTemplateId}
              >
                {availableTemplates.buyer.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </label>
          )}
          {(draft.journeyType === "seller" || draft.journeyType === "buyer_seller") && (
            <label className="grid gap-2 text-sm font-bold">
              Seller template
              <select
                className="rounded-md border border-line px-3 py-2 text-sm font-normal outline-none focus:border-accent"
                onChange={(event) => updateDraft("sellerTemplateId", event.target.value)}
                value={draft.sellerTemplateId}
              >
                {availableTemplates.seller.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </label>
          )}
          <button
            className="inline-flex items-center justify-center gap-2 rounded-md border border-accent px-4 py-2 text-sm font-bold text-accent hover:bg-accentSoft"
            type="submit"
          >
            <Plus className="h-4 w-4" />
            Create local checklist
          </button>
          {createStatus ? <p className="rounded-md bg-cloud px-3 py-2 text-sm text-ink/70">{createStatus}</p> : null}
        </form>
      </section>

      <section className="rounded-lg border border-line bg-white p-5 shadow-soft">
        <h2 className="text-sm font-bold uppercase text-ink/58">Client list</h2>
        <div className="mt-4 grid gap-3">
          {clients.map((client) => (
            <article key={client.id} className="rounded-lg border border-line p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-base font-bold">{client.clientName}</h3>
                  <p className="mt-1 text-sm text-ink/62">{getJourneyLabel(client.journeyType)}</p>
                  <p className="mt-1 text-xs text-ink/52">{client.clientEmail || "No email yet"}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    className="inline-flex items-center gap-2 rounded-md border border-line px-3 py-2 text-sm font-bold hover:border-ink"
                    onClick={() => copyLink(client.privateLinkToken)}
                    type="button"
                  >
                    <Copy className="h-4 w-4" />
                    {copiedToken === client.privateLinkToken ? "Copied" : "Copy link"}
                  </button>
                  <Link
                    className="inline-flex items-center gap-2 rounded-md border border-line px-3 py-2 text-sm font-bold hover:border-ink"
                    href={`/c/${client.privateLinkToken}`}
                  >
                    <ExternalLink className="h-4 w-4" />
                    Preview
                  </Link>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold text-ink/58">
                <span className="rounded-md bg-cloud px-2 py-1">{client.stages.length} stages</span>
                <span className="rounded-md bg-cloud px-2 py-1">
                  {client.stages.reduce((count, stage) => count + stage.tasks.length, 0)} tasks
                </span>
                <span className="rounded-md bg-cloud px-2 py-1 capitalize">{client.journeyType.replace("_", " + ")} journey</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
