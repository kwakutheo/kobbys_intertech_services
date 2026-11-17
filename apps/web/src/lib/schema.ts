import { Service } from "@/data/site";

const BASE_URL = "https://kobbysintertechservices.online";

const VERIFIED_SERVICE_AREAS = [
  {
    "@type": "AdministrativeArea",
    name: "Greater Accra Region",
  },
  {
    "@type": "AdministrativeArea",
    name: "Ashanti Region",
  },
  {
    "@type": "Country",
    name: "Ghana",
  },
];

/**
 * Generates the Organization and WebSite entity graph for the Homepage.
 * Uses stable URI fragments (#organization and #website) to anchor entities.
 *
 * NOTE: As a service-area business where technicians dispatch to client sites
 * without customer walk-ins, operating base address details are omitted.
 */
export function getOrganizationAndWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${BASE_URL}/#organization`,
        name: "Kobby's Intertech Services",
        url: BASE_URL,
        logo: `${BASE_URL}/brand/logo.png`,
        image: `${BASE_URL}/hero_section_background.jpg`,
        description:
          "Professional CCTV installation, fibre internet, computer networking, satellite TV, electrical works, and GPS tracking for properties and businesses in Accra and across Ghana.",
        telephone: "+233243487160",
        email: "kobbysintertech@gmail.com",
        areaServed: VERIFIED_SERVICE_AREAS,
      },
      {
        "@type": "WebSite",
        "@id": `${BASE_URL}/#website`,
        url: BASE_URL,
        name: "Kobby's Intertech Services",
        description: "Technology, Security & Connectivity in Ghana",
        publisher: {
          "@id": `${BASE_URL}/#organization`,
        },
        inLanguage: "en",
      },
    ],
  };
}

/**
 * Generates the Service entity schema for an individual service detail page.
 * References the central Organization entity through provider.@id.
 */
export function getServiceSchema(service: Service) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${BASE_URL}/services/${service.slug}#service`,
    name: service.name,
    description: service.description,
    url: `${BASE_URL}/services/${service.slug}`,
    image: `${BASE_URL}${service.image}`,
    provider: {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
    },
    areaServed: VERIFIED_SERVICE_AREAS,
  };
}

/**
 * Generates the BreadcrumbList schema for an individual service detail page.
 * Matches the visible breadcrumb navigation: Home → Our Services → [Service Name].
 */
export function getServiceBreadcrumbSchema(service: Service) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${BASE_URL}/services/${service.slug}#breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: BASE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Our Services",
        item: `${BASE_URL}/services`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: service.name,
        item: `${BASE_URL}/services/${service.slug}`,
      },
    ],
  };
}
