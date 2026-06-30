import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export default function SkeletonLoading({ className }) {
    return (
        <>
            <Skeleton baseColor="#EEDCD2" highlightColor='#F5EBE0' className={className} />
        </>
    )
}
