"use client";

import { FormEvent, useMemo, useState } from "react";
import { ExternalLink, RefreshCw, Save } from "lucide-react";
import type { Vendor } from "@/lib/types";
import { VendorCard } from "@/components/VendorCard";

type VendorLibraryManagerProps = {
  initialVendors: Vendor[];
};

type EditableVendor = Vendor & {
  internalNotes?: string;
};

const emptyVendor: EditableVendor = {
  id: "new-vendor",
  name: "",
  category: "",
  contactName: "",
  phone: "",
  email: "",
  website: "",
  clientFacingNote: "",
  serviceArea: "",
  isActive: true,
  siteDomain: "",
  siteFaviconUrl: "",
  siteImageUrl: "",
  internalNotes: ""
};

function normalizeWebsite(value: string) {
  if (!value.trim()) {
    return "";
  }

  return value.startsWith("http") ? value : `https://${value}`;
}

export function VendorLibraryManager({ initialVendors }: VendorLibraryManagerProps) {
  const [vendors, setVendors] = useState<EditableVendor[]>(initialVendors);
  const [selectedVendorId, setSelectedVendorId] = useState(initialVendors[0]?.id ?? emptyVendor.id);
  const [draft, setDraft] = useState<EditableVendor>(initialVendors[0] ?? emptyVendor);
  const [metadataStatus, setMetadataStatus] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const selectedVendor = useMemo(
    () => vendors.find((vendor) => vendor.id === selectedVendorId) ?? draft,
    [draft, selectedVendorId, vendors]
  );

  function selectVendor(vendor: EditableVendor) {
    setSelectedVendorId(vendor.id);
    setDraft(vendor);
    setMetadataStatus(null);
  }

  function startNewVendor() {
    setSelectedVendorId(emptyVendor.id);
    setDraft({
      ...emptyVendor,
      id: crypto.randomUUID()
    });
    setMetadataStatus(null);
  }

  function updateDraft<K extends keyof EditableVendor>(key: K, value: EditableVendor[K]) {
    setDraft((current) => ({
      ...current,
      [key]: value
    }));
  }

  async function saveVendor(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedDraft = {
      ...draft,
      website: normalizeWebsite(draft.website ?? "")
    };

    setVendors((current) => {
      const exists = current.some((vendor) => vendor.id === normalizedDraft.id);

      if (exists) {
        return current.map((vendor) => (vendor.id === normalizedDraft.id ? normalizedDraft : vendor));
      }

      return [...current, normalizedDraft];
    });
    setSelectedVendorId(normalizedDraft.id);
    setDraft(normalizedDraft);
    setSaveStatus(null);

    try {
      const response = await fetch("/api/admin/vendors", {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify(normalizedDraft)
      });
      const payload = (await response.json()) as { message?: string; error?: string };
      setSaveStatus(response.ok ? payload.message ?? "Vendor saved." : payload.error ?? "Vendor save failed.");
    } catch {
      setSaveStatus("Vendor save failed.");
    }
  }

  async function fetchMetadata() {
    if (!draft.website?.trim()) {
      setMetadataStatus("Add a website first.");
      return;
    }

    setMetadataStatus("Fetching site identity...");

    const response = await fetch(`/api/vendor-metadata?url=${encodeURIComponent(draft.website)}`);
    const payload = (await response.json()) as {
      title?: string;
      description?: string;
      domain?: string;
      faviconUrl?: string;
      imageUrl?: string;
      error?: string;
    };

    setDraft((current) => ({
      ...current,
      siteDomain: payload.domain || current.siteDomain,
      siteFaviconUrl: payload.faviconUrl || current.siteFaviconUrl,
      siteImageUrl: payload.imageUrl || current.siteImageUrl,
      clientFacingNote: current.clientFacingNote || payload.description || ""
    }));
    setMetadataStatus(payload.error ? "Could not fetch everything. You can edit the display manually." : "Site identity pulled.");
  }

  return (
    <section className="grid gap-5 xl:grid-cols-[320px_1fr]">
      <div className="grid content-start gap-4">
        <section className="rounded-lg border border-line bg-white p-4 shadow-soft">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-bold uppercase text-ink/58">Vendor library</h2>
            <button className="rounded-md border border-line px-3 py-2 text-xs font-bold" onClick={startNewVendor} type="button">
              New
            </button>
          </div>
          <div className="mt-3 grid gap-2">
            {vendors.map((vendor) => (
              <button
                className={`rounded-md border p-3 text-left ${
                  selectedVendor.id === vendor.id ? "border-accent bg-white" : "border-line hover:border-ink"
                }`}
                key={vendor.id}
                onClick={() => selectVendor(vendor)}
                type="button"
              >
                <span className="block text-sm font-bold">{vendor.name}</span>
                <span className="mt-1 block text-xs text-ink/62">
                  {vendor.category} {vendor.isActive ? "active" : "inactive"}
                </span>
              </button>
            ))}
          </div>
        </section>
      </div>

      <section className="rounded-lg border border-line bg-white p-5 shadow-soft">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-accent">Vendor CMS</p>
            <h1 className="mt-1 text-2xl font-semibold">Master vendor record</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/68">
              Maintain polished client-facing vendors and pull website identity server-side.
            </p>
          </div>
          <button
            className="inline-flex items-center justify-center gap-2 rounded-md border border-line px-4 py-2 text-sm font-bold hover:border-ink"
            onClick={fetchMetadata}
            type="button"
          >
            <RefreshCw className="h-4 w-4" />
            Pull site identity
          </button>
        </div>

        <form className="mt-5 grid gap-4" onSubmit={saveVendor}>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold">
              Name
              <input
                className="rounded-md border border-line px-3 py-2 text-sm font-normal outline-none focus:border-accent"
                onChange={(event) => updateDraft("name", event.target.value)}
                required
                value={draft.name}
              />
            </label>
            <label className="grid gap-2 text-sm font-bold">
              Category
              <input
                className="rounded-md border border-line px-3 py-2 text-sm font-normal outline-none focus:border-accent"
                onChange={(event) => updateDraft("category", event.target.value)}
                required
                value={draft.category}
              />
            </label>
            <label className="grid gap-2 text-sm font-bold">
              Website
              <input
                className="rounded-md border border-line px-3 py-2 text-sm font-normal outline-none focus:border-accent"
                onChange={(event) => updateDraft("website", event.target.value)}
                value={draft.website}
              />
            </label>
            <label className="grid gap-2 text-sm font-bold">
              Contact person
              <input
                className="rounded-md border border-line px-3 py-2 text-sm font-normal outline-none focus:border-accent"
                onChange={(event) => updateDraft("contactName", event.target.value)}
                value={draft.contactName}
              />
            </label>
            <label className="grid gap-2 text-sm font-bold">
              Phone
              <input
                className="rounded-md border border-line px-3 py-2 text-sm font-normal outline-none focus:border-accent"
                onChange={(event) => updateDraft("phone", event.target.value)}
                value={draft.phone}
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
              Service area
              <input
                className="rounded-md border border-line px-3 py-2 text-sm font-normal outline-none focus:border-accent"
                onChange={(event) => updateDraft("serviceArea", event.target.value)}
                value={draft.serviceArea}
              />
            </label>
            <label className="flex items-center gap-2 text-sm font-bold">
              <input
                checked={draft.isActive}
                className="h-4 w-4 accent-success"
                onChange={(event) => updateDraft("isActive", event.target.checked)}
                type="checkbox"
              />
              Active
            </label>
          </div>

          <label className="grid gap-2 text-sm font-bold">
            Client-facing note
            <textarea
              className="min-h-20 rounded-md border border-line px-3 py-2 text-sm font-normal leading-6 outline-none focus:border-accent"
              onChange={(event) => updateDraft("clientFacingNote", event.target.value)}
              value={draft.clientFacingNote}
            />
          </label>
          <label className="grid gap-2 text-sm font-bold">
            Internal notes
            <textarea
              className="min-h-20 rounded-md border border-line px-3 py-2 text-sm font-normal leading-6 outline-none focus:border-accent"
              onChange={(event) => updateDraft("internalNotes", event.target.value)}
              value={draft.internalNotes}
            />
          </label>

          {metadataStatus ? <p className="rounded-md bg-cloud px-3 py-2 text-sm text-ink/70">{metadataStatus}</p> : null}
          {saveStatus ? <p className="rounded-md bg-cloud px-3 py-2 text-sm text-ink/70">{saveStatus}</p> : null}

          <button
            className="inline-flex w-fit items-center justify-center gap-2 rounded-md border border-accent px-4 py-2 text-sm font-bold text-accent hover:bg-accentSoft"
            type="submit"
          >
            <Save className="h-4 w-4" />
            Save vendor locally
          </button>
        </form>

        <div className="mt-6 grid gap-3">
          <div className="flex items-center gap-2 text-sm font-bold">
            <ExternalLink className="h-4 w-4 text-ink/58" />
            Client card preview
          </div>
          <VendorCard
            recommendation={{
              id: "preview",
              vendorId: draft.id,
              note: draft.clientFacingNote,
              recommendationType: "recommended",
              sortOrder: 1
            }}
            vendor={draft}
          />
        </div>
      </section>
    </section>
  );
}
