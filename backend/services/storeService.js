const supabase = require("../config/supabaseClient");

async function getStoresFromDb() {
  const { data: stores, error: storesError } = await supabase
    .from("stores")
    .select("*");

  if (storesError) {
    throw storesError;
  }

  const { data: storeProducts, error: pricesError } = await supabase
    .from("store_products")
    .select("*");

  if (pricesError) {
    throw pricesError;
  }

  return stores.map(store => {
    const prices = {};

    storeProducts
      .filter(item => item.store_id === store.id)
      .forEach(item => {
        prices[item.product_id] = Number(item.price);
      });

    return {
      id: store.id,
      name: store.name,
      quality: store.quality,
      minOrder: Number(store.min_order),
      deliveryFee: Number(store.delivery_fee),
      areas: store.areas,
      website: store.website,
      prices
    };
  });
}

module.exports = {
  getStoresFromDb
};