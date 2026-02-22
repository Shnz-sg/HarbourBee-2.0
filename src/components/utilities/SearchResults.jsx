import React from "react";
import { Search } from "lucide-react";

export default function SearchResults({ 
  query, 
  results, 
  isSearching, 
  renderItem,
  emptyMessage = "No results found"
}) {
  if (!query) {
    return null;
  }

  if (isSearching) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-6 text-center">
        <p className="text-sm text-slate-500">Searching...</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <Search className="w-6 h-6 text-slate-400" />
        </div>
        <p className="text-sm text-slate-600">
          {emptyMessage} for "<span className="font-medium">{query}</span>"
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-600">
        Found {results.length} result{results.length !== 1 ? 's' : ''} for "<span className="font-medium">{query}</span>"
      </p>
      <div className="space-y-3">
        {results.map((item, index) => (
          <div key={index}>
            {renderItem(item)}
          </div>
        ))}
      </div>
    </div>
  );
}