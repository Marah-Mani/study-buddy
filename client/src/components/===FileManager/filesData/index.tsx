import ParaText from "@/app/commonUl/ParaText";
import { Col, Row } from "antd";
import Link from "next/link";
import { BsFiletypeDoc } from "react-icons/bs";
import { FaFileAudio, FaFileVideo, FaImages } from "react-icons/fa";
interface props {
    myFiles: any;
}

export default function FilesData({ myFiles }: props) {
    return (

        <>
            <Row align='middle'>
                <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}><ParaText size='textGraf' color='black' fontWeightBold={600}> My Files  </ParaText></Col>
                {/* <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12} className='textEnd'><span className='viewAll'>View All</span></Col> */}
            </Row>
            <div className='gapMarginTopOne'></div>
            <Row gutter={[16, 16]}>
                <>
                    {myFiles.map((file: any, index: any) => (
                        <Col xs={12} sm={12} md={12} lg={6} xl={6} xxl={6} key={index}>
                            <Link href='#'>
                                <div className='cardCommn'>
                                    <Row align='middle'>
                                        <Col xs={8} sm={12} md={12} lg={12} xl={12} xxl={12}><FaImages className='sameColorSvg' size={30} /></Col>
                                        <Col xs={16} sm={12} md={12} lg={12} xl={12} xxl={12} className='textEnd' key={index}>
                                            <ParaText size='textGraf' color='black' fontWeightBold={600}>{file.fileType}</ParaText>
                                            <ParaText size='smallExtra' color='black' className='dBlock'>{file.sizeCount}</ParaText>
                                            {/* <ParaText size='smallExtra' color='black' className='dBlock'>{file.count}</ParaText> */}
                                        </Col>


                                    </Row>
                                </div>
                            </Link>
                        </Col>
                    ))}
                </>
            </Row>
        </>
    )
}
