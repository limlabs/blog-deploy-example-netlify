import { NextApiRequest, NextApiResponse } from "next";
import { getStore } from "@netlify/blobs";

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const store = getStore(process.env.BLOB_STORE_NAME ?? '');
  const result = await store.getWithMetadata(req.query.key as string, {
    type: "arrayBuffer",
  });


  if (!result.data) {
    res.status(404).send("Not found");
    return;
  }

  res.setHeader("Content-Type", result.metadata.mimeType as string);
  res.setHeader("Content-Length", result.data.byteLength.toString());
  res.send(result.data);
}