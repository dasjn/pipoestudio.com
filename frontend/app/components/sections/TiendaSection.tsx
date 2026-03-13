import PipoProductCard, { type PipoProductCardData } from "../PipoProductCard";

interface TiendaSectionData {
  title?: string;
  subtitle?: string;
}

interface TiendaSectionProps {
  data?: TiendaSectionData;
  products?: PipoProductCardData[];
}

const DEFAULT_TITLE = "TIENDA";
const DEFAULT_SUBTITLE = "NO SIEMPRE HAY... ASÍ QUE APROVECHA.";

export default function TiendaSection({ data, products }: TiendaSectionProps) {
  const title = data?.title ?? DEFAULT_TITLE;
  const subtitle = data?.subtitle ?? DEFAULT_SUBTITLE;

  return (
    <section
      id="tienda"
      className="font-sans w-full h-full flex flex-col items-center justify-center gap-3 px-2 mt-6"
    >
      <div className="text-center">
        <p className="font-bold text-5xl leading-none text-green-pipo uppercase">
          {title}
        </p>
        <p className="font-bold text-[10px] text-green-pipo uppercase">
          {subtitle}
        </p>
      </div>

      <div className="flex gap-2 w-full justify-center">
        {products && products.length > 0 ? (
          products.map((product) => (
            <div key={product._id} className="w-56">
              <PipoProductCard product={product} />
            </div>
          ))
        ) : (
          <p className="text-green-pipo font-bold text-xs">Cargando…</p>
        )}
      </div>
    </section>
  );
}
