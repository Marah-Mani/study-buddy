import React, { useContext, useEffect, useMemo, useState } from 'react';
import { HolderOutlined } from '@ant-design/icons';
import type { DragEndEvent } from '@dnd-kit/core';
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { DndContext } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button, message, Popconfirm, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import ErrorHandler from '@/lib/ErrorHandler';
import { deleteHeaderMenu, getHeaderMenus, updateOrderOfMenu } from '@/lib/adminApi';
import { FaEdit, FaTrash } from 'react-icons/fa';

interface Props {
    activeKey: string;
    reload: any,
    onEdit: any
}

// Data type definition
interface DataType {
    key: string;
    title: string;
    link: string;
    action: any
}

// Context definition
interface RowContextProps {
    setActivatorNodeRef?: (element: HTMLElement | null) => void;
    listeners?: SyntheticListenerMap;
}

// Row component with sortable functionality
interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
    'data-row-key': string;
}

const RowContext = React.createContext<RowContextProps>({});

export default function HeaderData({ activeKey, reload, onEdit }: Props) {
    const DragHandle: React.FC = () => {
        const { setActivatorNodeRef, listeners } = useContext(RowContext);
        return (
            <Button
                type="text"
                size="small"
                icon={<HolderOutlined />}
                style={{ cursor: 'move' }}
                ref={setActivatorNodeRef}
                {...listeners}
            />
        );
    };

    // Table columns definition
    const columns: ColumnsType<DataType> = [
        { key: 'sort', align: 'center', width: 80, render: () => <DragHandle /> },
        { title: 'Title', dataIndex: 'title' },
        { title: 'Link', dataIndex: 'link' },
        { title: 'Action', dataIndex: 'action' }
    ];

    const Row: React.FC<RowProps> = (props) => {
        const {
            attributes,
            listeners,
            setNodeRef,
            setActivatorNodeRef,
            transform,
            transition,
            isDragging,
        } = useSortable({ id: props['data-row-key'] });

        const style: React.CSSProperties = {
            ...props.style,
            transform: CSS.Translate.toString(transform),
            transition,
            ...(isDragging ? { position: 'relative', zIndex: 9999 } : {}),
        };

        const contextValue = useMemo<any>(
            () => ({ setActivatorNodeRef, listeners }),
            [setActivatorNodeRef, listeners],
        );

        return (
            <RowContext.Provider value={contextValue}>
                <tr {...props} ref={setNodeRef} style={style} {...attributes} />
            </RowContext.Provider>
        );
    };

    const [dataSource, setDataSource] = useState<DataType[]>([]);

    useEffect(() => {
        fetchData();
    }, [activeKey, reload]);

    const handleDelete = async (item: any) => {
        try {
            const res = await deleteHeaderMenu({ menuId: item._id });
            if (res.status === true) {
                message.success(res.message);
                fetchData();
            }
        } catch (error) {
            ErrorHandler.showNotification(error);
        }
    };

    const fetchData = async () => {
        try {
            const res = await getHeaderMenus();
            if (res.status === true) {
                const formattedData = res.data.map((item: any) => ({
                    key: item._id,
                    title: item.title,
                    link: item.link,
                    action: (
                        <>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <div>
                                    <Button type='text' ghost onClick={() => onEdit(item)}><FaEdit /></Button>
                                </div>
                                <div>
                                    <Popconfirm
                                        title="Are you sure you want to delete this menu?"
                                        onConfirm={() => { handleDelete(item) }}
                                        okText="Yes"
                                        cancelText="No"
                                    >
                                        <Button
                                            danger
                                            ghost
                                        >
                                            <FaTrash />
                                        </Button>
                                    </Popconfirm>
                                </div>
                            </div>
                        </>
                    )
                }));
                setDataSource(formattedData);
            }
        } catch (error) {
            ErrorHandler.showNotification(error);
        }
    };

    const onDragEnd = async ({ active, over }: DragEndEvent) => {
        if (active.id !== over?.id) {
            try {
                const items = [...dataSource];
                const activeIndex = dataSource.findIndex((record) => record.key === active.id);
                const overIndex = dataSource.findIndex((record) => record.key === over?.id);

                // Remove the dragged item from its original position
                const [draggedItem]: any = items.splice(activeIndex, 1);

                // Insert the dragged item into the new position
                items.splice(overIndex, 0, draggedItem);

                // Update the order of items
                const updatedItems = items.map((item, index) => ({
                    ...item,
                    order: index + 1,
                }));

                setDataSource(updatedItems);

                await updateOrderOfMenu(updatedItems);
            } catch (error) {
                ErrorHandler.showNotification(error);
            }
        }
    };


    return (
        <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
            <SortableContext items={dataSource.map((item) => item.key)} strategy={verticalListSortingStrategy}>
                <Table
                    rowKey="key"
                    components={{ body: { row: Row } }}
                    columns={columns}
                    dataSource={dataSource}
                />
            </SortableContext>
        </DndContext>
    );
}
