export const PRODUCTS = [
  // ירקות בסיסיים
  { id: "tomato", name: "עגבנייה", unit: 'ק"ג', category: "ירקות" },
  { id: "cucumber", name: "מלפפון", unit: 'ק"ג', category: "ירקות" },
  { id: "pepper", name: "פלפל אדום", unit: 'ק"ג', category: "ירקות" },
  { id: "green_pepper", name: "פלפל ירוק", unit: 'ק"ג', category: "ירקות" },
  { id: "yellow_pepper", name: "פלפל צהוב", unit: 'ק"ג', category: "ירקות" },
  { id: "hot_pepper", name: "פלפל חריף", unit: 'ק"ג', category: "ירקות" },
  { id: "onion", name: "בצל יבש", unit: 'ק"ג', category: "ירקות" },
  { id: "red_onion", name: "בצל סגול", unit: 'ק"ג', category: "ירקות" },
  { id: "potato", name: "תפוח אדמה", unit: 'ק"ג', category: "ירקות" },
  { id: "sweet_potato", name: "בטטה", unit: 'ק"ג', category: "ירקות" },
  { id: "carrot", name: "גזר", unit: 'ק"ג', category: "ירקות" },
  { id: "zucchini", name: "קישוא", unit: 'ק"ג', category: "ירקות" },
  { id: "eggplant", name: "חציל", unit: 'ק"ג', category: "ירקות" },
  { id: "cabbage", name: "כרוב לבן", unit: "יח'", category: "ירקות" },
  { id: "red_cabbage", name: "כרוב סגול", unit: "יח'", category: "ירקות" },
  { id: "cauliflower", name: "כרובית", unit: "יח'", category: "ירקות" },
  { id: "broccoli", name: "ברוקולי", unit: "יח'", category: "ירקות" },
  { id: "pumpkin", name: "דלעת", unit: 'ק"ג', category: "ירקות" },
  { id: "beet", name: "סלק", unit: 'ק"ג', category: "ירקות" },
  { id: "radish", name: "צנונית", unit: 'ק"ג', category: "ירקות" },
  { id: "corn", name: "תירס", unit: "יח'", category: "ירקות" },
  { id: "garlic", name: "שום", unit: 'ק"ג', category: "ירקות" },
  { id: "ginger", name: "ג׳ינג׳ר", unit: 'ק"ג', category: "ירקות" },

  // ירוקים ועלים
  { id: "lettuce", name: "חסה", unit: "יח'", category: "ירק" },
  { id: "romaine_lettuce", name: "חסה ערבית", unit: "יח'", category: "ירק" },
  { id: "iceberg_lettuce", name: "חסה אייסברג", unit: "יח'", category: "ירק" },
  { id: "spinach", name: "תרד", unit: "יח'", category: "ירק" },
  { id: "mangold", name: "מנגולד", unit: "יח'", category: "ירק" },
  { id: "kale", name: "קייל", unit: "יח'", category: "ירק" },
  { id: "arugula", name: "רוקט", unit: "יח'", category: "ירק" },
  { id: "parsley", name: "פטרוזיליה", unit: "יח'", category: "ירק" },
  { id: "cilantro", name: "כוסברה", unit: "יח'", category: "ירק" },
  { id: "dill", name: "שמיר", unit: "יח'", category: "ירק" },
  { id: "mint", name: "נענע", unit: "יח'", category: "ירק" },
  { id: "basil", name: "בזיליקום", unit: "יח'", category: "ירק" },
  { id: "green_onion", name: "בצל ירוק", unit: "יח'", category: "ירק" },
  { id: "leek", name: "כרישה", unit: "יח'", category: "ירק" },
  { id: "celery", name: "סלרי", unit: "יח'", category: "ירק" },

  // פירות
  { id: "apple", name: "תפוח עץ", unit: 'ק"ג', category: "פירות" },
  { id: "green_apple", name: "תפוח ירוק", unit: 'ק"ג', category: "פירות" },
  { id: "banana", name: "בננה", unit: 'ק"ג', category: "פירות" },
  { id: "orange", name: "תפוז", unit: 'ק"ג', category: "פירות" },
  { id: "lemon", name: "לימון", unit: 'ק"ג', category: "פירות" },
  { id: "mandarin", name: "קלמנטינה", unit: 'ק"ג', category: "פירות" },
  { id: "grapefruit", name: "אשכולית", unit: 'ק"ג', category: "פירות" },
  { id: "pear", name: "אגס", unit: 'ק"ג', category: "פירות" },
  { id: "peach", name: "אפרסק", unit: 'ק"ג', category: "פירות" },
  { id: "nectarine", name: "נקטרינה", unit: 'ק"ג', category: "פירות" },
  { id: "plum", name: "שזיף", unit: 'ק"ג', category: "פירות" },
  { id: "apricot", name: "משמש", unit: 'ק"ג', category: "פירות" },
  { id: "grapes_green", name: "ענבים ירוקים", unit: 'ק"ג', category: "פירות" },
  { id: "grapes_red", name: "ענבים אדומים", unit: 'ק"ג', category: "פירות" },
  { id: "watermelon", name: "אבטיח", unit: 'ק"ג', category: "פירות" },
  { id: "melon", name: "מלון", unit: 'ק"ג', category: "פירות" },
  { id: "pineapple", name: "אננס", unit: "יח'", category: "פירות" },
  { id: "mango", name: "מנגו", unit: 'ק"ג', category: "פירות" },
  { id: "kiwi", name: "קיווי", unit: 'ק"ג', category: "פירות" },
  { id: "strawberry", name: "תות שדה", unit: 'ק"ג', category: "פירות" },
  { id: "blueberry", name: "אוכמניות", unit: "יח'", category: "פירות" },
  { id: "raspberry", name: "פטל", unit: "יח'", category: "פירות" },
  { id: "cherry", name: "דובדבן", unit: 'ק"ג', category: "פירות" },
  { id: "pomegranate", name: "רימון", unit: 'ק"ג', category: "פירות" },
  { id: "persimmon", name: "אפרסמון", unit: 'ק"ג', category: "פירות" },
  { id: "avocado", name: "אבוקדו", unit: 'ק"ג', category: "פירות" },
  { id: "dates", name: "תמרים", unit: 'ק"ג', category: "פירות" },
  { id: "fig", name: "תאנה", unit: 'ק"ג', category: "פירות" },
  { id: "loquat", name: "שסק", unit: 'ק"ג', category: "פירות" },

  // מיוחדים
  { id: "mushrooms", name: "פטריות שמפיניון", unit: "יח'", category: "מיוחדים" },
  { id: "portobello", name: "פטריות פורטובלו", unit: "יח'", category: "מיוחדים" },
  { id: "sprouts", name: "נבטים", unit: "יח'", category: "מיוחדים" },
  { id: "bean_sprouts", name: "נבטי שעועית", unit: "יח'", category: "מיוחדים" },
  { id: "baby_carrot", name: "גזר גמדי", unit: "יח'", category: "מיוחדים" },
  { id: "cherry_tomato", name: "עגבניות שרי", unit: "יח'", category: "מיוחדים" },
  { id: "cucumber_baby", name: "מלפפון בייבי", unit: "יח'", category: "מיוחדים" },
  { id: "mini_pepper", name: "פלפלונים מתוקים", unit: "יח'", category: "מיוחדים" },
  { id: "edamame", name: "אדממה", unit: "יח'", category: "מיוחדים" },
  { id: "asparagus", name: "אספרגוס", unit: "יח'", category: "מיוחדים" },
  { id: "artichoke", name: "ארטישוק", unit: "יח'", category: "מיוחדים" }
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
