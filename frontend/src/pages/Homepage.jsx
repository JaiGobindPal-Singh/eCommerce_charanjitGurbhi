import HeroBanner from '../components/HeroBanner.jsx';
import HomepageBestSellers from '../components/HomepageBestSellers.jsx';
import HomepageCategory from '../components/HomepageCategory.jsx';
import heroBanner from '../assets/heroBanner.png'
import promiseBanner from '../assets/promise.png';
import leftGoldenStyler from '../assets/leftGolden.svg';
import advertisement from '../assets/advertisement.jpeg'
import rightGoldenStyler from '../assets/rightGolden.svg';
// import tastikaLogo from '../assets/tastikaLogo.png';
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
            {advertisement && <HeroBanner img={advertisement} />}
            <section className=' w-full grid grid-cols-1 gap-6 mt-2 px-4'>
                <h2 className="font-bold text-2xl sm:text-3xl w-full max-sm:text-lg flex gap-2 items-center justify-center"><img src={leftGoldenStyler} className="w-12 h-12 sm:w-16 sm:h-16" alt="" /> Why Choose Us<img src={rightGoldenStyler} className="w-12 h-12 sm:w-16 sm:h-16" alt="" /></h2>
                <img src={processBanner} alt="" />
            </section>

            <section className=' w-full grid grid-cols-1 md:grid-cols-2 gap-6 mt-2 px-4 shadow-black/20 shadow-inner'>
                <div className="companies gap-4 flex justify-center flex-col py-6 px-4">
                    <h2 className="font-bold text-2xl sm:text-3xl w-full max-sm:text-lg flex gap-2 items-center justify-center">
                        <img
                            src={leftGoldenStyler}
                            className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                            alt=""
                        />
                        Our Brands
                        <img
                            src={rightGoldenStyler}
                            className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                            alt=""
                        />
                    </h2>

                    <div className="flex justify-center items-center gap-4  w-full px-2">
                        <div className="flex-1 min-w-[120px] max-w-[250px] flex justify-center">
                            <img
                                loading="lazy"
                                className="w-full max-h-48 object-contain max-sm:max-h-32"
                                src={companyLogo}
                                alt="Company Logo"
                            />
                        </div>

                        <div className="flex-1 min-w-[120px] max-w-[250px] flex justify-center">
                            <img
                                loading="lazy"
                                className="w-full max-h-48 object-contain max-sm:max-h-32"
                                src={zaikaLogo}
                                alt="Zaika Logo"
                            />
                        </div>
                    </div>
                </div>

                <div className="companies gap-4 flex justify-center flex-col py-6 px-4 rounded-lg">
                    <h2 className="font-bold text-center text-2xl sm:text-3xl w-full max-sm:text-lg flex  items-center justify-center text-nowrap gap-1">
                        <img
                            src={leftGoldenStyler}
                            className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                            alt=""
                        />
                        Trusted and Registered
                        <img
                            src={rightGoldenStyler}
                            className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                            alt=""
                        />
                    </h2>

                    <div className="flex flex-wrap justify-center items-center gap-4 gap-y-0  w-full px-2">
                        <div className="flex-1 min-w-[100px] max-w-[250px] flex justify-center">
                            <img
                                loading="lazy"
                                className="w-full max-h-48 object-contain"
                                src={fssaiLogo}
                                alt="FSSAI Logo"
                            />
                        </div>

                        <div className="flex-1 min-w-[100px] max-w-[250px] flex justify-center">
                            <img
                                loading="lazy"
                                className="w-full max-h-48  object-contain"
                                src={msmeLogo}
                                alt="MSME Logo"
                            />
                        </div>

                        <div className="flex-1 min-w-[100px] max-w-[250px] flex justify-center max-sm:max-w-[150px]">
                            <img
                                loading="lazy"
                                className="w-full max-h-48 object-contain"
                                src={gstLogo}
                                alt="GST Logo"
                            />
                        </div>
                    </div>
                </div>

            </section>

            <HeroBanner img={promiseBanner} />
        </div>
    )
}

export default Homepage
