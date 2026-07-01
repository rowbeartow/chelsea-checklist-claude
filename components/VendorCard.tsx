import { ExternalLink, Mail, Phone } from "lucide-react";
import type { Vendor, VendorRecommendation } from "@/lib/types";

type VendorCardProps = {
  vendor: Vendor;
  recommendation: VendorRecommendation;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function VendorCard({ vendor, recommendation }: VendorCardProps) {
  return (
    <article className="grid grid-cols-[44px_1fr] gap-3 rounded-lg border border-line bg-white p-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-md border border-accent/35 bg-white text-sm font-bold text-accent">
        {vendor.siteFaviconUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={vendor.siteFaviconUrl} alt="" className="h-6 w-6" />
        ) : (
          getInitials(vendor.name)
        )}
      </div>
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h4 className="text-sm font-bold text-ink">{vendor.name}</h4>
          <span className="rounded-full bg-successSoft px-2 py-0.5 text-[11px] font-bold uppercase text-success">
            {vendor.category}
          </span>
        </div>
        <p className="mt-1 text-xs leading-5 text-ink/68">{recommendation.note || vendor.clientFacingNote}</p>
        {vendor.contactName ? <p className="mt-1 text-xs font-semibold text-ink/65">{vendor.contactName}</p> : null}
        <div className="mt-3 flex flex-wrap gap-2">
          {vendor.phone ? (
            <a
              href={`tel:${vendor.phone}`}
              className="inline-flex items-center gap-1 rounded-md border border-line px-2 py-1 text-xs font-bold text-ink hover:border-ink"
            >
              <Phone className="h-3.5 w-3.5" />
              Call
            </a>
          ) : null}
          {vendor.email ? (
            <a
              href={`mailto:${vendor.email}`}
              className="inline-flex items-center gap-1 rounded-md border border-line px-2 py-1 text-xs font-bold text-ink hover:border-ink"
            >
              <Mail className="h-3.5 w-3.5" />
              Email
            </a>
          ) : null}
          {vendor.website ? (
            <a
              href={vendor.website}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-md border border-line px-2 py-1 text-xs font-bold text-ink hover:border-ink"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Website
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
