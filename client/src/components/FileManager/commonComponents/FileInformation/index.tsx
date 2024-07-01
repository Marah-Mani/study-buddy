import ParaText from '@/app/commonUl/ParaText'
import { getFileDetails, getListOfContributors } from '@/lib/commonApi';
import ErrorHandler from '@/lib/ErrorHandler';
import { Avatar, Col, Divider, Image, Row } from 'antd'
import React, { useEffect, useState } from 'react'
import DateFormat from '../DateFormat';
import GetFileSize from '../GetFileSize';
import GetFileTypeIcon from '../GetFileTypeIcon';
import GetFileTypeName from '../GetFileTypeName';
import { UserOutlined } from '@ant-design/icons';
import DropdownMenu from '../DropdownMenu';
import { FcOpenedFolder } from 'react-icons/fc';

interface Props {
    fileId: string;
    folder: any;
}

export default function FileInformation({ fileId, folder }: Props) {
    const [fileDetails, setFileDetails] = useState<any>([]);
    const [contributors, setContributors] = useState<any>([]);

    useEffect(() => {
        if (fileId) {
            fetchFile();
        } else {
            fetchContributors();
        }
    }, [fileId, folder])
    console.log(folder);
    console.log(fileId);

    const fetchContributors = async () => {
        try {
            const res = await getListOfContributors(folder._id);
            if (res.status === true) {
                setContributors(res.data.contributors)
            }
        } catch (error) {
            ErrorHandler.showNotification(error)
        }
    }

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
                <div  >
                    <div className='fixedFileSearchThree'>
                        <Row align='middle'>
                            <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}><ParaText size='textGraf' color='black' fontWeightBold={600}>{folder ? 'Folder Details' : 'File Details'}  </ParaText></Col>
                        </Row>
                    </div>
                    <div className='upgradeBox1'>
                        {folder ?
                            <FcOpenedFolder size={75} />
                            :
                            <GetFileTypeIcon fileType={fileDetails?.fileType} size={100} />
                        }
                        <br />
                        <ParaText size='textGraf' color='black' fontWeightBold={800} className='dBlock'>
                            {folder ? folder.folderName : fileDetails?.fileName}
                        </ParaText>
                        <ParaText size='minSmall' color='black' >
                            {folder ? folder.totalSize : <GetFileSize fileSize={fileDetails?.fileSize} />} | <DateFormat date={folder ? folder.createdAt : fileDetails?.createdAt} />
                        </ParaText>
                    </div>
                    <div className='tableCommn'>
                        {!folder &&
                            <>
                                <ParaText size='textGraf' color='black' fontWeightBold={600}>
                                    File Format :
                                </ParaText>
                                <ParaText size='textGraf' color='black'> <b><GetFileTypeName fileType={fileDetails?.fileType} /></b>  </ParaText>
                                <Divider />
                            </>
                        }

                        {fileDetails?.description || folder?.description &&
                            <>
                                <ParaText size='textGraf' color='black' fontWeightBold={600} className='dBlock'>{folder ? folder.description : 'File Description'} :</ParaText>
                                <ParaText size='smallExtra' color='black'>{folder ? folder.description : fileDetails?.description}</ParaText>
                                <Divider />
                            </>
                        }
                        <ParaText size='textGraf' color='black' fontWeightBold={600} className='dBlock'>{folder ? 'Folder Location' : 'File Location'} :
                        </ParaText>
                        <ParaText size='smallExtra' color='black'>{folder ? folder.folderPath : fileDetails?.filePath}</ParaText>
                        <Divider />
                        <ParaText size='textGraf' color='black' fontWeightBold={600} className='dBlock'>Contributors :</ParaText>
                        {contributors.length > 0 ?
                            contributors.map((contributor: any, index: any) => {
                                return (
                                    <div key={index} className='flexBar' style={{ justifyContent: 'space-between' }}>
                                        <div className='flexBar'>
                                            <div> {contributor?.image ?
                                                <Image src={`${process.env['NEXT_PUBLIC_IMAGE_URL']}/userImage/original/${contributor?.image}`} className='profilePicRadius' preview={false} alt='Avatar' width={40} height={40} />
                                                :
                                                <Avatar size={40} icon={<UserOutlined />} />
                                            }
                                            </div>
                                            <div>  <ParaText size='smallExtra' color='black' fontWeightBold={600}>{contributor?.name}</ParaText></div>
                                        </div>
                                        <div> <ParaText size='minSmall' color='black' > <span className='badge'><DateFormat date={contributor?.createdAt} /></span> </ParaText></div>
                                    </div>
                                )
                            })
                            :
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
                        }
                    </div>
                </div>
            </div>
        </>
    )
}
