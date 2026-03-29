import { BookOpen } from "lucide-react";

interface ArticleCitationsProps {
  articles: string[];
}

export default function ArticleCitations({ articles }: ArticleCitationsProps) {
  if (articles.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="h-5 w-5 text-blue-500" aria-hidden="true" />
        <h3 className="text-lg font-semibold text-slate-900">
          Cited Articles &amp; Provisions
        </h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {articles.map((article) => (
          <span
            key={article}
            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-100"
          >
            {article}
          </span>
        ))}
      </div>
    </div>
  );
}
