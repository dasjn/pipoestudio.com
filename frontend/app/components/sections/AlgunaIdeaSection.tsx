"use client";

import {
  useRef,
  useState,
  useActionState,
  useEffect,
  useTransition,
} from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Button from "../Button";
import { enviarContacto, type ContactoState } from "../../actions/contacto";
import { useNavigationStore } from "../../store/navigationStore";
import PipoBubble from "../PipoBubble";

// (REF_W - formWidth) / 2 = (600 - 250) / 2
const FORM_CENTER_OFFSET = 175;

const MAX_FILES = 4;
const MAX_DIMENSION = 1400; // px — suficiente para adjunto de email
const JPEG_QUALITY = 0.82;

const initialState: ContactoState = { status: "idle" };

async function compressImage(file: File): Promise<File> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        if (width > height) {
          height = Math.round((height * MAX_DIMENSION) / width);
          width = MAX_DIMENSION;
        } else {
          width = Math.round((width * MAX_DIMENSION) / height);
          height = MAX_DIMENSION;
        }
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          const name = file.name.replace(/\.[^.]+$/, ".jpg");
          resolve(new File([blob!], name, { type: "image/jpeg" }));
        },
        "image/jpeg",
        JPEG_QUALITY,
      );
    };
    img.src = url;
  });
}

interface AlgunaIdeaSectionProps {
  data?: { title?: string; [key: string]: unknown };
}

export default function AlgunaIdeaSection({
  data,
}: AlgunaIdeaSectionProps = {}) {
  const { currentSection, activeAnimation } = useNavigationStore();
  const [slid, setSlid] = useState(false);

  const [fotos, setFotos] = useState<File[]>([]);
  const [compressing, setCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [state, dispatch] = useActionState(enviarContacto, initialState);
  const [isPending, startTransition] = useTransition();

  // Desliza el form cuando una animación de scroll lleva a Pipo a esta sección
  useEffect(() => {
    if (currentSection !== "algunaIdea") {
      setSlid(false);
      return;
    }
    const delays: Record<string, number> = {
      "Scroll 01-D": 6000,
      "Idle 02": 80,
      "Scroll 02- U": 1000,
    };
    const delay = delays[activeAnimation];
    if (delay !== undefined) {
      const t = setTimeout(() => setSlid(true), delay);
      return () => clearTimeout(t);
    }
  }, [currentSection, activeAnimation]);

  useEffect(() => {
    if (state.status === "success") {
      toast.success("¡Mensaje enviado! Te contactamos pronto.");
      formRef.current?.reset();
      setFotos([]);
    } else if (state.status === "error") {
      toast.error(state.message);
    }
  }, [state]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length === 0) return;
    if (selected.length > MAX_FILES) {
      toast.error(`Máximo ${MAX_FILES} imágenes.`);
      return;
    }
    setCompressing(true);
    const compressed = await Promise.all(selected.map(compressImage));
    setFotos(compressed);
    setCompressing(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    // Replace raw input files with compressed versions from state
    formData.delete("fotos");
    fotos.forEach((f) => formData.append("fotos", f));
    startTransition(() => dispatch(formData));
  };

  const labelBar =
    "block w-full bg-[#00A750] text-white font-bold uppercase text-[10px] px-2 ";
  const inputBase =
    "w-full bg-transparent border-none outline-none text-xs px-2 py-1 text-[#3a3a3a] placeholder-[#6F6F6F]";

  const title = data?.title ?? "¿TIENES UNA IDEA?";

  return (
    <section
      id="algunaIdea"
      className="relative w-full h-full flex flex-col items-center justify-center px-2 gap-4 mt-6"
    >
      {title && (
        <p className="font-sans font-bold text-4xl leading-none tracking-normal text-center text-green-pipo">
          {title}
        </p>
      )}
      <PipoBubble
        text={"¿Tienes fotos? ¿Un plano?\n¿Un dibujo cutre? ¡Pásamelo!"}
        style={{ right: "18%", top: "44%" }}
      />

      <motion.div
        initial={{ x: 0 }}
        animate={{ x: slid ? -FORM_CENTER_OFFSET : 0 }}
        transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            width: "250px",
            padding: "10px",
            flexDirection: "column",
            alignItems: "flex-start",
            height: "fit-content",
            borderRadius: "6px",
            background: "#E4E5E0",
            gap: "4px",
          }}
        >
          {/* IDEA */}
          <div className="w-full">
            <label htmlFor="algunaIdea-idea" className={labelBar}>
              IDEA*:
            </label>
            <textarea
              id="algunaIdea-idea"
              name="idea"
              placeholder="Me encantaría restaurar la mesa de pino de casa de mi abuela"
              required
              rows={2}
              className={`${inputBase} resize-none`}
            />
          </div>

          {/* FOTOS */}
          <div className="w-full">
            <div
              className={`${labelBar} cursor-pointer`}
              onClick={() => fileInputRef.current?.click()}
            >
              FOTOS:
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`${inputBase} cursor-pointer`}
            >
              {compressing ? (
                <span className="text-[#6F6F6F]">Comprimiendo...</span>
              ) : fotos.length > 0 ? (
                `${fotos.length} imagen${fotos.length > 1 ? "es" : ""} seleccionada${fotos.length > 1 ? "s" : ""}`
              ) : (
                "Haz click y sube imágenes (si tienes)"
              )}
            </div>
          </div>

          {/* NOMBRE */}
          <div className="w-full">
            <label htmlFor="algunaIdea-nombre" className={labelBar}>
              NOMBRE*:
            </label>
            <input
              id="algunaIdea-nombre"
              name="nombre"
              type="text"
              placeholder="Soy Marta"
              required
              className={inputBase}
            />
          </div>

          {/* EMAIL */}
          <div className="w-full">
            <label htmlFor="algunaIdea-email" className={labelBar}>
              EMAIL*:
            </label>
            <input
              id="algunaIdea-email"
              name="email"
              type="email"
              placeholder="ejemplo@email.com"
              required
              className={inputBase}
            />
          </div>

          {/* TELÉFONO */}
          <div className="w-full">
            <label htmlFor="algunaIdea-telefono" className={labelBar}>
              TELÉFONO*:
            </label>
            <input
              id="algunaIdea-telefono"
              name="telefono"
              type="tel"
              placeholder="600112233"
              required
              className={inputBase}
            />
          </div>

          {/* Submit */}
          <Button
            as="button"
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isPending}
            className="w-full mt-1 text-xs py-[6px]"
          >
            ENVIAR A PIPO
          </Button>
        </form>
      </motion.div>
    </section>
  );
}
