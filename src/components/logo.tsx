"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function Logo({ className = "" }: { className?: string }) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Before mount, render dark variant to match defaultTheme="dark"
  const src = mounted && theme === "light" ? "/logo.svg" : "/logo-dark.svg";

  return (
    <Image
      src={src}
      alt="Bergstrom Labs"
      width={225}
      height={233}
      className={className}
      priority
    />
  );
}
