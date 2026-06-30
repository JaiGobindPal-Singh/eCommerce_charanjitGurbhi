import { useNavigate } from "react-router-dom";

function CategoryCard({ category, onCategoryClick }){
    const placeholder = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><rect width='100%' height='100%' fill='%23f3f4f6'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-size='20'>No Image</text></svg>";
    return (
        <div 
            className="w-full max-w-sm overflow-hidden transform transition duration-200 cursor-pointer"
        >
            <div className="flex flex-col items-center p-6">
                <div className="rounded-full overflow-hidden bg-gray-100 w-48 h-48 sm:w-52 sm:h-52 md:w-60 md:h-60 flex items-center justify-center flex-shrink-0 hover:scale-110 transition-all duration-150" onClick={() => onCategoryClick(category?.name)}>
                    <img 
                        className="object-cover w-full h-full" 
                        src={category?.imageUrl || placeholder} 
                        alt={category?.name || 'Category'} 
                        loading="lazy"
                    />
                </div>
                <div className="mt-4 w-full text-center">
                    <h2 className="text-base sm:text-lg font-semibold capitalize truncate">{category?.name || 'Category'}</h2>
                </div>
            </div>
        </div>
    );
}

export default function CategoriesPage() {
    const navigate = useNavigate();

    const categoryClick = (category) => {
        navigate(`/products?search=${category}`)
    }

    //?sample data
    const Category = {
        id:"hellodcate",
        name:"amla candy",
        
        imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyQg8_AvABOanXorRIfdLyEeOpm7LCW93Zwg&s"
    }
    return (
        <>
            <div className="page CategoryPage w-full bg-gradient-to-r from-main-background to-[#EEDEC1]  ">
                <div className="searchHeader shadow-md shadow-[#EEDEC1]  w-full h-24 flex items-center px-5 justify-between max-sm:h-16 ">
                    <div className="flex flex-col items-start gap-2">
                        <h1 className="text-dark-textcolor font-semibold text-4xl max-sm:text-xl">Categories</h1>
                        <div className="inline-flex items-center gap-2 text-sm max-sm:text-xs">
                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            className="inline-flex items-center gap-2 hover:bg-slate-200 transition-colors duration-200 text-dark-textcolor"
                        >
                            <span>Home</span>
                        </button>
                        <span className="text-dark-textcolor">&gt;</span>
                        <span className="text-dark-textcolor font-semibold">Categories</span>
                    </div>
                    </div>

                </div>
                <div className="CategoriesGrid grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4 py-5 px-5 w-full min-h-[80dvh] justify-items-center 1">
                    {/* //?todo fetch Categories and show them*/}
                    <CategoryCard category={Category} onCategoryClick={categoryClick}/>
                    <CategoryCard category={Category} onCategoryClick={categoryClick}/>
                    <CategoryCard category={Category} onCategoryClick={categoryClick}/>
                    <CategoryCard category={Category} onCategoryClick={categoryClick}/>
                    <CategoryCard category={Category} onCategoryClick={categoryClick}/>
                    <CategoryCard category={Category} onCategoryClick={categoryClick}/>
                    <CategoryCard category={Category} onCategoryClick={categoryClick}/>
                    <CategoryCard category={Category} onCategoryClick={categoryClick}/>
                    <CategoryCard category={Category} onCategoryClick={categoryClick}/>
                </div>

            </div>
        </>
    )
}
