import { motion } from "framer-motion";

/**
 * Component that reveals its children when they come into view
 * @param {*} param0 
 * @returns 
 */
const RevealOnScroll = ({ children, delay = 0, y = 20 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: y }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
                duration: 0.6,
                delay: delay,
                ease: [0.22, 1, 0.36, 1]
            }}
        >
            {children}
        </motion.div>
    );
};

export default RevealOnScroll;