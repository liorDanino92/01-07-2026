const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

function normalizeProducts(products) {
  return products.map(product => ({
    id: product.id,
    name: product.name,
    unit: product.unit,
    category: product.category
  }));
}

function cleanSuggestions(rawSuggestions, products) {
  const allowedProducts = new Map(
    products.map(product => [product.id, product])
  );

  return rawSuggestions
    .filter(item => item && allowedProducts.has(item.productId))
    .map(item => {
      const product = allowedProducts.get(item.productId);

      return {
        productId: product.id,
        name: product.name,
        unit: product.unit,
        qty: Number(item.qty) > 0 ? Number(item.qty) : defaultQty(product),
        reason: item.reason || "מוצר מתאים לבקשה שלך"
      };
    })
    .slice(0, 10);
}

function defaultQty(product) {
  return product.unit === "יח'" ? 1 : 0.5;
}

async function suggestBasketItems(userPrompt, products) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is missing");
  }

  const availableProducts = normalizeProducts(products);

  const response = await client.responses.create({
    model: "gpt-4.1-mini",
    instructions: `
אתה עוזר סל קניות לאתר השוואת פירות וירקות.

המטרה שלך:
לקבל בקשה חופשית בעברית, למשל:
"סלט יווני", "סלט פירות", "פלטת פירות", "ירקות למרק".

עליך להציע מוצרים רלוונטיים מתוך רשימת המוצרים הזמינים בלבד.

כללים חשובים:
1. החזר רק מוצרים שקיימים ברשימת המוצרים.
2. אל תמציא productId.
3. אל תחזיר מתכון מלא.
4. אל תחזיר שלבי הכנה.
5. החזר 3 עד 10 מוצרים.
6. הכמויות צריכות להיות הגיוניות.
7. אם המוצר ביחידות, הכמות תהיה מספר שלם.
8. אם המוצר בק"ג, הכמות יכולה להיות 0.5, 1, 1.5 או 2.
9. החזר תשובה בעברית.
`,
    input: [
      {
        role: "user",
        content: `
בקשת המשתמש:
${userPrompt}

רשימת המוצרים הזמינים:
${JSON.stringify(availableProducts, null, 2)}

החזר JSON בלבד במבנה הבא:
{
  "suggestions": [
    {
      "productId": "tomato",
      "qty": 1,
      "reason": "מרכיב נפוץ בסלט יווני"
    }
  ]
}
`
      }
    ],
    text: {
      format: {
        type: "json_schema",
        name: "basket_suggestions",
        schema: {
          type: "object",
          additionalProperties: false,
          properties: {
            suggestions: {
              type: "array",
              minItems: 0,
              maxItems: 10,
              items: {
                type: "object",
                additionalProperties: false,
                properties: {
                  productId: { type: "string" },
                  qty: { type: "number" },
                  reason: { type: "string" }
                },
                required: ["productId", "qty", "reason"]
              }
            }
          },
          required: ["suggestions"]
        }
      }
    }
  });

  const parsed = JSON.parse(response.output_text);
  return cleanSuggestions(parsed.suggestions || [], products);
}

module.exports = {
  suggestBasketItems
};