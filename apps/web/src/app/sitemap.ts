import type { MetadataRoute } from 'next';
import { services } from '@/data/site';

const BASE_URL = 'https://kobbysintertechservices.online';

export default function sitemap(): MetadataRoute.Sitemap {
  const serviceRoutes: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${BASE_URL}/services/${service.slug}`,
  }));

  const routes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}` },
    { url: `${BASE_URL}/about` },
    { url: `${BASE_URL}/services` },
    ...serviceRoutes,
    { url: `${BASE_URL}/gallery` },
    { url: `${BASE_URL}/contact` },
    { url: `${BASE_URL}/faq` },
    { url: `${BASE_URL}/book-service` },
    { url: `${BASE_URL}/request-quote` },
    { url: `${BASE_URL}/privacy` },
    { url: `${BASE_URL}/terms-of-service` },
  ];

  return routes;
}
