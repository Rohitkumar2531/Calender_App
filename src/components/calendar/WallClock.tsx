import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface WallClockProps {
  centered?: boolean;
}

export function WallClock({ centered = false }: WallClockProps) {
  const [time, setTime] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [greeting, setGreeting] = useState<string>("");

  useEffect(() => {
    // Set initial time, date, and greeting
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, "0");
      setTime(`${String(hours).padStart(2, "0")}:${minutes}`);

      // Format date
      const dateFormatter = new Intl.DateTimeFormat("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
      setDate(dateFormatter.format(now));

      // Determine greeting based on time
      if (hours >= 5 && hours < 12) {
        setGreeting("Good Morning");
      } else if (hours >= 12 && hours < 17) {
        setGreeting("Good Afternoon");
      } else if (hours >= 17 && hours < 21) {
        setGreeting("Good Evening");
      } else {
        setGreeting("Good Night");
      }
    };

    updateTime();

    // Update every second
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  if (centered) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="relative"
      >
        {/* Glassmorphism background - stronger for image overlay */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-md rounded-2xl"></div>

        {/* Border glow effect */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            boxShadow:
              "inset 0 0 20px rgba(255, 255, 255, 0.1), 0 0 40px rgba(100, 200, 255, 0.15)",
            border: "1px solid transparent",
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%) padding-box, linear-gradient(135deg, rgba(100,200,255,0.3) 0%, rgba(100,200,255,0.1) 50%, transparent 100%) border-box",
            borderRadius: "1rem",
          }}
        ></div>

        {/* Light reflection gradient */}
        <div
          className="absolute top-0 left-0 right-0 h-32 rounded-t-2xl pointer-events-none opacity-40"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.05) 50%, transparent 100%)",
          }}
        ></div>

        {/* Clock display */}
        <div className="relative px-10 py-6 text-center">
          <div className="text-sm text-white/70 mb-3 uppercase tracking-widest drop-shadow">
            {greeting || "Welcome"}
          </div>
          <div className="text-5xl font-light tracking-wider text-white font-mono tabular-nums drop-shadow-lg">
            {time || "--:--"}
          </div>
          <div className="text-xs text-white/70 mt-3 drop-shadow">
            {date || "Loading..."}
          </div>
        </div>

        {/* Enhanced border with glow */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            border: "1px solid rgba(255, 255, 255, 0.25)",
            boxShadow:
              "inset 0 1px 2px rgba(255, 255, 255, 0.2), 0 0 15px rgba(100, 200, 255, 0.2)",
          }}
        ></div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="mb-8 flex justify-center"
    >
      <div className="relative">
        {/* Glassmorphism background */}
        <div className="absolute inset-0 bg-white/10 dark:bg-white/5 backdrop-blur-xl rounded-2xl"></div>

        {/* Border glow effect */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            boxShadow:
              "inset 0 0 15px rgba(255, 255, 255, 0.08), 0 0 30px rgba(150, 200, 255, 0.1)",
            border: "1px solid transparent",
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%) padding-box, linear-gradient(135deg, rgba(150,200,255,0.25) 0%, rgba(150,200,255,0.08) 50%, transparent 100%) border-box",
            borderRadius: "1rem",
          }}
        ></div>

        {/* Light reflection gradient */}
        <div
          className="absolute top-0 left-0 right-0 h-24 rounded-t-2xl pointer-events-none opacity-30"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.03) 50%, transparent 100%)",
          }}
        ></div>

        {/* Clock display */}
        <div className="relative px-8 py-4 text-center">
          <div className="text-xs text-white/60 dark:text-gray-300 mb-2 uppercase tracking-widest">
            {greeting || "Welcome"}
          </div>
          <div className="text-4xl font-light tracking-wider text-white/90 dark:text-gray-100 font-mono tabular-nums">
            {time || "--:--"}
          </div>
          <div className="text-xs text-white/50 dark:text-gray-400 mt-2">
            {date || "Loading..."}
          </div>
        </div>

        {/* Enhanced border with glow */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            border: "1px solid rgba(255, 255, 255, 0.15)",
            boxShadow:
              "inset 0 1px 2px rgba(255, 255, 255, 0.15), 0 0 12px rgba(150, 200, 255, 0.15)",
          }}
        ></div>
      </div>
    </motion.div>
  );
}
