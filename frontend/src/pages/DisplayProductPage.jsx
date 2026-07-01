import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { addToCartMethod } from "../utils/cartUtils";
import { IndianRupee, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getProduct } from "../utils/productUtils";
import SkeletonLoading from "../components/SkeletonLoading";
export default function DisplayProductPage() {
    const { productId } = useParams();
    const [quantity, setQuantity] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [product, setProduct] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        getProduct(productId).then((prd) => {
            setProduct(prd);
            setIsLoading(false);
        })
    }, [productId]);


    //?sample data test
    // const product = {
    //     name: "Amla Candy",
    //     description: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. At nobis voluptate qui accusantium voluptates saepe totam numquam modi accusamus! Similique, exercitationem consequuntur natus dolorem architecto laudantium omnis dicta beatae maxime?",
    //     price: 2500,
    //     comparePrice:3999,
    //     stockAvailable: 5,
    //     imageUrl: "https://img.magnific.com/free-vector/gradient-e-commerce-website-template_23-2149546567.jpg?semt=ais_hybrid&w=740&q=80"
    // };



    return (
        <div className="page bg-main-background text-dark-textcolor px-4 py-8 flex justify-center">
            <div className="mx-auto max-w-5xl rounded-3xl bg-gradient-to-r from-main-background to-[#EEDEC1] p-6 shadow-lg shadow-slate-200">
                <button
                    type="button"
                    onClick={() => navigate('/products')}
                    className="mb-6 inline-flex items-center gap-2 rounded-full border border-dark-textcolor bg-main-background px-4 py-2 text-sm font-semibold text-dark-textcolor transition hover:bg-light-textcolor hover:text-white"
                >
                    <ChevronLeft className="h-4 w-4" />
                    <p className="max-sm:hidden">Back to Products</p>
                </button>
                <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
                    <div className="rounded-3xl bg-white p-6 shadow-inner shadow-slate-100">
                        {!isLoading ? <img
                            src={product.imageUrl}
                            alt={product.name || "Product image"}
                            className="h-full w-full rounded-3xl object-cover"
                        /> : <SkeletonLoading className={"h-60 w-full"} />}
                    </div>
                    <div className="space-y-6 ">
                        {
                            !isLoading ?
                                <div className="space-y-3">
                                    <h1 className="text-4xl font-semibold leading-tight text-dark-textcolor">{product.name || "Product Name"}</h1>
                                    <p className="text-base leading-7 text-dark-textcolor/80">{product.description || "This is a beautiful product with elegant design and premium features. Perfect for your everyday needs and style."}</p>
                                </div> : <SkeletonLoading className={"h-8"} />
                        }
                        {
                            !isLoading ?
                                <div className="flex flex-col gap-4 rounded-3xl bg-white p-5 shadow-sm shadow-slate-200">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm uppercase tracking-[0.2em] text-light-textcolor">Price</span>
                                        <span className="text-3xl font-bold flex items-center text-dark-textcolor max-md:text-2xl"><IndianRupee className="h-8 w-8 md:h-6 md:w-6 sm:h-4 sm:w-4 max-sm:h-3 max-sm:w-3" />{product.price ? `${product.price}` : "--"}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm uppercase tracking-[0.2em] text-light-textcolor"></span>
                                        <span className="text-base font-medium flex items-center text-dark-textcolor line-through">{product.comparePrice ? `${product.comparePrice}` : "--"}</span>
                                    </div>
                                </div> : <SkeletonLoading className={"h-8"} />
                        }

                        <div className="flex items-center gap-4 rounded-3xl bg-white p-5 shadow-sm shadow-slate-200">
                            <span className="text-sm uppercase tracking-[0.2em] text-light-textcolor">Quantity</span>
                            <div className="flex items-center gap-3 ml-auto">
                                <button
                                    onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-200 text-dark-textcolor font-semibold transition hover:bg-slate-300 disabled:opacity-50"
                                    disabled={quantity <= 1}
                                >
                                    −
                                </button>
                                <input className="w-8 text-center text-lg font-semibold text-dark-textcolor" value={quantity} onChange={(e) => setQuantity(e.target.value)}></input>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-200 text-dark-textcolor font-semibold transition hover:bg-slate-300"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                        <button
                            className={`w-full rounded-3xl px-6 py-4 text-lg font-semibold text-white transition ${product.stockAvailable ? 'bg-dark-textcolor hover:bg-light-textcolor hover:text-white' : 'bg-gray-300 cursor-not-allowed text-gray-700'}`}
                            onClick={() => product.stockAvailable && addToCartMethod(productId, quantity)}
                            disabled={!product.stockAvailable || isLoading}
                        >
                            {product.stockAvailable ? 'Add to Cart' : 'Out of Stock'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
