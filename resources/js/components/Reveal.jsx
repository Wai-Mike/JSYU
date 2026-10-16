import { motion, useReducedMotion } from 'framer-motion';

const offsets = {
    up: { y: 40 },
    down: { y: -40 },
    left: { x: 48 },
    right: { x: -48 },
    none: {},
};

/**
 * Fades and slides its children in the first time they scroll into view.
 * `delay` (seconds) staggers items in a grid; `from` sets the entry direction.
 */
export default function Reveal({ children, className = '', delay = 0, from = 'up', scale = false, as = 'div', ...props }) {
    const reduceMotion = useReducedMotion();
    const Component = motion[as] ?? motion.div;

    if (reduceMotion) {
        const Plain = as;
        return (
            <Plain className={className} {...props}>
                {children}
            </Plain>
        );
    }

    return (
        <Component
            className={className}
            initial={{ opacity: 0, ...offsets[from], ...(scale ? { scale: 0.94 } : {}) }}
            whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
            {...props}
        >
            {children}
        </Component>
    );
}
