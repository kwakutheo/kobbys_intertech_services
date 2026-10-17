'use client';

import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    setIsNavigating(true);
    const timer = setTimeout(() => {
      setIsNavigating(false);
    }, 450);
    return () => clearTimeout(timer);
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
