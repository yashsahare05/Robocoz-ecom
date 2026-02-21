import { type Product, type Category, type Brand } from "@/types";

const subcategories = {
  ics: [
    {
      id: "sub-ics-mcu",
      name: "Microcontrollers",
      slug: "microcontrollers",
    },
    {
      id: "sub-ics-power",
      name: "Power Management",
      slug: "power-management",
    },
    {
      id: "sub-ics-signal",
      name: "Signal Processing",
      slug: "signal-processing",
    },
  ],
  electroniccomps: [
    {
      id: "sub-ec-connectors",
      name: "Connectors",
      slug: "connectors",
    },
    {
      id: "sub-ec-resistors",
      name: "Resistors",
      slug: "resistors",
    },
    {
      id: "sub-ec-capacitors",
      name: "Capacitors",
      slug: "capacitors",
    },
  ],
  sensors: [
    {
      id: "sub-sens-color",
      name: "Color Sensors",
      slug: "Color Sensors",
    },
    {
      id: "sub-sens-gas",
      name: "Gas Sensors",
      slug: "Gas Sensors",
    },
    {
      id: "sub-sens-Flame",
      name: "Flame Sensors",
      slug: "Flame Sensors",
    },
  ],

  motors: [
    {
      id: "sub-dc-motors",
      name: "DC Motor",
      slug: "DC Motor",
    },
    {
      id: "sub-motor-driver",
      name: "Motor Driver",
      slug: "Motor Driver",
    },
    {
      id: "sub-dc-pumps",
      name: "DC Pumps",
      slug: "DC Pumps",
    },
  ],
};

export const categories: Category[] = [
  {
    id: "cat-ics",
    name: "Integrated Circuits",
    slug: "integrated-circuits",
    description: "Microcontrollers, drivers, amplifiers, converters and ASICs.",
    heroImage: "/images/categories/ics.jpg",
    subcategories: subcategories.ics,
  },
  {
    id: "cat-elec-comp",
    name: "Electronic Components",
    slug: "electronic-components",
    description:
      "Connectors, resistors, capacitors, and essential components for every build.",
    heroImage: "/images/categories/ec-comp.jpg",
    subcategories: subcategories.electroniccomps,
  },
  {
    id: "cat-sensors",
    name: "Sensors",
    slug: "sensors",
    description: "Smart sensing modules for motion, gas, flame, and color.",
    heroImage: "/images/categories/sensors.jpg",
    subcategories: subcategories.sensors,
  },
  {
    id: "cat-motors",
    name: "Motors",
    slug: "Motors",
    description: "Motors, drivers, and pumps built for motion projects.",
    heroImage: "/images/categories/motors.jpg",
    subcategories: subcategories.motors,
  },
];

export const brands: Brand[] = [
  {
    id: "brand-epf",
    name: "Robocoz Labs",
    description: "Premium components engineered for demanding applications.",
  },
  {
    id: "brand-omega",
    name: "Omega Circuits",
    description: "Industrial-grade PCB assemblies.",
  },
];

export const products: Product[] = [
  {
    id: "prod-1",
    name: "EPF STM32F4 Core Module",
    slug: "epf-stm32f4-core-module",
    sku: "EPF-STM32F4-01",
    summary:
      "High-performance STM32F4 module with integrated PMIC and industrial IO.",
    description:
      "A production-ready compute module featuring STM32F4 MCU, on-board power, and flexible connectivity.",
    category: categories[0],
    subcategory: subcategories.ics[0],
    brand: brands[0],
    specs: {
      MCU: "STM32F407VGT6",
      Clock: "168 MHz",
      Flash: "1 MB",
      RAM: "192 KB",
      Temperature: "-40°C to 85°C",
    },
    datasheetUrl: "#",
    price: 48,
    volumePricing: [
      { minQty: 10, price: 45 },
      { minQty: 100, price: 41 },
    ],
    images: ["/images/products/stm32f4.jpg"],
    inStock: 340,
    minOrderQty: 1,
    rating: 4.9,
    tags: ["featured", "new"],
    featured: true,
  },
  {
    id: "prod-2",
    name: "Omega High-Current Connector",
    slug: "omega-high-current-connector",
    sku: "OMG-HCC-16P",
    summary:
      "16-pin high-current connector system rated up to 40A per contact.",
    description:
      "Modular connector with locking mechanism and gold-plated contacts for rugged environments.",
    category: categories[1],
    subcategory: subcategories.electroniccomps[0],
    brand: brands[1],
    specs: {
      Contacts: "16",
      Current: "40A",
      Voltage: "600V",
      Pitch: "5.08 mm",
    },
    price: 18.5,
    images: ["/images/products/connector.jpg"],
    inStock: 780,
    minOrderQty: 10,
    rating: 4.7,
    featured: true,
  },
  {
    id: "prod-3",
    name: "EPF Precision IMU Module",
    slug: "epf-precision-imu-module",
    sku: "EPF-IMU-9AX",
    summary: "9-axis IMU module with Kalman filtering and sensor fusion.",
    description:
      "Drop-in IMU solution with sensor fusion firmware targeting robotics and UAV applications.",
    category: categories[2],
    subcategory: subcategories.sensors[0],
    brand: brands[0],
    specs: {
      Gyro: "±2000 dps",
      Accel: "±16g",
      Mag: "±14 gauss",
      Interface: "I2C/SPI",
    },
    price: 72,
    images: ["/images/products/imu.jpg"],
    inStock: 120,
    minOrderQty: 1,
    rating: 4.8,
  },
];

export const testimonials = [
  {
    company: "Volt Robotics",
    feedback:
      "Robocoz helped us consolidate our component sourcing and accelerate hardware iterations with their rapid 3D printing service.",
    name: "Jin Park",
    role: "Head of Hardware",
  },
  {
    company: "Nova Aerospace",
    feedback:
      "Their PCB manufacturing team consistently delivers complex multi-layer boards on time with impeccable documentation.",
    name: "Lauren Chen",
    role: "Electronics Lead",
  },
];
