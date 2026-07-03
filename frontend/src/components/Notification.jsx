import { ToastContainer } from "react-toastify"
export default function Notification() {


    return (
        <div>
            <ToastContainer
                toastStyle={{
                    backgroundColor: '#882B1D',                          // Dark red background
                    color: '#FDF5E9',                                    // Light cream text
                    border: `1px solid #FDF6EA`, // Keeps your existing border variables
                }}
                bodyStyle={{
                    color: '#FDF5E9',                                    // Dark theme text color
                }}
                progressStyle={{
                    background: '#FDF5E9',                               // Progress bar matches the text color
                }}
            />

        </div>
    )
}
