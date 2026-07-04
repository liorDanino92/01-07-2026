const STORES = [
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

const QUALITY_WEIGHT = {
  "פרימיום": 3,
  "מובחר": 2,
  "מוזל": 1
};

module.exports = {
  STORES,
  QUALITY_WEIGHT
};