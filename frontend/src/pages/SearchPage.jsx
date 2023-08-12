import {useParams} from "react-router-dom";
import {useGetProductsQuery} from "../slices/productsApiSlice";
import ProductItem from "../components/ProductItem";
import Paginate from "../components/Paginate";
import Spinner from "../components/Spinner";
import Snake from "../components/Snake";
import {useEffect, useState} from "react";
import Meta from "../components/Meta";
import {FaChevronDown, FaChevronUp, FaChevronLeft, FaChevronRight} from "react-icons/fa";


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


    return (
        isLoading ? (
            <Spinner/>
            ) : (
                <>
                    <Meta title={`Search - ${searchTerm}`}/>
                    {
                        data.products.length === 0 ? (

                            <div className={"absolute h-[calc(100vh-80px)] left-0 right-0 bottom-0"}>
                                <div className={"w-full h-full"} style={{background: "url(https://cdn-icons-png.flaticon.com/512/380/380005.png?w=996&t=st=1691200957~exp=1691201557~hmac=b73c3f7d38c1498bb4bfba1e8bfbd260397b34152e8b60c4064cf9bf646b8b3f)", backgroundSize: "10%", backgroundRepeat: "no-repeat", backgroundPositionX: "center", backgroundPositionY: "center"}}>
                                    <h2 className={"text-3xl px-2 py-8 text-center"}>
                                        No search results for "{data.keyword}"
                                    </h2>
                                    <div  className={"m-auto bg-neutral/70 rounded-xl max-w-[830px] shadow-xl"}>
                                        {
                                            !windowResizing && (
                                                <Snake />
                                            )
                                        }
                                        {/*<div className={"border-t-[10px] border-neutral-500"}>*/}
                                        {/*    <h2 className={"text-xl px-2 py-5 text-center"}>*/}
                                        {/*        Press SPACE to restart game*/}
                                        {/*    </h2>*/}
                                        {/*</div>*/}
                                    </div>
                                    <div className={"sm:hidden py-10 flex justify-center items-center"}>
                                        <div className={"w-40 flex flex-col"}>
                                            <div className={"flex justify-center"}>
                                                <button onClick={() => dispatchEvent(new KeyboardEvent('keydown', {key: 'w', code: 'KeyW', keyCode: 87}))} className={"btn btn-outline p-3 rounded-lg border-[2px]"}>
                                                    <FaChevronUp/>
                                                </button>
                                            </div>
                                            <div className={"flex justify-between"}>
                                                <button onClick={() => dispatchEvent(new KeyboardEvent('keydown', {key: 'a', code: 'KeyA', keyCode: 65}))} className={"btn btn-outline p-3 rounded-lg border-[2px]"}>
                                                    <FaChevronLeft/>
                                                </button>
                                                <button onClick={() => dispatchEvent(new KeyboardEvent('keydown', {key: 's', code: 'KeyS', keyCode: 83}))} className={"btn btn-outline p-3 rounded-lg border-[2px]"}>
                                                    <FaChevronRight/>
                                                </button>
                                            </div>
                                            <div className={"flex justify-center"}>
                                                <button onClick={() => dispatchEvent(new KeyboardEvent('keydown', {key: 'd', code: 'KeyD', keyCode: 68}))} className={"btn btn-outline p-3 rounded-lg border-[2px]"}>
                                                    <FaChevronDown/>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        ) : (
                            <div className={"mb-10"}>
                                <h2 className={"pt-10 text-3xl text-center px-2 py-7"}>
                                    Search results for "{data.keyword}"
                                </h2>
                                <div className={"w-full flex flex-wrap justify-center"}>
                                    {
                                        data.products.map(function (product) {
                                            return <ProductItem key={product._id} product={product}/>
                                        })
                                    }
                                </div>
                                <div className={"pt-10 flex justify-center"}>
                                    <div className={"join"}>
                                        <Paginate pages={data.pages} page={data.page} searchTerm={searchTerm}/>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </>
        )
    );
};

export default SearchPage;