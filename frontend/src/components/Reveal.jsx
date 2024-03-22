import {motion, useAnimation, useInView} from "framer-motion";
import {useEffect, useRef} from "react";

const Reveal = ({children, customChildClass, delay, once, y, customParentClass}) => {

    const ref = useRef(null);
    const isInView = useInView(ref, {once: once});
    const mainControls = useAnimation();

    useEffect(() => {
        if (isInView) {
            mainControls.start("visible")
        }
        if (!once && !isInView) {
            mainControls.start("hidden")
        }
    }, [isInView, mainControls, once]);

    return (
        <div ref={ref} className={`${customParentClass}`}>
            <motion.div
                variants={{
                    hidden: { opacity: 0, y: y},
                    visible: { opacity: 1, y: 0},
                }}
                initial={"hidden"}
                animate={mainControls}
                transition={{
                    duration: .25,
                    delay: delay
                }}
                className={`${customChildClass}`}
            >
                {children}
            </motion.div>
        </div>
    );
};

Reveal.defaultProps = {
    y: 0,
    delay: 0.10,
    once: true,
}


export default Reveal;