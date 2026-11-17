import Link from "next/link";
import React from "react";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export type BreadcrumbProps = {
  items: BreadcrumbItem[];
};

/**
 * Accessible visible breadcrumb component.
 * Conforms to WAI-ARIA breadcrumb pattern using <nav aria-label="Breadcrumb">
 * and <ol> list items with aria-current="page" on the terminal active page.
 */
export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs-nav">
      <ol className="breadcrumbs-list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li
              key={item.label}
              className={`breadcrumb-item ${isLast ? "breadcrumb-current" : ""}`}
              {...(isLast ? { "aria-current": "page" } : {})}
            >
              {item.href && !isLast ? (
                <Link href={item.href} className="breadcrumb-link">
                  {item.label}
                </Link>
              ) : (
                <span className="breadcrumb-current-label">{item.label}</span>
              )}
              {!isLast && (
                <span className="breadcrumb-separator" aria-hidden="true">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
