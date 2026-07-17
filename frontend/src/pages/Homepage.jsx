import HeroBanner from '../components/HeroBanner.jsx';
import HomepageBestSellers from '../components/HomepageBestSellers.jsx';
import HomepageCategory from '../components/HomepageCategory.jsx';
import heroBanner from '../assets/heroBanner.png'
import promiseBanner from '../assets/promise.png';
import leftGoldenStyler from '../assets/leftGolden.svg';
import rightGoldenStyler from '../assets/rightGolden.svg';
import tastikaLogo from '../assets/tastikaLogo.png';
import companyLogo from '../assets/companyLogo.png';
import zaikaLogo from '../assets/zaikaLogo.png';
import fssaiLogo from '../assets/fssaiLogo.png';
import msmeLogo from '../assets/msmeLogo.png';
import gstLogo from '../assets/gstLogo.png';
import processBanner from '../assets/processBanner.jpeg';
function Homepage() {
    return (
        <div id="page homepage-main" className="w-full min-h-screen overflow-x-hidden text-dark-textcolor">

            <HeroBanner img={heroBanner} />
            <HomepageCategory />
            <HomepageBestSellers />
            <section className=' w-full grid grid-cols-1 shadow-black/20 shadow-inner gap-6 mt-2 px-4'>
                <h2 className="font-bold text-2xl sm:text-3xl w-full max-sm:text-lg flex gap-2 items-center justify-center"><img src={leftGoldenStyler} className="w-12 h-12 sm:w-16 sm:h-16" alt="" /> Why Choose Us<img src={rightGoldenStyler} className="w-12 h-12 sm:w-16 sm:h-16" alt="" /></h2>
                <img src={processBanner} alt="" />
            </section>

            <section className=' w-full grid grid-cols-1 md:grid-cols-2 gap-6 mt-2 px-4 shadow-black/20 shadow-inner'>
                <div className="companies gap-4 flex justify-center flex-col py-6 px-4 border-r-2 border-light-textcolor/20">
                    <h2 className="font-bold text-2xl sm:text-3xl w-full max-sm:text-lg flex gap-2 items-center justify-center"><img src={leftGoldenStyler} className="w-12 h-12 sm:w-16 sm:h-16" alt="" /> Our Brands<img src={rightGoldenStyler} className="w-12 h-12 sm:w-16 sm:h-16" alt="" /></h2>
                    <div className="grid grid-cols-3 gap-10 max-md:gap-4 w-full items-center px-4">
                    <img loading='lazy' className="w-full object-contain" src={companyLogo} alt="Company Logo" />
                    <img loading='lazy' className="w-full object-contain" src={tastikaLogo} alt="Tastika Logo" />
                    <img loading='lazy' className="w-full object-contain" src={zaikaLogo} alt="Zaika Logo" />
                    </div>
                </div>
                <div className=" companies gap-4 flex justify-center flex-col py-6 px-4 rounded-lg ">
                    <h2 className="font-bold text-center text-2xl sm:text-3xl w-full max-sm:text-lg flex gap-2 items-center justify-center"><img src={leftGoldenStyler} className="w-12 h-12 sm:w-16 sm:h-16" alt="" /> Trusted and Registered<img src={rightGoldenStyler} className="w-12 h-12 sm:w-16 sm:h-16" alt="" /></h2>
                    <div className="grid grid-cols-3 gap-10 max-md:gap-4 w-full items-center px-4">
                    <img loading="lazy" className="w-full object-contain" src={fssaiLogo} alt="FSSAI Logo" />
                    <img loading="lazy" className="w-full object-contain" src={msmeLogo} alt="MSME Logo" />
                    <img loading="lazy" className="w-full object-contain" src={gstLogo} alt="GST Logo" />
                    </div>
                </div>

            </section>
            
            <HeroBanner img={promiseBanner} />
        </div>
    )
}

export default Homepage
