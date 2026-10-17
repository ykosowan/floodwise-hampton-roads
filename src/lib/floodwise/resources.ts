import type { City, CityResources } from "./types";

/**
 * Official city references, provided verbatim in the project brief.
 * Do not add phone numbers, URLs or services that are not verified.
 * Last reviewed: October 2026.
 */
export const CITY_RESOURCES: Record<City, CityResources> = {
  "virginia-beach": {
    city: "virginia-beach",
    name: "Virginia Beach",
    resources: [
      {
        id: "vb-service-requests",
        name: "Public Works service requests",
        description: "General city service requests, including reporting a flooded roadway.",
        url: "https://pw.virginiabeach.gov/roads/service-requests",
        relevantTo: ["street", "drain"],
      },
      {
        id: "vb-stormwater-maintenance",
        name: "Public Works Stormwater Maintenance",
        description: "Phone line for street flooding concerns.",
        phone: "757-385-1470",
        relevantTo: ["street", "drain"],
      },
      {
        id: "vb-311",
        name: "VB311",
        description: "The city's general information and service line.",
        phone: "757-385-3111",
        relevantTo: ["yard", "street", "home", "drain"],
      },
      {
        id: "vb-stormwater",
        name: "Stormwater and flood protection",
        description: "City information about stormwater and flood protection.",
        url: "https://pw.virginiabeach.gov/stormwater",
        relevantTo: ["yard", "home", "street", "drain"],
      },
    ],
  },
  chesapeake: {
    city: "chesapeake",
    name: "Chesapeake",
    resources: [
      {
        id: "ch-contact-center",
        name: "Customer Contact Center",
        description: "Phone line for stormwater drainage concerns.",
        phone: "757-382-2489",
        relevantTo: ["yard", "street", "drain", "home"],
      },
      {
        id: "ch-stormwater",
        name: "Stormwater Management Division",
        description: "City information about stormwater and drainage.",
        url: "https://www.cityofchesapeake.net/1029/Stormwater-Management-Division",
        relevantTo: ["yard", "street", "drain", "home"],
      },
      {
        id: "ch-report",
        name: "City reporting resources",
        description: "The city's page for reporting problems and concerns.",
        url: "https://www.cityofchesapeake.net/146/Report",
        relevantTo: ["street", "drain"],
      },
      {
        id: "ch-water-sewer",
        name: "Water and sewer emergency information",
        description: "Information on reporting water and sewer problems.",
        url: "https://www.cityofchesapeake.net/956/Report-a-Problem",
        relevantTo: ["home"],
        sewage: true,
      },
    ],
  },
};
