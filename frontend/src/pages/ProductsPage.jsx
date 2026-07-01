import { useEffect, useState } from "react"
import { Search, IndianRupee, } from "lucide-react"
import { useNavigate } from "react-router-dom";
import { addToCartMethod } from "../utils/cartUtils";
import { useSearchParams } from "react-router-dom";
import SkeletonLoading from "../components/SkeletonLoading";
import { clearProductStore, fetchProductsByKey, moreProductsExists } from "../utils/productUtils.js";
import { useRef } from "react";
import { useInView } from 'react-intersection-observer';
import Loader from "../components/Loader.jsx";
function ProductCard({ product, onClick, isLoading, ref }) {
    return (
        <div
            ref={ref}
            className="w-full max-w-sm bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-200 cursor-pointer"
            onClick={isLoading ? () => { } : onClick}
        >
            <div className="flex flex-col max-sm:flex-row">
                {!isLoading ?
                    <div className="w-full h-64 md:h-56 sm:h-48 max-sm:w-[40%] max-sm:h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
                        <img
                            className="object-cover w-full h-full"
                            src={product?.imageUrl}
                            alt={product?.name || 'product'}
                            loading="lazy"
                        />
                    </div> : <SkeletonLoading className='w-full h-64 md:h-56 sm:h-48 max-sm:w-[40%] max-sm:h-40' />}
                <div className="p-4 md:p-3 sm:p-3 flex-1">
                    <div className="capitalize font-semibold text-xl md:text-lg sm:text-base max-sm:text-sm truncate">{isLoading ? <SkeletonLoading /> : product?.name || "--"}</div>


                    <div className="mt-2 flex items-center gap-2">
                        {!isLoading ?
                            <>

                                <div className='flex items-center gap-1 font-semibold text-base md:text-sm sm:text-sm max-sm:text-xs'>
                                    <IndianRupee className="h-5 w-5 md:h-4 md:w-4 sm:h-4 sm:w-4 max-sm:h-3 max-sm:w-3" />
                                    <span>{isLoading ? "--" : product?.price || "--"}</span>
                                </div>
                                <div className='text-base md:text-sm sm:text-sm max-sm:text-xs text-gray-500 line-through'>{isLoading ? "" : product?.comparePrice || ""}</div>
                            </> : <SkeletonLoading />}
                    </div>
                    {!isLoading ?
                        <button className={"text-left mt-2 bg-light-textcolor rounded-3xl px-3 md:px-3 py-2 md:py-2 font-semibold text-sm md:text-xs max-sm:text-xs text-white hover:scale-110 transition-all duration-150"} disabled={isLoading} onClick={
                            (e) => {
                                addToCartMethod(product.id, 1);
                                e.stopPropagation();
                            }}>Add To Cart</button>
                        : <SkeletonLoading />}
                </div>
            </div>
        </div>
    );
}
export default function ProductsPage() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchParams] = useSearchParams();
    const search = searchParams.get("search");
    const [hasNextPage, setHasNextPage] = useState(true);
    const [searchValue, setSearchValue] = useState(search || "");
    const [delayedSearchValue, setDelayedSearchValue] = useState(search || "");

    const productClick = (productId) => {
        navigate(`/products/${productId}`)
    }
    const incCurrentPage = () => {
        if (hasNextPage) {
            setCurrentPage((c) => c + 1);
        }
    }
    // increment current page to auto show more products on scroll
    const { ref } = useInView({
        triggerOnce: false,
        onChange: (inView) => {
            if (inView) incCurrentPage();
        }
    })
    //searchHandler
    const timeoutRef = useRef(null);

    const searchHandler = (e) => {
        const value = e.target.value;

        setSearchValue(value);
        if (searchValue && searchValue.length > 2) {
            setIsLoading(true);
            clearProductStore();
            setProducts([]);
            setHasNextPage(true);
            clearTimeout(timeoutRef.current);

            timeoutRef.current = setTimeout(() => {
                setCurrentPage(1);
                setDelayedSearchValue(value);
            }, 300);
        }
    };
    useEffect(() => {
        let isMounted = true;
        fetchProductsByKey(currentPage, delayedSearchValue)
            .then((ps) => {
                if (!isMounted) return;

                const nextProducts = Array.isArray(ps) ? ps : [];
                setProducts((prevProducts) => {
                    const existingIds = new Set(
                        prevProducts
                            .map((product) => product?._id || product?.id)
                            .filter(Boolean)
                    );

                    const uniqueNextProducts = nextProducts.filter((product) => {
                        const key = product?._id || product?.id;
                        if (!key) return true;
                        if (existingIds.has(key)) return false;
                        existingIds.add(key);
                        return true;
                    });
                    return [...prevProducts, ...uniqueNextProducts];
                });
                setHasNextPage(moreProductsExists());
                setIsLoading(false);
            })
            .catch(() => {
                if (isMounted) {
                    setIsLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [currentPage, delayedSearchValue]);

    //?sample data
    // const product = {
    //     id: "hellod",
    //     name: "amla candy",
    //     price: 1200,
    //     comparePrice: 2300,
    //     imageUrl: ""
    // }
    return (
        <>
            <div className=" page productPage w-full bg-gradient-to-r from-main-background to-[#EEDEC1] pb-20  ">
                <div className="searchHeader shadow-md shadow-[#EEDEC1]  w-full h-24 flex items-center px-5 justify-between max-sm:h-16 ">
                    <div className="flex flex-col items-start gap-2">
                        <h1 className="text-dark-textcolor font-semibold text-4xl max-sm:text-xl">Products</h1>
                        <div className="inline-flex items-center gap-2 text-sm max-sm:text-xs">
                            <button
                                type="button"
                                onClick={() => navigate("/")}
                                className="inline-flex items-center gap-2 hover:bg-slate-200 transition-colors duration-200 text-dark-textcolor"
                            >
                                <span>Home</span>
                            </button>
                            <span className="text-dark-textcolor">&gt;</span>
                            <span className="text-dark-textcolor font-semibold">Products</span>
                        </div>
                    </div>

                    <form onSubmit={(e) => { e.preventDefault(); }} className=" bg-gradient-to-r from-main-background to-[#F5EFCC] w-1/2 h-10 rounded-3xl flex items-center justify-between px-5 drop-shadow-md shadow-black">
                        <input type="text" value={searchValue} onChange={searchHandler} className="w-3/4 h-8 px-2 bg-transparent border-none focus:outline-none" placeholder={`Search by "Keyword", "Category", "name" `} />
                        <Search />
                    </form>

                </div>
                {
                    isLoading ? <Loader className="min-h-[50dvh] max-md:h-[10dvh]" /> :

                        <div className="productsGrid grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4 py-5 px-5 w-full min-h-[50dvh] justify-items-center transition-all duration-1000 max-md:min-h-[20dvh]">
                            {products.length ? products?.map((product, index, pds) => {
                                if (index == pds.length - 1) {
                                    return (
                                        <ProductCard ref={ref} key={product._id} product={product} isLoading={isLoading} onClick={() => productClick(product?._id)} />
                                    )
                                }
                                return (
                                    <ProductCard key={product._id} product={product} isLoading={isLoading} onClick={() => productClick(product?._id)} />
                                )
                            }) : <h1>No products found</h1>}
                        </div>
                }
            </div>
        </>
    )
}
