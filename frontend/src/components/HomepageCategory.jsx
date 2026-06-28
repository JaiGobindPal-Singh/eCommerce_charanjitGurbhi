
import { MoveRight } from "lucide-react";

function CategoryCard({ title, image, onClick }) {
    return (
        <div 
            className="flex flex-col w-60 hover:scale-110  transition-all duration-200 rounded-lg items-center py-5 gap-2 flex-shrink-0 cursor-pointer" 
            onClick={onClick}
        >
            <div className="rounded-full bg-white w-40 h-40  border-dark-textcolor overflow-hidden lg:w-60 lg:h-60 max-md:w-32 max-md:h-32">
                <img 
                    className="object-cover w-full h-full rounded-full" 
                    src={image || "null"} 
                    alt={title} 
                    loading="lazy"
                />
            </div>
            <div className="capitalize font-semibold text-xl w-full text-center">
                {title || "--"}
            </div>
            <div className="flex gap-2 items-center">
                <span>Shop Now</span>
                <MoveRight size={20} />
            </div>
        </div>
    );
}
export default function HomepageCategory() {
    return (
        <div className="pt-5 bg-section-background drop-shadow-md">
            <div className="homeCategoryHeading w-full text-center flex items-center gap-2 justify-between">
                <div className="hrline w-full h-0.5 bg-dark-textcolor "></div>
                <h1 className="font-bold text-3xl w-full text-nowrap max-sm:text-xl">Shop By Category</h1>
                <div className="hrline w-full h-0.5 bg-dark-textcolor "></div>
            </div>
            <div className="categoryBox w-full grid grid-cols-4 items-center justify-items-center pt-10 max-md:grid-cols-3 max-sm:grid-cols-2 ">
                {/* //todo fetch categories and show */}
                <CategoryCard  title={"hello"} image={"null"}/>
                <CategoryCard  title={"hello candy "} image={"null"}/>
                <CategoryCard  title={"hello candy "} image={"null"}/>
                <CategoryCard  title={"hello candy "} image={"null"}/>
            </div>
        </div>
    )
}
