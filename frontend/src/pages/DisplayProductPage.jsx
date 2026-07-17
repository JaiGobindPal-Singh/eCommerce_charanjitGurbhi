import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { addToCart } from "../utils/cartUtils";
import { IndianRupee, ChevronLeft, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getProduct } from "../utils/productUtils";
import SkeletonLoading from "../components/SkeletonLoading";
import { generateNotification } from "../utils/notificationUtils";
export default function DisplayProductPage() {
    const { productId } = useParams();
    const [quantity, setQuantity] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [product, setProduct] = useState({});
    const [addedToCartBtn, setaddedToCartBtn] = useState(false);
    const [showDescriptionModal, setShowDescriptionModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        getProduct(productId).then((prd) => {
            setProduct(prd);
            setIsLoading(false);
        })
    }, [productId]);

    const handleButtonUI = ()=>{
        setaddedToCartBtn(true);
        setTimeout(() => {
            setaddedToCartBtn(false);
        }, 500);
    }

    const DESCRIPTION_MAX_LENGTH = 160;
    const hasLongDescription = product.description && product.description.length > DESCRIPTION_MAX_LENGTH;
    const descriptionPreview = hasLongDescription
        ? `${product.description.slice(0, DESCRIPTION_MAX_LENGTH)}...`
        : product.description || "Product description not available.";

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
                                    <p
                                        className="text-base leading-7 text-dark-textcolor/80 cursor-pointer"
                                        onClick={() => {
                                            if (hasLongDescription) setShowDescriptionModal(true);
                                        }}
                                    >
                                        {descriptionPreview}
                                        {hasLongDescription && (
                                            <span className="ml-1 text-sm font-semibold text-dark-textcolor underline">
                                                Read more
                                            </span>
                                        )}
                                    </p>
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
                            className={`w-full rounded-3xl px-6 py-4 text-lg font-semibold text-white transition ${product.stockAvailable && !addedToCartBtn ? 'bg-dark-textcolor hover:bg-light-textcolor hover:text-white' : 'bg-gray-300 cursor-not-allowed text-gray-700'}`}
                            onClick={() => {
                                product.stockAvailable && addToCart(product, quantity)
                                handleButtonUI();
                                generateNotification("Added to cart")();
                            }}
                            disabled={!product.stockAvailable || isLoading || addedToCartBtn}
                        >
                            {product.stockAvailable ? 'Add to Cart' : 'Out of Stock'}
                        </button>
                    </div>
                </div>
            </div>
            {showDescriptionModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6"
                    onClick={() => setShowDescriptionModal(false)}
                >
                    <div
                        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <button
                            type="button"
                            className="absolute right-4 top-4 rounded-full bg-slate-100 p-2 text-dark-textcolor transition hover:bg-slate-200"
                            onClick={() => setShowDescriptionModal(false)}
                        >
                            <X className="h-5 w-5" />
                        </button>
                        <h2 className="text-2xl font-semibold text-dark-textcolor">Description</h2>
                        <p className="mt-4 whitespace-pre-line text-base leading-7 text-dark-textcolor/80">
                            {product.description || "Product description not available."}
                        </p>
                    </div>
                </div>
            )}
        
                    
        </div>
    );
}
