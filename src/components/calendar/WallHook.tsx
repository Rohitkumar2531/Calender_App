export function WallHook() {
  return (
    <div className="flex flex-col items-center -mb-2 relative z-20">
      {/* Nail */}
      <div className="w-3 h-3 rounded-full bg-cal-hook shadow-cal-sm" />
      {/* String / wire */}
      <div className="w-[2px] h-5 bg-cal-hook/60" />
    </div>
  );
}
