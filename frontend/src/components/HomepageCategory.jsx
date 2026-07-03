import { useEffect, useState } from "react";
import { getCategories } from "../utils/categoryUtils";
import { useNavigate } from "react-router-dom";
import SkeletonLoading from "./SkeletonLoading";
function CategoryCard({ title, image, onClick, isLoading }) {

    return (
        <div
            className="page flex flex-col w-60 hover:scale-110  transition-all duration-150 rounded-lg items-center py-5 gap-2 flex-shrink-0 cursor-pointer pb-10"
            onClick={onClick}
        >
            <div className="rounded-full bg-white w-40 h-40  border-dark-textcolor overflow-hidden lg:w-60 lg:h-60 max-md:w-32 max-md:h-32 ">
                {!isLoading ?<img
                    className="object-cover w-full h-full rounded-full"
                    src={image || "null"}
                    alt={title}
                    loading="lazy"
                />:
                <SkeletonLoading className={"h-full w-full"}/>
                }
            </div>
            <div className="capitalize font-semibold text-xl max-md:text-lg w-full text-center">
                {title || <SkeletonLoading className={"max-w-12 overflow-hidden"}/>}
            </div>
        </div>
    );
}
export default function HomepageCategory() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        getCategories().then((cats) => {
            if (isMounted) {
                setCategories(cats) || [];
                setIsLoading(false);
            }
        });
        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <div className="pt-5 bg-section-background drop-shadow-md">
            <div className="homeCategoryHeading w-full  flex items-center gap-12 max-sm:gap-4 justify-center">
                <div className="hrline w-20 h-1 bg-light-textcolor "></div>
                <h1 className="font-bold text-3xl text-nowrap max-sm:text-xl">Shop By Category</h1>
                <div className="hrline w-20 h-1 bg-light-textcolor "></div>
            </div>
            <div className="categoryBox w-full grid grid-cols-4 items-center justify-items-center pt-10 max-md:grid-cols-3 max-sm:grid-cols-2 max-md:pt-5">
                {!isLoading && categories?.length &&
                    categories?.slice(0, 4).map((cat) => {
                        return <CategoryCard key={cat._id} title={cat.name} image={cat.iconUrl} onClick={() => navigate(`/products?search=${cat.name}`)} isLoading={false} />
                    })
                }
                {!categories?.length && <>
                    <CategoryCard  isLoading={true}/>
                    <CategoryCard  isLoading={true}/>
                    <CategoryCard  isLoading={true}/>
                    <CategoryCard  isLoading={true}/>
                </>}

            </div>
        </div>
    )
}
