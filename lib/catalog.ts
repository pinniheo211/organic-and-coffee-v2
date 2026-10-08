export const categories = [
  "Produce",
  "Bulk",
  "Grocery",
  "Dairy and drinks",
  "Personal care",
] as const;

export type Category = (typeof categories)[number];

export type Product = {
  slug: string;
  name: string;
  category: Category;
  price: number;
  unit: string;
  summary: string;
  image?: string;
  imageFit?: "cover" | "contain";
};

export const products: Product[] = [
  {
    slug: "globe-artichokes",
    name: "Globe artichokes",
    category: "Produce",
    price: 650,
    unit: "each",
    summary: "Certified organic, from the produce stand when they are in season.",
    image: "/assets/artichoke.webp",
    imageFit: "contain",
  },
  {
    slug: "hills-apples",
    name: "Adelaide Hills apples",
    category: "Produce",
    price: 690,
    unit: "per kg",
    summary: "Organic apples from Hills growers. The variety follows the week.",
    image: "/assets/IMG_5756.webp",
  },
  {
    slug: "mixed-leaves",
    name: "Mixed leaves",
    category: "Produce",
    price: 420,
    unit: "bag",
    summary: "A small bag of seasonal leaves, washed and packed for the week.",
    image: "/assets/cafe-salad-bowl-jpg.webp",
  },
  {
    slug: "lemons",
    name: "Lemons",
    category: "Produce",
    price: 580,
    unit: "per kg",
    summary: "Organic lemons for the kitchen and the café.",
    image: "/assets/img3.webp",
  },
  {
    slug: "rolled-oats",
    name: "Rolled oats",
    category: "Bulk",
    price: 480,
    unit: "per kg",
    summary: "Wholegrain oats from the bulk wall, sold by weight.",
    image: "/assets/product4.webp",
    imageFit: "contain",
  },
  {
    slug: "almonds",
    name: "Almonds",
    category: "Bulk",
    price: 2800,
    unit: "per kg",
    summary: "Raw almonds, scooped to the amount you will use.",
    image: "/assets/cafe-almond-biscuit.webp",
  },
  {
    slug: "french-lentils",
    name: "French lentils",
    category: "Bulk",
    price: 640,
    unit: "per kg",
    summary: "Small green lentils, sold loose.",
    image: "/assets/product5.webp",
    imageFit: "contain",
  },
  {
    slug: "spelt-flour",
    name: "Spelt flour",
    category: "Bulk",
    price: 520,
    unit: "per kg",
    summary: "Organic spelt flour for bread and the café bench.",
    image: "/assets/break4.webp",
  },
  {
    slug: "olive-oil",
    name: "Extra virgin olive oil",
    category: "Grocery",
    price: 1800,
    unit: "500 ml",
    summary: "A bottled oil from the grocery aisle, for cooking and the table.",
    image: "/assets/break3.webp",
  },
  {
    slug: "honey",
    name: "Organic honey",
    category: "Grocery",
    price: 1450,
    unit: "500 g",
    summary: "A jar of organic honey. Ask in the shop if you want a local line.",
    image: "/assets/product1.webp",
    imageFit: "contain",
  },
  {
    slug: "passata",
    name: "Tomato passata",
    category: "Grocery",
    price: 490,
    unit: "680 g",
    summary: "Organic tomatoes, bottled for the pantry.",
    image: "/assets/cafe-shakshouka.webp",
  },
  {
    slug: "oat-biscuits",
    name: "Oat biscuits",
    category: "Grocery",
    price: 620,
    unit: "pack",
    summary: "A plain oat biscuit from the sweet shelf.",
    image: "/assets/cafe-almond-biscuit.webp",
  },
  {
    slug: "paris-creek-milk",
    name: "Paris Creek milk",
    category: "Dairy and drinks",
    price: 440,
    unit: "1 litre",
    summary: "Organic milk from Paris Creek, the same milk used in the café.",
    image: "/assets/cafe-smoothie.webp",
  },
  {
    slug: "dangelo-beans",
    name: "D'Angelo coffee beans",
    category: "Dairy and drinks",
    price: 1600,
    unit: "250 g",
    summary: "Organic coffee from D'Angelo, the beans the café grinds.",
    image: "/assets/cafe-flat-white.webp",
  },
  {
    slug: "hills-white",
    name: "Adelaide Hills white",
    category: "Dairy and drinks",
    price: 2800,
    unit: "750 ml",
    summary: "A white from the wine wall. The label changes with what is in stock.",
    image: "/assets/cafe-cold-juice.webp",
  },
  {
    slug: "pressed-juice",
    name: "Pressed juice",
    category: "Dairy and drinks",
    price: 750,
    unit: "bottle",
    summary: "Juice pressed from market fruit. The flavour follows the stand.",
    image: "/assets/img3.webp",
  },
  {
    slug: "olive-soap",
    name: "Olive oil soap",
    category: "Personal care",
    price: 680,
    unit: "bar",
    summary: "A plain soap from the personal care shelf.",
    image: "/assets/artichoke.webp",
    imageFit: "contain",
  },
  {
    slug: "hand-cream",
    name: "Hand cream",
    category: "Personal care",
    price: 1600,
    unit: "tube",
    summary: "A small tube, chosen to the same standard as the food.",
    image: "/assets/artichoke.webp",
    imageFit: "contain",
  },
];

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function formatPrice(cents: number) {
  return new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" }).format(cents / 100);
}
