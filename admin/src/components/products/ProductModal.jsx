import { useState, useEffect } from "react";
import { LoaderCircle, UploadCloud } from "lucide-react";
import { createProduct, getProduct, updateProduct } from "../../utils/productUtils";
function ProductModal({ setIsOpen, productId }) {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState([]);
    const [newCat, setNewCat] = useState('');
    const [price, setPrice] = useState('');
    const [comparePrice, setComparePrice] = useState('');
    const [stock, setStock] = useState(1);
    const [image, setImage] = useState(null);
    const [pricingTiers, setPricingTiers] = useState([]);

    const [previewUrl, setPreviewUrl] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");


    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    useEffect(() => {
        if (!productId) {
            return;
        }
        async function fetchProduct() {
            const product = await getProduct(productId);
            setTitle(product?.name ?? '');
            setDescription(product?.description ?? '');
            setCategory(product?.category ?? []);
            setPrice(product?.price ?? '');
            setComparePrice(product?.comparePrice ?? '');
            setStock(product?.stockAvailable ?? 1);
            setPricingTiers(product?.pricingTiers ?? []);
            setPreviewUrl((!Array.isArray(product?.imageUrl) ? product?.imageUrl : product?.imageUrl[0]));
        }
        fetchProduct();
    }, [productId])
    // Fetch product data by ID and populate the form fields
    const handleAddCategory = () => {
        if (newCat.trim() !== '') {
            setCategory((prevCategories) => [...prevCategories, newCat.trim()]);
            setNewCat('');
        }
    };

    const handleRemoveCategory = (catToRemove) => {
        setCategory((prevCategories) => prevCategories.filter((cat) => cat !== catToRemove));
    };

    const handleAddPricingTier = () => {
        setPricingTiers((prevTiers) => [...prevTiers, { minQuantity: "", price: "" }]);
    };

    const handlePricingTierChange = (index, field, value) => {
        setPricingTiers((prevTiers) =>
            prevTiers.map((tier, tierIndex) =>
                tierIndex === index ? { ...tier, [field]: value } : tier
            )
        );
    };

    const handleRemovePricingTier = (index) => {
        setPricingTiers((prevTiers) => prevTiers.filter((_, tierIndex) => tierIndex !== index));
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0] ?? null;

        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }

        setImage(file);
        setPreviewUrl(file ? URL.createObjectURL(file) : "");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim() || !image || isSubmitting) return;

        const hasInvalidPricingTier = pricingTiers.some(
            (tier) => tier.minQuantity === "" || tier.price === ""
        );

        if (hasInvalidPricingTier) {
            setError("Each pricing tier must include both minimum quantity and price.");
            return;
        }

        setIsSubmitting(true);
        setError("");

        const normalizedPricingTiers = pricingTiers.map((tier) => ({
            minQuantity: Number(tier.minQuantity),
            price: Number(tier.price),
        }));

        const productPayload = {
            name: title.trim(),
            image,
            description,
            category,
            price,
            comparePrice,
            stockAvailable: stock,
            pricingTiers: normalizedPricingTiers,
        };
        
        try {
            if (!productId) {
                await createProduct(productPayload);
            } else {
                await updateProduct(productId, productPayload);
            }

        } catch (error) {
            console.error("Error:", error);
            setError("Something went wrong while creating the product.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-color-medium flex p-4">
            <div className="mx-auto flex w-full  flex-col overflow-hidden rounded-3xl border border-slate-800/70 bg-color-heavy shadow-2xl shadow-slate-950/30">
                <div className="border-b border-slate-800/80 bg-slate-900/60 px-6 py-6 sm:px-8">
                    <div className="flex flex-wrap items-center justify-between">
                        <div>
                            <h1 className="text-2xl max-md:text-xl max-sm:text-lg font-bold text-primary-color sm:text-3xl">Create New Product</h1>
                        </div>
                        <button
                            className="text-slate-900 bg-color-medium p-2 rounded-full overflow-hidden max-w-8 min-w-8 max-h-8 flex items-center justify-center"
                            onClick={() => setIsOpen(false)}
                        >X</button>

                    </div>
                </div>

                <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.1fr_0.9fr]">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300" htmlFor="product-name">
                                Product name
                            </label>
                            <input
                                id="product-name"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter product name"
                                className="w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none transition focus:border-primary-color focus:ring-2 focus:ring-primary-color/20"
                            />
                        </div>

                        <div className="flex gap-2 grow">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300" htmlFor="product-price">
                                    Product Price
                                </label>
                                <input
                                    id="product-price"
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    placeholder="Enter product price"
                                    className="w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none transition focus:border-primary-color focus:ring-2 focus:ring-primary-color/20"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300" htmlFor="product-compare-price">
                                    Compare Price
                                </label>
                                <input
                                    id="product-compare-price"
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={comparePrice}
                                    onChange={(e) => setComparePrice(e.target.value)}
                                    placeholder="Enter compare price"
                                    className="w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none transition focus:border-primary-color focus:ring-2 focus:ring-primary-color/20"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300" htmlFor="product-stock">
                                Stock Available
                            </label>
                            <input
                                id="product-stock"
                                type="number"
                                min="1"
                                value={stock}
                                onChange={(e) => setStock(e.target.value)}
                                placeholder="Enter stock available"
                                className="w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none transition focus:border-primary-color focus:ring-2 focus:ring-primary-color/20"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300" htmlFor="product-description">
                                Product Description
                            </label>
                            <textarea
                                id="product-description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Enter product description"
                                className="w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none transition focus:border-primary-color focus:ring-2 focus:ring-primary-color/20"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300" htmlFor="product-categories">
                                Product Categories
                            </label>
                            <div className="flex gap-2">
                                <input
                                    id="product-categories"
                                    type="text"
                                    value={newCat}
                                    onKeyDown={(event) => event.key === 'Enter' && (event.preventDefault(), handleAddCategory())}
                                    onChange={(e) => setNewCat(e.target.value)}
                                    placeholder="Enter product category"
                                    className="w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none transition focus:border-primary-color focus:ring-2 focus:ring-primary-color/20"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddCategory}
                                    className="w-[30%] rounded-2xl bg-slate-900/80 px-3 py-2 text-sm font-semibold text-slate-100 hover:bg-slate-600"
                                >
                                    Add
                                </button>
                            </div>
                            <div className="mt-3 flex flex-wrap gap-2">
                                {category.length > 0 ? (
                                    category.map((cat) => (
                                        <div
                                            key={cat}
                                            className="flex items-center rounded-full border border-slate-700 bg-slate-800/70 px-2.5 py-1 text-sm text-slate-200"
                                        >
                                            <span className="mr-2">{cat}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveCategory(cat)}
                                                className="text-slate-400 hover:text-red-400"
                                                aria-label={`Remove ${cat}`}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <span className="text-sm text-slate-500">No categories added</span>
                                )}
                            </div>
                        </div>


                        <div className="space-y-3">
                            <div className="flex items-center justify-between gap-3">
                                <label className="text-sm font-medium text-slate-300" htmlFor="pricing-tiers">
                                    Pricing tiers
                                </label>
                                <button
                                    type="button"
                                    onClick={handleAddPricingTier}
                                    className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-primary-color/70 hover:text-primary-color"
                                >
                                    Add tier
                                </button>
                            </div>

                            {pricingTiers.length > 0 ? (
                                pricingTiers.map((tier, index) => (
                                    <div key={index} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3">
                                        <div className="flex items-start gap-2">
                                            <div className="grid w-full gap-2 sm:grid-cols-2">
                                                <div className="space-y-1">
                                                    <label className="text-xs font-medium text-slate-400" htmlFor={`tier-min-${index}`}>
                                                        Min quantity
                                                    </label>
                                                    <input
                                                        id={`tier-min-${index}`}
                                                        type="number"
                                                        min="1"
                                                        step="1"
                                                        value={tier.minQuantity}
                                                        onChange={(e) => handlePricingTierChange(index, "minQuantity", e.target.value)}
                                                        placeholder="e.g. 10"
                                                        className="w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-white outline-none transition focus:border-primary-color focus:ring-2 focus:ring-primary-color/20"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-xs font-medium text-slate-400" htmlFor={`tier-price-${index}`}>
                                                        Price
                                                    </label>
                                                    <input
                                                        id={`tier-price-${index}`}
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        value={tier.price}
                                                        onChange={(e) => handlePricingTierChange(index, "price", e.target.value)}
                                                        placeholder="e.g. 45"
                                                        className="w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-white outline-none transition focus:border-primary-color focus:ring-2 focus:ring-primary-color/20"
                                                    />
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleRemovePricingTier(index)}
                                                className="rounded-full p-2 text-slate-400 transition hover:bg-slate-800 hover:text-red-400"
                                                aria-label={`Remove tier ${index + 1}`}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 px-4 py-4 text-sm text-slate-500">
                                    No pricing tiers added yet.
                                </div>
                            )}
                        </div>



                        {error && (
                            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={!title.trim() || !image || isSubmitting}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-primary-color/90 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isSubmitting ? (
                                <>
                                    <LoaderCircle size={18} className="animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    Create Product
                                </>
                            )}
                        </button>
                    </form>

                    <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-4 sm:p-6 space-y-4">
                        {/* upload image */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300" htmlFor="product-image">
                                Product image
                            </label>
                            <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-900/70 px-4 py-8 text-center transition hover:border-primary-color/70 hover:bg-slate-800/60">
                                <UploadCloud size={24} className="text-primary-color" />
                                <span className="mt-4 text-sm font-semibold text-slate-200">Upload an image</span>
                                <span className="mt-1 text-xs text-slate-400">PNG, JPG, or WEBP</span>
                                <input
                                    id="product-image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="sr-only"
                                />
                            </label>
                            {image && <p className="text-sm text-slate-400">Selected file: {image.name}</p>}
                        </div>

                        <h2 className="text-white">Preview</h2>
                        <div className="overflow-hidden rounded-2xl border h-72 border-slate-800 bg-white">

                            {previewUrl ? (
                                <img src={previewUrl} alt="Selected category preview" className="h-full w-full object-cover" />
                            ) : (
                                <div className="flex h-full items-center justify-center bg-slate-200 text-sm font-medium text-slate-500">
                                    No image selected
                                </div>
                            )}
                        </div>

                        <div className="mt-4 rounded-2xl bg-slate-800/70 p-4">
                            <p className="text-sm font-semibold text-primary-color">
                                {title.trim() || "Product name"}
                            </p>
                            <p className="mt-1 text-sm text-slate-400">
                                {description.trim() || "Product description"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

}
export default ProductModal
