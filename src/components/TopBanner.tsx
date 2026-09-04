import React from 'react';

export const TopBanner: React.FC = () => {
  return (
    <div className="bg-[#2E1E17] text-[#F3EBE1] py-2 px-4 text-center text-xs sm:text-sm font-medium tracking-wide shadow-xs">
      <div className="max-w-xl mx-auto flex items-center justify-center gap-2">
        <span>🚚</span>
        <span>توصيل لجميع مناطق العراق • الدفع عند الاستلام</span>
      </div>
    </div>
  );
};
