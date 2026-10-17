import Link from "next/link";
import React from "react";

export type HeroIconType = "grid" | "clock" | "shield" | "camera" | "pin" | "phone" | "check";

export type HeroCardItem = {
  icon?: HeroIconType;
  customIcon?: React.ReactNode;
  value: string;
  label: string;
};

export type HeroSectionProps = {
  eyebrowParts: string[];
  title: React.ReactNode;
  lead: string;
  primaryAction?: {
    href: string;
    label: string;
  };
  secondaryAction?: {
    href: string;
    label: string;
  };
  cardRows?: [HeroCardItem, HeroCardItem];
  id?: string;
};

function renderIcon(type?: HeroIconType) {
  switch (type) {
    case "clock":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      );
    case "shield":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <polyline points="9 12 11 14 15 10" />
        </svg>
      );
    case "camera":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
      );
    case "pin":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      );
    case "phone":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      );
    case "check":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      );
    case "grid":
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
        </svg>
      );
  }
}

export function HeroSection({
  eyebrowParts,
  title,
  lead,
  primaryAction,
  secondaryAction,
  cardRows,
  id = "top",
}: HeroSectionProps) {
  return (
    <section className="hero" id={id}>
      <div className="hero-container">
        <div className="hero-copy">
          <p className="hero-eyebrow">
            {eyebrowParts.map((part, index) => (
              <React.Fragment key={part}>
                {index > 0 && <span className="hero-dot">·</span>}
                <span>{part}</span>
              </React.Fragment>
            ))}
          </p>

          <h1 className="hero-title">{title}</h1>

          <p className="hero-lead">{lead}</p>

          {(primaryAction || secondaryAction) && (
            <div className="hero-actions">
              {primaryAction && (
                <Link className="hero-button-primary" href={primaryAction.href}>
                  {primaryAction.label} <span aria-hidden="true" className="btn-arrow">→</span>
                </Link>
              )}
              {secondaryAction && (
                <Link className="hero-link-secondary" href={secondaryAction.href}>
                  {secondaryAction.label} <span aria-hidden="true" className="link-arrow">↗</span>
                </Link>
              )}
            </div>
          )}
        </div>

        {cardRows && (
          <aside className="hero-card" aria-label="Key operational details">
            <div className="hero-card-row">
              <div className="hero-icon-box" aria-hidden="true">
                {cardRows[0].customIcon ?? renderIcon(cardRows[0].icon)}
              </div>
              <div className="hero-card-info">
                <strong className="hero-card-value">{cardRows[0].value}</strong>
                <span className="hero-card-label">{cardRows[0].label}</span>
              </div>
            </div>

            <div className="hero-card-divider" />

            <div className="hero-card-row">
              <div className="hero-icon-box" aria-hidden="true">
                {cardRows[1].customIcon ?? renderIcon(cardRows[1].icon)}
              </div>
              <div className="hero-card-info">
                <strong className="hero-card-value">{cardRows[1].value}</strong>
                <span className="hero-card-label">{cardRows[1].label}</span>
              </div>
            </div>
          </aside>
        )}
      </div>
    </section>
  );
}
