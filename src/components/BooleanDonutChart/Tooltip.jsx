import { createContext, forwardRef, useContext, useEffect, useRef, useState } from "react"; // createContext: crea un contexto para compartir datos. forwardRef: permite pasar una referencia desde fuera. useContext: lee datos del contexto. useEffect: ejecuta código cuando el componente se monta. useRef: guarda una referencia a un elemento del DOM. useState: guarda estado.
import { createPortal } from "react-dom"; // Sirve para pintar un componente fuera de su posición normal

const TooltipContext = createContext(undefined);

function useTooltipContext() {
    const context = useContext(TooltipContext);

    if (!context) {
        throw new Error("Tooltip must be used within a Tooltip Context");
    }

    return context;
}

function ClientTooltip({ children }) {
    const [tooltip, setTooltip] = useState(); // guarda la posición de tooltip

    return (
        <TooltipContext.Provider value={{ tooltip, setTooltip }}>
            {children}
        </TooltipContext.Provider>
    );
}

// Crea el componente que activa el tooltip. Usa forwardRef para poder recibir una referencia externa
const TooltipTrigger = forwardRef(function TooltipTrigger({ children }, forwardedRef) {
    const context = useTooltipContext(); // Obtiene tooltip y setTooltip del contexto
    const triggerRef = useRef(null); // Crea una referencia interna al elemento que activa el tooltip

    // Ejecuta código cuando el componente se monta
    useEffect(() => {
        // Función para detectar clicks fuera del tooltip
        const handleClickOutside = (event) => {
            // Que exista el elemento. Que el click NO haya sido dentro de ese elemento
            if (triggerRef.current && !triggerRef.current.contains(event.target)) {
                context.setTooltip(undefined); // Si haces click fuera, oculta el tooltip
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside);

        // Función de limpieza
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, [context]);

    return (
        <g
            ref={(node) => {
                // Mantenemos la ref interna y tambien la ref externa si algun componente la necesita
                triggerRef.current = node;
                if (typeof forwardedRef === "function") {
                    forwardedRef(node);
                } else if (forwardedRef) {
                    forwardedRef.current = node;
                }
            }}
            onPointerMove={(event) => {
                // En escritorio se muestra con hover/movimiento del raton
                if (event.pointerType === "mouse") {
                    context.setTooltip({ x: event.clientX, y: event.clientY });
                }
            }}
            onPointerLeave={(event) => {
                if (event.pointerType === "mouse") {
                    context.setTooltip(undefined);
                }
            }}
            onTouchStart={(event) => {
                // En movil se muestra al tocar el sector durante un momento
                context.setTooltip({ x: event.touches[0].clientX, y: event.touches[0].clientY });
                window.setTimeout(() => {
                    context.setTooltip(undefined);
                }, 2000); // Después de 2 segundos, lo oculta
            }}
        >
            {children}
        </g>
    );
});

// Componente que pinta el contenido del tooltip
const TooltipContent = forwardRef(function TooltipContent({ children }, forwardedRef) {
    const context = useTooltipContext(); // Lee el estado del tooltip
    const runningOnClient = typeof document !== "undefined"; // Comprueba que existe document

    // Si no hay tooltip activo, no pinta nada
    if (!context.tooltip || !runningOnClient) {
        return null;
    }

    // Comprueba si la pantalla es móvil
    const isMobile = window.innerWidth < 768;
    const desktopLeft = Math.min(context.tooltip.x + 10, window.innerWidth - 180);  // Calcula posición izquierda en escritorio. Math.min evita que el tooltip se salga por la derecha

    return createPortal(
        <div
            ref={(node) => {
                if (typeof forwardedRef === "function") {
                    forwardedRef(node);
                } else if (forwardedRef) {
                    forwardedRef.current = node;
                }
            }}
            // fixed: se posiciona respecto a la pantalla. z-50: aparece por encima. rounded-md: bordes redondeados. border: borde. bg-white: fondo blanco. px-3.5 py-2: padding. shadow-sm: sombra
            className="fixed z-50 h-fit w-fit rounded-md border border-zinc-200 bg-white px-3.5 py-2 shadow-sm"
            style={
                // Si es móvil, coloca el tooltip cerca del toque. Si es escritorio, lo coloca cerca del ratón, un poco más arriba
                isMobile
                    ? {
                        top: context.tooltip.y,
                        left: context.tooltip.x + 20,
                    }
                    : {
                        top: context.tooltip.y - 20,
                        left: desktopLeft,
                    }
            }
        >
            {children}
        </div>,
        document.body
    );
});

export { ClientTooltip, TooltipTrigger, TooltipContent };
