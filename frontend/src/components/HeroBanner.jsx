
function HeroBanner({ img }) {
  return (
    <div className=' h-auto w-full bg-black '>

      <img src={img || "null"} className='w-full h-auto' alt="" />
    </div>
  )
}

export default HeroBanner
