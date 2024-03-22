import {motion, useAnimation, useInView} from "framer-motion";
import {useEffect, useRef, useState} from "react";

const Reveal = ({children, customChildClass, delay, once, y, customParentClass}) => {

    const ref = useRef(null);
    const isInView = useInView(ref, {once: once});
    const mainControls = useAnimation();
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        if (isInView) {
            mainControls.start("visible")
        }
        if (!once && !isInView) {
            mainControls.start("hidden")
        }
    }, [isInView, mainControls, once]);

    useEffect(() => {
        const activeWindow = () => {
            setWindowWidth(window.innerWidth);
        };
        window.addEventListener("resize", activeWindow);
        return () => {
            window.removeEventListener("resize", activeWindow)
        }
    }, []);

    return (
        <div ref={ref} className={`${customParentClass}`}>
            <motion.div
                variants={{
                    hidden: { opacity: 0, y: y === 0 ? y : windowWidth >= 768 ? 0 : 75},
                    visible: { opacity: 1, y: 0 },
                }}
                initial={"hidden"}
                animate={mainControls}
                transition={{
                    duration: windowWidth >= 768 ? 0.25 : 0.55,
                    delay: windowWidth >= 768 ? delay : 0.15
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