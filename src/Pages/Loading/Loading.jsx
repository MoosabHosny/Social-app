import { FadeLoader} from 'react-spinners'

export default function Loading() {
    return <>
        <div className=' fixed flex top-0 bottom-0justify-center items-center' >
            <FadeLoader/>
    </div>
    </>
}
