import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Función utilitaria cn
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Configuración de estilos con template literals para IntelliSense completo
const buttonStyles = {
  // Clases base - IntelliSense completo en cada línea
  base: `
    inline-flex items-center justify-center
    font-semibold text-white rounded-md 
    cursor-pointer
    transition-all duration-200 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:cursor-not-allowed disabled:opacity-50
  `,

  // Variantes de color - IntelliSense completo
  variants: {
    primary: `
       bg-green-pipo text-white
      hover:bg-green-600 active:bg-green-700
      focus:ring-green-500
      disabled:bg-gray-300 disabled:text-gray-500
    `,
    secondary: `
      bg-gray-200 text-gray-900
      hover:bg-gray-300 active:bg-gray-400
      focus:ring-gray-500
      disabled:bg-gray-100 disabled:text-gray-400
    `,
    destructive: `
      bg-red-500 text-white
      hover:bg-red-600 active:bg-red-700
      focus:ring-red-500
      disabled:bg-gray-300 disabled:text-gray-500
    `,
    outline: `
      border-2 border-green-pipo bg-transparent text-green-pipo
      hover:bg-gray-50 active:bg-gray-100
      focus:ring-gray-500
      disabled:border-gray-200 disabled:text-gray-400
    `,
    ghost: `
      bg-transparent text-gray-700
      hover:bg-gray-100 active:bg-gray-200
      focus:ring-gray-500
      disabled:text-gray-400
    `,
  },

  // Tamaños - IntelliSense completo
  sizes: {
    sm: `px-3 py-2 text-sm`,
    md: `px-4 py-3 text-base`,
    lg: `px-6 py-4 text-lg`,
    xl: `px-8 py-5 text-xl`,
  },
};

// Tipos TypeScript
interface BaseButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: keyof typeof buttonStyles.variants;
  size?: keyof typeof buttonStyles.sizes;
  disabled?: boolean;
}

interface ButtonAsButton extends BaseButtonProps {
  as?: "button";
  type?: "button" | "submit" | "reset";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  href?: never;
  target?: never;
  rel?: never;
}

interface ButtonAsLink extends BaseButtonProps {
  as: "link";
  href: string;
  target?: "_blank" | "_self" | "_parent" | "_top";
  rel?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  type?: never;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

// Componente principal
const Button = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(
  (
    {
      children,
      className,
      variant = "primary",
      size = "md",
      disabled = false,
      as = "button",
      ...props
    },
    ref
  ) => {
    // Combinar clases usando template literals
    const combinedClasses = cn(
      buttonStyles.base,
      buttonStyles.variants[variant],
      buttonStyles.sizes[size],
      className
    );

    // Renderizar como enlace
    if (as === "link") {
      const { href, target, rel, onClick } = props as ButtonAsLink;

      // Auto-agregar rel="noopener noreferrer" para enlaces externos
      const linkRel = target === "_blank" ? rel || "noopener noreferrer" : rel;

      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={disabled ? undefined : href}
          target={disabled ? undefined : target}
          rel={linkRel}
          onClick={disabled ? (e) => e.preventDefault() : onClick}
          className={combinedClasses}
          aria-disabled={disabled}
          tabIndex={disabled ? -1 : undefined}
        >
          {children}
        </a>
      );
    }

    // Renderizar como botón
    const { type = "button", onClick } = props as ButtonAsButton;
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={combinedClasses}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;

// ============= EJEMPLOS DE USO =============

/*
// Botón básico (variant="primary", size="md" por defecto)
<Button onClick={() => console.log('clicked')}>
  CREEMOS ALGO ÚNICO
</Button>

// Todas las variantes disponibles
<Button variant="primary">Primary Button</Button>
<Button variant="secondary">Secondary Button</Button>
<Button variant="destructive">Delete Account</Button>
<Button variant="outline">Outline Button</Button>
<Button variant="ghost">Ghost Button</Button>

// Todos los tamaños disponibles
<Button size="sm">Small Button</Button>
<Button size="md">Medium Button</Button>
<Button size="lg">Large Button</Button>
<Button size="xl">Extra Large Button</Button>

// Como enlace interno
<Button as="link" href="/productos">
  Ver Productos
</Button>

// Como enlace externo (rel se agrega automáticamente)
<Button as="link" href="https://ejemplo.com" target="_blank">
  Sitio Externo
</Button>

// Enlace con variante y tamaño
<Button as="link" href="/contacto" variant="outline" size="lg">
  Contáctanos
</Button>

// Botón deshabilitado
<Button disabled onClick={() => console.log('no se ejecuta')}>
  Botón Deshabilitado
</Button>

// Enlace deshabilitado
<Button as="link" href="/disabled" disabled>
  Enlace Deshabilitado
</Button>

// Con clases personalizadas (se mezclan inteligentemente con twMerge)
<Button className="shadow-lg bg-blue-500" variant="primary">
  Custom Button
</Button>
// → bg-blue-500 sobrescribe bg-green-500 gracias a twMerge

// Botón de formulario
<Button type="submit" variant="primary" size="lg">
  Enviar Formulario
</Button>

// Con ref para acceso directo al DOM
const buttonRef = useRef<HTMLButtonElement>(null);
<Button ref={buttonRef} onClick={() => buttonRef.current?.focus()}>
  Button con Ref
</Button>

// Combinando múltiples props
<Button 
  variant="destructive" 
  size="sm"
  disabled={isLoading}
  onClick={handleDelete}
  className="ml-auto"
>
  {isLoading ? 'Eliminando...' : 'Eliminar'}
</Button>
*/
