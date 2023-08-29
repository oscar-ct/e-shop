import { useState, useEffect } from "react";

export function useScroll() {
    // storing this to get the scroll direction
    const [lastScrollTop, setLastScrollTop] = useState(0);
    // the offset of the document.body
    const [bodyOffset, setBodyOffset] = useState(
        document.body.getBoundingClientRect()
    );
    // the vertical direction
    const [scrollY, setScrollY] = useState(window.scrollY);
    // the horizontal direction
    // const [scrollX, setScrollX] = useState(bodyOffset.left);
    // scroll direction would be either up or down
    const [scrollDirection, setScrollDirection] = useState();

    const listener = () => {

        setBodyOffset(document.body.getBoundingClientRect());
        setScrollY(window.scrollY);
        // setScrollX(bodyOffset.left);
        setScrollDirection(lastScrollTop > -bodyOffset.top ? "up" : "down");
        setLastScrollTop(-bodyOffset.top);


    };

    useEffect(() => {
        window.addEventListener("scroll", listener);
        return () => {
            window.removeEventListener("scroll", listener);
        };
    });

    return {
        // scrollX,
        scrollY,
        scrollDirection,
    };
}