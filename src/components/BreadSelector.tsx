import type { BreadType } from "@/types";
import { BREAD_OPTIONS } from "@/lib/bread";

type Props = {
  value: BreadType | "";
  onChange: (v: BreadType) => void;
  groupName: string;
};

export function BreadSelector({ value, onChange, groupName }: Props) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-xs font-bold text-stone-300">شامي ولا بلدي؟</legend>
      <div className="flex flex-wrap gap-2">
        {BREAD_OPTIONS.map((opt) => {
          const isSelected = value === opt.value;
          return (
            <label key={opt.value} className="relative cursor-pointer">
              <input
                type="radio"
                name={groupName}
                className="sr-only"
                checked={isSelected}
                onChange={() => onChange(opt.value)}
              />
              <div
                className="flex items-center rounded-xl px-3.5 py-2 text-sm font-medium transition-all duration-200 hover:scale-[1.02]"
                style={{
                  background: isSelected
                    ? "linear-gradient(135deg, #F58220, #d96e15)"
                    : "#292524",
                  border: isSelected
                    ? "1.5px solid #F58220"
                    : "1.5px solid rgba(255,255,255,0.12)",
                  color: isSelected ? "#fff" : "#d6d3d1",
                  boxShadow: isSelected
                    ? "0 3px 12px rgba(245,130,32,0.3)"
                    : "none",
                }}
              >
                {isSelected && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="animate-bounce-in me-1.5 shrink-0"
                    aria-hidden
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
                {opt.label}
              </div>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
