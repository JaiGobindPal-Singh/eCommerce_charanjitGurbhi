import loader from "../assets/loader.png"
export default function Loader() {
  return (
    <div className="flex justify-center items-center h-3/4  fixed z-30 w-screen  bg-main-background pointer-events-none bottom-0 max-md:h-[80%]">
      <img 
        src={loader} 
        alt="Rotating Planet" 
        className="w-48 h-48 rounded-full object-cover animate-[spin_7s_linear_infinite]"
      />
    </div>
  );
}
