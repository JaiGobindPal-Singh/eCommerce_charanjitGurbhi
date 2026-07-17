import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser, logoutUser, setUserAddress } from "../utils/userUtils";
import { ArrowLeft } from "lucide-react";

export default function ProfilePage() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [saved, setSaved] = useState(false);
    const [streetAddress, setStreetAddress] = useState("");
    const [cityVal, setCityVal] = useState("");
    const [stateVal, setStateVal] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        let mounted = true;
        getUser()
            .then((u) => {
                setStreetAddress(u.streetAddress || "");
                setCityVal(u.city || "");
                setStateVal(u.state || "");
                setPostalCode(u.postalCode || "");

                //navigate to register if user is not logged in
                if (!u?.id) {
                    navigate("/register");
                    return;
                }
                if (mounted) setUser(u);
            })
            .catch((err) => {
                console.error("error loading user", err);
                navigate("/register");
            })
            .finally(() => mounted && setIsLoading(false));

        return () => {
            mounted = false;
        };
    }, [navigate]);


    const handleLogout = async () => {
        try {
            await logoutUser();
        } catch (e) {
            // logoutUser already handles clear on success; ignore errors
            console.error(e);
        }
        navigate("/register");
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-main-background">
                <div className="rounded-3xl bg-white p-8 shadow">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-main-background px-4 py-8 text-dark-textcolor">
            <div className="mx-auto max-w-3xl">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="mb-6 inline-flex items-center gap-2 rounded-full bg-section-background px-4 py-2 text-sm font-semibold text-light-textcolor shadow-sm transition hover:-translate-y-0.5"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </button>

                <div className="rounded-2xl bg-white p-6 shadow-sm">
                    <h1 className="text-2xl font-semibold mb-4">Profile</h1>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="text-xs text-light-textcolor">Name</label>
                            <div className="mt-1 rounded-md border border-[#EBD8C0] bg-section-background p-3">{user?.name || "-"}</div>
                        </div>
                        <div>
                            <label className="text-xs text-light-textcolor">Phone</label>
                            <div className="mt-1 rounded-md border border-[#EBD8C0] bg-section-background p-3">{user?.phone || "-"}</div>
                        </div>

                        <div className="sm:col-span-2">
                            <label className="text-xs text-light-textcolor">Street Address</label>
                            {editMode ? (
                                <textarea
                                    value={streetAddress}
                                    onChange={(e) => setStreetAddress(e.target.value)}
                                    className="mt-1 w-full rounded-md border border-[#EBD8C0] bg-white p-3"
                                    rows={3}
                                />
                            ) : (
                                <div className="mt-1 rounded-md border border-[#EBD8C0] bg-section-background p-3">{user?.streetAddress || "-"}</div>
                            )}
                        </div>

                        <div>
                            <label className="text-xs text-light-textcolor">City</label>
                            {editMode ? (
                                <input
                                    value={cityVal}
                                    onChange={(e) => setCityVal(e.target.value)}
                                    className="mt-1 w-full rounded-md border border-[#EBD8C0] bg-white p-3"
                                />
                            ) : (
                                <div className="mt-1 rounded-md border border-[#EBD8C0] bg-section-background p-3">{user?.city || "-"}</div>
                            )}
                        </div>
                        <div>
                            <label className="text-xs text-light-textcolor">State</label>
                            {editMode ? (
                                <input
                                    value={stateVal}
                                    onChange={(e) => setStateVal(e.target.value)}
                                    className="mt-1 w-full rounded-md border border-[#EBD8C0] bg-white p-3"
                                />
                            ) : (
                                <div className="mt-1 rounded-md border border-[#EBD8C0] bg-section-background p-3">{user?.state || "-"}</div>
                            )}
                        </div>

                        <div>
                            <label className="text-xs text-light-textcolor">Pincode</label>
                            {editMode ? (
                                <input
                                    value={postalCode}
                                    onChange={(e) => setPostalCode(e.target.value)}
                                    className="mt-1 w-full rounded-md border border-[#EBD8C0] bg-white p-3"
                                />
                            ) : (
                                <div className="mt-1 rounded-md border border-[#EBD8C0] bg-section-background p-3">{user?.postalCode || "-"}</div>
                            )}
                        </div>
                    </div>

                    <div className="mt-6 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={async () => {
                                if (!editMode && !saved) {
                                    setEditMode(true);
                                    return;
                                }

                                if (editMode) {
                                    setIsSaving(true);
                                    try {
                                        await setUserAddress(streetAddress, cityVal, stateVal, postalCode);
                                        // update local user state
                                        setUser((prev) => ({ ...(prev || {}), streetAddress, city: cityVal, state: stateVal, postalCode }));
                                        setSaved(true);
                                        setEditMode(false);
                                    } catch (e) {
                                        console.error(e);
                                    } finally {
                                        setIsSaving(false);
                                    }
                                    return;
                                }

                                // not editMode and saved -> Exit
                                if (!editMode && saved) {
                                    navigate(-1);
                                }
                            }}
                            disabled={isSaving}
                            className="rounded-full px-4 py-2 text-sm font-semibold bg-white border border-[#EBD8C0] text-dark-textcolor hover:bg-[#f6f3ef]"
                        >
                            {editMode ? (isSaving ? 'Saving...' : 'Save') : 'Edit'}
                        </button>
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="rounded-full bg-light-textcolor px-4 py-2 text-sm font-semibold text-main-background hover:opacity-90"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}


