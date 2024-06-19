import DropdownMenu from "@/app/[locale]/user/file-manager/DropdownMenu";
import NewFolder from "@/app/[locale]/user/file-manager/newFolder";
import ParaText from "@/app/commonUl/ParaText";
import { Col, Row } from "antd";
import Link from "next/link";
import { FcOpenedFolder } from "react-icons/fc";


interface props {
    folderData: any;
    handleUpdate: (folder: any, action: any) => void;
    handleDoubleClick: (folder: any) => void;
    handleClick: (folder: any) => void;
}

export default function Folders({ folderData, handleUpdate, handleDoubleClick, handleClick }: props) {

    const items = [
        { label: 'Delete', action: 'delete' },
        { label: 'Rename', action: 'rename' },
        { label: 'Download', action: 'download' },
    ];

    return (
        <>
            {/* <Row align='middle'>
                <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}><ParaText size='textGraf' color='black' fontWeightBold={600}> Folders  </ParaText></Col>
                <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12} className='textEnd'><span className='viewAll'>View All</span></Col>
            </Row>
            <div className='gapMarginTopOne'></div> */}
            <Row gutter={[16, 16]}>
                <>
                    {folderData.map((folder: any, index: any) => (
                        <Col xs={12} sm={12} md={12} lg={6} xl={6} xxl={6} key={folder._id || index}>
                            <Link href='#'>
                                <div className='cardCommn active' onDoubleClick={() => handleDoubleClick(folder)} onClick={() => handleClick(folder)}>
                                    <Row>
                                        <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                                            <div><FcOpenedFolder size={30} /></div>
                                        </Col>
                                        <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12} className='textEnd'>
                                            <DropdownMenu onUpdate={(action: any) => handleUpdate(folder, action)} items={items} />

                                        </Col>
                                        <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                                            <ParaText size='textGraf' color='black' fontWeightBold={600}> {folder.folderName} </ParaText>
                                            <ParaText size='smallExtra' color='black' className='dBlock'>246 Files</ParaText>
                                        </Col>
                                        <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12} className='textEnd'>
                                            <br />
                                            <ParaText size='smallExtra' color='black' className='dBlock' fontWeightBold={600}> 214.32MB </ParaText>
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
