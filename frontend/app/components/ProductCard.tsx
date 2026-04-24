"use client";
import Image from "next/image";
import Button from "./Button";
import { urlForImage } from "@/sanity/lib/utils";

interface ProductCardData {
  _id: string;
  name?: string;
  subtitle?: string;
  description?: string;
  image?: {
    asset: any;
    alt?: string;
  };
  buttonText?: string;
  priceShippingInfo?: string;
  slug?: string;
  sold?: boolean;
  soldText?: string;
}

interface ProductCardProps {
  product: ProductCardData;
  onClick?: (product: ProductCardData) => void;
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  const {
    name = "PRODUCTO",
    subtitle = "DESCRIPCIÓN",
    image,
    buttonText = "¡LO QUIERO!",
    priceShippingInfo = "Información de envío no disponible",
    sold = false,
    soldText = "¡VENDIDO!",
  } = product;

  const imageUrl = image?.asset
    ? urlForImage(image)?.width(400).height(400).url()
    : "/images/Furniture_Fallback.webp";

  // For Next.js Image optimization
  const optimizedImageUrl = imageUrl || "/images/Furniture_Fallback.webp";
  const imageAlt = image?.alt || name || "Product Image";

  const handleClick = () => {
    // Scroll to contact section
    const contactSection = document.getElementById("contacto");
    if (contactSection) {
      contactSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    // Optional: still call the onClick prop if provided
    onClick?.(product);
    console.log("Product clicked, scrolling to contact:", product);
  };

  return (
    <article
      className={`bg-gray-100 shadow-md relative rounded-xl p-3 sm:p-4 w-80 sm:w-96 mx-auto ${sold ? "opacity-75" : ""}`}
    >
      <div className="w-full flex">
        <Image
          src={optimizedImageUrl}
          alt={imageAlt}
          width={400}
          height={384}
          className={`w-full h-96 object-cover rounded-xl mb-4 ${sold ? "grayscale" : ""}`}
          priority={false}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
        />

        {/* Sold badge */}
        {sold && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <div className="bg-green-pipo text-white px-4 py-2 rounded-lg font-bold text-lg transform -rotate-12 shadow-lg">
              {soldText}
            </div>
          </div>
        )}

        <div className="absolute top-0 max-w-[80%] uppercase">
          <h3 className="bg-gray-100 pr-2 font-bold text-4xl sm:text-5xl rounded-br-xl mt-3 sm:mt-4 w-fit overflow-hidden text-green-600">
            {name}
          </h3>
          {subtitle && (
            <h4 className="bg-gray-100 pr-2 font-bold text-lg sm:text-xl rounded-br-xl w-fit text-green-600">
              {subtitle}
            </h4>
          )}
        </div>

        <div className="absolute top-95 max-w-[80%] rounded-tr-xl">
          <p className="bg-gray-100 pr-2 text-xs sm:text-sm leading-4 pt-1 rounded-tr-xl w-fit text-green-600">
            {priceShippingInfo || "Hecho a mano y por sólo $20."}
          </p>
        </div>
      </div>
      <div className="flex justify-center mt-3 sm:mt-4">
        <Button
          onClick={handleClick}
          size="sm"
          className="font-bold text-xs sm:text-sm px-4 sm:px-6 cursor-pointer"
          variant={sold ? "secondary" : "primary"}
        >
          {buttonText}
        </Button>
      </div>
    </article>
  );
}
