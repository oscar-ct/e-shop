import ProductItem from "../components/ProductItem";
import {useGetProductsQuery, useGetProductsByCategoryQuery} from "../slices/productsApiSlice";
import Spinner from "../components/Spinner";
import Message from "../components/Message";
import {useParams, Link} from "react-router-dom";
import Paginate from "../components/Paginate";
import {useEffect, useRef, useState} from "react";
import {ReactComponent as Logo} from "../icons/e.svg"
import Meta from "../components/Meta";
import {motion} from "framer-motion";
import Footer from "../components/Footer";
import CategoryItem from "../components/CategoryItem";
import {FaChevronDown} from "react-icons/fa";
import HomePageCategorySection from "../components/HomePageCategorySection";
import HomePageLatestProducts from "../components/HomePageLatestProducts";
import HomePageIntro from "../components/HomePageIntro";


const HomePage = () => {

    const {pageNumber} = useParams();

    // products query
    const { data, isLoading, error } = useGetProductsQuery({pageNumber});
    console.log(data);
    // console.log(pageNumber);
    // console.log(error)

    // products by category query
    const { data: productCategories, isLoading: loadingCategories, error: errorCategories } = useGetProductsByCategoryQuery();

    const [windowInnerWidth, setWindowInnerWidth] = useState(window.innerWidth);

    // set window width on resize
    useEffect( () => {
        const adjustWidth = () => {
            setWindowInnerWidth(window.innerWidth);
        }
        window.addEventListener("resize", adjustWidth);
        return () => window.removeEventListener("resize", adjustWidth);
    });

    // scroll to based on page number
    useEffect( () => {
        const executeScroll = () => {
            if (scrollTo) {
                var headerOffset = 80;
                var elementPosition = scrollTo.current.getBoundingClientRect().top;
                var offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
                // scrollTo.current.scrollIntoView({behavior: "smooth", block: "start"})
            }
        };
        if ((data && pageNumber) && (data?.page !== pageNumber) && document.readyState === "complete") {
            setTimeout(() => {
                executeScroll()
            }, 500)
        }
    }, [data, pageNumber, data?.page]);

    const scrollTo = useRef(null);

    return (
        <>
            {
                isLoading || loadingCategories ? (
                    <Spinner/>
                ) : error  || errorCategories ? (
                    <Message variant={"error"}>
                        {error?.data?.message || error.error || errorCategories.error || errorCategories?.data?.message}
                    </Message>
                ) : (
                    <>
                        <Meta title={"Home"} description={'Welcome to e-shop!'}/>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <HomePageIntro/>
                            </motion.div>
                            <HomePageCategorySection windowInnerWidth={windowInnerWidth} productCategories={productCategories}/>
                            <HomePageLatestProducts scrollTo={scrollTo} data={data} windowInnerWidth={windowInnerWidth}/>
                            <Footer/>
                    </>
                )
            }
        </>
    );
};

export default HomePage;