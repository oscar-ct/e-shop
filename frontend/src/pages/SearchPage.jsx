import {useParams} from "react-router-dom";
import {useGetProductsQuery} from "../slices/productsApiSlice";
import ProductItem from "../components/ProductItem";
import Paginate from "../components/Paginate";
import Spinner from "../components/Spinner";
import Snake from "../components/Snake";
import {useEffect, useState} from "react";
import Meta from "../components/Meta";
import {FaChevronDown, FaChevronUp, FaChevronLeft, FaChevronRight} from "react-icons/fa";
import BackButton from "../components/BackButton";


const SearchPage = () => {

    const {searchTerm, pageNumber} = useParams();
    const { data, isLoading} = useGetProductsQuery({searchTerm, pageNumber});

    const [windowResizing, setWindowResizing] = useState(false);

    useEffect(() => {
        let timeout;
        const handleResize = () => {
            clearTimeout(timeout);
            setWindowResizing(true);
            timeout = setTimeout(() => {
                setWindowResizing(false);
            }, 200);
        }
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(function () {
        window.scrollTo(0,0);
    }, [])


    return (
        isLoading ? (
            <Spinner/>
            ) : (
                <>
                    <Meta title={`Search - ${searchTerm}`}/>
                    <BackButton/>
                    {
                        data.products.length === 0 ? (
                            <>
                                <h2 className={"text-2xl lg:text-3xl px-2 pt-20 pb-7 md:pt-10 text-center"}>
                                    No search results for &quot;{data.keyword}&quot;
                                </h2>
                                <div className={"px-10"}>
                                    <div  className={"m-auto bg-neutral/70 rounded-xl max-w-[830px] shadow-xl"}>
                                        {
                                            !windowResizing && (
                                                <Snake />
                                            )
                                        }
                                    </div>
                                </div>
                                <div className={"py-10 flex justify-center items-center"}>
                                    <div className={"w-40 flex flex-col"}>
                                        <div className={"flex justify-center"}>
                                            <button onClick={() => dispatchEvent(new KeyboardEvent('keydown', {key: 'w', code: 'KeyW', keyCode: 87}))} className={"btn btn-neutral p-3 rounded-lg border-[2px]"}>
                                                <FaChevronUp/>
                                            </button>
                                        </div>
                                        <div className={"flex justify-between"}>
                                            <button onClick={() => dispatchEvent(new KeyboardEvent('keydown', {key: 'a', code: 'KeyA', keyCode: 65}))} className={"btn btn-neutral p-3 rounded-lg border-[2px]"}>
                                                <FaChevronLeft/>
                                            </button>
                                            <button onClick={() => dispatchEvent(new KeyboardEvent('keydown', {key: 'd', code: 'KeyD', keyCode: 68}))}  className={"btn btn-neutral p-3 rounded-lg border-[2px]"}>
                                                <FaChevronRight/>
                                            </button>
                                        </div>
                                        <div className={"flex justify-center"}>
                                            <button onClick={() => dispatchEvent(new KeyboardEvent('keydown', {key: 's', code: 'KeyS', keyCode: 83}))} className={"btn btn-neutral p-3 rounded-lg border-[2px]"}>
                                                <FaChevronDown/>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className={"pb-10"}>
                                <h2 className={"pt-20 md:pt-10 text-2xl lg:text-3xl text-center px-2 pb-7"}>
                                    Search results for &quot;{data.keyword}&quot;
                                </h2>
                                <div className={"w-full flex flex-wrap justify-center"}>
                                    {
                                        data.products.map(function (product) {
                                            return <ProductItem key={product._id} product={product}/>
                                        })
                                    }
                                </div>
                                {
                                    data?.products.length >= 16 && (
                                        <div className={"pt-10 flex justify-center"}>
                                            <div className={"join"}>
                                                <Paginate pages={data.pages} page={data.page} searchTerm={searchTerm}/>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        )
                    }
                </>
        )
    );
};

export default SearchPage;