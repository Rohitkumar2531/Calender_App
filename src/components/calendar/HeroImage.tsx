import january from "@/assets/months/january.jpg";
import february from "@/assets/months/february.jpg";
import march from "@/assets/months/march.jpg";
import april from "@/assets/months/april.jpg";
import may from "@/assets/months/may.jpg";
import june from "@/assets/months/june.jpg";
import july from "@/assets/months/july.jpg";
import august from "@/assets/months/august.jpg";
import september from "@/assets/months/september.jpg";
import october from "@/assets/months/october.jpg";
import november from "@/assets/months/november.jpg";
import december from "@/assets/months/december.jpg";
import { motion } from "framer-motion";
import { WallClock } from "./WallClock";

const MONTH_IMAGES = [
  january, february, march, april, may, june,
  july, august, september, october, november, december,
];

const MONTHS = [
  "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
  "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER",
];

interface HeroImageProps {
  currentMonth: Date;
}

export function HeroImage({ currentMonth }: HeroImageProps) {
  const monthIndex = currentMonth.getMonth();

  return (
    <div className="relative w-full overflow-hidden">
      <motion.img
        key={monthIndex}
        src={MONTH_IMAGES[monthIndex]}
        alt={`${MONTHS[monthIndex]} landscape`}
        className="w-full h-[280px] sm:h-[340px] md:h-[400px] object-cover cursor-pointer"
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.6 }}
        width={1920}
        height={1080}
      />

      {/* Dark overlay for clock readability */}
      <motion.div
        className="absolute inset-0 bg-black/20 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      />

      {/* Centered clock */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <WallClock centered={true} />
      </div>

      {/* Blue diagonal accent */}
      <motion.svg
        className="absolute bottom-0 right-0 w-[55%] h-[100px]"
        viewBox="0 0 400 100"
        preserveAspectRatio="none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <polygon
          points="120,0 400,0 400,100 0,100"
          fill="hsl(var(--primary))"
        />
      </motion.svg>
      {/* Month & Year label */}
      <div className="absolute bottom-4 right-6 sm:right-10 text-right overflow-hidden">
        <motion.p
          key={`year-${currentMonth.getFullYear()}`}
          className="text-primary-foreground/80 text-sm sm:text-base font-display font-medium tracking-widest"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {currentMonth.getFullYear()}
        </motion.p>
        <motion.h1
          key={`month-${monthIndex}`}
          className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-primary-foreground tracking-wider"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {MONTHS[monthIndex]}
        </motion.h1>
      </div>
    </div>
  );
}
