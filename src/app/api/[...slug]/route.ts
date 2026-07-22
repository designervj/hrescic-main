


import { proxyRequest } from "@/lib/apiProxy";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, context: { params: Promise<{ slug?: string[] }> }) {
  return handleProxy(req, context);
}

export async function POST(req: NextRequest, context: { params: Promise<{ slug?: string[] }> }) {
  return handleProxy(req, context);
}

export async function PUT(req: NextRequest, context: { params: Promise<{ slug?: string[] }> }) {
  return handleProxy(req, context);
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ slug?: string[] }> }) {
  return handleProxy(req, context);
}

async function handleProxy(req: NextRequest, context: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await context.params;
  
  if (!slug || slug.length === 0) {
    return NextResponse.json({ error: "Invalid API endpoint" }, { status: 404 });
  }

  const base = slug[0];
  const rest = slug.slice(1).join("/");
  
  // Mapping logic
  let targetPath = slug.join("/");
  let addApiPrefix = false;

  if (base === "commerce") {
    targetPath = "commerce/" + rest;
  } else if (base === "form-data") {
    targetPath = "form-data/";
  }

  return proxyRequest(req, targetPath, { addApiPrefix });
}

// import type { NextRequest } from "next/server";
// import { ObjectId } from "mongodb";
// import { connectClient } from "@/lib/db";
// import { pageRegistry, headerData, footerData } from "@/lib/data/pageLoader";

// export const runtime = "nodejs";
// export const dynamic = "force-dynamic";

// interface ProxyRouteContext {
//   params: Promise<{ slug: string[] }>;
// }

// function resolveApiProxyBaseUrl(): string {
//   const envUrl = process.env.KALZERO_PUBLIC_API_URL?.trim();
//   if (!envUrl) throw new Error("KALZERO_PUBLIC_API_URL is not defined");
//   const trimmed = envUrl.endsWith("/") ? envUrl.slice(0, -1) : envUrl;
//   return trimmed.startsWith("http://") || trimmed.startsWith("https://")
//     ? trimmed
//     : `https://${trimmed}`;
// }

// async function proxyRequest(request: NextRequest, context: ProxyRouteContext) {
//   const { slug } = await context.params;

//   // Handle media metadata updates directly to MongoDB
//   if (
//     (request.method === "PUT" || request.method === "PATCH") &&
//     slug &&
//     ((slug.length === 2 && slug[0] === "media") ||
//       (slug.length === 3 && slug[0] === "admin" && slug[1] === "media"))
//   ) {
//     const id = slug[slug.length - 1];
//     const tenantDbName = request.headers.get("x-tenant-db");
//     if (!tenantDbName) {
//       return Response.json({ error: "x-tenant-db header is required" }, { status: 400 });
//     }
//     try {
//       const body = await request.json();
//       const { filename, altText, foldername, isWatermark } = body;
//       const client = await connectClient();
//       const db = client.db(tenantDbName);
//       const collection = db.collection("media");
//       const updateData: Record<string, unknown> = {};
//       if (filename !== undefined) updateData.filename = filename;
//       if (altText !== undefined) updateData.alt = altText;
//       if (foldername !== undefined) updateData.foldername = foldername;
//       if (isWatermark !== undefined) updateData.isWatermark = isWatermark;
//       updateData.updatedAt = new Date();

//       let query: Record<string, unknown> = {};
//       if (ObjectId.isValid(id)) {
//         query = { _id: new ObjectId(id) };
//       } else {
//         query = { id: id };
//       }
//       const result = await collection.updateOne(query, { $set: updateData });
//       if (result.matchedCount === 0) {
//         return Response.json({ error: "Media item not found" }, { status: 404 });
//       }
//       return Response.json({ success: true, message: "Media item updated successfully" });
//     } catch (error: any) {
//       return Response.json({ error: error.message || "Failed to update media item" }, { status: 500 });
//     }
//   }

//   // Handle page data fetches directly from Next.js API
//   if (request.method === "GET" && slug && slug.length >= 2 && slug[0] === "pages") {
//     const pageSlug = slug.slice(1).join("/");
//     if (pageSlug === "headerData") {
//       return Response.json(headerData);
//     }
//     if (pageSlug === "footerData") {
//       return Response.json(footerData);
//     }
//     const pageData = pageRegistry[pageSlug];
//     if (pageData) {
//       return Response.json(pageData);
//     }
//     return Response.json({ error: "Page not found" }, { status: 404 });
//   }

//   // Proxy to FastAPI backend
//   const incomingUrl = new URL(request.url);
//   const pathname = slug && slug.length > 0 ? `/${slug.join("/")}` : "";
//   const baseUrl = resolveApiProxyBaseUrl();
//   const targetUrl = `${baseUrl}${pathname}${incomingUrl.search}`;

//   const headers = new Headers(request.headers);
//   headers.delete("host");
//   headers.set("x-forwarded-host", incomingUrl.host);
//   headers.set("x-forwarded-proto", incomingUrl.protocol.replace(":", ""));

//   const init: RequestInit = { method: request.method, headers, cache: "no-store", redirect: "manual" };
//   if (request.method !== "GET" && request.method !== "HEAD") {
//     const body = await request.arrayBuffer();
//     if (body.byteLength > 0) init.body = body;
//   }

//   try {
//     const response = await fetch(targetUrl, init);
//     const responseHeaders = new Headers(response.headers);
//     responseHeaders.delete("x-powered-by");
//     return new Response(response.body, {
//       status: response.status,
//       statusText: response.statusText,
//       headers: responseHeaders,
//     });
//   } catch (error: any) {
//     const detail = error instanceof Error && error.message
//       ? `API proxy request failed: ${error.message}`
//       : "API proxy request failed.";
//     return Response.json({ detail, targetUrl }, { status: 502 });
//   }
// }

// export const GET = proxyRequest;
// export const POST = proxyRequest;
// export const PUT = proxyRequest;
// export const PATCH = proxyRequest;
// export const DELETE = proxyRequest;
// export const OPTIONS = proxyRequest;
// export const HEAD = proxyRequest;
