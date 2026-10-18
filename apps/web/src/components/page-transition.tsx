'use client';

import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => {
      setIsNavigating(true);
    }, 0);
    const stopTimer = setTimeout(() => {
      setIsNavigating(false);
    }, 450);
    return () => {
      clearTimeout(startTimer);
      clearTimeout(stopTimer);
    };
  }, [pathname]);

  return (
    <>
      <div
        className={`page-progress-bar ${isNavigating ? "active" : ""}`}
        aria-hidden="true"
      />
      <div key={pathname} className="page-transition-wrapper">
        {children}
      </div>
    </>
  );
}
