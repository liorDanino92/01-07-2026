export const PRODUCTS = [
  { id: "tomato", name: "עגבניות", unit: 'ק"ג', category: "ירקות" },
  { id: "cucumber", name: "מלפפון", unit: 'ק"ג', category: "ירקות" },
  { id: "pepper", name: "פלפל אדום", unit: 'ק"ג', category: "ירקות" },
  { id: "onion", name: "בצל", unit: 'ק"ג', category: "ירקות" },
  { id: "potato", name: "תפוח אדמה", unit: 'ק"ג', category: "ירקות" },

  { id: "sweet_potato", name: "בטטה", unit: 'ק"ג', category: "ירקות" },
  { id: "carrot", name: "גזר", unit: 'ק"ג', category: "ירקות" },
  { id: "butternut", name: "דלורית", unit: 'ק"ג', category: "ירקות" },
  { id: "pumpkin", name: "דלעת", unit: 'ק"ג', category: "ירקות" },
  { id: "packed_pumpkin", name: "דלעת ארוזה", unit: "יח'", category: "מיוחדים" },
  { id: "zucchini", name: "זוקיני", unit: 'ק"ג', category: "ירקות" },
  { id: "eggplant", name: "חציל", unit: 'ק"ג', category: "ירקות" },
  { id: "baladi_eggplant", name: "חציל בלאדי", unit: 'ק"ג', category: "ירקות" },
  { id: "cauliflower", name: "כרובית", unit: 'ק"ג', category: "ירקות" },
  { id: "packed_cauliflower", name: "כרובית ארוזה", unit: "יח'", category: "מיוחדים" },
  { id: "beet", name: "סלק", unit: 'ק"ג', category: "ירקות" },
  { id: "vacuum_beet", name: "סלק מבושל בוואקום", unit: "יח'", category: "מיוחדים" },
  { id: "salanova_lettuce", name: "חסה סלנובה", unit: "יח'", category: "ירק" },
  { id: "lalik_lettuce", name: "חסה לאליק", unit: "יח'", category: "ירק" },
  { id: "parsley", name: "פטרוזיליה", unit: "יח'", category: "ירק" },
  { id: "cilantro", name: "כוסברה", unit: "יח'", category: "ירק" },
  { id: "dill", name: "שמיר", unit: "יח'", category: "ירק" },
  { id: "mint", name: "נענע", unit: "יח'", category: "ירק" },
  { id: "yellow_pepper", name: "פלפל צהוב", unit: 'ק"ג', category: "ירקות" },
  { id: "green_pepper", name: "פלפל ירוק", unit: 'ק"ג', category: "ירקות" },
  { id: "shushka_red_pepper", name: "פלפל שושקה אדום", unit: 'ק"ג', category: "ירקות" },
  { id: "peach", name: "אפרסק", unit: 'ק"ג', category: "פירות" },
  { id: "loquat", name: "שסק", unit: 'ק"ג', category: "פירות" },
  { id: "packed_loquat", name: "שסק ארוז", unit: "יח'", category: "מיוחדים" },

  { id: "apple", name: "תפוח", unit: 'ק"ג', category: "פירות" },
  { id: "banana", name: "בננה", unit: 'ק"ג', category: "פירות" },
  { id: "lemon", name: "לימון", unit: 'ק"ג', category: "פירות" },
  { id: "avocado", name: "אבוקדו", unit: 'ק"ג', category: "פירות" },
  { id: "strawberry", name: "תות שדה", unit: 'ק"ג', category: "פירות" },

  { id: "lettuce", name: "חסה", unit: "יח'", category: "ירק" },

  { id: "garlic", name: "שום", unit: 'ק"ג', category: "מיוחדים" },
];

export const STORES = [
  {
    id: "s1",
    name: "ירק פרימיום",
    quality: "פרימיום",
    minOrder: 160,
    deliveryFee: 25,
    areas: ["תל אביב", "הרצליה", "רמת גן", "גבעתיים"],
    prices: {
      tomato: 12.9, cucumber: 7.9, pepper: 16.9, onion: 6.9, potato: 5.9,
      lemon: 11.9, apple: 14.9, banana: 10.9, avocado: 34.9, lettuce: 8.5,
      strawberry: 39.9
    }
  },
  {
    id: "s2",
    name: "השדה המובחר",
    quality: "מובחר",
    minOrder: 120,
    deliveryFee: 29,
    areas: ["חיפה", "קריות", "נהריה", "עכו"],
    prices: {
      tomato: 11.5, cucumber: 6.9, pepper: 15.9, onion: 6.2, potato: 5.5,
      lemon: 10.9, apple: 13.9, banana: 9.9, avocado: 33.9, lettuce: 7.9
    }
  },
  {
    id: "s3",
    name: "ירקות בזול",
    quality: "מוזל",
    minOrder: 90,
    deliveryFee: 35,
    areas: ["באר שבע", "אשקלון", "אשדוד"],
    prices: {
      tomato: 9.9, cucumber: 5.9, onion: 5.8, potato: 4.9,
      lemon: 9.9, apple: 12.9, banana: 8.9, lettuce: 6.9
    }
  },
  {
    id: "s4",
    name: "פירות גורמה",
    quality: "פרימיום",
    minOrder: 200,
    deliveryFee: 19,
    areas: ["תל אביב", "רמת השרון", "כפר סבא"],
    prices: {
      apple: 16.9, banana: 11.9, avocado: 36.9, strawberry: 42.9, lemon: 12.9
    }
  },
  {
    id: "s5",
    name: "מבחר יומי",
    quality: "מובחר",
    minOrder: 110,
    deliveryFee: 32,
    areas: ["ירושלים", "מודיעין", "בית שמש"],
    prices: {
      tomato: 10.9, cucumber: 6.4, pepper: 16.2, onion: 6.0, potato: 5.2,
      lemon: 10.2, apple: 13.2, banana: 9.4, avocado: 32.5, garlic: 22.0
    }
  }
];

export const QUALITY_WEIGHT = {
  "פרימיום": 3,
  "מובחר": 2,
  "מוזל": 1
};
