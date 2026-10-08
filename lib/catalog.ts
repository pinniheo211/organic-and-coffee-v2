export const categories = [
  "Fruit",
  "Vegetables",
  "Chilled & Frozen",
  "Bakery & Pantry",
  "Drinks",
] as const;

export type Category = (typeof categories)[number];

export type Product = {
  slug: string;
  name: string;
  category: Category;
  /** Mock price in AUD cents. */
  price: number;
  unit: string;
  summary: string;
  image?: string;
  imageFit?: "cover" | "contain";
};

// Demo catalogue based on the supplied product photos.
// Prices and pack sizes are illustrative, not a live inventory or price list.
export const products: Product[] = [
  {
    slug: "oranges",
    name: "Oranges",
    category: "Fruit",
    price: 690,
    unit: "per kg",
    summary: "Bright citrus for the fruit bowl, fresh juice and orange zest.",
    image: "/assets/fruit/1.webp",
    imageFit: "contain"
  },
  {
    slug: "mandarins",
    name: "Mandarins",
    category: "Fruit",
    price: 790,
    unit: "per kg",
    summary: "Easy-peel citrus with juicy segments for lunchboxes and snacks.",
    image: "/assets/fruit/2.webp",
    imageFit: "contain"
  },
  {
    slug: "watermelon",
    name: "Watermelon",
    category: "Fruit",
    price: 390,
    unit: "per kg",
    summary: "A refreshing melon with crisp red flesh, ready to slice and share.",
    image: "/assets/fruit/4.webp",
    imageFit: "contain"
  },
  {
    slug: "pineapple",
    name: "Pineapple",
    category: "Fruit",
    price: 850,
    unit: "each",
    summary: "Golden tropical fruit for fruit salads, smoothies or grilling.",
    image: "/assets/fruit/5.webp",
    imageFit: "contain"
  },
  {
    slug: "pears",
    name: "Pears",
    category: "Fruit",
    price: 790,
    unit: "per kg",
    summary: "Blush-skinned pears for snacking, poaching and baking.",
    image: "/assets/fruit/6.webp",
    imageFit: "contain"
  },
  {
    slug: "avocado",
    name: "Avocado",
    category: "Fruit",
    price: 350,
    unit: "each",
    summary: "Creamy avocado for toast, salads and homemade guacamole.",
    image: "/assets/fruit/7.webp",
    imageFit: "contain"
  },
  {
    slug: "striped-apples",
    name: "Striped apples",
    category: "Fruit",
    price: 890,
    unit: "per kg",
    summary: "Red-and-gold apples for the fruit bowl, lunchbox or baking tray.",
    image: "/assets/fruit/8.webp",
    imageFit: "contain"
  },
  {
    slug: "lemons",
    name: "Lemons",
    category: "Fruit",
    price: 580,
    unit: "per kg",
    summary: "Fresh lemons for dressings, baking and a squeeze over dinner.",
    image: "/assets/fruit/9.webp",
    imageFit: "contain"
  },
  {
    slug: "red-apples",
    name: "Red apples",
    category: "Fruit",
    price: 890,
    unit: "per kg",
    summary: "Red-skinned apples for everyday snacking and fresh fruit salads.",
    image: "/assets/fruit/10.webp",
    imageFit: "contain"
  },
  {
    slug: "carrots",
    name: "Carrots",
    category: "Vegetables",
    price: 490,
    unit: "per kg",
    summary: "Everyday carrots for roasting, grating into salads and slow-cooked soups.",
    image: "/assets/product/1.webp",
    imageFit: "contain"
  },
  {
    slug: "broccoli",
    name: "Broccoli",
    category: "Vegetables",
    price: 890,
    unit: "per kg",
    summary: "Green broccoli florets for steaming, roasting and quick stir-fries.",
    image: "/assets/product/2.webp",
    imageFit: "contain"
  },
  {
    slug: "potatoes",
    name: "Potatoes",
    category: "Vegetables",
    price: 590,
    unit: "per kg",
    summary: "A kitchen staple for mash, roast potatoes and comforting soups.",
    image: "/assets/product/3.webp",
    imageFit: "contain"
  },
  {
    slug: "brown-onions",
    name: "Brown onions",
    category: "Vegetables",
    price: 490,
    unit: "per kg",
    summary: "Brown onions for the base of soups, sauces and everyday cooking.",
    image: "/assets/product/4.webp",
    imageFit: "contain"
  },
  {
    slug: "cucumber",
    name: "Cucumber",
    category: "Vegetables",
    price: 350,
    unit: "each",
    summary: "Crisp cucumber for salads, sandwiches and cool summer sides.",
    image: "/assets/product/5.webp",
    imageFit: "contain"
  },
  {
    slug: "sweet-potatoes",
    name: "Sweet potatoes",
    category: "Vegetables",
    price: 690,
    unit: "per kg",
    summary: "Orange-fleshed sweet potatoes for roasting, mashing and wedges.",
    image: "/assets/product/6.webp",
    imageFit: "contain"
  },
  {
    slug: "cauliflower",
    name: "Cauliflower",
    category: "Vegetables",
    price: 790,
    unit: "each",
    summary: "A whole cauliflower for roasted florets, creamy soups and baked dishes.",
    image: "/assets/product/7.webp",
    imageFit: "contain"
  },
  {
    slug: "cherry-tomatoes",
    name: "Cherry tomatoes",
    category: "Vegetables",
    price: 590,
    unit: "250 g punnet",
    summary: "Small red tomatoes for salads, lunchboxes and quick pasta sauces.",
    image: "/assets/product/8.webp",
    imageFit: "contain"
  },
  {
    slug: "butternut-pumpkin",
    name: "Butternut pumpkin",
    category: "Vegetables",
    price: 490,
    unit: "per kg",
    summary: "Golden-fleshed pumpkin for roasting, soups and warming curries.",
    image: "/assets/product/9.webp",
    imageFit: "contain"
  },
  {
    slug: "silverbeet",
    name: "Silverbeet",
    category: "Vegetables",
    price: 490,
    unit: "bunch",
    summary: "Leafy greens with pale stems for pies, sautés and hearty soups.",
    image: "/assets/product/10.webp",
    imageFit: "contain"
  },
  {
    slug: "red-onions",
    name: "Red onions",
    category: "Vegetables",
    price: 590,
    unit: "per kg",
    summary: "Red onions for salads, pickling and caramelising in the pan.",
    image: "/assets/product/11.webp",
    imageFit: "contain"
  },
  {
    slug: "brussels-sprouts",
    name: "Brussels sprouts",
    category: "Vegetables",
    price: 1190,
    unit: "per kg",
    summary: "Compact green sprouts for roasting or shredding into a crunchy slaw.",
    image: "/assets/product/12.webp",
    imageFit: "contain"
  },
  {
    slug: "fennel",
    name: "Fennel",
    category: "Vegetables",
    price: 590,
    unit: "each",
    summary: "A crisp fennel bulb with leafy fronds for salads and roasting.",
    image: "/assets/product/13.webp",
    imageFit: "contain"
  },
  {
    slug: "green-leaf-lettuce",
    name: "Green leaf lettuce",
    category: "Vegetables",
    price: 450,
    unit: "each",
    summary: "Tender green leaves for fresh salads, wraps and sandwiches.",
    image: "/assets/product/15.webp",
    imageFit: "contain"
  },
  {
    slug: "paris-creek-milk",
    name: "Paris Creek cream-on-top milk",
    category: "Chilled & Frozen",
    price: 750,
    unit: "2 litres",
    summary: "Paris Creek Farms organic cream-on-top milk from the dairy fridge.",
    image: "/assets/chiller/1.webp",
    imageFit: "contain"
  },
  {
    slug: "elgin-garden-peas",
    name: "Elgin organic garden peas",
    category: "Chilled & Frozen",
    price: 690,
    unit: "600 g",
    summary: "Frozen garden peas for quick sides, soups and weeknight dinners.",
    image: "/assets/chiller/2.webp",
    imageFit: "contain"
  },
  {
    slug: "elgin-wild-blueberries",
    name: "Elgin organic wild blueberries",
    category: "Chilled & Frozen",
    price: 2290,
    unit: "1 kg",
    summary: "Frozen wild blueberries for smoothies, breakfast bowls and baking.",
    image: "/assets/chiller/3.webp",
    imageFit: "contain"
  },
  {
    slug: "barambah-cheddar-slices",
    name: "Barambah tasty cheddar slices",
    category: "Chilled & Frozen",
    price: 790,
    unit: "210 g",
    summary: "Sliced organic tasty cheddar for sandwiches, toasties and burgers.",
    image: "/assets/chiller/4.webp",
    imageFit: "contain"
  },
  {
    slug: "barambah-shredded-cheddar",
    name: "Barambah shredded tasty cheddar",
    category: "Chilled & Frozen",
    price: 890,
    unit: "250 g",
    summary: "Shredded organic cheddar for pasta bakes, pizzas and toasties.",
    image: "/assets/chiller/5.webp",
    imageFit: "contain"
  },
  {
    slug: "chicken-thigh-fillets",
    name: "Organic chicken thigh fillets",
    category: "Chilled & Frozen",
    price: 1490,
    unit: "500 g pack",
    summary: "Chicken thigh fillets for curries, tray bakes and pan-fried meals.",
    image: "/assets/chiller/6.webp",
    imageFit: "contain"
  },
  {
    slug: "savoury-pasty",
    name: "Savoury pasty",
    category: "Chilled & Frozen",
    price: 790,
    unit: "each",
    summary: "A golden folded pastry for an easy lunch, served warm with a side salad.",
    image: "/assets/chiller/7.webp",
    imageFit: "contain"
  },
  {
    slug: "true-organic-salted-butter",
    name: "True Organic salted butter",
    category: "Chilled & Frozen",
    price: 790,
    unit: "250 g",
    summary: "Salted butter for spreading, cooking and everyday baking.",
    image: "/assets/chiller/8.webp",
    imageFit: "contain"
  },
  {
    slug: "elgin-blackberries",
    name: "Elgin organic blackberries",
    category: "Chilled & Frozen",
    price: 1990,
    unit: "1 kg",
    summary: "Frozen blackberries for crumbles, smoothies and berry compotes.",
    image: "/assets/chiller/9.webp",
    imageFit: "contain"
  },
  {
    slug: "barambah-lactose-free-yoghurt",
    name: "Barambah lactose-free natural yoghurt",
    category: "Chilled & Frozen",
    price: 750,
    unit: "500 g",
    summary: "Natural organic pot-set yoghurt from the Barambah dairy range.",
    image: "/assets/chiller/10.webp",
    imageFit: "contain"
  },
  {
    slug: "made-by-cow-milk",
    name: "Made By Cow cold-pressed raw milk",
    category: "Chilled & Frozen",
    price: 850,
    unit: "1.5 litres",
    summary: "Jersey milk from the Made By Cow cold-pressed range. Keep refrigerated.",
    image: "/assets/chiller/11.webp",
    imageFit: "contain"
  },
  {
    slug: "mungalli-high-protein-yoghurt",
    name: "Mungalli high-protein natural yoghurt",
    category: "Chilled & Frozen",
    price: 1090,
    unit: "500 g tub",
    summary: "Natural organic yoghurt from the Mungalli high-protein range.",
    image: "/assets/chiller/12.webp",
    imageFit: "contain"
  },
  {
    slug: "nut-and-seed-slice",
    name: "Nut and seed slice",
    category: "Chilled & Frozen",
    price: 550,
    unit: "each",
    summary: "A crunchy slice topped with mixed nuts and seeds, ready for a snack.",
    image: "/assets/chiller/13.webp",
    imageFit: "cover"
  },
  {
    slug: "viking-stir-fry-mix",
    name: "Viking organic stir-fry mix",
    category: "Chilled & Frozen",
    price: 790,
    unit: "500 g",
    summary: "A frozen vegetable mix ready for the wok and quick weeknight meals.",
    image: "/assets/chiller/14.webp",
    imageFit: "contain"
  },
  {
    slug: "mungalli-natural-yoghurt",
    name: "Mungalli natural organic yoghurt",
    category: "Chilled & Frozen",
    price: 890,
    unit: "500 g tub",
    summary: "Natural organic yoghurt for breakfast bowls, dips and dressings.",
    image: "/assets/chiller/15.webp",
    imageFit: "contain"
  },
  {
    slug: "spelt-sourdough-loaf",
    name: "Spelt sourdough loaf",
    category: "Bakery & Pantry",
    price: 1090,
    unit: "loaf",
    summary: "A spelt loaf for everyday toast, sandwiches and the bread basket.",
    image: "/assets/supplements/1.webp",
    imageFit: "contain"
  },
  {
    slug: "ancient-grains-rye-sourdough",
    name: "Ancient Grains organic rye sourdough",
    category: "Bakery & Pantry",
    price: 1150,
    unit: "loaf",
    summary: "A rye sourdough loaf for toast and open sandwiches.",
    image: "/assets/supplements/2.webp",
    imageFit: "contain"
  },
  {
    slug: "venerdi-sweet-potato-buns",
    name: "Venerdi sweet potato sourdough buns",
    category: "Bakery & Pantry",
    price: 990,
    unit: "pack",
    summary: "Gluten Freedom sweet potato sourdough buns for burgers and lunch rolls.",
    image: "/assets/supplements/3.webp",
    imageFit: "contain"
  },
  {
    slug: "wholemeal-spelt-rolls",
    name: "Wholemeal spelt rolls",
    category: "Bakery & Pantry",
    price: 850,
    unit: "6 pack",
    summary: "Soft wholemeal spelt rolls for lunchboxes, picnics and the dinner table.",
    image: "/assets/supplements/4.webp",
    imageFit: "contain"
  },
  {
    slug: "dona-cholita-white-corn-totopos",
    name: "Doña Cholita white corn totopos",
    category: "Bakery & Pantry",
    price: 790,
    unit: "170 g",
    summary: "White corn tortilla chips cooked in avocado oil, ready for salsa and dips.",
    image: "/assets/supplements/5.webp",
    imageFit: "contain"
  },
  {
    slug: "proper-crisps-sea-salt",
    name: "Proper Crisps Marlborough sea salt",
    category: "Bakery & Pantry",
    price: 650,
    unit: "150 g",
    summary: "Hand-cooked potato crisps seasoned with Marlborough sea salt.",
    image: "/assets/supplements/6.webp",
    imageFit: "contain"
  },
  {
    slug: "ceres-quinoa-brown-rice-crackers",
    name: "Ceres quinoa & brown rice crackers",
    category: "Bakery & Pantry",
    price: 490,
    unit: "pack",
    summary: "Quinoa and brown rice crackers for snacking and sharing with dips.",
    image: "/assets/supplements/7.webp",
    imageFit: "contain"
  },
  {
    slug: "seeded-flatbread",
    name: "Seeded flatbread",
    category: "Bakery & Pantry",
    price: 690,
    unit: "each",
    summary: "A seed-topped flatbread to serve with dips, soup or a fresh salad.",
    image: "/assets/supplements/8.webp",
    imageFit: "contain"
  },
  {
    slug: "venerdi-seeded-sourdough",
    name: "Venerdi seeded sourdough bread",
    category: "Bakery & Pantry",
    price: 1190,
    unit: "loaf",
    summary: "A seeded loaf from the Venerdi Gluten Freedom sourdough range.",
    image: "/assets/supplements/9.webp",
    imageFit: "contain"
  },
  {
    slug: "ancient-grains-spelt-loaf",
    name: "Ancient Grains organic spelt loaf",
    category: "Bakery & Pantry",
    price: 1090,
    unit: "loaf",
    summary: "A wholemeal spelt loaf for breakfast toast and everyday sandwiches.",
    image: "/assets/supplements/10.webp",
    imageFit: "contain"
  },
  {
    slug: "honest-to-goodness-coconut-milk",
    name: "Honest to Goodness organic coconut milk",
    category: "Bakery & Pantry",
    price: 390,
    unit: "400 ml",
    summary: "Canned coconut milk for curries, soups, sauces and desserts.",
    image: "/assets/supplements/11.webp",
    imageFit: "contain"
  },
  {
    slug: "la-tortilleria-tortilla-chips",
    name: "La Tortilleria tortilla chips",
    category: "Bakery & Pantry",
    price: 690,
    unit: "200 g",
    summary: "Corn tortilla chips for nachos or a bowl of fresh guacamole.",
    image: "/assets/supplements/12.webp",
    imageFit: "contain"
  },
  {
    slug: "naturis-rice-loaf",
    name: "Naturis gluten-free rice loaf",
    category: "Bakery & Pantry",
    price: 990,
    unit: "680 g",
    summary: "A rice loaf from the Naturis range, ready to slice and toast.",
    image: "/assets/supplements/13.webp",
    imageFit: "contain"
  },
  {
    slug: "passata",
    name: "Global Organics tomato purée",
    category: "Bakery & Pantry",
    price: 490,
    unit: "bottle",
    summary: "Bottled tomato purée for pasta sauces, soups and slow-cooked dishes.",
    image: "/assets/supplements/14.webp",
    imageFit: "contain"
  },
  {
    slug: "food-to-nourish-cacao-hazelnut-clusters",
    name: "Food to Nourish cacao & hazelnut clusters",
    category: "Bakery & Pantry",
    price: 1290,
    unit: "pack",
    summary: "Sprouted cacao and hazelnut clusters for breakfast bowls or snacking.",
    image: "/assets/supplements/15.webp",
    imageFit: "contain"
  },
  {
    slug: "apple-juice",
    name: "Apple juice",
    category: "Drinks",
    price: 750,
    unit: "1 litre",
    summary: "A fruity apple juice to serve chilled with breakfast or lunch.",
    image: "/assets/fruit/3.webp",
    imageFit: "contain"
  },
  {
    slug: "carrot-juice",
    name: "Carrot juice",
    category: "Drinks",
    price: 750,
    unit: "500 ml",
    summary: "Bright carrot juice for a refreshing drink, served chilled.",
    image: "/assets/product/14.webp",
    imageFit: "contain"
  }
];

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function formatPrice(cents: number) {
  return new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" }).format(cents / 100);
}
