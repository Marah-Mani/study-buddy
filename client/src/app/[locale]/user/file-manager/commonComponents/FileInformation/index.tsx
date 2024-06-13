import ParaText from '@/app/commonUl/ParaText'
import { getFileDetails } from '@/lib/commonApi';
import ErrorHandler from '@/lib/ErrorHandler';
import { Avatar, Col, Divider, Image, Row } from 'antd'
import React, { useEffect, useState } from 'react'
import DropdownMenu from '../../DropdownMenu';
import DateFormat from '../DateFormat';
import GetFileSize from '../GetFileSize';
import GetFileTypeIcon from '../GetFileTypeIcon';
import GetFileTypeName from '../GetFileTypeName';
import { UserOutlined } from '@ant-design/icons';

interface Props {
    fileId: string;
}

export default function FileInformation({ fileId }: Props) {
    const [fileDetails, setFileDetails] = useState<any>([]);
    useEffect(() => {
        if (fileId) fetchFile();
    }, [fileId])

    const fetchFile = async () => {
        try {
            const res = await getFileDetails(fileId);
            if (res.status === true) {
                setFileDetails(res.data)
            }
        } catch (error) {
            ErrorHandler.showNotification(error)
        }
    }

    return (
        <>
            <div id='fileInformation'>
                <div style={{ background: '#fff' }} >
                    <div className='fixedFileSearchThree'>
                        <Row align='middle'>
                            <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}><ParaText size='textGraf' color='black' fontWeightBold={600}> File Details  </ParaText></Col>
                            <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12} className='textEnd'><DropdownMenu /></Col>
                        </Row>
                    </div>
                    <div className='upgradeBox1'>
                        <GetFileTypeIcon fileType={fileDetails?.fileType} size={100} />
                        <br />
                        <ParaText size='textGraf' color='black' fontWeightBold={800} className='dBlock'>
                            {fileDetails?.fileName}</ParaText>
                        <ParaText size='minSmall' color='black' ><GetFileSize fileSize={fileDetails?.fileSize} /> | <DateFormat date={fileDetails?.createdAt} /></ParaText>
                    </div>
                    <div className='tableCommn'>
                        <ParaText size='textGraf' color='black' fontWeightBold={600}>  File Format :</ParaText>
                        <ParaText size='textGraf' color='black'> <b><GetFileTypeName fileType={fileDetails?.fileType} /></b>  </ParaText>
                        <Divider />
                        {fileDetails?.description &&
                            <>
                                <ParaText size='textGraf' color='black' fontWeightBold={600} className='dBlock'>File Description :</ParaText>
                                <ParaText size='smallExtra' color='black'>{fileDetails?.description}</ParaText>
                                <Divider />
                            </>
                        }
                        <ParaText size='textGraf' color='black' fontWeightBold={600} className='dBlock'>File Location :</ParaText>
                        <ParaText size='smallExtra' color='black'>{fileDetails?.filePath}</ParaText>
                        <Divider />
                        <ParaText size='textGraf' color='black' fontWeightBold={600} className='dBlock'>Contributors :</ParaText>
                        <div className='flexBar' style={{ justifyContent: 'space-between' }}>
                            <div className='flexBar'>
                                <div> {fileDetails?.createdBy?.image ?
                                    <Image src={`${process.env['NEXT_PUBLIC_IMAGE_URL']}/userImage/original/${fileDetails?.createdBy?.image}`} className='profilePicRadius' preview={false} alt='Avatar' width={40} height={40} />
                                    :
                                    <Avatar size={40} icon={<UserOutlined />} />
                                }
                                </div>
                                <div>  <ParaText size='smallExtra' color='black' fontWeightBold={600}>{fileDetails?.createdBy?.name}</ParaText></div>
                            </div>
                            <div> <ParaText size='minSmall' color='black' > <span className='badge'><DateFormat date={fileDetails?.createdAt} /></span> </ParaText></div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}
