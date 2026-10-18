export type ServiceWorkflowStep = {
  step: string;
  title: string;
  description: string;
};

export type ServiceTechSpec = {
  label: string;
  value: string;
  detail: string;
};

export type ServiceBenefit = {
  title: string;
  description: string;
};

export type Service = {
  slug: string;
  name: string;
  summary: string;
  description: string;
  badge: string;
  tagline: string;
  inclusions: string[];
  workflow: ServiceWorkflowStep[];
  technicalSpecs: ServiceTechSpec[];
  benefits: ServiceBenefit[];
  idealFor: string[];
  whatsappMessage: string;
  image: string;
};

export const services: Service[] = [
  {
    slug: "cctv-security",
    name: "CCTV & Security",
    summary: "Camera supply, installation, upgrades and support.",
    badge: "Surveillance & Access",
    tagline: "High-definition 24/7 video monitoring, smart detection and mobile access.",
    description: "Security systems for indoor and outdoor surveillance, configured around your property layout, perimeter risks and monitoring needs.",
    inclusions: [
      "High-Definition (HD & 4K) IP and Analog Camera Installation",
      "Perimeter & Outdoor Weatherproof (IP67) Surveillance",
      "Infrared Night Vision & ColorVu Low-Light Sensors",
      "Real-Time Remote Live Viewing & Playback on iOS & Android",
      "NVR / DVR Setup with Redundant Hard Drive Storage",
      "Motion Detection Alerts, AI Human / Vehicle Filtering & Maintenance"
    ],
    workflow: [
      {
        step: "01",
        title: "Site Survey & Vulnerability Audit",
        description: "Our technicians inspect your premises, identifying blind spots, lighting conditions, cable pathways and entry points."
      },
      {
        step: "02",
        title: "System Design & Itemised Quotation",
        description: "We select the optimal camera resolutions, lenses, recorder capacity, and supply transparent pricing."
      },
      {
        step: "03",
        title: "Concealed Cabling & Installation",
        description: "Cameras and conduits are neatly installed with surge protection, weatherproof junctions and clean cable dressing."
      },
      {
        step: "04",
        title: "App Setup, Testing & Training",
        description: "We configure phone remote access, set motion alert notifications, test backup storage, and train your staff or family."
      }
    ],
    technicalSpecs: [
      { label: "Resolution", value: "2MP to 4K Ultra HD", detail: "Crystal-clear facial and vehicle license recognition" },
      { label: "Night Vision", value: "Smart IR & Full Color", detail: "Active illumination up to 40m in total darkness" },
      { label: "Ingress Protection", value: "IP67 Weatherproof", detail: "Heavy tropical rain, dust and heat resistant" },
      { label: "Storage", value: "H.265+ Compression", detail: "30+ days continuous or smart motion-activated recording" }
    ],
    benefits: [
      { title: "24/7 Peace of Mind", description: "Keep constant watch over your property, loved ones, inventory, and staff from anywhere in the world." },
      { title: "Deter Crime & Intrusion", description: "Visible premium security cameras significantly discourage theft, trespassing, and unauthorized activity." },
      { title: "Verifiable Video Evidence", description: "Timestamped high-resolution footage ready for legal, insurance, or police verification when needed." },
      { title: "Clean, Protected Workmanship", description: "No loose hanging cables or messy penetrations; all wiring is securely trunked and protected." }
    ],
    idealFor: ["Residential Homes & Gated Estates", "Retail Stores & Supermarkets", "Commercial Offices & Banking", "Warehouses, Factories & Sites"],
    whatsappMessage: "Hello Kobby's Intertech, I would like to enquire about CCTV & Security installation for my property.",
    image: "/services/cctv_and_security.jpg"
  },
  {
    slug: "fibre-internet",
    name: "Fibre & Internet",
    summary: "Fibre, wireless internet and connectivity support.",
    badge: "High-Speed Connectivity",
    tagline: "Low-latency fibre-optic drops, robust Wi-Fi backbones and failover solutions.",
    description: "Internet and connectivity solutions to establish, improve and maintain the way your home or business connects to the digital world.",
    inclusions: [
      "Fibre-Optic Cable Laying, Splicing & Termination",
      "Wireless Point-to-Point & Point-to-Multipoint Internet Links",
      "High-Performance Dual-Band & Wi-Fi 6 Router Setup",
      "Network Cabling Infrastructure (Cat6 / Cat6A & Fibre Drops)",
      "Internet Speed Audits, Bandwidth Management & QoS",
      "Starlink & Satellite High-Speed Internet Setup & Mounting"
    ],
    workflow: [
      {
        step: "01",
        title: "Connectivity Assessment",
        description: "We test incoming provider signals, fiber availability, building layouts, and bandwidth requirements."
      },
      {
        step: "02",
        title: "Infrastructure Route Planning",
        description: "We design safe, durable routing paths for fibre drops, optical network terminals (ONT), and main distribution racks."
      },
      {
        step: "03",
        title: "Precision Fusion Splicing & Cabling",
        description: "Fibre strands are spliced with low optical attenuation, terminating into clean faceplates and patch panels."
      },
      {
        step: "04",
        title: "Speed Benchmark & Coverage Verification",
        description: "Full throughput testing, latency verification, Wi-Fi heatmapping, and device connectivity handover."
      }
    ],
    technicalSpecs: [
      { label: "Cable Standards", value: "Single-Mode & Cat6A", detail: "Ultra-low attenuation glass cores for gigabit data" },
      { label: "Wireless Tech", value: "Wi-Fi 6 (802.11ax)", detail: "Simultaneous high-density device streaming with zero lag" },
      { label: "Termination", value: "Fusion Splicing", detail: "Precision optical joins for stable, uninterrupted signals" },
      { label: "Hardware Support", value: "MikroTik, Ubiquiti, Cisco", detail: "Enterprise-grade routers, managed switches and access points" }
    ],
    benefits: [
      { title: "Zero Buffer & High Speed", description: "Stream 4K video, attend crystal-clear zoom conferences, and transfer large enterprise files effortlessly." },
      { title: "Whole-Building Coverage", description: "Eliminate dead spots in basements, compound yards, multi-storey balconies, and remote rooms." },
      { title: "Stable Multiple Users", description: "Support dozens or hundreds of simultaneous smartphones, laptops, TVs, and smart devices without choking." },
      { title: "Quick Local Support", description: "Fast technician response if your line is accidentally cut or equipment requires reconfiguration." }
    ],
    idealFor: ["Smart Homes & Luxury Villas", "Corporate Offices & Coworking Hubs", "Hotels, Guest Houses & Lounges", "Remote Facilities Requiring Starlink"],
    whatsappMessage: "Hello Kobby's Intertech, I would like to enquire about Fibre & Internet connectivity setup.",
    image: "/services/fibre_and_internet.jpg"
  },
  {
    slug: "networking",
    name: "Networks",
    summary: "Home and office network design, installation and support.",
    badge: "Structured Cabling & LAN/WAN",
    tagline: "Enterprise-grade wired & wireless architectures designed for speed, security and uptime.",
    description: "Networking solutions for secure, reliable connections across homes, offices and large institutional working spaces in Ghana.",
    inclusions: [
      "LAN / WAN Architecture Design & Structured Cabling",
      "Managed Network Switches, Patch Panels & Server Racks",
      "Enterprise Mesh Wi-Fi (UniFi / Omada) for Seamless Roaming",
      "Hardware Firewall Setup, VPNs & VLAN Segmentation",
      "Network Cable Certification (Cat6 / Cat6A Fluke Testing)",
      "Network Troubleshooting, Packet Loss Resolution & Upgrades"
    ],
    workflow: [
      {
        step: "01",
        title: "Network Load & Architecture Analysis",
        description: "We evaluate the number of workstations, servers, IP phones, printers, and smart IoT endpoints."
      },
      {
        step: "02",
        title: "Rack & Pathway Engineering",
        description: "Drafting schematic diagrams, switch port allocations, server cabinet positions, and trunking conduits."
      },
      {
        step: "03",
        title: "Structured Pulling, Punchdown & Labelling",
        description: "Clean cable runs inside conduits, punchdown into keystones, and meticulous port-by-port labelling."
      },
      {
        step: "04",
        title: "VLAN Config, Security & Certification",
        description: "Setting up guest networks, staff isolation, DHCP pools, bandwidth limits, and cable continuity testing."
      }
    ],
    technicalSpecs: [
      { label: "Cable Rating", value: "100% Pure Bare Copper Cat6", detail: "Guaranteed gigabit transfer with zero crosstalk" },
      { label: "Switching Capacity", value: "Gigabit & 10G SFP+ Uplinks", detail: "High-throughput backbone for heavy server transfers" },
      { label: "Roaming", value: "802.11k/v/r Fast Roaming", detail: "Move room-to-room on calls without disconnecting" },
      { label: "Security", value: "VLAN & Stateful Firewall", detail: "Isolates guest devices and protects confidential company files" }
    ],
    benefits: [
      { title: "No Dropped Connections", description: "Engineered mesh access points hand over devices smoothly as you walk through your building." },
      { title: "Tidy, Labeled Server Racks", description: "All cables color-coded, labeled, and neatly arranged in ventilated, lockable wall or floor racks." },
      { title: "Segregated Guest Access", description: "Keep your internal databases and computers secure by providing visitors with isolated guest Wi-Fi." },
      { title: "Future-Proof Foundation", description: "Infrastructure built to easily expand when you add more staff, computers, cameras, or equipment." }
    ],
    idealFor: ["Corporate Headquarters & Branch Offices", "Schools, Universities & Labs", "Hospitals & Medical Centres", "Modern Multi-Story Residences"],
    whatsappMessage: "Hello Kobby's Intertech, I would like to enquire about Network design and cabling services.",
    image: "/services/network.jpg"
  },
  {
    slug: "satellite",
    name: "Satellite Support",
    summary: "Dish installation, signal alignment and technical support.",
    badge: "Television & Satellite Systems",
    tagline: "Precision dish alignment, multi-room distribution and crystal-clear digital reception.",
    description: "Satellite installation and technical support for dependable viewing, stronger signal lock, clean cabling, and multi-channel decoders across Ghana.",
    inclusions: [
      "Satellite Dish Mounting & Precision Micro-Degree Alignment",
      "DStv, Multi-Choice, Free-to-Air & International Satellite Setup",
      "Multi-Room Distribution, Splitters & LNB Replacements",
      "Starlink Satellite Dish Professional Roof & Mast Mounting",
      "Rain Fade Minimisation & High-Gain LNB Upgrades",
      "Signal Loss Diagnosis, Receiver Configuration & Cabling Repair"
    ],
    workflow: [
      {
        step: "01",
        title: "Sightline & Azimuth Calculation",
        description: "We determine clear line-of-sight to the orbital satellites, checking for trees, tall walls, or roofing obstructions."
      },
      {
        step: "02",
        title: "Heavy-Duty Mast Mounting",
        description: "Dishes are anchored using industrial wall brackets and galvanised bolts capable of withstanding heavy storms."
      },
      {
        step: "03",
        title: "Digital Meter Signal Peaking",
        description: "Using calibrated digital signal meters, we lock the exact elevation, azimuth, and LNB skew for maximum decibels."
      },
      {
        step: "04",
        title: "Decoder Configuration & Quality Check",
        description: "Coaxial cabling routed neatly inside, decoders scanned, channel audio/video synced, and signal strength verified."
      }
    ],
    technicalSpecs: [
      { label: "Dish Sizes", value: "60cm to 120cm High-Gain", detail: "Provides strong signal reserve against storm attenuation" },
      { label: "LNB Types", value: "Smart LNB, Twin & Quad Output", detail: "Independent channel viewing across multiple decoders" },
      { label: "Mounting", value: "Heavy-Gauge Galvanised Steel", detail: "Rust-resistant brackets and precision anchor screws" },
      { label: "Coaxial Cabling", value: "RG6 Quad-Shield with F-Compression", detail: "Prevents RF interference and signal degradation" }
    ],
    benefits: [
      { title: "Zero Signal Freezing", description: "Enjoy uninterrupted live football, news, and entertainment even in overcast weather." },
      { title: "Multi-TV Independence", description: "Watch different channels simultaneously in bedrooms, living rooms, and office areas." },
      { title: "Storm-Resistant Alignment", description: "Robust mechanical mounting ensures your dish doesn't shift during coastal winds or rainstorms." },
      { title: "Starlink Specialised Mounting", description: "Certified roof and mast installations for high-speed satellite broadband hardware." }
    ],
    idealFor: ["Private Residences & Apartments", "Sports Bars, Pubs & Lounges", "Hotels & Multi-Room Lodgings", "Offices & Executive Boardrooms"],
    whatsappMessage: "Hello Kobby's Intertech, I need assistance with Satellite Dish installation and signal support.",
    image: "/services/satellite.jpg"
  },
  {
    slug: "electrical-works",
    name: "Electrical Works",
    summary: "Electrical work within the company's qualifications and authorisations.",
    badge: "Power & Electrical Infrastructure",
    tagline: "Certified electrical installations, power protection, inverter integration and fault repairs.",
    description: "Professional electrical services delivered within approved safety standards, focusing on clean installations, surge protection, and power reliability.",
    inclusions: [
      "Distribution Board (DB) Wiring, Load Balancing & Circuit Breakers",
      "Surge Protection Devices (SPD) for Tech Equipment & Appliances",
      "Inverter, Solar & Backup Power System Integration & Cabling",
      "Socket, Switch & Dedicated Computer Power Line Installation",
      "Interior & Exterior Architectural LED Security Lighting",
      "Electrical Fault Finding, Short-Circuit Repairs & Safety Audits"
    ],
    workflow: [
      {
        step: "01",
        title: "Load Calculation & Safety Inspection",
        description: "We inspect existing main panels, earthing rods, load distribution, and identify obsolete or hazardous wiring."
      },
      {
        step: "02",
        title: "Specification & Circuit Planning",
        description: "Designing dedicated circuits for sensitive electronics (CCTV, servers, air conditioners, and backup power)."
      },
      {
        step: "03",
        title: "Safe Wiring & Breaker Installation",
        description: "Installing rated fire-retardant copper conduits, proper ground earthing, and industrial-grade circuit breakers."
      },
      {
        step: "04",
        title: "Insulation & Continuity Testing",
        description: "Multimeter voltage verification, earth resistance tests, load test under full power, and safety sign-off."
      }
    ],
    technicalSpecs: [
      { label: "Cable Standard", value: "Pure Copper 1.5mm / 2.5mm / 4mm", detail: "Flame-retardant PVC insulation adhering to safety codes" },
      { label: "Protection", value: "RCD / RCBO & Type 2 SPDs", detail: "Guards against electrical shocks, lightning and surge spikes" },
      { label: "Earthing", value: "Sub-5 Ohm Earth Rod System", detail: "Critical for discharging surges and protecting delicate electronics" },
      { label: "Switchgear", value: "Certified International Brands", detail: "ABB, Schneider, Chint industrial-grade breakers" }
    ],
    benefits: [
      { title: "Protection for Expensive Tech", description: "Shield your computers, TV screens, and security gear against voltage surges and grid spikes." },
      { title: "Fire & Shock Prevention", description: "Eliminate loose connections, overloaded plugs, and substandard wires that cause electrical hazards." },
      { title: "Clean Backup Power Integration", description: "Smooth changeover between national grid, generator, and battery inverter systems." },
      { title: "Energy Efficient Lighting", description: "Modern LED installations that dramatically reduce your monthly electricity bills." }
    ],
    idealFor: ["New Building Construction & Renovations", "Commercial Offices & Workspaces", "Server Rooms & IT Hubs", "Residential Homes Requiring Clean Power"],
    whatsappMessage: "Hello Kobby's Intertech, I would like to enquire about Electrical Works and power installations.",
    image: "/services/electrical_works.jpg"
  },
  {
    slug: "gps-tracking",
    name: "GPS Tracking",
    summary: "Vehicle-tracking installation and support.",
    badge: "Fleet & Asset Security",
    tagline: "Real-time satellite GPS tracking, remote engine immobilisation and geo-fencing.",
    description: "GPS vehicle-tracking installation, fleet monitoring and ongoing technical support for private cars, corporate fleets, and logistics trucks across Ghana.",
    inclusions: [
      "Covert GPS Tracker Installation for Cars, SUVs, Trucks & Motorbikes",
      "Live Real-Time Satellite Tracking via Mobile App & Web Dashboard",
      "Remote Engine Cut-Off (Kill Switch) via SMS or Smartphone App",
      "Geo-Fence Boundary Alerts, Speeding Warnings & Route History Playback",
      "Tamper Alarms, Battery Disconnection Alerts & Backup Internal Battery",
      "Fleet Management Reporting, Mileage Logs & Technician Support"
    ],
    workflow: [
      {
        step: "01",
        title: "Vehicle & Fleet Needs Consultation",
        description: "We determine the vehicle types, fleet size, security requirements (anti-theft vs. logistics tracking)."
      },
      {
        step: "02",
        title: "Covert Hardware Installation",
        description: "Trackers are hidden deep inside the vehicle's dashboard or chassis with zero telltale wires or external antennas."
      },
      {
        step: "03",
        title: "Relay & Immobiliser Wiring",
        description: "Professional integration into fuel or ignition relays, enabling secure remote engine shut-off without electrical faults."
      },
      {
        step: "04",
        title: "App Activation & Training",
        description: "SIM data activation, mobile app login setup, geo-fence configuration, and live simulation of engine immobilisation."
      }
    ],
    technicalSpecs: [
      { label: "Positioning Accuracy", value: "Under 5 Metres", detail: "Dual GPS & GLONASS multi-constellation satellite tracking" },
      { label: "Remote Control", value: "Instant Engine Kill Switch", detail: "Safely cut fuel flow or ignition during theft situations" },
      { label: "Backup Battery", value: "Internal Lithium-Ion", detail: "Sends alerts and tracks vehicle even if car battery is disconnected" },
      { label: "History Retention", value: "90+ Days Cloud Route Logs", detail: "Complete replay of speeds, stops, idle times, and daily routes" }
    ],
    benefits: [
      { title: "Immediate Theft Recovery", description: "Locate your vehicle in seconds and remotely stop the engine directly from your phone." },
      { title: "Control Fuel & Driver Misuse", description: "Monitor unauthorized trips, late-night driving, excessive speeding, and extended engine idling." },
      { title: "Live Geo-Fence Alerts", description: "Receive instant notifications when vehicles enter or leave designated zones like Accra, Kumasi, or your depot." },
      { title: "Invisible, Clean Installation", description: "No visible signs of tracker presence, preventing car thieves from tampering with the unit." }
    ],
    idealFor: ["Private Car & SUV Owners", "Car Rental, Uber & Bolt Fleets", "Logistics, Haulage & Delivery Trucks", "Corporate Company Vehicle Pools"],
    whatsappMessage: "Hello Kobby's Intertech, I would like to enquire about GPS Vehicle Tracking installation.",
    image: "/services/gps_tracking.jpg"
  }
];

export const faqs = [
  ["Which areas do you serve?", "Kobby’s Intertech Services is currently available in Ghana. Contact us with your location so we can discuss your requirements."],
  ["When are you open?", "Our current business hours are Monday to Saturday, 7:30 am to 5:00 pm."],
  ["Can I request a quotation?", "Yes. Tell us about the service you need and your location, and our team will review your request before providing a quotation where appropriate."],
  ["Do you offer fixed prices?", "Requirements vary by service and site. Quotations are prepared after the relevant details have been reviewed."],
  ["How can I reach the team?", "You can call or WhatsApp +233 24 348 7160, or email kobbysintertech@gmail.com."],
] as const;
