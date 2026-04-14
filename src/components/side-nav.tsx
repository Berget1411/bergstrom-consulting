"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";

const navItems = [
  { id: "hero", label: "Index", mobileLabel: "Index" },
  { id: "work", label: "Work", mobileLabel: "Work" },
  { id: "principles", label: "Principles", mobileLabel: "Princ." },
  { id: "correspondence", label: "Correspondence", mobileLabel: "Contact" },
  { id: "colophon", label: "Colophon", mobileLabel: "Info" },
];

export function SideNav() {
  const [activeSection, setActiveSection] = useState("hero");

  const updateActiveSection = useCallback(() => {
    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;

    // If near top, hero is active
    if (scrollY < viewportHeight * 0.3) {
      setActiveSection("hero");
      return;
    }

    // If near bottom, colophon is active
    if (scrollY + viewportHeight >= document.documentElement.scrollHeight - 100) {
      setActiveSection("colophon");
      return;
    }

    // Find section whose top is closest to viewport center
    const viewportCenter = scrollY + viewportHeight * 0.4;
    let closest = navItems[0].id;
    let closestDistance = Number.POSITIVE_INFINITY;

    for (const { id } of navItems) {
      const el = document.getElementById(id);
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      const sectionTop = scrollY + rect.top;
      const sectionCenter = sectionTop + rect.height / 2;
      const distance = Math.abs(viewportCenter - sectionCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closest = id;
      }
    }

    setActiveSection(closest);
  }, []);

  useEffect(() => {
    updateActiveSection();

    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [updateActiveSection]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Desktop side nav */}
      <nav className="fixed left-0 top-0 z-50 h-screen w-14 md:w-20 hidden md:flex flex-col justify-between border-r border-border/30 bg-background">
        <div className="flex items-center justify-center pt-6 px-3 md:px-4">
          <button
            onClick={() => scrollToSection("hero")}
            type="button"
            className="hover:opacity-70 transition-opacity duration-200"
            aria-label="Back to top"
          >
            <Logo className="h-6 w-auto md:h-8" />
          </button>
        </div>
        <div className="flex flex-col gap-6 px-3 md:px-4">
          {navItems.map(({ id, label }) => (
            <button
              key={`${id}-${label}`}
              onClick={() => scrollToSection(id)}
              className="group relative flex items-center gap-3"
              type="button"
            >
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full transition-all duration-300",
                  activeSection === id
                    ? "bg-accent scale-125"
                    : "bg-muted-foreground/40 group-hover:bg-foreground/60",
                )}
              />
              <span
                className={cn(
                  "absolute left-6 font-mono text-[10px] uppercase tracking-widest opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:left-8 whitespace-nowrap",
                  activeSection === id
                    ? "text-accent"
                    : "text-muted-foreground",
                )}
              >
                {label}
              </span>
            </button>
          ))}
        </div>
        <div className="pb-6" />
      </nav>

      {/* Mobile bottom bar */}
      <nav className="fixed bottom-0 left-0 z-50 w-full border-t border-border/30 bg-background/90 md:hidden">
        <div className="flex items-center px-1 py-2">
          <button
            onClick={() => scrollToSection("hero")}
            type="button"
            className="flex h-[44px] w-[40px] shrink-0 items-center justify-center hover:opacity-70 transition-opacity duration-200"
            aria-label="Back to top"
          >
            <Logo className="h-5 w-auto" />
          </button>
          <div className="flex flex-1 items-center justify-around">
            {navItems.map(({ id, mobileLabel }) => (
              <button
                key={`mobile-${id}`}
                onClick={() => scrollToSection(id)}
                className="flex min-h-[44px] flex-col items-center justify-center gap-1"
                type="button"
              >
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full transition-all duration-300",
                    activeSection === id
                      ? "bg-accent scale-125"
                      : "bg-muted-foreground/40",
                  )}
                />
                {activeSection === id && (
                  <span className="font-mono text-[8px] uppercase tracking-[0.15em] text-accent whitespace-nowrap">
                    {mobileLabel}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}
