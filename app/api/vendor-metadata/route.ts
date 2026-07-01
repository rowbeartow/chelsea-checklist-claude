import { NextRequest, NextResponse } from "next/server";

type MetadataResult = {
  title: string;
  description: string;
  domain: string;
  faviconUrl: string;
  imageUrl: string;
};

function getAttribute(tag: string, attribute: string) {
  const pattern = new RegExp(`${attribute}=["']([^"']+)["']`, "i");
  return tag.match(pattern)?.[1] ?? "";
}

function getMetaContent(html: string, selectors: string[]) {
  for (const selector of selectors) {
    const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const tag = html.match(new RegExp(`<meta[^>]+(?:property|name)=["']${escapedSelector}["'][^>]*>`, "i"))?.[0];

    if (tag) {
      const content = getAttribute(tag, "content");

      if (content) {
        return content.trim();
      }
    }
  }

  return "";
}

function getTitle(html: string) {
  const ogTitle = getMetaContent(html, ["og:title", "twitter:title"]);

  if (ogTitle) {
    return ogTitle;
  }

  return html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.replace(/\s+/g, " ").trim() ?? "";
}

function getDescription(html: string) {
  return getMetaContent(html, ["og:description", "twitter:description", "description"]);
}

function resolveUrl(value: string, baseUrl: URL) {
  if (!value) {
    return "";
  }

  try {
    return new URL(value, baseUrl).toString();
  } catch {
    return "";
  }
}

function getPreviewImage(html: string, baseUrl: URL) {
  const image = getMetaContent(html, ["og:image", "twitter:image"]);
  return resolveUrl(image, baseUrl);
}

function getFavicon(html: string, baseUrl: URL) {
  const iconTag =
    html.match(/<link[^>]+rel=["'][^"']*(?:icon|shortcut icon|apple-touch-icon)[^"']*["'][^>]*>/i)?.[0] ?? "";
  const href = getAttribute(iconTag, "href");

  return resolveUrl(href || "/favicon.ico", baseUrl);
}

export async function GET(request: NextRequest) {
  const rawUrl = request.nextUrl.searchParams.get("url");

  if (!rawUrl) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  let targetUrl: URL;

  try {
    targetUrl = new URL(rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`);
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  if (!["http:", "https:"].includes(targetUrl.protocol)) {
    return NextResponse.json({ error: "Only http and https URLs are supported" }, { status: 400 });
  }

  try {
    const response = await fetch(targetUrl, {
      headers: {
        "user-agent": "ChelseaChecklistBot/1.0"
      },
      signal: AbortSignal.timeout(8000)
    });

    if (!response.ok) {
      return NextResponse.json({ error: `Metadata fetch failed with ${response.status}` }, { status: 502 });
    }

    const html = await response.text();
    const metadata: MetadataResult = {
      title: getTitle(html),
      description: getDescription(html),
      domain: targetUrl.hostname.replace(/^www\./, ""),
      faviconUrl: getFavicon(html, targetUrl),
      imageUrl: getPreviewImage(html, targetUrl)
    };

    return NextResponse.json(metadata);
  } catch {
    return NextResponse.json(
      {
        title: "",
        description: "",
        domain: targetUrl.hostname.replace(/^www\./, ""),
        faviconUrl: "",
        imageUrl: "",
        error: "Unable to fetch metadata"
      },
      { status: 200 }
    );
  }
}
