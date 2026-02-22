import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

export default function SearchBar({ 
  placeholder = "Search...", 
  onSearch, 
  debounceMs = 500 
}) {
  const [value, setValue] = useState("");
  const [debounceTimeout, setDebounceTimeout] = useState(null);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);

    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const timeout = setTimeout(() => {
      onSearch(newValue);
    }, debounceMs);

    setDebounceTimeout(timeout);
  };

  const handleClear = () => {
    setValue("");
    onSearch("");
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      <Input
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="pl-9 pr-9 h-10"
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}