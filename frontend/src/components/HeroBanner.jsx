
function HeroBanner({ img, loading = 'lazy', fetchPriority = 'low' }) {
  return (
    <div className=' h-auto w-full bg-black '>

      <img src={img || "null"} className='w-full h-auto' alt="" loading={loading} fetchPriority={fetchPriority} decoding="async" />
    </div>
  )
}

export default HeroBanner
