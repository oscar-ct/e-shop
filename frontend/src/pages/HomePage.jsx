import {useGetProductsQuery, useGetProductsByCategoryQuery} from "../slices/productsApiSlice";
import Spinner from "../components/Spinner";
import Message from "../components/Message";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import Meta from "../components/Meta";
import HomePageCategorySection from "../components/HomePageCategorySection";
import HomePageLatestProducts from "../components/HomePageLatestProducts";
import HomePageIntro from "../components/HomePageIntro";
import {useScroll} from "../hooks/useScroll";

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

    const { scrollY } = useScroll();

    // scroll to based on page number
    // useEffect( () => {
    //     const executeScroll = () => {
    //         if (scrollTo) {
    //             var headerOffset = 80;
    //             var elementPosition = scrollTo.current.getBoundingClientRect().top;
    //             var offsetPosition = elementPosition + window.pageYOffset - headerOffset;
    //             window.scrollTo({
    //                 top: offsetPosition,
    //                 behavior: "smooth"
    //             });
    //             // scrollTo.current.scrollIntoView({behavior: "smooth", block: "start"})
    //         }
    //     };
    //     if ((data && pageNumber) && (data?.page !== pageNumber) && document.readyState === "complete") {
    //         setTimeout(() => {
    //             executeScroll()
    //         }, 500)
    //     }
    // }, [data, pageNumber, data?.page]);
    //
    // const scrollTo = useRef(null);


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
                        <HomePageIntro productCategories={productCategories} windowInnerWidth={windowInnerWidth} scrollY={scrollY}/>
                        <div className={"flex flex-col md:flex-col-reverse"}>
                            <HomePageLatestProducts data={data} windowInnerWidth={windowInnerWidth}/>
                            <div className={"lg:hidden"}>
                                <HomePageCategorySection windowInnerWidth={windowInnerWidth} productCategories={productCategories}/>
                            </div>
                        </div>

                    </>
                )
            }
        </>
    );
};

export default HomePage;