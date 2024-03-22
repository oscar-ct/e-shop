import {motion, useAnimation, useInView} from "framer-motion";
import {useEffect, useRef, useState} from "react";

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
                    hidden: { opacity: 0},
                    visible: { opacity: 1},
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
    delay: 0.0,
    once: true,
}


export default Reveal;