import { Plus, PackageOpen, Pencil, Trash2, IndianRupee, Search } from "lucide-react";
import Pagination from "../utilents/Pagination";
export default function Products() {
    // Replace this with your state/API/localStorage later
    // const products = [
    //     {
    //         id: 1,
    //         name: "Wireless Mouse",
    //         description: "Ergonomic wireless mouse with silent clicks.",
    //         price: 24.99,
    //         image: "https://placehold.co/300x300?text=Mouse",
    //     },
    //     {
    //         id: 2,
    //         name: "Mechanical Keyboard",
    //         description: "RGB mechanical keyboard with blue switches.",
    //         price: 69.99,
    //         image: "https://placehold.co/300x300?text=Keyboard",
    //     },
    //     {
    //         id: 3,
    //         name: "USB-C Hub",
    //         description: "7-in-1 Type-C hub with HDMI and USB 3.0.",
    //         price: 39.99,
    //         image: "https://placehold.co/300x300?text=Hub",
    //     },
    //     {
    //         id: 3,
    //         name: "USB-C Hub",
    //         description: "7-in-1 Type-C hub with HDMI and USB 3.0.",
    //         price: 39.99,
    //         image: "https://placehold.co/300x300?text=Hub",
    //     },
    //     {
    //         id: 3,
    //         name: "USB-C Hub",
    //         description: "7-in-1 Type-C hub with HDMI and USB 3.0.",
    //         price: 39.99,
    //         image: "https://placehold.co/300x300?text=Hub",
    //     },
    //     {
    //         id: 3,
    //         name: "USB-C Hub",
    //         description: "7-in-1 Type-C hub with HDMI and USB 3.0.",
    //         price: 39.99,
    //         image: "https://placehold.co/300x300?text=Hub",
    //     },
    //     {
    //         id: 3,
    //         name: "USB-C Hub",
    //         description: "7-in-1 Type-C hub with HDMI and USB 3.0.",
    //         price: 39.99,
    //         image: "https://placehold.co/300x300?text=Hub",
    //     },
    // ];
    const products = []
    return (
        <div className="min-h-screen bg-color-medium p-4 ">
            <div className="w-full flex flex-col items-center bg-color-heavy p-4 rounded-xl">
                {/* Header */}
                <div className="pb-4 flex gap-4  items-center justify-between w-full">

                    <div className="flex justify-between max-md:hidden">
                        <h1 className="text-4xl text-primary-color font-bold">Products</h1>
                    </div>
                    <div className="search flex gap-2 bg-slate-900/90 px-4 py-2 min-w-4 text-white rounded-full justify-between ">
                        <input type="text" className="bg-transparent outline-none min-w-2" placeholder="Search Product" />
                        <Search size={24} />
                    </div>
                    <button
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900/90 text-sm px-5 py-3 font-medium text-white transition hover:bg-slate-900 active:scale-95 "
                    >
                        <Plus size={18} />
                        <span className="max-lg:hidden">
                            Add New Product
                        </span>
                    </button>
                </div>
                <div className="w-full border-1 border border-primary-color/50 flex my-2"></div>
                {/* Products */}
                {products.length === 0 ? (<div className="flex min-h-[450px] flex-col items-center justify-center rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-8 text-center">
                    <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-slate-700 bg-slate-800/60">
                        <PackageOpen size={42} className="text-slate-300" />
                    </div>

                    <h2 className="mt-8 text-3xl font-bold tracking-tight text-white">
                        No Products Yet
                    </h2>

                    <p className="mt-4 max-w-lg text-slate-400">
                        Your products will appear here once they're created. Organize your
                        products into products for a cleaner inventory.
                    </p>

                    <button className="mt-10 inline-flex items-center gap-2 rounded-xl bg-slate-700 px-6 py-3 font-semibold text-white transition-all hover:bg-slate-600 hover:shadow-lg hover:shadow-slate-900/40">
                        <Plus size={18} />
                        Create First product
                    </button>
                </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 bg-color-heavy p-4 rounded-xl w-full">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="overflow-hidden rounded-2xl border border-color-light bg-slate-900 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                            >
                                {/* Image */}
                                <div className="h-52 overflow-hidden bg-color-heavy">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="h-full w-full object-cover transition duration-300 hover:scale-105"
                                    />
                                </div>

                                {/* Content */}
                                <div className="space-y-3 p-5">
                                    <div>
                                        <h2 className="text-lg font-semibold text-primary-color">
                                            {product.name}
                                        </h2>

                                        <p className="mt-2 line-clamp-2 text-sm text-color-medium">
                                            {product.description}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-xl font-bold text-primary-color">

                                            <IndianRupee className="inline-flex" size={18} />
                                            {product.price}
                                        </span>

                                        <div className="flex items-center gap-2">
                                            <button
                                                className="rounded-lg bg-blue-50 p-2 text-blue-600 transition hover:bg-blue-100"
                                            >
                                                <Pencil size={18} />
                                            </button>

                                            <button
                                                className="rounded-lg bg-red-50 p-2 text-red-600 transition hover:bg-red-100"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <Pagination />//todo
            </div>
        </div>
    );
}