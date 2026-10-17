export type Service = {
  slug: string;
  name: string;
  summary: string;
  description: string;
  inclusions: string[];
  image: string;
};

export const services: Service[] = [
  { slug: "cctv-security", name: "CCTV & Security", summary: "Camera supply, installation, upgrades and support.", description: "Security systems for indoor and outdoor surveillance, configured around your property and monitoring needs.", inclusions: ["CCTV camera supply and installation", "Indoor and outdoor surveillance", "Night vision and motion detection", "Remote viewing on phones", "DVR/NVR setup, storage and maintenance", "Security system upgrades and troubleshooting"], image: "/services/cctv_and_security.jpg" },
  { slug: "fibre-internet", name: "Fibre & Internet", summary: "Fibre, wireless internet and connectivity support.", description: "Internet and connectivity solutions to establish, improve and maintain the way your property gets online.", inclusions: ["Fibre-optic cable installation", "Wireless internet setups", "Router configuration and optimisation", "Network troubleshooting and maintenance", "Network cabling (Cat6 and Cat5e)", "Internet speed testing and optimisation"], image: "/services/fibre_and_internet.jpg" },
  { slug: "networking", name: "Networks", summary: "Home and office network design, installation and support.", description: "Networking solutions for secure, reliable connections across homes, offices and other working spaces.", inclusions: ["LAN/WAN design and implementation", "Network setup for homes and offices", "Wi-Fi network planning and installation", "Network security and firewall configuration", "Network device configuration", "Network cable testing and certification"], image: "/services/network.jpg" },
  { slug: "satellite", name: "Satellite Support", summary: "Dish installation, signal alignment and technical support.", description: "Satellite installation and support for dependable viewing, clearer signal and multi-channel setups.", inclusions: ["Satellite dish installation", "Signal alignment and optimisation", "Receiver-box setup and configuration", "Satellite dish repair and realignment", "Troubleshooting satellite signal issues", "Multi-satellite installation for multiple channels"], image: "/services/satellite.jpg" },
  { slug: "electrical-works", name: "Electrical Works", summary: "Electrical work within the company's qualifications and authorisations.", description: "Electrical services delivered within the work the company is qualified and authorised to perform.", inclusions: ["Assessment", "Approved electrical work", "Testing and support"], image: "/services/electrical_works.jpg" },
  { slug: "gps-tracking", name: "GPS Tracking", summary: "Vehicle-tracking installation and support.", description: "GPS vehicle-tracking installation and ongoing technical support.", inclusions: ["Device installation", "Configuration support", "Troubleshooting"], image: "/services/gps_tracking.jpg" },
];

export const faqs = [
  ["Which areas do you serve?", "Kobby’s Intertech Services is currently available in Ghana. Contact us with your location so we can discuss your requirements."],
  ["When are you open?", "Our current business hours are Monday to Saturday, 7:30 am to 5:00 pm."],
  ["Can I request a quotation?", "Yes. Tell us about the service you need and your location, and our team will review your request before providing a quotation where appropriate."],
  ["Do you offer fixed prices?", "Requirements vary by service and site. Quotations are prepared after the relevant details have been reviewed."],
  ["How can I reach the team?", "You can call or WhatsApp +233 24 348 7160, or email kobbysintertech@gmail.com."],
] as const;
