// lib/getProducts.js
import { supabase } from "./supabase";

export const getProducts = async () => {
  const { data, error } = await supabase
    .from("products")
    .select(`
      id,
      name,
      slug,
      description,
      category,
      image_url,
      base_price,
      product_variants(name),
      product_flows(name)
    `);

  if (error) {
    console.error("Error fetching products:", error.message);
    return [];
  }

return data.map(product => ({
  ...product,
  category: product.category || "uncategorized", // <- ensure category is passed
  imageUrl: product.image_url,
  basePrice: product.base_price ?? 0,
  variants: product.product_variants?.map(v => v.name) || [],
  flow: product.product_flows?.map(f => f.name) || [],
}));
};

