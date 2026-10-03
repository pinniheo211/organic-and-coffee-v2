export interface CafeMenuItem {
  name: string;
  description?: string;
  price: string;
  dietary?: string[];
}

export interface CafeMenuSection {
  id: string;
  title: string;
  note?: string;
  imageSrc: string;
  imageAlt: string;
  items: CafeMenuItem[];
}

// Menu and indicative prices transcribed from the café's OrderUp ordering page.
export const cafeMenu: CafeMenuSection[] = [
  {
    id: "breakfast",
    title: "Breakfast",
    note: "All day",
    imageSrc: "/assets/cafe-shakshouka.jpg",
    imageAlt: "Shakshouka served with toasted sourdough at the café",
    items: [
      { name: "Shakshouka", description: "Egg baked in spicy capsicum and tomato sauce, with toasted sourdough. Vegan option with avocado, no egg.", price: "24.75", dietary: ["Vegan option"] },
      { name: "Leo’s special", description: "Avocado, feta, kimchi, almond dukkah and chilli oil on rye toast.", price: "from 17.00" },
      { name: "Mushroom confit", description: "Mushrooms and thyme on sourdough with hummus, pesto, pickled red onion and feta. Vegan pesto and cashew cheese available.", price: "from 21.00", dietary: ["Vegan option"] },
      { name: "Bircher", description: "Organic oats, apple juice, biodynamic yoghurt, nuts, seasonal fruit and honey. Vegan option available.", price: "from 14.50", dietary: ["Vegan option"] },
      { name: "Porridge", description: "Grains cooked in soy and almond milk, with banana, nut mix and honey.", price: "from 16.00", dietary: ["Vegan option", "GF option"] },
      { name: "Muesli — natural", description: "House-made muesli with yoghurt, dried fruit compote and your choice of juice or milk.", price: "17.50", dietary: ["Vegan option", "GF option"] },
      { name: "Muesli — toasted", description: "Toasted house-made muesli with yoghurt and your choice of milk or juice.", price: "17.50", dietary: ["Vegan option"] },
      { name: "Berry compote", description: "Berries in red wine syrup with biodynamic yoghurt and nuts.", price: "14.50", dietary: ["Vegan option"] },
      { name: "Toasted wholemeal fruit roll", description: "Locally made organic sourdough fruit roll, toasted with butter.", price: "8.50", dietary: ["Vegan option"] },
      { name: "Crumpet", description: "Locally made in Bridgewater, with your choice of spread.", price: "8.50" },
      { name: "Morning smoothie", description: "Organic yoghurt, banana, honey and wheatgerm.", price: "11.50", dietary: ["Vegan option"] },
      { name: "Croissant", description: "A savoury or sweet croissant from the café cabinet.", price: "10.50" },
      { name: "Toast", description: "Two slices of organic sourdough or sprouted dark rye, with butter and a condiment.", price: "9.00", dietary: ["Vegan option"] },
    ],
  },
  {
    id: "lunch",
    title: "Lunch",
    note: "Available all day; salad bowl from 11am",
    imageSrc: "/assets/cafe-salad-bowl.png",
    imageAlt: "The café's salad bowl with roasted pumpkin and fresh greens",
    items: [
      { name: "Soup: mushroom & lentil", description: "Daily soup served with bread.", price: "from 14.50", dietary: ["DF", "GF", "NF", "Vegan"] },
      { name: "Soup: red split lentil & zucchini", description: "Daily soup served with bread.", price: "from 14.50", dietary: ["DF", "GF", "NF", "Vegan"] },
      { name: "Salad bowl", description: "Two fresh salads, a roasted Jap pumpkin wedge and bread.", price: "22.50", dietary: ["Vegan option", "GF option"] },
      { name: "Organic penne with lentil bolognese", description: "Pasta with the chef’s daily selection.", price: "from 23.00", dietary: ["NF", "Vegetarian"] },
      { name: "Tasting platter for one", description: "Hummus, pickled vegetables, pesto, cheese, olives, crudités and house-made bread crisps.", price: "22.00", dietary: ["Vegan option"] },
      { name: "Tasting platter for two", description: "A larger platter with wild-caught smoked salmon, alongside hummus, pickles, pesto, cheese, olives and bread crisps.", price: "45.00", dietary: ["Vegan option"] },
      { name: "Bruschetta #1", description: "House-made Provençale sauce with olives and parmesan. Vegan option with eggplant, no parmesan.", price: "from 13.00", dietary: ["Vegan option"] },
      { name: "Bruschetta #2", description: "Haloumi with fresh house-made salsa. Vegan option with avocado, no haloumi.", price: "from 17.00", dietary: ["Vegan option"] },
      { name: "Bruschetta #3", description: "Roast pumpkin, capsicum and feta. Vegan option with olives, no feta.", price: "from 17.00", dietary: ["Vegan option"] },
      { name: "Focaccia #1", description: "Leg ham with chutney, pickled onion and cheddar.", price: "from 19.00" },
      { name: "Focaccia #2", description: "Roasted eggplant with tahini sauce and tabouli.", price: "from 17.00", dietary: ["Vegan"] },
      { name: "Focaccia #3", description: "Basil pesto, tomato, olives and bocconcini.", price: "from 17.00", dietary: ["Vegan option"] },
      { name: "Focaccia #4", description: "Smoked salmon, cream cheese, capers, horseradish, pickled red onion and rocket.", price: "from 22.50" },
      { name: "Roast vegetable wrap", description: "Mountain bread with vegan pesto, roast vegetables, carrot, sprouts and lettuce.", price: "17.00", dietary: ["Vegan"] },
      { name: "Croissant", price: "10.50" },
      { name: "Scone", description: "House-made with organic ingredients.", price: "8.50" },
    ],
  },
  {
    id: "cakes",
    title: "Muffins & cakes",
    note: "Cabinet selection changes; some items may not be available every day.",
    imageSrc: "/assets/cafe-almond-biscuit.png",
    imageAlt: "Almond biscuit from the café cabinet",
    items: [
      { name: "Pear, walnut & sultana muffin", price: "6.50", dietary: ["Vegan"] },
      { name: "Almond biscuit", price: "4.25", dietary: ["GF"] },
      { name: "Almond & coconut", description: "Served warm with cream.", price: "8.50" },
      { name: "Apple crumble cake", description: "Served warm with cream.", price: "8.50", dietary: ["GF"] },
      { name: "Banana bread", description: "Served warm with butter.", price: "8.50", dietary: ["Vegan"] },
      { name: "Blueberry sour cream cake", price: "6.75" },
      { name: "Raspberry brownie", description: "Chocolate and raspberries; served warm with cream.", price: "7.50", dietary: ["GF"] },
      { name: "Berry & almond cookies", price: "5.50", dietary: ["DF", "GF", "Vegan"] },
      { name: "Cacao truffles", price: "4.50", dietary: ["DF", "GF", "Vegan"] },
      { name: "Hemp seed truffles", price: "4.50", dietary: ["DF", "GF", "Raw", "Vegan"] },
      { name: "Kataifi", description: "Greek custard pastry with whipped cream.", price: "11.50" },
      { name: "Scone", description: "House-made with organic ingredients.", price: "8.50" },
      { name: "Sicilian apple cake", description: "Served warm with cream.", price: "7.75" },
      { name: "YoYo", price: "5.50" },
    ],
  },
  {
    id: "coffee",
    title: "Coffee & warm drinks",
    imageSrc: "/assets/cafe-flat-white.jpg",
    imageAlt: "Organic flat white coffee with latte art",
    items: [
      { name: "Flat white", price: "5.50" }, { name: "Latte", price: "5.50" },
      { name: "Piccolo", price: "4.75" }, { name: "Cappuccino", price: "5.50" },
      { name: "Long black", price: "4.75" }, { name: "Batch brew", description: "350ml, with refill.", price: "6.00" },
      { name: "Espresso", price: "4.75" }, { name: "Macchiato", price: "4.75" },
      { name: "Vienna", price: "6.50" }, { name: "Mocha", price: "6.50" },
      { name: "Babycino", price: "3.00" }, { name: "Chai latte", price: "6.00" },
      { name: "Pot chai", price: "8.00" }, { name: "Hot chocolate", price: "5.50" },
      { name: "Premium drinking chocolate", price: "6.00" },
      { name: "Carob, dandelion, barley or chicory", description: "A caffeine-free alternative.", price: "5.50" },
      { name: "Pot of tea", description: "English Breakfast, Earl Grey, Darjeeling, Sencha Green, Jasmine Pearls, Rooibos, Peppermint, Lemongrass or Chamomile.", price: "5.50" },
      { name: "Matcha milk", price: "6.50" }, { name: "Golden milk", price: "6.00" },
      { name: "Hot spicy apple", price: "7.00" },
      { name: "Hot lemon & honey", description: "Add ginger for 50¢.", price: "5.50" },
    ],
  },
  {
    id: "smoothies",
    title: "Smoothies",
    imageSrc: "/assets/cafe-smoothie.jpg",
    imageAlt: "Fresh smoothie served at the café",
    items: [
      { name: "Acai smoothie", description: "OM creation.", price: "11.50" },
      { name: "Groovy smoothie", description: "OM creation.", price: "11.50" },
      { name: "Green smoothie", description: "OM creation.", price: "11.50" },
      { name: "Morning smoothie", description: "Organic yoghurt, banana, honey and wheatgerm. Vegan option available.", price: "11.50", dietary: ["Vegan option"] },
      { name: "Fruit whip", description: "OM creation.", price: "11.50" },
    ],
  },
  {
    id: "cold-drinks",
    title: "Cold drinks",
    imageSrc: "/assets/cafe-cold-juice.jpg",
    imageAlt: "Three freshly made juices in red, orange and green",
    items: [
      { name: "Cold-pressed juice", price: "from 10.00" },
      { name: "Orange juice", price: "from 9.00" },
      { name: "Apple juice", price: "6.50" },
      { name: "Smoothie", price: "10.00" }, { name: "Lassi", price: "10.00" },
      { name: "Iced coffee", price: "10.00" }, { name: "Iced chocolate", price: "10.00" },
      { name: "Iced mocha", price: "10.00" },
      { name: "Iced chai", description: "Blended smoothie style.", price: "10.00" },
      { name: "Spider", price: "10.00" },
      { name: "Sparkling water", price: "from 4.50" },
      { name: "Lemon cordial", price: "5.50" },
      { name: "Organic bottled cola, lemonade or ginger beer", price: "8.00" },
    ],
  },
];

export const orderUpMenuUrl = "https://theorganicmarketandcafe.orderup.com.au/stores/the-organic-market-cafe";
