import {useGetProductsQuery, useGetProductsByCategoryQuery} from "../slices/productsApiSlice";
import Spinner from "../components/Spinner";
import Message from "../components/Message";
import {useParams} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import Meta from "../components/Meta";
import Footer from "../components/Footer";
import HomePageCategorySection from "../components/HomePageCategorySection";
import HomePageLatestProducts from "../components/HomePageLatestProducts";
import HomePageIntro from "../components/HomePageIntro";


const HomePage = () => {

    const {pageNumber} = useParams();

    // products query
    const { data, isLoading, error } = useGetProductsQuery({pageNumber});

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
                        <Meta title={"Home"} description={'Welcome to e-shop-us! An e-commerce website build by Oscar Castro'}/>
                        <HomePageIntro/>
                        <HomePageCategorySection windowInnerWidth={windowInnerWidth} productCategories={productCategories}/>
                        <HomePageLatestProducts scrollTo={scrollTo} data={data} windowInnerWidth={windowInnerWidth}/>
                    </>
                )
            }
        </>
    );
};

export default HomePage;