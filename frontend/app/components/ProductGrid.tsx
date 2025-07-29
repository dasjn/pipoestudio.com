"use client";
import ProductCard from "./ProductCard";

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

interface ProductGridProps {
  products: Product[];
  maxDesktop?: number;
  maxMobile?: number;
  onProductClick?: (product: Product) => void;
  className?: string;
}

export default function ProductGrid({ 
  products, 
  maxDesktop = 3, 
  maxMobile = 1, 
  onProductClick,
  className = ""
}: ProductGridProps) {
  if (!products || products.length === 0) {
    return null;
  }

  // Sort by sortOrder (already sorted from query, but just in case)
  const sortedProducts = [...products].sort((a, b) => 
    (a.sortOrder || 0) - (b.sortOrder || 0)
  );

  return (
    <div className={`w-full ${className}`}>
      {/* Desktop Grid */}
      <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 justify-items-center">
        {sortedProducts.slice(0, maxDesktop).map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onClick={onProductClick}
          />
        ))}
      </div>

      {/* Mobile Grid */}
      <div className="md:hidden flex flex-col items-center space-y-6">
        {sortedProducts.slice(0, maxMobile).map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onClick={onProductClick}
          />
        ))}
      </div>

      {/* Show count info if there are more products */}
      {products.length > Math.max(maxDesktop, maxMobile) && (
        <div className="text-center mt-6 text-gray-600 text-sm">
          Mostrando {Math.min(maxDesktop, products.length)} de {products.length} productos en desktop, 
          {Math.min(maxMobile, products.length)} en móvil
        </div>
      )}
    </div>
  );
}