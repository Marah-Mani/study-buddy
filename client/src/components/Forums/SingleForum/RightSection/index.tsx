import React, { useContext, useEffect, useState } from 'react';
import { Avatar, Card, Col, Divider, Image, Input, MenuProps, Row } from 'antd';
import { Menu } from 'antd';
import { getRelatedForums } from '@/lib/frontendApi';
import ParaText from '@/app/commonUl/ParaText';
import { UserOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { getForumCategories } from '@/lib/commonApi';
import './style.css'
import { usePathname } from 'next/navigation'
import AuthContext from '@/contexts/AuthContext';

interface Props {
    categoryId: string;
    onCallBack?: any;
    onSearch?: any;
}
interface Category {
    _id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface SubCategory {
    _id: string;
    name: string;
    description: string;
    categoryId: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface MenuItem {
    key: string;
    label: string;
    children?: MenuItem[];
}


export default function RightSection({ categoryId, onCallBack, onSearch }: Props) {
    const [stateOpenKeys, setStateOpenKeys] = useState(['2', '23']);
    const [relatedData, setRelatedData] = useState<any>([]);
    const [categories, setCategories] = useState<any>([]);
    const pathname = usePathname()
    const { user } = useContext(AuthContext)
    const targetUrl = '/en/user/forums';
    const isTargetMatched = pathname === targetUrl;

    useEffect(() => {
        getRelatedForums(categoryId ? categoryId : 'empty').then((res: any) => {
            setRelatedData(res.data);
        });
        getForumCategories().then((res: any) => {
            setCategories(res.data);
        })
    }, [categoryId]);

    const handleItem = (data: any) => {
        onCallBack(data);
    };

    const items: MenuItem[] = categories.categories?.slice(0, 4).map((category: Category) => {
        const subCategories = categories.subCategories.filter((subCategory: SubCategory) => subCategory.categoryId === category._id);
        return {
            key: category._id,
            label: category.name,
            children: subCategories.slice(0, 5).map((subCategory: any) => ({
                key: subCategory._id,
                label: subCategory.name,
                onClick: () => handleItem(subCategory),
            })),
        };
    })

    const getLevelKeys = (items1: MenuItem[]) => {
        const key: Record<string, number> = {};
        const func = (items2: MenuItem[], level = 1) => {
            items2?.forEach((item) => {
                if (item?.key) {
                    key[item.key] = level;
                }
                if (item?.children) {
                    func(item.children, level + 1);
                }
            });
        };
        func(items1);
        return key;
    };


    const levelKeys: any = getLevelKeys(items);


    const onOpenChange: MenuProps['onOpenChange'] = (openKeys) => {
        const currentOpenKey = openKeys.find((key) => stateOpenKeys.indexOf(key) === -1);
        // open
        if (currentOpenKey !== undefined) {
            const repeatIndex = openKeys
                .filter((key) => key !== currentOpenKey)
                .findIndex((key) => levelKeys[key] === levelKeys[currentOpenKey]);

            setStateOpenKeys(
                openKeys
                    // remove repeat key
                    .filter((_, index) => index !== repeatIndex)
                    // remove current level all child
                    .filter((key: any) => levelKeys[key] <= levelKeys[currentOpenKey]),
            );
        } else {
            // close
            setStateOpenKeys(openKeys);
        }
    };



    return (
        <>
            <div id='rightSectionForm'>
                {isTargetMatched ? <Card color='#ccc'>
                    {!categoryId &&
                        <>
                            <Input placeholder='Search here...' onChange={(e: any) => { onSearch(e.target.value) }} maxLength={50}
                            />
                            <div className="smallTopMargin"></div>
                            <ParaText size="small" fontWeightBold={600} color="primaryColor">
                                Categories
                            </ParaText>
                            <div className="smallTopMargin"></div>
                            <div className='categoriesMenu'>
                                <Menu
                                    mode="inline"
                                    defaultSelectedKeys={['231']}
                                    openKeys={stateOpenKeys}
                                    onOpenChange={onOpenChange}
                                    items={items}
                                />
                            </div>
                            <Divider />
                        </>}
                    {relatedData.relatedForums?.length > 0 && categoryId &&
                        <>
                            <ParaText size="small" fontWeightBold={600} color="primaryColor">
                                Related Forums
                            </ParaText>
                            <div className="smallTopMargin"></div>
                            <div>
                                <Row gutter={[5, 5]}>
                                    {relatedData.relatedForums?.map((data: any) => {
                                        return (
                                            <>
                                                <Col md={3}>
                                                    {data.attachment ?
                                                        <Image
                                                            src={`${process.env['NEXT_PUBLIC_IMAGE_URL']}/forumImages/original/${data.attachment}`}
                                                            alt="Avatar"
                                                            width="40px"
                                                            height="40px"
                                                            style={{ borderRadius: '50px' }}
                                                            preview={false}
                                                        />
                                                        :
                                                        <Avatar size={40} icon={<UserOutlined />} />
                                                    }
                                                </Col>
                                                <Col md={21}>
                                                    <ParaText size="extraSmall" fontWeightBold={600} color="primaryColor">
                                                        <Link target={'blank'} href={`${process.env.NEXT_PUBLIC_SITE_URL}/admin/questions/${data.slug}`} >
                                                            {data.title.length > 65 ? `${data.title.slice(0, 65)}...` : data.title}
                                                        </Link>
                                                    </ParaText>
                                                    <div className='smallTopMargin'></div>
                                                </Col>
                                            </>
                                        )
                                    })}
                                </Row>
                            </div>
                            <Divider />
                        </>
                    }
                    {relatedData.others?.length > 0 &&
                        <>
                            <ParaText size="small" fontWeightBold={600} color="primaryColor">
                                Other Forums
                            </ParaText>
                            <div className="smallTopMargin"></div>
                            <div>
                                <Row gutter={[5, 5]}>
                                    {relatedData.others?.map((data: any) => {
                                        return (
                                            <>
                                                <Col md={3}>
                                                    {data.attachment ?
                                                        <Image
                                                            src={`${process.env['NEXT_PUBLIC_IMAGE_URL']}/forumImages/original/${data.attachment}`}
                                                            alt="Avatar"
                                                            width="40px"
                                                            height="40px"
                                                            style={{ borderRadius: '50px' }}
                                                            preview={false}
                                                        />
                                                        :
                                                        <Avatar size={40} icon={<UserOutlined />} />
                                                    }
                                                </Col>
                                                <Col md={21}>
                                                    <ParaText size="extraSmall" fontWeightBold={600} color="primaryColor">
                                                        <Link target={'blank'} href={`${process.env.NEXT_PUBLIC_SITE_URL}/${user?.role}/questions/${data.slug}`} >
                                                            {data.title.length > 65 ? `${data.title.slice(0, 65)}...` : data.title}
                                                        </Link>
                                                    </ParaText>
                                                </Col>
                                                <div className='smallTopMargin'></div>
                                            </>
                                        )
                                    })}
                                </Row>
                            </div>
                        </>
                    }
                </Card> : ""}
            </div>
        </>

    );
};


