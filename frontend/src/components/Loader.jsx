import loader from "../assets/loader.png"
export default function Loader({ className }) {
  return (
    <div className={"flex justify-center items-center z-30  bg-transparent pointer-events-none " + className}>
      <img
        src={loader}
        alt="Rotating Planet"
        className="w-48 h-48 rounded-full object-cover animate-[spin_7s_linear_infinite]"
      />
    </div>
  );
}
