import {motion, useAnimation, useInView} from "framer-motion";
import {useEffect, useRef} from "react";

const Reveal = ({children, customClass, delay, once}) => {

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
    }, [isInView, mainControls, once])

    return (
        <div ref={ref}>
            <motion.div
                variants={{
                    hidden: { opacity: 0, y: 75},
                    visible: {opacity: 1, y: 0},
                }}
                initial={"hidden"}
                animate={mainControls}
                transition={{
                    duration: 0.55,
                    delay: delay
                }}
                exit={"hidden"}
                className={`${customClass}`}
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