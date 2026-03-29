"use client";
import { Trash2 } from "lucide-react";

export interface ApiKeyItem {
  id: string;
  name: string;
  keyPrefix: string;
  lastUsedAt?: string | null;
  createdAt: string;
}

interface ApiKeyListProps {
  keys: ApiKeyItem[];
  onDelete: (id: string) => void;
}

export default function ApiKeyList({ keys, onDelete }: ApiKeyListProps) {
  if (keys.length === 0) {
    return (
      <p className="text-slate-500 text-sm py-4">
        No API keys yet. Create one to get started.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-slate-100">
      {keys.map((key) => (
        <li key={key.id} className="flex items-center justify-between py-4">
          <div>
            <p className="font-medium text-slate-900">{key.name}</p>
            <p className="text-sm text-slate-500 font-mono">
              {key.keyPrefix}••••••••••••••••
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Created {new Date(key.createdAt).toLocaleDateString()}
              {key.lastUsedAt
                ? ` · Last used ${new Date(key.lastUsedAt).toLocaleDateString()}`
                : " · Never used"}
            </p>
          </div>
          <button
            onClick={() => onDelete(key.id)}
            className="p-2 text-slate-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
            aria-label={`Delete API key ${key.name}`}
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </button>
        </li>
      ))}
    </ul>
  );
}
