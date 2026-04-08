interface SpiralBindingProps {
  count?: number;
}

export function SpiralBinding({ count = 20 }: SpiralBindingProps) {
  return (
    <div className="relative w-full h-6 flex items-center justify-center z-10">
      {/* Wire line */}
      <div className="absolute inset-x-4 top-1/2 h-[2px] bg-cal-spiral/40 rounded-full" />
      {/* Spiral loops */}
      <div className="flex items-center justify-between w-full px-6">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="w-3 h-5 rounded-full border-2 border-cal-spiral bg-background relative -top-1"
          />
        ))}
      </div>
    </div>
  );
}
