import HeroBanner from '../components/HeroBanner.jsx';
import HomepageBestSellers from '../components/HomepageBestSellers.jsx';
import HomepageCategory from '../components/HomepageCategory.jsx';
import promiseBanner from '../assets/promise.png';
function Homepage() {
    return (
        <div id="homepage-main" className="w-full min-h-screen overflow-x-hidden text-dark-textcolor">
            
            <HeroBanner img={promiseBanner} />
            <HomepageCategory />
            <HomepageBestSellers />
            <HeroBanner img={promiseBanner} />
        </div>
    )
}

export default Homepage
