import { IndianRupee } from 'lucide-react';
import { useEffect, useState } from 'react';
import SkeletonLoading from './SkeletonLoading.jsx';
import { fetchProducts } from '../utils/productUtils.js';
import { useNavigate } from 'react-router-dom';
function ProductCard({ product, onClick, isLoading }) {
    return (
        <div
            className="flex flex-col w-40 hover:scale-110  transition-all duration-200 rounded-lg py-2  flex-shrink-0 cursor-pointer   max-md:w-32"
            onClick={onClick}
        >
            <div className="rounded-lg w-40 h-40  border-dark-textcolor overflow-hidden lg:w-60 lg:h-60 max-md:w-32 max-md:h-32 object-cover">
                {!isLoading ? <img
                    className="object-cover w-full h-full rounded-lg "
                    src={product?.imageUrl || "null"}
                    alt={product?.name}
                    loading="lazy"
                /> : <SkeletonLoading className='h-full' />}
            </div>
            <div className="capitalize font-semibold text-lg max-md:text-base w-full text-left pl-2 ">
                {isLoading ? <SkeletonLoading /> : product?.name || "--"}
            </div>
            <div className="flex gap-2 text-base items-center">
                <p className='flex items-center'><span><IndianRupee /></span>{isLoading ? "--" : product?.price || "--"}</p>
                <p className='line-through'>{isLoading ? "" : product?.comparePrice || ""}</p>

            </div>
        </div>
    );
}
export default function HomepageBestSellers() {
    const [isLoading, setIsLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts(1).then((ps) => {
            setProducts(ps);
            setIsLoading(false);
        });
    }, []);

    //sample data
    // const product = {
    //     name: "amla candy",
    //     price: 1200,
    //     comparePrice: 2300,
    //     imageUrl: ""
    // }

    return (
        <div className=" mt-5 mb-5">
            <div className="homeBestSellers w-full text-center flex flex-col items-center gap-2 justify-between">
                <h1 className="font-bold text-3xl w-full text-nowrap max-sm:text-xl">Best Sellers</h1>
                <div className="hrline w-16 h-1 bg-light-textcolor "></div>
            </div>
            <div className="categoryBox w-full grid grid-cols-4 items-center justify-items-center pt-10 max-md:grid-cols-3 max-sm:grid-cols-2 ">

                {/* //todo here fetch 3 products and show them  */}
                {products?.slice(0, 4).map((product) => {
                    return <ProductCard key={product._id} product={product} isLoading={isLoading} onClick={() => navigate('/products')} />
                })}

            </div>
        </div>
    )
}
