type Props = {
  value: boolean | null;
  onChange: (v: boolean) => void;
  groupName: string;
};

const OPTIONS = [
  { val: true, label: "بالسلطة والطحينة كده 🥗" },
  { val: false, label: "من غير سلطة ولا طحينة" },
] as const;

export function DynamicOptions({ value, onChange, groupName }: Props) {
  return (
    <fieldset className="space-y-2">
      <div className="flex items-center gap-1.5">
        <legend className="text-xs font-bold text-stone-300">
          سلطة وطحينة
        </legend>
        <span className="rounded-full border border-orange-500/30 bg-orange-950/30 px-2 py-0.5 text-xs text-orange-200">
          لازم تختار
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {OPTIONS.map(({ val, label }) => {
          const isSelected = value === val;
          return (
            <label key={String(val)} className="relative cursor-pointer">
              <input
                type="radio"
                name={`${groupName}-salad`}
                className="sr-only"
                checked={isSelected}
                onChange={() => onChange(val)}
              />
              <div
                className="flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-medium transition-all duration-200 hover:scale-[1.02]"
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
                {label}
              </div>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
