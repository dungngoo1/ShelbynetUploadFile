import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env } from "@/shared/config/env";

export type UploadRecord = {
  id: string;
  account: string;
  blobName: string;
  fileSize: number;
  expirationMicros: number;
  objectUrl: string;
  explorerUrl: string;
  mediaType: string;
  createdAt: string;
  source: "supabase" | "local";
};

type UploadRecordInsert = Omit<UploadRecord, "source">;

const LOCAL_STORAGE_KEY = "shelbyproof-upload-records";
const TABLE_NAME = "upload_records";

let supabaseClient: SupabaseClient | null = null;

function getSupabaseClient() {
  if (!env.supabaseUrl || !env.supabaseAnonKey) {
    return null;
  }

  if (!supabaseClient) {
    supabaseClient = createClient(env.supabaseUrl, env.supabaseAnonKey);
  }

  return supabaseClient;
}

function readLocalRecords() {
  if (typeof window === "undefined") {
    return [] as UploadRecord[];
  }

  try {
    const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as UploadRecord[];
  } catch {
    return [];
  }
}

function writeLocalRecords(records: UploadRecord[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(records));
}

function toRecordSource(record: UploadRecordInsert, source: "supabase" | "local"): UploadRecord {
  return {
    ...record,
    source,
  };
}

export async function saveUploadRecord(record: UploadRecordInsert) {
  const client = getSupabaseClient();

  if (client) {
    const { error } = await client.from(TABLE_NAME).insert({
      id: record.id,
      account: record.account,
      blob_name: record.blobName,
      file_size: record.fileSize,
      expiration_micros: record.expirationMicros,
      object_url: record.objectUrl,
      explorer_url: record.explorerUrl,
      media_type: record.mediaType,
      created_at: record.createdAt,
    });

    if (!error) {
      return toRecordSource(record, "supabase");
    }
  }

  const existing = readLocalRecords();
  const next = [toRecordSource(record, "local"), ...existing].slice(0, 24);
  writeLocalRecords(next);
  return toRecordSource(record, "local");
}

export async function listUploadRecords(account?: string, limit = 8) {
  const client = getSupabaseClient();

  if (client) {
    let query = client
      .from(TABLE_NAME)
      .select("id, account, blob_name, file_size, expiration_micros, object_url, explorer_url, media_type, created_at")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (account) {
      query = query.eq("account", account);
    }

    const { data, error } = await query;

    if (!error && data) {
      return data.map((item) => ({
        id: item.id,
        account: item.account,
        blobName: item.blob_name,
        fileSize: item.file_size,
        expirationMicros: item.expiration_micros,
        objectUrl: item.object_url,
        explorerUrl: item.explorer_url,
        mediaType: item.media_type,
        createdAt: item.created_at,
        source: "supabase" as const,
      }));
    }
  }

  return readLocalRecords()
    .filter((record) => (account ? record.account === account : true))
    .slice(0, limit);
}

export function metadataStoreLabel() {
  return getSupabaseClient() ? "Supabase" : "Local fallback";
}

