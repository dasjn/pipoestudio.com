import ProductCard from "../ProductCard";

interface Product {
  _id: string;
  name?: string;
  subtitle?: string;
  image?: {
    asset: any;
    alt?: string;
  };
  buttonText?: string;
  priceShippingInfo?: string;
  slug?: string;
  sortOrder?: number;
  sold?: boolean;
  soldText?: string;
}

interface DevelopProps {
  products?: Product[];
}

export default function Develop({ products = [] }: DevelopProps) {
  // Mock product data as fallback
  const mockProducts = [
    {
      _id: "mock-product-1",
      name: "LLAVERIZO",
      subtitle: "SOPORTE LLAVES",
      buttonText: "¡LO QUIERO!",
      priceShippingInfo:
        "Hecho a mano y por sólo 28€. Recógelo gratis en Gran Canaria. Envío a Canarias +10€",
      slug: "llaverizo",
    },
    {
      _id: "mock-product-2",
      name: "PERCHERO",
      subtitle: "COLGADOR ROPA",
      buttonText: "¡LO QUIERO!",
      priceShippingInfo:
        "Hecho a mano y por sólo 35€. Recógelo gratis en Gran Canaria. Envío a Canarias +10€",
      slug: "perchero",
    },
    {
      _id: "mock-product-3",
      name: "ESTANTERÍA",
      subtitle: "ORGANIZADOR",
      buttonText: "¡LO QUIERO!",
      priceShippingInfo:
        "Hecho a mano y por sólo 42€. Recógelo gratis en Gran Canaria. Envío a Canarias +10€",
      slug: "estanteria",
    },
  ];

  // Use products from props or fallback to mock, take first 3
  const productsToShow = products.length > 0 ? products.slice(0, 3) : mockProducts;

  return (
    <section className="h-svh bg-gray-400 text-white py-16 flex items-center justify-center">
      <div className="max-w-[1920px] mx-auto px-5">
        <div className="flex flex-row gap-5">
          {productsToShow.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
