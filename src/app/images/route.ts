
import { getStore } from "@netlify/blobs";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const store = getStore(process.env.BLOB_STORE_NAME ?? '');
  const key = req.nextUrl.searchParams.get("key");

  if (!key) {
    return new Response("Missing key", { status: 400 });
  }

  const result = await store.getWithMetadata(key as string, {
    type: "arrayBuffer",
  });

  if (!result.data) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(result.data, {
    headers: {
      "Content-Type": result.metadata.mimeType as string,
      "Content-Length": result.data.byteLength.toString(),
    },
  });
}