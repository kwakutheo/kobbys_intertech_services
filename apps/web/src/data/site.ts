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
    name: "CCTV Installation & Security Systems",
    summary: "CCTV camera installation, recording systems, remote monitoring, upgrades and maintenance for homes and businesses across Ghana.",
    badge: "Video Surveillance & Property Security",
    tagline: "Protect your property with professionally installed cameras, dependable recording and secure remote viewing.",
    description: "We design, install and maintain CCTV surveillance systems for homes, shops, schools, churches, offices, warehouses, hospitality businesses and other properties across Ghana. Each installation is planned around the property's layout, entry points, lighting, security concerns, available power and budget. Depending on the selected equipment, systems may include HD or 4K cameras, night vision, full-colour low-light recording, motion alerts, human or vehicle detection, and remote viewing through a compatible mobile app or computer. We also provide DVR and NVR configuration, recording storage, structured cabling, suitable surge protection, optional backup power and ongoing technical support. Camera performance, remote access, smart detection and recording retention depend on the equipment, installation conditions, network connectivity and storage configuration.",
    inclusions: [
      "HD, Full HD, 4MP, 4K IP & Compatible Analog CCTV Camera Installation",
      "Indoor, Outdoor, Entrance, Reception & Perimeter Surveillance",
      "Night Vision, Infrared Illumination & Compatible Full-Colour Low-Light Cameras",
      "DVR and NVR Installation, Configuration & Recording Playback",
      "Remote Live Viewing and Playback Through Compatible Mobile Apps or Computers",
      "Motion Detection, Human or Vehicle Detection & Intrusion Alerts Where Supported",
      "Camera Placement Planning to Reduce Blind Spots and Improve Coverage",
      "Security Cameras for Gates, Parking Areas, Shops, Offices & Building Entrances",
      "PoE IP Camera Systems and Suitable Network Switch Configuration",
      "Coaxial, Ethernet, Conduit & Protected Cable Installation as Required",
      "Hard Drive Installation, Recording Schedule Setup & Storage Capacity Planning",
      "UPS and Suitable Backup Power Options for Cameras and Recording Equipment",
      "Surge Protection, Proper Earthing Assessment & Protection Against Power Disturbances",
      "Secure Remote Access Setup, User Permissions & Default Password Replacement",
      "Existing CCTV Troubleshooting, Camera Replacement & System Upgrades",
      "Periodic Inspection, Cleaning, Recording Checks & Preventive Maintenance",
      "Customer Training on Live Viewing, Playback, Exporting Footage & Basic Troubleshooting"
    ],
    workflow: [
      {
        step: "01",
        title: "Site Survey & Security Requirements",
        description: "We inspect the property and identify entrances, exits, reception areas, parking spaces, perimeter risks, lighting conditions and likely camera blind spots. We discuss the customer's priorities, privacy considerations, available internet service, power reliability and budget before recommending a system."
      },
      {
        step: "02",
        title: "System Design & Itemised Quotation",
        description: "We recommend suitable camera types, resolution, lens angles, night-vision capabilities, recorder capacity and storage based on the site. The quotation identifies the proposed equipment, number of cameras, cabling, installation work and optional items such as remote viewing, UPS backup and maintenance. Expected recording retention and any recurring service costs are explained before approval."
      },
      {
        step: "03",
        title: "Professional Installation & Configuration",
        description: "We install cameras in appropriate locations, route and secure cables, protect outdoor connections and configure the DVR or NVR. Where required, we set up PoE networking, suitable surge protection, backup power and internet connectivity. Camera views are adjusted to improve useful coverage while respecting neighbouring properties and areas where people reasonably expect privacy."
      },
      {
        step: "04",
        title: "Testing, Secure Access & Handover",
        description: "We test each camera's live view, image quality, night performance, recording, playback and supported alerts. Where remote access is required, we configure the compatible app or platform using secure account settings and appropriate user permissions. We demonstrate how to search and export footage, explain storage limitations and provide guidance on maintenance and support."
      }
    ],
    technicalSpecs: [
      {
        label: "Camera Resolution",
        value: "HD to 4K, Depending on Requirements",
        detail: "Resolution and lens selection are based on the required viewing distance, field of view, lighting and intended level of detail. Identification of faces or vehicle registration plates cannot be guaranteed solely by selecting a higher-resolution camera."
      },
      {
        label: "Night Surveillance",
        value: "Infrared or Compatible Full-Colour Night Vision",
        detail: "Night performance depends on the camera sensor, illumination, ambient lighting, lens, mounting position and distance to the subject. Advertised illumination ranges vary by model and site conditions."
      },
      {
        label: "Outdoor Protection",
        value: "Weather-Rated Cameras and Protected Connections",
        detail: "Camera enclosures and accessories are selected for the installation environment. Weather resistance depends on the device rating, cable entries, junction boxes, mounting, installation quality and ongoing maintenance."
      },
      {
        label: "Recording & Storage",
        value: "DVR / NVR with Suitable Surveillance Storage",
        detail: "Recording duration depends on the number of cameras, resolution, frame rate, bitrate, compression, audio settings, recording schedule and hard-drive capacity. Retention is estimated during system design and verified after configuration."
      },
      {
        label: "Network & Remote Viewing",
        value: "Compatible IP Cameras and Remote-Access Platform",
        detail: "Remote access requires compatible equipment and working connectivity. Local recording may continue during an internet outage if the recorder, cameras and power supply remain operational. Secure configuration and software updates are important."
      },
      {
        label: "Power Continuity",
        value: "Suitable Power Protection and Optional UPS",
        detail: "Power protection and backup runtime are selected according to the equipment load and expected outage duration. A UPS only provides the runtime its capacity and connected load allow; it does not guarantee uninterrupted operation indefinitely."
      },
      {
        label: "Smart Detection",
        value: "Model-Dependent Analytics and Alerts",
        detail: "Human detection, vehicle classification, line crossing and intrusion-zone alerts are available only on compatible equipment. Accuracy varies with camera position, lighting, obstructions and system settings."
      }
    ],
    benefits: [
      {
        title: "Better Visibility Around Your Property",
        description: "Monitor important areas such as entrances, reception points, tills, corridors, parking spaces and approved perimeter locations."
      },
      {
        title: "Review Incidents After They Occur",
        description: "Search recorded footage by date and time, review relevant events and export available recordings for authorised internal investigations or requests from the appropriate authorities."
      },
      {
        title: "Monitor Remotely When Away",
        description: "Use a compatible phone or computer to check camera views and recorded footage when the system, internet connection and remote-access service are available."
      },
      {
        title: "Improve Security Awareness",
        description: "Visible cameras and appropriately configured alerts can help discourage unauthorised activity and bring certain events to the attention of authorised users."
      },
      {
        title: "Reduce Avoidable Downtime",
        description: "Suitable power protection, optional backup power and routine equipment checks can help reduce interruptions caused by power disturbances, equipment faults and neglected maintenance."
      },
      {
        title: "A System Designed for Your Budget",
        description: "Choose a practical camera count and feature set, with room to expand where the recorder, network, storage and power arrangements support future additions."
      },
      {
        title: "More Controlled Access to Footage",
        description: "Configure authorised user accounts and permissions, replace default passwords and apply suitable security settings to reduce unnecessary access to surveillance recordings."
      }
    ],
    idealFor: [
      "Homes, Apartments & Gated Residential Properties",
      "Shops, Retail Outlets & Supermarkets",
      "Schools, Colleges & Educational Facilities",
      "Churches, Mosques & Other Places of Worship",
      "Offices, Clinics & Professional Premises",
      "Warehouses, Workshops & Manufacturing Facilities",
      "Hotels, Guest Houses, Restaurants & Hospitality Businesses",
      "Construction Sites, Depots & Equipment Storage Areas",
      "Parking Areas, Estate Entrances & Approved Perimeter Locations",
      "Businesses Upgrading or Repairing Existing CCTV Systems"
    ],
    whatsappMessage: "Hello Kobby's Intertech, I would like to enquire about CCTV camera installation, remote monitoring or upgrading the security system at my property.",
    image: "/services/cctv_and_security.jpg"
  },
{
    slug: "fibre-internet",
    name: "Fibre Optics & Satellite Internet",
    summary: "Fibre-optic installations, satellite internet setup, wireless links and high-performance network connectivity.",
    badge: "Advanced Internet Connectivity",
    tagline: "Reliable fibre-optic infrastructure, professionally installed satellite internet, and high-performance wireless networking.",
    description: "End-to-end internet connectivity solutions for homes, offices, hotels, commercial facilities, and remote locations. From fibre-optic cable installation and precision splicing to Starlink and other satellite internet installations, we design, deploy, test, and maintain reliable networks tailored to your coverage, speed, and bandwidth requirements.",
    inclusions: [
      "Fibre-Optic Cable Installation, Fusion Splicing, Testing & Termination",
      "Starlink & Compatible Satellite Internet Installation, Mounting & Configuration",
      "Wireless Point-to-Point & Point-to-Multipoint Network Links",
      "High-Performance Dual-Band, Tri-Band & Wi-Fi 6 Router and Access Point Setup",
      "Structured Network Cabling Infrastructure (Cat6 / Cat6A & Fibre-Optic Drops)",
      "Internet Speed Testing, Network Diagnostics, Bandwidth Management & Quality of Service (QoS)",
      "Optical Network Terminal (ONT), Modem, Router & Network Rack Installation",
      "Wi-Fi Coverage Optimisation, Network Expansion & Connectivity Troubleshooting",
      "Internet Connection Redundancy and Failover Configuration"
    ],
    workflow: [
      {
        step: "01",
        title: "Site Survey & Connectivity Assessment",
        description: "We assess fibre availability, satellite service suitability, line-of-sight requirements, building layout, signal conditions, expected device usage, and bandwidth requirements to determine the most appropriate connectivity solution."
      },
      {
        step: "02",
        title: "Network Design & Installation Planning",
        description: "We plan cable routes, satellite antenna placement, mounting positions, equipment locations, power requirements, weather protection, network rack layouts, and Wi-Fi access point coverage."
      },
      {
        step: "03",
        title: "Professional Installation & Configuration",
        description: "We install and terminate fibre-optic cables, perform fusion splicing where required, mount and configure compatible satellite internet equipment, deploy wireless links, and configure routers, switches, and access points."
      },
      {
        step: "04",
        title: "Testing, Optimisation & Handover",
        description: "We verify optical link performance where applicable, measure download and upload speeds, test latency and connection stability, assess Wi-Fi coverage, validate failover configurations where installed, and provide the customer with a system handover."
      }
    ],
    technicalSpecs: [
      {
        label: "Fibre-Optic Infrastructure",
        value: "Single-Mode Fibre & Cat6/Cat6A",
        detail: "Fibre-optic links, structured copper cabling, appropriate terminations, and optical testing based on project requirements."
      },
      {
        label: "Satellite Connectivity",
        value: "Starlink & Compatible Systems",
        detail: "Satellite antenna mounting, unobstructed sky-view assessment, equipment configuration, cable routing, and connectivity verification, subject to provider availability and service compatibility."
      },
      {
        label: "Wireless Technology",
        value: "Wi-Fi 6 & Point-to-Point Links",
        detail: "Modern wireless access points and directional radio links selected according to coverage, capacity, distance, and environmental conditions."
      },
      {
        label: "Network Hardware",
        value: "MikroTik, Ubiquiti, Cisco & Compatible Brands",
        detail: "Router, managed switch, wireless access point, and network management solutions selected to suit the installation and customer budget."
      },
      {
        label: "Optical Termination",
        value: "Fusion Splicing & Connector Termination",
        detail: "Fibre preparation, splicing, connectorisation, and optical loss testing using suitable equipment and procedures."
      },
      {
        label: "Network Performance",
        value: "Speed, Latency, Coverage & Stability",
        detail: "Practical throughput measurements, latency checks, wireless coverage assessment, and network configuration verification."
      }
    ],
    benefits: [
      {
        title: "High-Speed Internet Connectivity",
        description: "Get reliable connectivity for video conferencing, streaming, cloud applications, online learning, business operations, and large file transfers, subject to your internet plan and available network capacity."
      },
      {
        title: "Connectivity for Remote Locations",
        description: "Bring internet access to suitable locations where conventional broadband is unavailable or impractical, using compatible satellite internet services such as Starlink where available."
      },
      {
        title: "Reliable Whole-Building Coverage",
        description: "Reduce Wi-Fi dead zones through properly positioned access points, suitable cabling, wireless links, and coverage-focused network design."
      },
      {
        title: "Support for Multiple Connected Devices",
        description: "Design networks for homes, offices, schools, hotels, and other environments with many simultaneous users, based on the available bandwidth and equipment capacity."
      },
      {
        title: "Improved Network Stability",
        description: "Identify connectivity bottlenecks, optimise network settings, and implement a secondary internet connection with automatic failover where supported and required."
      },
      {
        title: "Professional Installation & Technical Support",
        description: "Receive assistance with installation, equipment configuration, network expansion, fault diagnosis, and ongoing connectivity maintenance."
      }
    ],
    idealFor: [
      "Homes, Apartments & Luxury Villas",
      "Corporate Offices & Coworking Spaces",
      "Schools, Training Centres & Educational Institutions",
      "Hotels, Guest Houses, Restaurants & Lounges",
      "Construction Sites, Farms & Remote Facilities",
      "Businesses Requiring Reliable Primary or Backup Internet",
      "Properties Requiring Fibre-Optic Network Infrastructure"
    ],
    whatsappMessage: "Hello Kobby's Intertech, I would like to enquire about Fibre Optics & Satellite Internet installation and connectivity services.",
    image: "/services/fibre_and_internet.jpg"
  },
{
    slug: "networking",
    name: "Network Design & Infrastructure",
    summary: "Professional network design, structured cabling, wireless networking, security and ongoing technical support.",
    badge: "Secure & Scalable Networking",
    tagline: "Reliable wired and wireless networks engineered for performance, security, scalability and business continuity.",
    description: "We design, install, configure and maintain reliable computer networks for homes, offices, schools, hotels and commercial facilities across Ghana. From structured Ethernet cabling and managed switching to enterprise Wi-Fi, network segmentation, firewall configuration and fault diagnosis, we build network infrastructure tailored to your operational requirements, security needs and future growth.",
    inclusions: [
      "LAN / WAN Network Design, Architecture Planning & Implementation",
      "Structured Ethernet Cabling, Cable Routing, Termination & Labelling",
      "Managed Network Switches, Patch Panels, Network Cabinets & Server Racks",
      "Business Wi-Fi Design, Access Point Installation & Coverage Optimisation",
      "Enterprise Wireless Networking, Mesh Wi-Fi & Seamless Roaming Configuration",
      "Router, Firewall, VLAN Segmentation & Network Access Control Configuration",
      "Guest Wi-Fi Isolation, Staff Network Separation & Secure Remote Access VPNs",
      "Network Cable Testing, Continuity Checks & Certification Where Supported",
      "Network Troubleshooting, Packet Loss Investigation & Performance Optimisation",
      "IP Address Planning, DHCP, DNS & Network Device Configuration",
      "Network Expansion, Equipment Upgrades & Multi-Branch Connectivity",
      "Network Documentation, Configuration Backup & Maintenance Support"
    ],
    workflow: [
      {
        step: "01",
        title: "Network Assessment & Requirements Analysis",
        description: "We assess the site layout, number of users and devices, applications, existing infrastructure, internet connections, security requirements and expected network traffic to determine the appropriate design."
      },
      {
        step: "02",
        title: "Network Architecture & Installation Planning",
        description: "We plan cable routes, network cabinet locations, switch capacities, access point positions, IP addressing, VLANs, equipment requirements and network expansion options."
      },
      {
        step: "03",
        title: "Structured Installation & Configuration",
        description: "We install and label network cables, terminate outlets and patch panels, organise network racks, configure switches and routers, deploy wireless access points, and implement the agreed network security policies."
      },
      {
        step: "04",
        title: "Testing, Security Verification & Handover",
        description: "We test network connectivity, cable performance where applicable, wireless coverage, device communication, VLAN isolation, internet access and configured security controls. We document the installation and provide a customer handover."
      }
    ],
    technicalSpecs: [
      {
        label: "Structured Cabling",
        value: "Cat6 / Cat6A & Fibre-Optic Links",
        detail: "Cabling and termination selected according to distance, bandwidth, installation environment and project requirements."
      },
      {
        label: "Network Switching",
        value: "Gigabit Ethernet & 10GbE Where Required",
        detail: "Managed switches, suitable uplinks, PoE support where needed, and switching capacity matched to connected devices and traffic."
      },
      {
        label: "Wireless Networking",
        value: "Wi-Fi 6 & Compatible Enterprise Wi-Fi",
        detail: "Access point selection, channel planning, coverage optimisation and supported roaming features based on the deployed hardware."
      },
      {
        label: "Network Security",
        value: "VLANs, Firewalls & Access Controls",
        detail: "Network segmentation, guest isolation, traffic filtering and secure remote access where supported by the selected equipment."
      },
      {
        label: "IP Network Services",
        value: "IPv4, DHCP, DNS & Routing",
        detail: "IP address allocation, subnet planning, routing, name resolution and network service configuration."
      },
      {
        label: "Testing & Diagnostics",
        value: "Cable Tests & Network Performance Analysis",
        detail: "Connectivity verification, cable testing, throughput checks, latency measurements and fault investigation using appropriate tools."
      }
    ],
    benefits: [
      {
        title: "Reliable Network Connectivity",
        description: "Reduce avoidable connection interruptions through proper network design, suitable hardware, structured installation and systematic troubleshooting."
      },
      {
        title: "Stronger Network Security",
        description: "Separate guest and internal traffic, apply appropriate access controls, and reduce unnecessary exposure of business systems and devices."
      },
      {
        title: "Consistent Wireless Coverage",
        description: "Improve Wi-Fi coverage throughout offices, classrooms, hotels and multi-storey buildings with appropriately positioned access points and a site-specific wireless design."
      },
      {
        title: "Organised, Documented Infrastructure",
        description: "Keep network cabinets, patch panels and cable runs organised, labelled and documented to simplify maintenance and future fault diagnosis."
      },
      {
        title: "Scalable Network Architecture",
        description: "Plan capacity and infrastructure so additional staff, computers, printers, IP phones, access points and other devices can be accommodated as requirements grow."
      },
      {
        title: "Simpler Maintenance & Fault Resolution",
        description: "Use clear documentation, structured troubleshooting and configuration backups where supported to make ongoing network administration more manageable."
      }
    ],
    idealFor: [
      "Corporate Offices & Multi-Branch Businesses",
      "Small and Medium-Sized Enterprises (SMEs)",
      "Schools, Universities, Training Centres & Computer Labs",
      "Hospitals, Clinics & Healthcare Facilities",
      "Hotels, Guest Houses, Restaurants & Commercial Venues",
      "Warehouses, Workshops & Operational Facilities",
      "Homes, Apartments & Multi-Storey Residential Buildings"
    ],
    whatsappMessage: "Hello Kobby's Intertech, I would like to enquire about professional network design, installation, security and structured cabling services.",
    image: "/services/network.jpg"
  },
{
    slug: "satellite",
    name: "Satellite TV Installation & Support",
    summary: "TV installation, decoder setup, signal troubleshooting and reception support for leading television services in Ghana.",
    badge: "Digital TV & Satellite Systems",
    tagline: "Professional dish installation, decoder configuration and reliable television reception for homes and businesses.",
    description: "We provide television installation, configuration, maintenance and troubleshooting services across Ghana. We support DStv, Multi TV, HD+, StarTimes, Strong Digital TV and GOtv, helping customers with compatible dish or antenna installation, decoder setup, signal optimisation, channel scanning, cabling repairs and multi-room TV connections according to each provider's technology and requirements.",
    inclusions: [
      "DStv Dish Installation, Alignment, Decoder Setup & Signal Troubleshooting",
      "Multi TV Satellite Reception, Dish Installation & Free-to-Air Channel Configuration",
      "HD+ Compatible Dish Installation, Decoder Configuration & Reception Support",
      "StarTimes Digital TV Installation, Decoder Setup & Compatible Antenna Configuration",
      "Strong Digital TV Installation, Receiver Setup & Compatible Satellite Reception",
      "GOtv Decoder Setup, Compatible Antenna Installation & Signal Troubleshooting",
      "Satellite Dish Mounting, Realignment, Relocation & Secure Fixing",
      "LNB Installation, Replacement & Configuration for Compatible TV Systems",
      "RG6 Coaxial Cable Installation, Connector Replacement & Cable Fault Repairs",
      "Digital TV Antenna Installation, Positioning & Reception Optimisation",
      "Decoder Configuration, Channel Scanning & Missing-Channel Troubleshooting",
      "Multi-Room Television Cabling and Distribution for Compatible Equipment",
      "Signal Loss Diagnosis, Reception Quality Checks & System Maintenance",
      "Additional TV Point Installation for Homes, Offices, Hotels and Viewing Centres"
    ],
    workflow: [
      {
        step: "01",
        title: "TV Service & Site Assessment",
        description: "We identify the customer's TV service, decoder or receiver model, required channels, installation location and existing equipment. We assess whether the service requires a satellite dish, terrestrial antenna or another compatible reception arrangement."
      },
      {
        step: "02",
        title: "Equipment Selection & Installation Planning",
        description: "We determine the suitable dish or antenna, mounting position, cabling route, connectors and supporting equipment based on the selected service, site conditions and provider requirements."
      },
      {
        step: "03",
        title: "Dish or Antenna Installation & Configuration",
        description: "We securely mount and align satellite dishes where required, position compatible terrestrial antennas, install cables and connectors, and configure the decoder or receiver for the intended TV service."
      },
      {
        step: "04",
        title: "Signal Testing & Customer Handover",
        description: "We check reception quality, scan for available channels, investigate missing-channel or signal problems, test additional TV points where installed, and explain basic equipment operation and maintenance."
      }
    ],
    technicalSpecs: [
      {
        label: "Supported TV Services",
        value: "DStv, Multi TV, HD+, StarTimes, Strong Digital TV & GOtv",
        detail: "Installation and technical support for compatible equipment and reception systems used by these services in Ghana."
      },
      {
        label: "Satellite Dish Systems",
        value: "Compatible Dish, LNB & Receiver Configurations",
        detail: "Dish installation, alignment, LNB selection and receiver configuration according to the satellite service and equipment requirements."
      },
      {
        label: "Terrestrial TV Reception",
        value: "Compatible Digital TV Antennas",
        detail: "Antenna installation, positioning and reception checks for terrestrial services such as GOtv and compatible StarTimes systems."
      },
      {
        label: "Coaxial Cabling",
        value: "RG6 Coaxial Cable & Compatible Connectors",
        detail: "Appropriate cable routing, connector installation and inspection for damaged connections or signal loss."
      },
      {
        label: "Decoder & Receiver Setup",
        value: "Provider-Compatible Digital Receivers",
        detail: "Decoder installation, channel scanning, reception troubleshooting and configuration according to the supported device and service."
      },
      {
        label: "Multi-Room TV",
        value: "Compatible Additional TV Connections",
        detail: "Additional television points and suitable distribution equipment, subject to provider rules, decoder capabilities and installation requirements."
      }
    ],
    benefits: [
      {
        title: "Support for Popular TV Services",
        description: "Get installation and technical assistance for DStv, Multi TV, HD+, StarTimes, Strong Digital TV and GOtv, subject to compatible equipment and the services available in your area."
      },
      {
        title: "Better Signal Reception",
        description: "Improve reception through correct dish alignment or antenna positioning, suitable cabling and systematic signal troubleshooting."
      },
      {
        title: "Professional Equipment Setup",
        description: "Have your compatible decoder, receiver, dish or antenna installed and configured for the selected television service."
      },
      {
        title: "TV Connections in Multiple Rooms",
        description: "Extend television connections to additional rooms using an appropriate distribution arrangement compatible with your equipment."
      },
      {
        title: "Troubleshooting & Repairs",
        description: "Get help with weak signals, missing channels, damaged coaxial cables, faulty connectors, LNB problems and decoder configuration issues."
      },
      {
        title: "Neat & Secure Installation",
        description: "Benefit from properly routed cables, suitable mounting hardware, organised connections and an installation designed for easier maintenance."
      }
    ],
    idealFor: [
      "Homes, Apartments & Residential Properties",
      "DStv, Multi TV & HD+ Customers",
      "StarTimes, Strong Digital TV & GOtv Customers",
      "Hotels, Guest Houses & Lodging Facilities",
      "Restaurants, Sports Viewing Centres & Lounges",
      "Offices, Reception Areas & Meeting Rooms",
      "Landlords and Property Managers Requiring Multiple TV Connections"
    ],
    whatsappMessage: "Hello Kobby's Intertech, I would like to enquire about DStv, Multi TV, HD+, StarTimes, Strong Digital TV or GOtv installation and technical support.",
    image: "/services/satellite.jpg"
  },
{
    slug: "electrical-works",
    name: "Electrical Installation & Power Solutions",
    summary: "Residential and commercial electrical installations, fault repairs, power protection and backup power integration.",
    badge: "Safe Electrical & Power Systems",
    tagline: "Dependable electrical installations, practical power protection and professionally planned backup power solutions.",
    description: "We provide electrical installation and maintenance services for homes, shops, offices, schools, churches and commercial properties across Ghana. Our services cover wiring for new buildings and renovations, distribution board upgrades, socket and lighting installations, electrical fault diagnosis, earthing and protective devices, and integration of compatible inverter, battery and generator systems. Every project is assessed according to its requirements, with regulated electrical wiring, inspection and testing undertaken by appropriately certified professionals in accordance with applicable Ghanaian requirements.",
    inclusions: [
      "Electrical Wiring for New Buildings, Extensions & Renovations",
      "Distribution Board Installation, Circuit Identification & Upgrades",
      "Circuit Breaker, RCD / RCCB, RCBO & Surge Protection Device Installation",
      "Socket Outlets, Switches, Lighting Points & Dedicated Appliance Circuits",
      "Electrical Fault Finding, Tripping Breaker Diagnosis & Damaged Wiring Repairs",
      "Earthing, Bonding & Electrical Protective Conductor Inspection",
      "Voltage Fluctuation Investigation & Protection for Sensitive Equipment",
      "Inverter, Battery Backup & Automatic or Manual Changeover Integration",
      "Generator Connection, Changeover Switch & Essential Load Circuit Planning",
      "Solar Power Electrical Integration and Compatible Inverter Connections",
      "Indoor, Outdoor, Security & Energy-Efficient LED Lighting Installation",
      "Electrical Load Assessment, Circuit Balancing & Capacity Planning",
      "Electrical Installation Testing, Safety Checks & Inspection Coordination",
      "Preventive Electrical Maintenance for Homes and Commercial Properties"
    ],
    workflow: [
      {
        step: "01",
        title: "Site Inspection & Electrical Safety Assessment",
        description: "We assess the existing wiring, distribution board, supply capacity, earthing arrangements, protective devices, connected appliances and reported faults. For backup power projects, we also identify essential loads and assess the customer's operating requirements."
      },
      {
        step: "02",
        title: "Load Calculation & Installation Planning",
        description: "We determine circuit requirements, suitable conductor sizes, protective device ratings, equipment locations, cable routes and anticipated loads. Where an inverter, battery or generator is involved, we plan compatible equipment, changeover arrangements and essential circuits."
      },
      {
        step: "03",
        title: "Installation, Repairs & Protection",
        description: "Appropriately qualified professionals carry out the authorised electrical work using suitable materials and protective devices. Depending on the project, this may include wiring, distribution board upgrades, socket and lighting installation, fault repairs, earthing improvements and backup power connections."
      },
      {
        step: "04",
        title: "Testing, Verification & Handover",
        description: "We arrange the applicable installation tests, including continuity, insulation resistance, polarity, protective conductor and earthing checks, and functional verification of protective devices. Results, outstanding issues and required inspection or certification are documented as applicable before handover."
      }
    ],
    technicalSpecs: [
      {
        label: "Wiring & Cable Selection",
        value: "Copper Conductors Sized for Each Circuit",
        detail: "Conductor size and insulation type selected according to load current, installation method, cable length, voltage drop, environmental conditions and applicable standards."
      },
      {
        label: "Circuit Protection",
        value: "MCBs, RCDs, RCCBs, RCBOs & SPDs",
        detail: "Protective devices selected according to the circuit design, fault conditions, equipment requirements and applicable electrical standards."
      },
      {
        label: "Earthing & Bonding",
        value: "Verified Protective Earthing System",
        detail: "Inspection and testing of protective conductors, earthing arrangements and bonding where applicable. Acceptable results depend on the earthing system, protective devices and installation requirements."
      },
      {
        label: "Backup Power",
        value: "Inverters, Batteries & Generators",
        detail: "Compatible changeover equipment, properly rated conductors, isolation, protection and essential-load planning for the selected backup power arrangement."
      },
      {
        label: "Surge & Voltage Protection",
        value: "Suitable SPDs & Voltage Protection",
        detail: "Surge protection and, where required, voltage monitoring or regulation selected according to the supply conditions, equipment sensitivity and installation design."
      },
      {
        label: "Testing & Verification",
        value: "Electrical Installation Test Instruments",
        detail: "Appropriate instruments and procedures for continuity, insulation resistance, polarity, earth-fault protection and other applicable installation tests."
      }
    ],
    benefits: [
      {
        title: "Safer Electrical Installations",
        description: "Address deteriorated wiring, loose connections, overloaded circuits and unsuitable protective devices to reduce electrical shock, overheating and fire risks."
      },
      {
        title: "Protection Against Power Problems",
        description: "Assess voltage fluctuations and surge risks, then recommend suitable protective measures for televisions, computers, networking equipment, appliances and other sensitive electronics."
      },
      {
        title: "Backup Power When the Grid Goes Off",
        description: "Plan compatible inverter, battery or generator connections to keep selected essential loads operating during power interruptions, within the installed system's capacity."
      },
      {
        title: "Reliable Lighting & Socket Installations",
        description: "Install practical lighting layouts, additional sockets, outdoor security lighting and dedicated circuits suited to the property's electrical requirements."
      },
      {
        title: "Better Load Management",
        description: "Identify overloaded circuits, distribute loads appropriately and plan additional circuits or capacity upgrades where the existing installation permits."
      },
      {
        title: "Documented Testing & Maintenance",
        description: "Improve long-term maintainability through appropriate testing, clear circuit identification, fault reports and recommendations for corrective work."
      }
    ],
    idealFor: [
      "New Homes, Building Projects & Renovations",
      "Existing Homes Requiring Wiring Repairs or Upgrades",
      "Shops, Offices & Small and Medium-Sized Businesses",
      "Schools, Churches & Institutional Buildings",
      "Hotels, Guest Houses & Commercial Properties",
      "Computer Rooms, CCTV Systems & Network Equipment",
      "Properties Requiring Inverter, Battery or Generator Backup",
      "Landlords and Property Managers Arranging Electrical Maintenance"
    ],
    whatsappMessage: "Hello Kobby's Intertech, I would like to enquire about electrical installation, fault repairs, power protection or inverter and generator integration.",
    image: "/services/electrical_works.jpg"
  },
  {
    slug: "gps-tracking",
    name: "GPS Vehicle Tracking & Fleet Management",
    summary: "Vehicle tracking, anti-theft monitoring, fleet visibility and ongoing technical support for vehicles operating across Ghana.",
    badge: "Vehicle Security & Fleet Monitoring",
    tagline: "Know where your vehicles are, monitor their movements and manage your fleet with greater confidence.",
    description: "We provide GPS vehicle-tracking installation and support for private vehicle owners, businesses and fleet operators across Ghana. Our services help customers monitor vehicle locations, review trip history, set up geofence alerts and track driving activity through compatible mobile apps or web platforms. Depending on the selected tracker and service plan, additional features may include ignition status, tamper alerts, overspeed notifications and remote immobilisation. We assess each vehicle and customer's requirements before recommending compatible equipment. Tracking performance, alert delivery, history retention and remote-control features depend on the hardware, platform subscription, GPS reception and mobile-network coverage.",
    inclusions: [
      "GPS Tracker Installation for Cars, SUVs, Pickups, Trucks & Motorbikes",
      "Vehicle Location Monitoring Through Compatible Mobile Apps or Web Dashboards",
      "Trip History, Route Playback & Journey Reporting Where Supported",
      "Geofence Setup for Homes, Offices, Depots, Worksites & Delivery Areas",
      "Overspeed Alerts, Ignition Status & Movement Notifications Where Supported",
      "Tamper, Power Disconnection & Low-Backup-Battery Alerts Where Supported",
      "Remote Engine Immobilisation for Compatible Vehicles and Tracker Systems",
      "Fleet Location Monitoring for Multiple Vehicles Under One Account",
      "Driver Activity, Stop Duration, Mileage & Idle-Time Reporting Where Supported",
      "SIM Installation, Device Activation & Tracker Platform Configuration",
      "Tracker Health Checks, Fault Diagnosis & After-Installation Support",
      "Customer Guidance on App Usage, Alerts, Subscriptions & Device Limitations"
    ],
    workflow: [
      {
        step: "01",
        title: "Vehicle Assessment & Requirements",
        description: "We establish the number and types of vehicles, their operating locations, security concerns and monitoring needs. We also check tracker compatibility, available power connections, expected mobile-network coverage and whether the customer needs basic tracking or fleet-management features."
      },
      {
        step: "02",
        title: "Tracker Installation & Electrical Checks",
        description: "We install the selected device in a suitable, secure location, following the manufacturer's instructions and the vehicle's electrical requirements. Wiring is routed and secured professionally, with appropriate protection against heat, moisture, vibration and accidental damage. Installation locations are agreed with the authorised vehicle owner or fleet manager."
      },
      {
        step: "03",
        title: "Device Activation & Feature Configuration",
        description: "We configure the supported SIM or connectivity service, activate the tracking platform and test location reporting. Where available, we set up geofences, movement alerts, overspeed notifications, trip reports and authorised remote-control features. Any immobilisation function is installed and tested only when appropriate for the vehicle and operating conditions."
      },
      {
        step: "04",
        title: "Handover, User Training & Support",
        description: "We show the customer how to sign in, locate vehicles, review trip history, configure alerts and report faults. We explain any SIM or platform subscription charges, expected network limitations, data-retention period and supported features. The customer receives guidance on maintenance, troubleshooting and requesting technical support."
      }
    ],
    technicalSpecs: [
      {
        label: "Location Technology",
        value: "GNSS / GPS Tracking",
        detail: "Location accuracy depends on the tracker, satellite visibility, installation position and surrounding environment. Buildings, covered parking, tunnels and other obstructions may affect positioning."
      },
      {
        label: "Data Connectivity",
        value: "Compatible Cellular Network or Supported Alternative",
        detail: "The device transmits location data using its supported communication method. Reporting frequency and availability depend on mobile-network coverage, SIM/data service, device configuration and platform status."
      },
      {
        label: "Remote Immobilisation",
        value: "Compatible Tracker & Vehicle Integration",
        detail: "Available only on supported devices and suitable vehicles. Installation requires appropriate electrical protection and safety controls; remote immobilisation must never be triggered while the vehicle is moving or in an unsafe location."
      },
      {
        label: "Power & Tamper Monitoring",
        value: "Device-Dependent Alerts",
        detail: "External-power loss, backup-battery operation and tamper notifications are available only when supported by the selected hardware and configured correctly. A tracker may stop reporting if its power, battery or communication service fails."
      },
      {
        label: "Tracking History",
        value: "Platform-Dependent Route Records",
        detail: "Trip history and report retention depend on the tracking platform, subscription plan, device settings and service availability. The available retention period is confirmed before purchase or activation."
      },
      {
        label: "Fleet Reporting",
        value: "Multi-Vehicle Dashboard Where Supported",
        detail: "Depending on the platform, fleet users may access vehicle locations, trip records, geofence events, stop durations and other reports. Driver identification and mileage accuracy depend on available data and system configuration."
      }
    ],
    benefits: [
      {
        title: "Improved Vehicle Visibility",
        description: "Check the reported location of a vehicle from a compatible phone or computer, subject to device operation, satellite reception and network availability."
      },
      {
        title: "Support for Theft Response",
        description: "Use the tracker's available location and movement information to assist with reporting and recovery efforts. Tracking cannot guarantee recovery, and customers should contact the appropriate authorities if a vehicle is stolen."
      },
      {
        title: "Better Fleet Oversight",
        description: "Review vehicle movements, trips and stops to help manage delivery schedules, business travel, inter-city operations and vehicle utilisation."
      },
      {
        title: "Alerts for Unusual Movement",
        description: "Configure supported geofence, movement, overspeed or power-disconnection alerts to help identify activity that may require investigation."
      },
      {
        title: "More Informed Operating Decisions",
        description: "Use available journey and fleet reports to review routes, stop durations and vehicle use, while recognising that report accuracy depends on the tracker and platform."
      },
      {
        title: "Installation & Ongoing Technical Support",
        description: "Receive assistance with device activation, app access, connectivity problems, alert configuration and troubleshooting after installation."
      }
    ],
    idealFor: [
      "Private Car, SUV & Pickup Owners",
      "Small Businesses & Corporate Vehicle Fleets",
      "Delivery Services, Dispatch Riders & Motorbike Fleets",
      "Haulage, Logistics & Inter-City Transport Operators",
      "Schools and Organisations Managing Authorised Transport Vehicles",
      "Construction Companies & Worksite Vehicle Fleets",
      "Field-Service Teams & Sales Representatives Using Company Vehicles",
      "Fleet Managers Requiring Multi-Vehicle Monitoring"
    ],
    whatsappMessage: "Hello Kobby's Intertech, I would like to enquire about GPS vehicle tracking, anti-theft monitoring or fleet management for vehicles operating in Ghana.",
    image: "/services/gps_tracking.jpg"
  },
];

export const faqs = [
  ["Which areas do you serve?", "Kobby’s Intertech Services is currently available in Ghana. Contact us with your location so we can discuss your requirements."],
  ["When are you open?", "Our current business hours are Monday to Saturday, 7:30 am to 5:00 pm."],
  ["Can I request a quotation?", "Yes. Tell us about the service you need and your location, and our team will review your request before providing a quotation where appropriate."],
  ["Do you offer fixed prices?", "Requirements vary by service and site. Quotations are prepared after the relevant details have been reviewed."],
  ["How can I reach the team?", "You can call or WhatsApp +233 24 348 7160, or email kobbysintertech@gmail.com."],
] as const;
