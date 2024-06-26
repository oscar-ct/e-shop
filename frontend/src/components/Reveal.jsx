import {motion, useAnimation, useInView} from "framer-motion";
import {useEffect, useRef} from "react";

const Reveal = ({children, customChildClass, delay, once, y, customParentClass, isSmallScreen}) => {

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
                    hidden: { opacity: 0, y: y, scale: isSmallScreen ? .5 : 1 },
                    visible: { opacity: 1, y: 0, scale: 1 },
                }}
                initial={"hidden"}
                animate={mainControls}
                transition={{
                    duration: isSmallScreen ? .15 : .35,
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
    customParentClass: "w-full",
    customChildClass: "w-full",
    isSmallScreen: false,
    y: 0,
    delay: 0.10,
    once: true,
}


export default Reveal;