export interface CafeMenuItem {
  name: string;
  description?: string;
  /** Illustrative price in AUD, formatted as a decimal string. */
  price: string;
  imageSrc: string;
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

// Mock menu based on the supplied photos in public/assets/coffee.
// Dish descriptions and prices are illustrative; confirm the live menu for orders.
// Dietary labels are omitted because recipes cannot be verified from photos.
export const cafeMenu: CafeMenuSection[] = [
  {
    id: "breakfast",
    title: "Breakfast",
    note: "All day",
    imageSrc: "/assets/coffee/breakfast/1.jpg",
    imageAlt: "Shakshouka",
    items: [
      {
        name: "Shakshouka",
        description: "Egg baked in a rich tomato and capsicum sauce, finished with herbs and served with toasted sourdough.",
        price: "24.75",
        imageSrc: "/assets/coffee/breakfast/1.jpg"
      },
      {
        name: "Avocado & feta toast",
        description: "Avocado and crumbled feta on rye toast, topped with leafy greens and a sprinkle of dukkah.",
        price: "17.00",
        imageSrc: "/assets/coffee/breakfast/2.jpg"
      },
      {
        name: "Mushroom confit",
        description: "Roasted mushrooms on sourdough with creamy feta, rocket and pickled red onion.",
        price: "21.00",
        imageSrc: "/assets/coffee/breakfast/3.jpg"
      },
      {
        name: "Toasted muesli bowl",
        description: "Toasted muesli with yoghurt, fresh strawberries, coconut flakes and nuts.",
        price: "17.50",
        imageSrc: "/assets/coffee/breakfast/4.jpg"
      },
      {
        name: "Banana & coconut porridge",
        description: "A warming breakfast bowl topped with banana, coconut flakes, nuts and rose petals.",
        price: "16.00",
        imageSrc: "/assets/coffee/breakfast/5.jpg"
      },
      {
        name: "Sourdough toast",
        description: "Two slices of toasted sourdough with butter and a side of fruit preserve.",
        price: "9.00",
        imageSrc: "/assets/coffee/breakfast/6.jpg"
      }
    ]
  },
  {
    id: "lunch",
    title: "Lunch",
    note: "All day; salad bowl from 11am",
    imageSrc: "/assets/coffee/lunch/1.jpg",
    imageAlt: "Roast pumpkin salad bowl",
    items: [
      {
        name: "Roast pumpkin salad bowl",
        description: "A generous wedge of roasted pumpkin with a colourful selection of seasonal salads.",
        price: "22.50",
        imageSrc: "/assets/coffee/lunch/1.jpg"
      },
      {
        name: "Market tasting platter",
        description: "A selection of dips, olives, cheese, crisp vegetables and toasted bread for grazing.",
        price: "22.00",
        imageSrc: "/assets/coffee/lunch/2.jpg"
      },
      {
        name: "Tomato & olive bruschetta",
        description: "Toasted sourdough with rich tomato sauce, olives, grated parmesan and fresh herbs.",
        price: "13.00",
        imageSrc: "/assets/coffee/lunch/3.jpg"
      },
      {
        name: "Haloumi & salsa bruschetta",
        description: "Golden grilled haloumi on sourdough with fresh tomato salsa and a lemon wedge.",
        price: "17.00",
        imageSrc: "/assets/coffee/lunch/4.jpg"
      },
      {
        name: "Pumpkin & feta bruschetta",
        description: "Roast pumpkin and capsicum on toast, finished with crumbled feta and herbs.",
        price: "17.00",
        imageSrc: "/assets/coffee/lunch/5.jpg"
      },
      {
        name: "Ham & cheddar focaccia",
        description: "A seeded focaccia filled with ham, cheddar, chutney and pickled onion, with leafy greens.",
        price: "19.00",
        imageSrc: "/assets/coffee/lunch/6.jpg"
      },
      {
        name: "Roast eggplant focaccia",
        description: "Roasted eggplant, tahini sauce and fresh tabouli in a seeded focaccia, with a side salad.",
        price: "17.00",
        imageSrc: "/assets/coffee/lunch/7.jpg"
      },
      {
        name: "Tomato & bocconcini focaccia",
        description: "Basil pesto, sliced tomato, olives and bocconcini in a toasted focaccia.",
        price: "17.00",
        imageSrc: "/assets/coffee/lunch/8.jpg"
      },
      {
        name: "Smoked salmon focaccia",
        description: "Smoked salmon, cream cheese, leafy greens and pickled red onion in a seeded focaccia.",
        price: "22.50",
        imageSrc: "/assets/coffee/lunch/9.jpg"
      },
      {
        name: "Roast vegetable wrap",
        description: "A toasted wrap filled with roast vegetables, grated carrot and fresh greens, with salad on the side.",
        price: "17.00",
        imageSrc: "/assets/coffee/lunch/10.jpg"
      },
      {
        name: "Scone with jam & cream",
        description: "A freshly baked scone dusted with icing sugar, served with berry jam and cream.",
        price: "8.50",
        imageSrc: "/assets/coffee/lunch/11.jpg"
      }
    ]
  },
  {
    id: "cakes",
    title: "Cakes & sweet treats",
    note: "From the café cabinet",
    imageSrc: "/assets/coffee/cake/1.png",
    imageAlt: "Almond biscuit",
    items: [
      {
        name: "Almond biscuit",
        description: "A golden biscuit topped with flaked almonds, ready to pair with your coffee.",
        price: "4.25",
        imageSrc: "/assets/coffee/cake/1.png"
      },
      {
        name: "Apple crumble cake",
        description: "A slice of apple cake with a crumbly topping, dusted with icing sugar and served with cream.",
        price: "8.50",
        imageSrc: "/assets/coffee/cake/2.jpg"
      },
      {
        name: "Banana bread",
        description: "A thick slice of banana bread, lightly warmed and served with butter.",
        price: "8.50",
        imageSrc: "/assets/coffee/cake/3.jpg"
      },
      {
        name: "Classic cream tea scone",
        description: "A soft scone with a dusting of icing sugar, berry jam and a generous spoonful of cream.",
        price: "8.50",
        imageSrc: "/assets/coffee/cake/4.jpg"
      },
      {
        name: "Chocolate caramel slice",
        description: "A rich chocolate slice with a smooth caramel topping, served with cream.",
        price: "8.50",
        imageSrc: "/assets/coffee/cake/5.jpg"
      },
      {
        name: "YoYo biscuit",
        description: "A buttery sandwich biscuit with a creamy filling and a dusting of icing sugar.",
        price: "5.50",
        imageSrc: "/assets/coffee/cake/6.jpg"
      }
    ]
  },
  {
    id: "coffee",
    title: "Coffee & warm drinks",
    imageSrc: "/assets/coffee/cafe/1.jpg",
    imageAlt: "Flat white",
    items: [
      {
        name: "Flat white",
        description: "Espresso with silky steamed milk and a fine layer of microfoam.",
        price: "5.50",
        imageSrc: "/assets/coffee/cafe/1.jpg"
      },
      {
        name: "Latte",
        description: "A smooth espresso and steamed milk, served in a glass with latte art.",
        price: "5.50",
        imageSrc: "/assets/coffee/cafe/2.jpg"
      },
      {
        name: "Piccolo",
        description: "A small espresso-based coffee with steamed milk, served in a short glass.",
        price: "4.75",
        imageSrc: "/assets/coffee/cafe/3.jpg"
      },
      {
        name: "Long black",
        description: "Espresso poured over hot water for a full-flavoured black coffee.",
        price: "4.75",
        imageSrc: "/assets/coffee/cafe/4.jpg"
      },
      {
        name: "Espresso",
        description: "A short, concentrated coffee with a golden crema.",
        price: "4.75",
        imageSrc: "/assets/coffee/cafe/5.jpg"
      },
      {
        name: "Macchiato",
        description: "Espresso marked with a little steamed milk, served in a small glass.",
        price: "4.75",
        imageSrc: "/assets/coffee/cafe/6.jpg"
      },
      {
        name: "Vienna coffee",
        description: "A black coffee served with a side of whipped cream and a dusting of chocolate.",
        price: "6.50",
        imageSrc: "/assets/coffee/cafe/7.jpg"
      },
      {
        name: "Chai latte",
        description: "Spiced chai with steamed milk and a light cinnamon dusting.",
        price: "6.00",
        imageSrc: "/assets/coffee/cafe/8.jpg"
      },
      {
        name: "Pot chai",
        description: "Spiced milk chai served in a pot with a strainer and honey on the side.",
        price: "8.00",
        imageSrc: "/assets/coffee/cafe/9.jpg"
      },
      {
        name: "Hot chocolate",
        description: "A comforting cup of chocolate and steamed milk, finished with cocoa.",
        price: "5.50",
        imageSrc: "/assets/coffee/cafe/10.jpg"
      },
      {
        name: "Premium drinking chocolate",
        description: "A rich drinking chocolate with steamed milk and a generous cocoa topping.",
        price: "6.00",
        imageSrc: "/assets/coffee/cafe/11.jpg"
      },
      {
        name: "Pot of tea",
        description: "Your choice of tea, served in a teapot with milk on the side.",
        price: "5.50",
        imageSrc: "/assets/coffee/cafe/12.jpg"
      },
      {
        name: "Golden milk",
        description: "A gently spiced turmeric milk with a foamy top, served warm in a glass.",
        price: "6.00",
        imageSrc: "/assets/coffee/cafe/13.jpg"
      }
    ]
  },
  {
    id: "cold-drinks",
    title: "Cold drinks",
    note: "Juices, smoothies & iced favourites",
    imageSrc: "/assets/coffee/drink/1.jpg",
    imageAlt: "Cold-pressed juice",
    items: [
      {
        name: "Cold-pressed juice",
        description: "A glass of fresh fruit and vegetable juice; choose a seasonal red, orange or green blend.",
        price: "10.00",
        imageSrc: "/assets/coffee/drink/1.jpg"
      },
      {
        name: "Orange juice",
        description: "Fresh orange juice, served chilled with a slice of citrus.",
        price: "9.00",
        imageSrc: "/assets/coffee/drink/2.jpg"
      },
      {
        name: "Apple juice",
        description: "Refreshing apple juice, served chilled with a crisp apple garnish.",
        price: "6.50",
        imageSrc: "/assets/coffee/drink/3.jpg"
      },
      {
        name: "Mango smoothie",
        description: "A creamy mango smoothie, blended and served chilled.",
        price: "11.50",
        imageSrc: "/assets/coffee/drink/4.jpg"
      },
      {
        name: "Iced coffee",
        description: "Chilled coffee with milk and a creamy topping, served in a tall glass.",
        price: "10.00",
        imageSrc: "/assets/coffee/drink/5.jpg"
      },
      {
        name: "Iced chocolate",
        description: "Chocolate and cold milk with a creamy topping and a fresh strawberry garnish.",
        price: "10.00",
        imageSrc: "/assets/coffee/drink/6.jpg"
      },
      {
        name: "Berry lemonade spider",
        description: "A fizzy lemonade float with berries and ice cream, finished with a fresh strawberry.",
        price: "10.00",
        imageSrc: "/assets/coffee/drink/7.jpg"
      }
    ]
  }
];

export const orderUpMenuUrl = "https://theorganicmarketandcafe.orderup.com.au/stores/the-organic-market-cafe";
