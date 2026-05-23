import { Part, ComponentType } from "../core/types";

export const partsDatabase: Part[] = [
  // FRAME - Price increases over time due to material costs
  {
    id: "steel_frame",
    name: "Steel Frame",
    component: ComponentType.FRAME,
    description: "Durable steel frame",
    compatibilityNotes: "Compatible with all handlebar and brake types",
    priceHistory: [
      {
        validFrom: new Date("2016-01-01"),
        validUntil: new Date("2016-06-30"),
        price: 1000,
      },
      {
        validFrom: new Date("2016-07-01"),
        validUntil: new Date("2016-11-30"),
        price: 1100,
      },
      {
        validFrom: new Date("2016-12-01"),
        validUntil: new Date("2017-05-31"),
        price: 1200,
      },
      {
        validFrom: new Date("2017-06-01"),
        validUntil: new Date("2018-03-31"),
        price: 1250,
      },
      {
        validFrom: new Date("2018-04-01"),
        validUntil: new Date("2019-02-28"),
        price: 1350,
      },
      {
        validFrom: new Date("2019-03-01"),
        validUntil: new Date("2020-01-31"),
        price: 1450,
      },
      {
        validFrom: new Date("2020-02-01"),
        validUntil: new Date("2021-07-31"),
        price: 1550,
      },
      {
        validFrom: new Date("2021-08-01"),
        validUntil: new Date("2022-12-31"),
        price: 1700,
      },
      {
        validFrom: new Date("2023-01-01"),
        validUntil: new Date("2024-06-30"),
        price: 1850,
      },
      {
        validFrom: new Date("2024-07-01"),
        validUntil: null,
        price: 2000,
      },
    ],
  },
  {
    id: "aluminium_frame",
    name: "Aluminium Frame",
    component: ComponentType.FRAME,
    description: "Lightweight aluminium frame",
    compatibilityNotes: "Compatible with all handlebar and brake types",
    priceHistory: [
      {
        validFrom: new Date("2016-01-01"),
        validUntil: new Date("2016-05-31"),
        price: 1500,
      },
      {
        validFrom: new Date("2016-06-01"),
        validUntil: new Date("2016-10-31"),
        price: 1600,
      },
      {
        validFrom: new Date("2016-11-01"),
        validUntil: new Date("2017-04-30"),
        price: 1800,
      },
      {
        validFrom: new Date("2017-05-01"),
        validUntil: new Date("2018-02-28"),
        price: 1900,
      },
      {
        validFrom: new Date("2018-03-01"),
        validUntil: new Date("2019-01-31"),
        price: 2000,
      },
      {
        validFrom: new Date("2019-02-01"),
        validUntil: new Date("2020-06-30"),
        price: 2150,
      },
      {
        validFrom: new Date("2020-07-01"),
        validUntil: new Date("2021-11-30"),
        price: 2300,
      },
      {
        validFrom: new Date("2021-12-01"),
        validUntil: new Date("2023-05-31"),
        price: 2500,
      },
      {
        validFrom: new Date("2023-06-01"),
        validUntil: new Date("2024-12-31"),
        price: 2700,
      },
      {
        validFrom: new Date("2025-01-01"),
        validUntil: null,
        price: 2900,
      },
    ],
  },

  // HANDLEBAR & BRAKES - Varying prices
  {
    id: "standard_handlebar",
    name: "Standard Handlebar",
    component: ComponentType.HANDLEBAR_BRAKES,
    description: "Basic handlebar",
    priceHistory: [
      {
        validFrom: new Date("2016-01-01"),
        validUntil: new Date("2016-08-31"),
        price: 150,
      },
      {
        validFrom: new Date("2016-09-01"),
        validUntil: new Date("2017-07-31"),
        price: 200,
      },
      {
        validFrom: new Date("2017-08-01"),
        validUntil: new Date("2018-12-31"),
        price: 220,
      },
      {
        validFrom: new Date("2019-01-01"),
        validUntil: new Date("2020-05-31"),
        price: 240,
      },
      {
        validFrom: new Date("2020-06-01"),
        validUntil: new Date("2021-10-31"),
        price: 260,
      },
      {
        validFrom: new Date("2021-11-01"),
        validUntil: new Date("2023-03-31"),
        price: 280,
      },
      {
        validFrom: new Date("2023-04-01"),
        validUntil: new Date("2024-08-31"),
        price: 300,
      },
      {
        validFrom: new Date("2024-09-01"),
        validUntil: null,
        price: 320,
      },
    ],
  },
  {
    id: "v_brakes",
    name: "V-Brakes",
    component: ComponentType.HANDLEBAR_BRAKES,
    description: "V-type brakes",
    priceHistory: [
      {
        validFrom: new Date("2016-01-01"),
        validUntil: new Date("2016-07-31"),
        price: 300,
      },
      {
        validFrom: new Date("2016-08-01"),
        validUntil: new Date("2016-11-30"),
        price: 325,
      },
      {
        validFrom: new Date("2016-12-01"),
        validUntil: new Date("2017-06-30"),
        price: 350,
      },
      {
        validFrom: new Date("2017-07-01"),
        validUntil: new Date("2018-05-31"),
        price: 375,
      },
      {
        validFrom: new Date("2018-06-01"),
        validUntil: new Date("2019-04-30"),
        price: 400,
      },
      {
        validFrom: new Date("2019-05-01"),
        validUntil: new Date("2020-09-30"),
        price: 425,
      },
      {
        validFrom: new Date("2020-10-01"),
        validUntil: new Date("2022-02-28"),
        price: 450,
      },
      {
        validFrom: new Date("2022-03-01"),
        validUntil: new Date("2023-07-31"),
        price: 475,
      },
      {
        validFrom: new Date("2023-08-01"),
        validUntil: new Date("2025-01-31"),
        price: 500,
      },
      {
        validFrom: new Date("2025-02-01"),
        validUntil: null,
        price: 525,
      },
    ],
  },
  {
    id: "disc_brakes",
    name: "Disc Brakes",
    component: ComponentType.HANDLEBAR_BRAKES,
    description: "High-performance disc brakes",
    priceHistory: [
      {
        validFrom: new Date("2016-01-01"),
        validUntil: new Date("2016-06-30"),
        price: 450,
      },
      {
        validFrom: new Date("2016-07-01"),
        validUntil: new Date("2016-10-31"),
        price: 475,
      },
      {
        validFrom: new Date("2016-11-01"),
        validUntil: new Date("2017-05-31"),
        price: 500,
      },
      {
        validFrom: new Date("2017-06-01"),
        validUntil: new Date("2018-04-30"),
        price: 525,
      },
      {
        validFrom: new Date("2018-05-01"),
        validUntil: new Date("2019-03-31"),
        price: 550,
      },
      {
        validFrom: new Date("2019-04-01"),
        validUntil: new Date("2020-08-31"),
        price: 575,
      },
      {
        validFrom: new Date("2020-09-01"),
        validUntil: new Date("2022-01-31"),
        price: 600,
      },
      {
        validFrom: new Date("2022-02-01"),
        validUntil: new Date("2023-06-30"),
        price: 650,
      },
      {
        validFrom: new Date("2023-07-01"),
        validUntil: new Date("2025-01-31"),
        price: 700,
      },
      {
        validFrom: new Date("2025-02-01"),
        validUntil: null,
        price: 750,
      },
    ],
  },

  // SEATING - Price changes over time
  {
    id: "basic_saddle",
    name: "Basic Saddle",
    component: ComponentType.SEATING,
    description: "Basic comfort saddle",
    priceHistory: [
      {
        validFrom: new Date("2016-01-01"),
        validUntil: new Date("2016-09-30"),
        price: 250,
      },
      {
        validFrom: new Date("2016-10-01"),
        validUntil: new Date("2017-08-31"),
        price: 300,
      },
      {
        validFrom: new Date("2017-09-01"),
        validUntil: new Date("2018-07-31"),
        price: 320,
      },
      {
        validFrom: new Date("2018-08-01"),
        validUntil: new Date("2019-06-30"),
        price: 340,
      },
      {
        validFrom: new Date("2019-07-01"),
        validUntil: new Date("2021-01-31"),
        price: 360,
      },
      {
        validFrom: new Date("2021-02-01"),
        validUntil: new Date("2022-08-31"),
        price: 400,
      },
      {
        validFrom: new Date("2022-09-01"),
        validUntil: new Date("2024-03-31"),
        price: 440,
      },
      {
        validFrom: new Date("2024-04-01"),
        validUntil: null,
        price: 480,
      },
    ],
  },
  {
    id: "ergonomic_saddle",
    name: "Ergonomic Saddle",
    component: ComponentType.SEATING,
    description: "Ergonomic comfort saddle",
    priceHistory: [
      {
        validFrom: new Date("2016-01-01"),
        validUntil: new Date("2016-05-31"),
        price: 400,
      },
      {
        validFrom: new Date("2016-06-01"),
        validUntil: new Date("2016-10-31"),
        price: 450,
      },
      {
        validFrom: new Date("2016-11-01"),
        validUntil: new Date("2017-04-30"),
        price: 500,
      },
      {
        validFrom: new Date("2017-05-01"),
        validUntil: new Date("2018-03-31"),
        price: 540,
      },
      {
        validFrom: new Date("2018-04-01"),
        validUntil: new Date("2019-02-28"),
        price: 580,
      },
      {
        validFrom: new Date("2019-03-01"),
        validUntil: new Date("2020-08-31"),
        price: 620,
      },
      {
        validFrom: new Date("2020-09-01"),
        validUntil: new Date("2022-01-31"),
        price: 680,
      },
      {
        validFrom: new Date("2022-02-01"),
        validUntil: new Date("2023-09-30"),
        price: 750,
      },
      {
        validFrom: new Date("2023-10-01"),
        validUntil: new Date("2025-05-31"),
        price: 820,
      },
      {
        validFrom: new Date("2025-06-01"),
        validUntil: null,
        price: 900,
      },
    ],
  },

  // WHEELS - Include Rim, Tube, Standard Tyre, Tubeless Tyre, and Spokes
  {
    id: "rim",
    name: "Rim",
    component: ComponentType.WHEELS,
    description: "Standard wheel rim",
    compatibilityNotes: "Compatible with standard and tubeless tyres",
    priceHistory: [
      {
        validFrom: new Date("2016-01-01"),
        validUntil: new Date("2016-07-31"),
        price: 350,
      },
      {
        validFrom: new Date("2016-08-01"),
        validUntil: new Date("2016-11-30"),
        price: 375,
      },
      {
        validFrom: new Date("2016-12-01"),
        validUntil: new Date("2017-05-31"),
        price: 400,
      },
      {
        validFrom: new Date("2017-06-01"),
        validUntil: new Date("2018-04-30"),
        price: 420,
      },
      {
        validFrom: new Date("2018-05-01"),
        validUntil: new Date("2019-03-31"),
        price: 440,
      },
      {
        validFrom: new Date("2019-04-01"),
        validUntil: new Date("2020-08-31"),
        price: 460,
      },
      {
        validFrom: new Date("2020-09-01"),
        validUntil: new Date("2022-01-31"),
        price: 490,
      },
      {
        validFrom: new Date("2022-02-01"),
        validUntil: new Date("2023-08-31"),
        price: 520,
      },
      {
        validFrom: new Date("2023-09-01"),
        validUntil: new Date("2025-04-30"),
        price: 550,
      },
      {
        validFrom: new Date("2025-05-01"),
        validUntil: null,
        price: 580,
      },
    ],
  },
  {
    id: "tube",
    name: "Tube",
    component: ComponentType.WHEELS,
    description: "Inner tube",
    compatibilityNotes:
      "Use with standard tyres only. Not compatible with tubeless tyres",
    priceHistory: [
      {
        validFrom: new Date("2016-01-01"),
        validUntil: new Date("2016-08-31"),
        price: 120,
      },
      {
        validFrom: new Date("2016-09-01"),
        validUntil: new Date("2017-07-31"),
        price: 150,
      },
      {
        validFrom: new Date("2017-08-01"),
        validUntil: new Date("2018-06-30"),
        price: 160,
      },
      {
        validFrom: new Date("2018-07-01"),
        validUntil: new Date("2019-12-31"),
        price: 170,
      },
      {
        validFrom: new Date("2020-01-01"),
        validUntil: new Date("2021-06-30"),
        price: 180,
      },
      {
        validFrom: new Date("2021-07-01"),
        validUntil: new Date("2023-02-28"),
        price: 200,
      },
      {
        validFrom: new Date("2023-03-01"),
        validUntil: new Date("2024-10-31"),
        price: 220,
      },
      {
        validFrom: new Date("2024-11-01"),
        validUntil: null,
        price: 240,
      },
    ],
  },
  {
    id: "standard_tyre",
    name: "Standard Tyre",
    component: ComponentType.WHEELS,
    description: "Standard bicycle tyre",
    compatibilityNotes: "Compatible with rim and inner tube",
    priceHistory: [
      {
        validFrom: new Date("2016-01-01"),
        validUntil: new Date("2016-04-30"),
        price: 150,
      },
      {
        validFrom: new Date("2016-05-01"),
        validUntil: new Date("2016-09-30"),
        price: 175,
      },
      {
        validFrom: new Date("2016-10-01"),
        validUntil: new Date("2017-03-31"),
        price: 200,
      },
      {
        validFrom: new Date("2017-04-01"),
        validUntil: new Date("2018-02-28"),
        price: 220,
      },
      {
        validFrom: new Date("2018-03-01"),
        validUntil: new Date("2019-01-31"),
        price: 240,
      },
      {
        validFrom: new Date("2019-02-01"),
        validUntil: new Date("2020-07-31"),
        price: 260,
      },
      {
        validFrom: new Date("2020-08-01"),
        validUntil: new Date("2022-01-31"),
        price: 290,
      },
      {
        validFrom: new Date("2022-02-01"),
        validUntil: new Date("2023-08-31"),
        price: 320,
      },
      {
        validFrom: new Date("2023-09-01"),
        validUntil: new Date("2025-04-30"),
        price: 350,
      },
      {
        validFrom: new Date("2025-05-01"),
        validUntil: null,
        price: 380,
      },
    ],
  },
  {
    id: "tubeless_tyre",
    name: "Tubeless Tyre",
    component: ComponentType.WHEELS,
    description: "Tubeless bicycle tyre",
    compatibilityNotes: "Requires rim only. Not compatible with inner tube",
    priceHistory: [
      {
        validFrom: new Date("2016-01-01"),
        validUntil: new Date("2016-03-31"),
        price: 180,
      },
      {
        validFrom: new Date("2016-04-01"),
        validUntil: new Date("2016-08-31"),
        price: 200,
      },
      {
        validFrom: new Date("2016-09-01"),
        validUntil: new Date("2016-11-30"),
        price: 215,
      },
      {
        validFrom: new Date("2016-12-01"),
        validUntil: new Date("2017-05-31"),
        price: 230,
      },
      {
        validFrom: new Date("2017-06-01"),
        validUntil: new Date("2018-04-30"),
        price: 250,
      },
      {
        validFrom: new Date("2018-05-01"),
        validUntil: new Date("2019-03-31"),
        price: 270,
      },
      {
        validFrom: new Date("2019-04-01"),
        validUntil: new Date("2020-09-30"),
        price: 295,
      },
      {
        validFrom: new Date("2020-10-01"),
        validUntil: new Date("2022-03-31"),
        price: 325,
      },
      {
        validFrom: new Date("2022-04-01"),
        validUntil: new Date("2024-01-31"),
        price: 360,
      },
      {
        validFrom: new Date("2024-02-01"),
        validUntil: null,
        price: 395,
      },
    ],
  },
  {
    id: "spokes",
    name: "Spokes",
    component: ComponentType.WHEELS,
    description: "Wheel spokes set",
    compatibilityNotes: "Compatible with all rim and tyre combinations",
    priceHistory: [
      {
        validFrom: new Date("2016-01-01"),
        validUntil: new Date("2016-07-31"),
        price: 400,
      },
      {
        validFrom: new Date("2016-08-01"),
        validUntil: new Date("2016-11-30"),
        price: 415,
      },
      {
        validFrom: new Date("2016-12-01"),
        validUntil: new Date("2017-05-31"),
        price: 430,
      },
      {
        validFrom: new Date("2017-06-01"),
        validUntil: new Date("2018-04-30"),
        price: 450,
      },
      {
        validFrom: new Date("2018-05-01"),
        validUntil: new Date("2019-03-31"),
        price: 470,
      },
      {
        validFrom: new Date("2019-04-01"),
        validUntil: new Date("2020-09-30"),
        price: 495,
      },
      {
        validFrom: new Date("2020-10-01"),
        validUntil: new Date("2022-02-28"),
        price: 530,
      },
      {
        validFrom: new Date("2022-03-01"),
        validUntil: new Date("2023-08-31"),
        price: 570,
      },
      {
        validFrom: new Date("2023-09-01"),
        validUntil: new Date("2025-01-31"),
        price: 610,
      },
      {
        validFrom: new Date("2025-02-01"),
        validUntil: null,
        price: 650,
      },
    ],
  },

  // CHAIN ASSEMBLY - Major price variations
  {
    id: "single_speed_chain",
    name: "Single-Speed Chain",
    component: ComponentType.CHAIN_ASSEMBLY,
    description: "Single-speed chain assembly",
    priceHistory: [
      {
        validFrom: new Date("2016-01-01"),
        validUntil: new Date("2016-05-31"),
        price: 300,
      },
      {
        validFrom: new Date("2016-06-01"),
        validUntil: new Date("2016-10-31"),
        price: 350,
      },
      {
        validFrom: new Date("2016-11-01"),
        validUntil: new Date("2017-04-30"),
        price: 400,
      },
      {
        validFrom: new Date("2017-05-01"),
        validUntil: new Date("2018-03-31"),
        price: 430,
      },
      {
        validFrom: new Date("2018-04-01"),
        validUntil: new Date("2019-02-28"),
        price: 460,
      },
      {
        validFrom: new Date("2019-03-01"),
        validUntil: new Date("2020-08-31"),
        price: 495,
      },
      {
        validFrom: new Date("2020-09-01"),
        validUntil: new Date("2022-01-31"),
        price: 540,
      },
      {
        validFrom: new Date("2022-02-01"),
        validUntil: new Date("2023-07-31"),
        price: 590,
      },
      {
        validFrom: new Date("2023-08-01"),
        validUntil: new Date("2025-02-28"),
        price: 650,
      },
      {
        validFrom: new Date("2025-03-01"),
        validUntil: null,
        price: 710,
      },
    ],
  },
  {
    id: "4_gear_assembly",
    name: "4-Gear Assembly",
    component: ComponentType.CHAIN_ASSEMBLY,
    description: "4-gear chain assembly",
    priceHistory: [
      {
        validFrom: new Date("2016-01-01"),
        validUntil: new Date("2016-04-30"),
        price: 800,
      },
      {
        validFrom: new Date("2016-05-01"),
        validUntil: new Date("2016-09-30"),
        price: 875,
      },
      {
        validFrom: new Date("2016-10-01"),
        validUntil: new Date("2017-03-31"),
        price: 950,
      },
      {
        validFrom: new Date("2017-04-01"),
        validUntil: new Date("2018-02-28"),
        price: 1000,
      },
      {
        validFrom: new Date("2018-03-01"),
        validUntil: new Date("2019-01-31"),
        price: 1050,
      },
      {
        validFrom: new Date("2019-02-01"),
        validUntil: new Date("2020-07-31"),
        price: 1120,
      },
      {
        validFrom: new Date("2020-08-01"),
        validUntil: new Date("2022-01-31"),
        price: 1200,
      },
      {
        validFrom: new Date("2022-02-01"),
        validUntil: new Date("2023-07-31"),
        price: 1320,
      },
      {
        validFrom: new Date("2023-08-01"),
        validUntil: new Date("2025-02-28"),
        price: 1450,
      },
      {
        validFrom: new Date("2025-03-01"),
        validUntil: null,
        price: 1590,
      },
    ],
  },
  {
    id: "7_gear_assembly",
    name: "7-Gear Assembly",
    component: ComponentType.CHAIN_ASSEMBLY,
    description: "7-gear chain assembly",
    priceHistory: [
      {
        validFrom: new Date("2016-01-01"),
        validUntil: new Date("2016-06-30"),
        price: 1000,
      },
      {
        validFrom: new Date("2016-07-01"),
        validUntil: new Date("2016-10-31"),
        price: 1100,
      },
      {
        validFrom: new Date("2016-11-01"),
        validUntil: new Date("2017-04-30"),
        price: 1200,
      },
      {
        validFrom: new Date("2017-05-01"),
        validUntil: new Date("2018-03-31"),
        price: 1280,
      },
      {
        validFrom: new Date("2018-04-01"),
        validUntil: new Date("2019-02-28"),
        price: 1360,
      },
      {
        validFrom: new Date("2019-03-01"),
        validUntil: new Date("2020-08-31"),
        price: 1460,
      },
      {
        validFrom: new Date("2020-09-01"),
        validUntil: new Date("2022-02-28"),
        price: 1580,
      },
      {
        validFrom: new Date("2022-03-01"),
        validUntil: new Date("2023-09-30"),
        price: 1750,
      },
      {
        validFrom: new Date("2023-10-01"),
        validUntil: new Date("2025-04-30"),
        price: 1950,
      },
      {
        validFrom: new Date("2025-05-01"),
        validUntil: null,
        price: 2180,
      },
    ],
  },
];
