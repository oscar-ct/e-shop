import {useRef, useState} from "react";
import { motion } from "framer-motion";

export const ActiveLogo = () => {

    const constraintsRef = useRef(null);
    const [active, setActive] = useState(false);
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
    const [count, setCount] = useState(0);

    return (
        <>
            <span className={`chat chat-start absolute top-[-150px] ${active ? "pl-10" : "pl-10"}`}>
                <span className="chat-bubble text-sm">
                {!active && count === 0 && "Hello there!"}
                {active && count === 0 && "Catch me if you can!"}
                {!active && count !== 0 && "Nice job!"}
                </span>
            </span>
            <motion.div className="!opacity-0 !fixed !w-[300px] !h-[300px] !rounded-xl !top-0 !right-0 !left-0 !m-auto !bg-none" ref={constraintsRef} />
            <motion.div
                animate={active ? { x: x, y: y } : {}}
                transition={{
                    ease: "linear",
                    duration: .3,
                    // type: "spring",
                    // stiffness: 100,
                    // repeat: 1
                }}
                onAnimationComplete={() => {
                    setX(Math.ceil(Math.random() * 300) * (Math.round(Math.random()) ? 1 : -1));
                    setY(Math.ceil(Math.random() * 150) * (Math.round(Math.random()) ? 1 : -1));
                }}
                dragElastic={1}
                whileDrag={{ scale: 1.3 }}
                drag={!active && count !== 0}
                dragConstraints={constraintsRef}
                onMouseEnter={() => {
                    !active && count === 0 && setActive(true);
                    // setCount(0);
                }}
                onClick={(e) => {
                    setActive(false);
                    setCount(count + 1);
                }}
            />
        </>
    );
};
