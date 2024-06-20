import { ArrowLeftOutlined } from '@ant-design/icons';
import { useRouter } from "next/navigation";

export default function BackButton() {
    const router = useRouter();

    return (
        <>
            <ArrowLeftOutlined style={{ cursor: 'pointer' }} className='backArrowIcon' />
        </>
    )
}
