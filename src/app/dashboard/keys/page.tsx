"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ApiKeyList from "@/components/dashboard/ApiKeyList";
import ApiKeyCreateDialog from "@/components/dashboard/ApiKeyCreateDialog";
import type { ApiKeyItem } from "@/components/dashboard/ApiKeyList";

interface NewKeyInfo extends ApiKeyItem {
  key: string;
}

export default function ApiKeysPage() {
  const { status } = useSession();
  const router = useRouter();
  const [keys, setKeys] = useState<ApiKeyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newKey, setNewKey] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/keys")
      .then((r) => r.json())
      .then((data: { keys?: ApiKeyItem[] }) => {
        setKeys(data.keys ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [status]);

  function handleCreated(created: NewKeyInfo) {
    setNewKey(created.key);
    setKeys((prev) => [created, ...prev]);
  }

  async function handleDelete(id: string) {
    await fetch(`/api/keys/${id}`, { method: "DELETE" });
    setKeys((prev) => prev.filter((k) => k.id !== id));
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <p className="text-slate-500">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50">
      <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-slate-900">API Keys</h1>
          <ApiKeyCreateDialog onCreated={handleCreated} />
        </div>

        {newKey && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm font-medium text-green-800 mb-1">
              API key created. Copy it now — it will not be shown again.
            </p>
            <code className="text-xs font-mono text-green-900 break-all">
              {newKey}
            </code>
            <button
              onClick={() => setNewKey(null)}
              className="ml-3 text-xs text-green-700 underline"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <ApiKeyList keys={keys} onDelete={handleDelete} />
        </div>
      </div>
    </div>
  );
}
