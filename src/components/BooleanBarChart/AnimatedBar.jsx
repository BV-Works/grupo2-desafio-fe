import { motion } from "motion/react"; // librería para hacer animaciones en React

export function AnimatedBar({ children, index }) {
    return (
        <motion.div
            // Este componente envuelve cada barra y le da la animacion de entrada.
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{
                duration: 0.7,
                delay: index * 0.12,
                ease: "easeOut",
            }}
            style={{
                position: "absolute",
                inset: 0,
                transformOrigin: "left",
            }}
        >
            {children}
        </motion.div>
    );
}
