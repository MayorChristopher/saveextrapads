import React, { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ShoppingCart, Search } from "lucide-react";
import { useCart } from "@/store/cart";
import { useToast } from "@/components/ui/use-toast";
import { slugify } from '@/lib/slugify';
import { getProducts } from "@/lib/getProducts";
import { v4 as uuidv4 } from "uuid";
import { formatCurrency } from "@/lib/formatCurrency";





const Shop = () => {
  const { toast } = useToast();
  const addToCart = useCart((state) => state.addToCart);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedOptions, setSelectedOptions] = useState({});

  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await getProducts(); // fetch from Supabase
        setProducts(data);
      } catch (error) {
        toast({ title: "Error loading products", variant: "destructive" });
      }
    }
    fetchProducts();
  }, []);


  const categories = useMemo(() => {
    const all = products.map(p => p.category).filter(Boolean);
    return Array.from(new Set(all));
  }, [products]);

  const calculatePrice = (base, variant, flow) => {
    if (typeof base !== "number") return "0.00";

    let price = base;
    if (variant?.includes("Super") || variant?.includes("Extra")) price += 1.0;
    if (flow?.includes("Heavy")) price += 0.5;
    return Math.round(price * 100) / 100;

  };



  const handleAddToCart = (product) => {
    const opts = selectedOptions[product.id] || {
      variant: product.variants?.[0] ?? "Default",
      flow: product.flow?.[0] ?? "Default",
    };
    const price = calculatePrice(product.basePrice, opts.variant, opts.flow);

    addToCart({
      id: product.id,
      slug: product.slug,
      name: product.name,
      description: product.description,
      imageUrl: product.imageUrl,
      variant: opts.variant,
      flow: opts.flow,
      quantity: 1,
      price,
    });

    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };




  const handleOptionChange = (productId, key, value) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [key]: value,
      },
    }));
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <section className="hero-gradient section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Shop</h1>
            <p className="text-lg text-gray-600">
              Browse our collection of eco-friendly sanitary products
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search products..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-4">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
                className="w-40"
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat[0].toUpperCase() + cat.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>


            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {filteredProducts.map((product) => {
              const selected = selectedOptions[product.id] || {
                variant: product.variants?.[0] ?? "",
                flow: product.flow?.[0] ?? "",
              };

              const dynamicPrice = calculatePrice(
                product.basePrice,
                selected.variant,
                selected.flow
              );

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="glass-card rounded-xl overflow-hidden"
                >
                  <div className="aspect-square relative">
                    <img src={product.imageUrl} alt={product.name} className="rounded-lg w-full" />

                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 mb-4">{product.description}</p>
                    <div className="space-y-4 mb-4">
                      <Select
                        value={selected.variant}
                        onValueChange={(value) => handleOptionChange(product.id, "variant", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {product.variants?.length > 0 ? (
                            product.variants.map((variant) => (
                              <SelectItem key={variant} value={variant}>
                                {variant}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem disabled>No Variants</SelectItem>
                          )}
                        </SelectContent>
                      </Select>

                      <Select
                        value={selected.flow}
                        onValueChange={(value) => handleOptionChange(product.id, "flow", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {product.flow?.length > 0 ? (
                            product.flow.map((flow) => (
                              <SelectItem key={flow} value={flow}>
                                {flow} Flow
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem disabled>No Flow Options</SelectItem>
                          )}
                        </SelectContent>
                      </Select>

                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold">{formatCurrency(Number(dynamicPrice))}</span>                     <Button onClick={() => handleAddToCart(product)}>
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Shop;
