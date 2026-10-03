export const shopUrl = "https://organicmarket.myfoodlink.com/";
export const mapsUrl = "https://maps.app.goo.gl/UzFGf2cJmp6AVwAQ9";
export const email = "hello@organicmarket.com.au";
export const phoneDisplay = "(08) 8339 4835";
export const phoneHref = "tel:+61883394835";
export const facebookUrl = "https://www.facebook.com/organicmarketandcafe";
export const instagramUrl = "https://www.instagram.com/theorganicmarketandcafe/";

export const address = {
  line1: "5 Druid Avenue",
  line2: "Stirling SA 5152",
  full: "5 Druid Avenue, Stirling SA 5152",
};

export const nav = [
  { href: "/market", label: "Market" },
  { href: "/cafe", label: "Café" },
  { href: "/about", label: "About Us" },
  // { href: "/supply", label: "Supply" },
  // { href: "/visit", label: "Visit" },
] as const;

export const hours = [
  { when: "Monday to Friday", shop: "8:00–5:00", cafe: "8:00–4:30" },
  { when: "Saturday and Sunday", shop: "8:00–4:30", cafe: "8:00–4:00" },
  { when: "Public holidays", shop: "8:30–3:30", cafe: "8:30–3:30" },
] as const;

export const departments = [
  {
    name: "Fresh produce",
    summary:
      "Certified organic and biodynamic fruit and vegetables, from Adelaide Hills growers and from interstate.",
    detail:
      "The front of the shop is fresh fruit and vegetables: certified organic and biodynamic, bought from local growers and from interstate. What is on the stand follows the season.",
    note: "Kitchens usually start here, with cases of whatever is ripe this week.",
  },
  {
    name: "Bulk wholefoods",
    summary: "Grains, nuts, seeds, flours and other dry staples, sold by weight.",
    detail:
      "Grains, nuts, seeds, flours and dry staples are sold by weight, so a household and a kitchen can buy the amount they will use.",
    note: "Ask for bulk bags when you are stocking a bench.",
  },
  {
    name: "Grocery",
    summary:
      "Packaged lines for vegan, raw and free-from diets, chosen without genetically modified ingredients.",
    detail:
      "Packaged grocery covers vegan, raw, gluten-free, dairy-free and other free-from diets. We look for certified organic and preservative-free lines, and we keep genetically modified ingredients out of that range.",
    note: "Bring a standing list if you want the same lines each week.",
  },
  {
    name: "Dairy, meat and drinks",
    summary:
      "Organic dairy, free-range meat, wine, beer and spirits, bought to the same standard as the produce.",
    detail:
      "Dairy, meat, wine, beer and spirits are bought with the food, not added as a sideline. We prefer organic, biodynamic, free-range and ethically reared products, and we say when a line is conventional.",
    note: "Cafés often come for milk, and for drinks to pour by the glass.",
  },
  {
    name: "Personal care",
    summary: "Soaps, skincare and household lines held to the same rule as the food.",
    detail:
      "Personal care is on the floor because customers asked for the standard they already use in the kitchen: fewer industrial defaults, and a label that matches the contents.",
    note: "These lines are in the shop and on the online store.",
  },
  {
    name: "Café bench",
    summary:
      "A vegetarian kitchen cooking from the market shelves, and organic coffee from D'Angelo.",
    detail:
      "The café is vegetarian first, with vegan, dairy-free, gluten-free and sugar-free choices. Salads, soups and a special are made each day. Bruschettas, focaccias and croissants are assembled to order.",
    note: "Coffee is organic, from D'Angelo, with Paris Creek organic milk or a substitute.",
  },
] as const;

export const buyers = [
  {
    who: "A café or restaurant",
    need: "Produce, dairy, grocery and coffee on a repeating list.",
  },
  {
    who: "Another retailer",
    need: "Packaged organic lines and bulk goods you can turn over.",
  },
  {
    who: "An office",
    need: "Platters and coffee from the café, or a pantry order from the shop.",
  },
  {
    who: "A household",
    need: "The floor on Druid Avenue, or the online shop with delivery and click and collect.",
  },
] as const;
