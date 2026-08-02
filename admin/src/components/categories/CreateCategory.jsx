import { useEffect, useState } from "react";
import { LoaderCircle, UploadCloud } from "lucide-react";
import { createCategory } from "../../utils/categoryUtils";

export default function CreateCategory({setIsOpen}) {
    const [title, setTitle] = useState("");
    const [image, setImage] = useState(null);
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

        setIsSubmitting(true);
        setError("");

        const data = new FormData();
        data.append("name", title.trim());
        data.append("icon", image);

        try {
            await createCategory(data);
            setTitle("");
            setImage(null);
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
            setPreviewUrl("");
        } catch (error) {
            console.error("Error:", error);
            setError("Something went wrong while creating the category.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-color-medium flex p-4 sm:p-6 lg:p-8">
            <div className="mx-auto flex w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-slate-800/70 bg-color-heavy shadow-2xl shadow-slate-950/30">
                <div className="border-b border-slate-800/80 bg-slate-900/60 px-6 py-6 sm:px-8">
                    <div className="flex flex-wrap items-center justify-between">
                        <div>
                            <h1 className="text-2xl max-md:text-xl max-sm:text-lg font-bold text-primary-color sm:text-3xl">Create New Category</h1>
                        </div>
                        <button
                            className="text-slate-900 bg-color-medium p-2 rounded-full overflow-hidden max-w-8 min-w-8 max-h-8 flex items-center justify-center"
                            onClick={()=>setIsOpen(false)}
                        >X</button>
                        
                    </div>
                </div>

                <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.1fr_0.9fr]">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300" htmlFor="category-name">
                                Category name
                            </label>
                            <input
                                id="category-name"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter category title"
                                className="w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none transition focus:border-primary-color focus:ring-2 focus:ring-primary-color/20"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300" htmlFor="category-image">
                                Category icon
                            </label>
                            <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-900/70 px-4 py-8 text-center transition hover:border-primary-color/70 hover:bg-slate-800/60">
                                <UploadCloud size={24} className="text-primary-color" />
                                <span className="mt-4 text-sm font-semibold text-slate-200">Upload an image</span>
                                <span className="mt-1 text-xs text-slate-400">PNG, JPG, or WEBP</span>
                                <input
                                    id="category-image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="sr-only"
                                />
                            </label>
                            {image && <p className="text-sm text-slate-400">Selected file: {image.name}</p>}
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
                                    
                                    Create Category
                                </>
                            )}
                        </button>
                    </form>

                    <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-4 sm:p-6">
                        <div className="mb-4 flex items-center justify-between gap-3">
                            <h2 className="text-lg font-semibold text-primary-color">Preview</h2>
                            
                        </div>

                        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-white">
                            {previewUrl ? (
                                <img src={previewUrl} alt="Selected category preview" className="h-60 w-full object-cover" />
                            ) : (
                                <div className="flex h-60 items-center justify-center bg-slate-200 text-sm font-medium text-slate-500">
                                    No image selected
                                </div>
                            )}
                        </div>

                        <div className="mt-4 rounded-2xl bg-slate-800/70 p-4">
                            <p className="text-sm font-semibold text-primary-color">
                                {title.trim() || "Category name"}
                            </p>
                            <p className="mt-1 text-sm text-slate-400">
                                A concise title and a clear icon make the catalog easier to browse.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
