import { useState } from "react"
import { Search, IndianRupee } from "lucide-react"
import { useNavigate } from "react-router-dom";
import { addToCartMethod } from "../utils/cartUtils";
function ProductCard({product, onClick}){
    
    const placeholder = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><rect width='100%' height='100%' fill='%23f3f4f6'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-size='20'>No Image</text></svg>";
    return (
        <div 
            className="w-full max-w-sm bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-200 cursor-pointer" 
            onClick={onClick}
        >
            <div className="flex flex-col max-sm:flex-row">
                <div className="w-full h-64 md:h-56 sm:h-48 max-sm:w-[40%] max-sm:h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
                    <img 
                        className="object-cover w-full h-full" 
                        src={product?.imageUrl || placeholder} 
                        alt={product?.name || 'product'} 
                        loading="lazy"
                    />
                </div>
                <div className="p-4 md:p-3 sm:p-3 flex-1">
                    <div className="capitalize font-semibold text-xl md:text-lg sm:text-base max-sm:text-sm truncate">{product?.name || "--"}</div>
                    <div className="mt-2 flex items-center gap-2">
                        <div className='flex items-center gap-1 font-semibold text-base md:text-sm sm:text-sm max-sm:text-xs'>
                            <IndianRupee className="h-5 w-5 md:h-4 md:w-4 sm:h-4 sm:w-4 max-sm:h-3 max-sm:w-3" />
                            <span>{product?.price ?? "--"}</span>
                        </div>
                        <div className='text-base md:text-sm sm:text-sm max-sm:text-xs text-gray-500 line-through'>{product?.comparePrice || ""}</div>
                    </div>
                <button className="text-left mt-2 bg-light-textcolor rounded-3xl px-3 md:px-3 py-2 md:py-2 font-semibold text-sm md:text-xs max-sm:text-xs text-white hover:scale-110 transition-all duration-150" onClick={
                    (e)=>{
                    addToCartMethod(product.id, 1);
                    e.stopPropagation();
                }}>Add To Cart</button>
                </div>
            </div>
        </div>
    );
}
export default function ProductsPage() {
    const navigate = useNavigate();
    const [searchValue, setSearchValue] = useState("");
    const productClick = (e)=>{
        e.stopPropagation();
        navigate(`/products/${product.id}`)
    }

    //?sample data
    const product = {
        id:"hellod",
        name:"amla candy",
        price: 1200,
        comparePrice: 2300,
        imageUrl: ""
    }
    return (
        <>
            <div className="productPage w-full bg-gradient-to-r from-main-background to-[#EEDEC1]  ">
                <div className="searchHeader shadow-md shadow-[#EEDEC1]  w-full h-24 flex items-center px-5 justify-between max-sm:h-16 ">
                    <h1 className="text-dark-textcolor font-semibold text-4xl max-sm:text-xl ">Products</h1>

                    {/* //? add logic here what to do after search */}
                    <form onSubmit={(e)=>{e.preventDefault();console.log(searchValue)}} className=" bg-gradient-to-r from-main-background to-[#F5EFCC] w-1/2 h-10 rounded-3xl flex items-center justify-between px-5 drop-shadow-md shadow-black">
                        <input type="text" value={searchValue} onChange={(e)=>setSearchValue(e.target.value)}  className="w-3/4 h-8 px-2 bg-transparent border-none focus:outline-none" placeholder="Search by Keyword"/>
                        <Search />
                    </form>

                </div>
                <div className="productsGrid grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4 py-5 px-5 w-full min-h-[80dvh] justify-items-center 1">
                    {/* //?todo fetch products and show them*/}
                    <ProductCard product={product} onClick={productClick}/>
                    <ProductCard product={product}/>
                    <ProductCard product={product}/>
                    <ProductCard product={product}/>
                    <ProductCard product={product}/>
                    <ProductCard product={product}/>
                    <ProductCard product={product}/>
                    <ProductCard product={product}/>
                    <ProductCard product={product}/>
                </div>

            </div>
        </>
    )
}
