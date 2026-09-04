import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  return (
    <div className="relative w-full">
      <div className="relative flex items-center">
        <input
          id="product-search-input"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="ابحثي عن زيت، حنة، شامبو..."
          className="w-full bg-[#FCFBF8] text-[#2C1E18] placeholder-[#9E9488] text-sm sm:text-base rounded-full py-3.5 pr-12 pl-10 border border-[#E8E1D5] focus:outline-none focus:border-[#34533F] focus:ring-2 focus:ring-[#34533F]/15 transition-all shadow-xs"
        />
        <div className="absolute right-4 text-[#8C7E70] pointer-events-none">
          <Search className="w-5 h-5" />
        </div>
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute left-3.5 p-1 text-[#8C7E70] hover:text-[#2C1E18] rounded-full hover:bg-[#EFE8DC] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
