import { Plus, PackageOpen, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import Pagination from "../utilents/Pagination";
import { deleteCategory, fetchCategories } from "../../utils/categoryUtils";
import SpinLoader from "../utilents/SpinLoader";
import CreateCategory from "./CreateCategory";

export default function Categories() {
    const [categories, setCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [createCategory, setCreateCategory] = useState(false);
    useEffect(() => {
        let isMounted = true;

        const loadCategories = async () => {
            setIsLoading(true);
            try {
                const newCats = await fetchCategories(currentPage);
                if (isMounted) {
                    setCategories(newCats.categories ?? []);
                    setHasNextPage(Boolean(newCats.hasNextPage));
                }
            } catch (error) {
                console.error('Failed to fetch categories', error);
                if (isMounted) {
                    setCategories([]);
                    setHasNextPage(false);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        loadCategories();

        return () => {
            isMounted = false;
        };
    }, [currentPage]);

    const handleDeleteCategory = async (categoryId) =>{
        const yes = confirm("are you sure to delete category ? this action is irreversible");
        if(yes){
            
            await deleteCategory(categoryId);
            setCategories(cats=>cats.filter(cat=> cat.id != categoryId));
        }
    }
    if(createCategory) return <CreateCategory setIsOpen={setCreateCategory}/>
    return (
        <div className="min-h-screen bg-color-medium p-4">
            <div className="relative w-full flex flex-col items-center bg-color-heavy p-4 rounded-xl">
                {isLoading && <SpinLoader message="Loading categories..." />}

                <div className="pb-2 flex gap-4 items-center justify-between w-full">
                    <div className="flex justify-between">
                        <h1 className="text-4xl max-md:text-2xl text-primary-color font-bold">Categories</h1>
                    </div>

                    <button className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900/90 text-sm px-5 py-3 font-medium text-white transition hover:bg-slate-900 active:scale-95"
                    onClick={()=>{setCreateCategory(true)}}>
                        <Plus size={18} />
                        <span className="max-lg:hidden">Add New Category</span>
                    </button>
                </div>
                <div className="w-full border-1 border border-primary-color/50 flex mb-6 my-2"></div>

                {!isLoading && categories.length === 0 ? (
                    <div className="flex min-h-[450px] flex-col items-center justify-center rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-8 text-center">
                        <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-slate-700 bg-slate-800/60">
                            <PackageOpen size={42} className="text-slate-300" />
                        </div>

                        <h2 className="mt-8 text-3xl font-bold tracking-tight text-white">No Categories Yet</h2>

                        <p className="mt-4 max-w-lg text-slate-400">
                            Your categories will appear here once they're created. Organize your
                            products into categories for a cleaner inventory.
                        </p>

                        <button className="mt-10 inline-flex items-center gap-2 rounded-xl bg-slate-700 px-6 py-3 font-semibold text-white transition-all hover:bg-slate-600 hover:shadow-lg hover:shadow-slate-900/40">
                            <Plus size={18} />
                            Create First Category
                        </button>
                    </div>
                ) : (
                    !isLoading && (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 bg-color-heavy p-4 rounded-xl w-full">
                            {categories.map((category) => (
                                <div
                                    key={category.id}
                                    className="overflow-hidden rounded-2xl border border-color-light bg-slate-900 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                                >
                                    <div className="h-52 overflow-hidden bg-white">
                                        <img
                                            src={category.iconUrl}
                                            alt={category.name}
                                            className="h-full w-full object-cover transition duration-300 hover:scale-105"
                                        />
                                    </div>

                                    <div className="py-5 px-2">
                                        <div className="flex items-center justify-between flex-wrap gap-2">
                                            <div>
                                                <h2 className="text-lg font-semibold text-primary-color">{category.name}</h2>
                                            </div>

                                            <div className="flex items-center gap-2">
                                            
                                                <button className="rounded-lg bg-red-50 p-2 text-red-600 transition hover:bg-red-100"
                                                onClick={()=>handleDeleteCategory(category.id)}
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                )}

                <Pagination currentPage={currentPage} onPageChange={setCurrentPage} hasNextPage={hasNextPage} />
            </div>
        </div>
    );
}