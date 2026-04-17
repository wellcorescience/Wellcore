"use client";

import { useState, useEffect } from "react";

interface Props {
  targetDate?: string | Date;
}

export default function CountdownTimer({ targetDate }: Props) {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    setMounted(true);
    if (!targetDate) return;

    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const format = (num: number) => num.toString().padStart(2, '0');

  if (!mounted) return <div className="h-10 w-48 bg-surface-container animate-pulse rounded-lg"></div>;

  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-col items-center">
        <div className="bg-error text-white font-black px-2 py-1 rounded text-xl italic">{format(timeLeft.days)}</div>
        <span className="text-[8px] font-bold uppercase mt-1">Days</span>
      </div>
      <div className="text-xl font-black text-error animate-pulse">:</div>
      <div className="flex flex-col items-center">
        <div className="bg-error text-white font-black px-2 py-1 rounded text-xl italic">{format(timeLeft.hours)}</div>
        <span className="text-[8px] font-bold uppercase mt-1">Hrs</span>
      </div>
      <div className="text-xl font-black text-error animate-pulse">:</div>
      <div className="flex flex-col items-center">
        <div className="bg-error text-white font-black px-2 py-1 rounded text-xl italic">{format(timeLeft.minutes)}</div>
        <span className="text-[8px] font-bold uppercase mt-1">Mins</span>
      </div>
      <div className="text-xl font-black text-error animate-pulse">:</div>
      <div className="flex flex-col items-center">
        <div className="bg-error text-white font-black px-2 py-1 rounded text-xl italic">{format(timeLeft.seconds)}</div>
        <span className="text-[8px] font-bold uppercase mt-1">Secs</span>
      </div>
    </div>
  );
}
