"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { Check, Copy, ExternalLink, Link2, Plus, Search, X } from "lucide-react";
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
  agreementLink: string;
};

const defaultDraft: ClientDraft = {
  name: "",
  email: "",
  journeyType: "buyer",
  buyerTemplateId: "",
  sellerTemplateId: "",
  agreementLink: ""
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
  const [editingAgreement, setEditingAgreement] = useState<string | null>(null);
  const [agreementLinkDraft, setAgreementLinkDraft] = useState("");
  const [search, setSearch] = useState("");
  const [filterJourney, setFilterJourney] = useState<ClientJourneyType | "">("");
  const [filterAgreement, setFilterAgreement] = useState<"signed" | "unsigned" | "">("");

  const availableTemplates = useMemo(
    () => ({
      buyer: templates.filter((template) => template.journeyType === "buyer"),
      seller: templates.filter((template) => template.journeyType === "seller")
    }),
    [templates]
  );

  const filteredClients = useMemo(() => {
    const q = search.trim().toLowerCase();
    return clients.filter((client) => {
      if (q && !client.clientName.toLowerCase().includes(q) && !client.clientEmail?.toLowerCase().includes(q)) {
        return false;
      }
      if (filterJourney && client.journeyType !== filterJourney) return false;
      if (filterAgreement === "signed" && !client.agreementSigned) return false;
      if (filterAgreement === "unsigned" && client.agreementSigned) return false;
      return true;
    });
  }, [clients, search, filterJourney, filterAgreement]);

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
      stages: getStagesForDraft(),
      agreementLink: draft.agreementLink || undefined,
      agreementSigned: false
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

  async function saveAgreement(clientId: string) {
    setClients((current) =>
      current.map((c) => (c.id === clientId ? { ...c, agreementLink: agreementLinkDraft || undefined } : c))
    );
    setEditingAgreement(null);

    try {
      await fetch(`/api/admin/clients/${clientId}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ agreementLink: agreementLinkDraft || null })
      });
    } catch {}
  }

  async function toggleAgreementSigned(clientId: string, current: boolean) {
    setClients((cs) => cs.map((c) => (c.id === clientId ? { ...c, agreementSigned: !current } : c)));

    try {
      await fetch(`/api/admin/clients/${clientId}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ agreementSigned: !current })
      });
    } catch {}
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
          <label className="grid gap-2 text-sm font-bold">
            {draft.journeyType === "seller" ? "Listing agreement link" : "Buyer agreement link"}
            <input
              className="rounded-md border border-line px-3 py-2 text-sm font-normal outline-none focus:border-accent"
              onChange={(event) => updateDraft("agreementLink", event.target.value)}
              placeholder="Paste from Authentisign (optional)"
              type="url"
              value={draft.agreementLink}
            />
            <span className="text-xs font-normal text-ink/55">Can be added later after you set up the document in Authentisign</span>
          </label>
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
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-sm font-bold uppercase text-ink/58">Client list</h2>
          <span className="text-xs text-ink/50">{filteredClients.length} of {clients.length}</span>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <div className="relative flex-1 min-w-[160px]">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink/40" />
            <input
              className="w-full rounded-md border border-line py-2 pl-8 pr-8 text-sm outline-none focus:border-accent"
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email"
              value={search}
            />
            {search ? (
              <button type="button" onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink">
                <X className="h-3.5 w-3.5" />
              </button>
            ) : null}
          </div>
          <select
            className="rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-accent"
            onChange={(e) => setFilterJourney(e.target.value as ClientJourneyType | "")}
            value={filterJourney}
          >
            <option value="">All journeys</option>
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
            <option value="buyer_seller">Buyer + seller</option>
          </select>
          <select
            className="rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-accent"
            onChange={(e) => setFilterAgreement(e.target.value as "signed" | "unsigned" | "")}
            value={filterAgreement}
          >
            <option value="">All statuses</option>
            <option value="unsigned">Agreement pending</option>
            <option value="signed">Agreement signed</option>
          </select>
        </div>

        <div className="mt-4 grid gap-3">
          {filteredClients.length === 0 ? (
            <p className="rounded-lg border border-line px-4 py-6 text-center text-sm text-ink/50">
              {clients.length === 0 ? "No clients yet — create one on the left." : "No clients match those filters."}
            </p>
          ) : null}
          {filteredClients.map((client) => (
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

              <div className="mt-3 border-t border-line pt-3">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleAgreementSigned(client.id, Boolean(client.agreementSigned))}
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold transition ${
                      client.agreementSigned
                        ? "bg-successSoft text-success"
                        : "bg-warningSoft text-warning"
                    }`}
                  >
                    {client.agreementSigned ? (
                      <><Check className="h-3 w-3" /> {client.journeyType === "seller" ? "Listing agreement signed" : "Agreement signed"}</>
                    ) : (
                      client.journeyType === "seller" ? "Listing agreement not signed" : "Agreement not signed"
                    )}
                  </button>

                  {editingAgreement === client.id ? (
                    <div className="flex flex-1 items-center gap-2">
                      <input
                        autoFocus
                        className="min-w-0 flex-1 rounded-md border border-line px-2 py-1 text-xs outline-none focus:border-accent"
                        onChange={(e) => setAgreementLinkDraft(e.target.value)}
                        placeholder="Paste Authentisign link"
                        type="url"
                        value={agreementLinkDraft}
                      />
                      <button
                        type="button"
                        onClick={() => saveAgreement(client.id)}
                        className="rounded-md border border-accent px-2 py-1 text-xs font-bold text-accent hover:bg-accentSoft"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingAgreement(null)}
                        className="text-xs text-ink/50 hover:text-ink"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingAgreement(client.id);
                        setAgreementLinkDraft(client.agreementLink ?? "");
                      }}
                      className="inline-flex items-center gap-1 text-xs font-bold text-ink/50 hover:text-accent"
                    >
                      <Link2 className="h-3 w-3" />
                      {client.agreementLink
                        ? client.journeyType === "seller" ? "Edit listing agreement link" : "Edit buyer agreement link"
                        : client.journeyType === "seller" ? "Add listing agreement link" : "Add buyer agreement link"}
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
