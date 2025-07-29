"use client";
import { useEffect, useState } from "react";
import { sanityFetch } from "@/sanity/lib/live";
import { featuredProductsQuery } from "@/sanity/lib/queries";
import { useLocaleStore } from "@/app/store/localeStore";
import ProductGrid from "../ProductGrid";

interface Product {
  _id: string;
  name?: string;
  subtitle?: string;
  description?: string;
  price?: number;
  currency?: string;
  image?: {
    asset: any;
    alt?: string;
  };
  buttonText?: string;
  shippingInfo?: string;
  slug?: string;
  sortOrder?: number;
}

interface ProductsSectionProps {
  title?: string;
  maxDesktop?: number;
  maxMobile?: number;
  backgroundColor?: string;
}

export default function ProductsSection({
  title = "Nuestros Productos",
  maxDesktop = 3,
  maxMobile = 1,
  backgroundColor = "bg-white"
}: ProductsSectionProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const locale = useLocaleStore((state) => state.locale);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await sanityFetch({
          query: featuredProductsQuery,
          params: { language: locale, limit: Math.max(maxDesktop, maxMobile) }
        });
        setProducts(data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [locale, maxDesktop, maxMobile]);

  const handleProductClick = (product: Product) => {
    // Aquí puedes manejar el click del producto
    console.log("Product clicked:", product);
    // Por ejemplo, redirigir a la página del producto
    // router.push(`/${locale}/products/${product.slug}`);
  };

  if (loading) {
    return (
      <section className={`py-16 px-4 sm:px-6 lg:px-8 ${backgroundColor}`}>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-pipo"></div>
          </div>
        </div>
      </section>
    );
  }

  if (!products.length) {
    return (
      <section className={`py-16 px-4 sm:px-6 lg:px-8 ${backgroundColor}`}>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>
          <p className="text-center text-gray-600">No hay productos disponibles en este momento.</p>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-16 px-4 sm:px-6 lg:px-8 ${backgroundColor}`}>
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>
        <ProductGrid
          products={products}
          maxDesktop={maxDesktop}
          maxMobile={maxMobile}
          onProductClick={handleProductClick}
        />
      </div>
    </section>
  );
}