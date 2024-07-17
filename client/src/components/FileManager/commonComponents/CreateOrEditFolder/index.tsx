import { Button, Modal } from "antd";
import { useEffect, useState } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import FormModal from "../FormModal";

interface props {
    folderRename: any;
    action: any;
    getFolderData: any;
    setFolderRename: any;
    // getFolderData: any;
    currentInnerFolderId: any
}

export default function CreateOrEditFolder({ folderRename, action, setFolderRename, getFolderData, currentInnerFolderId }: props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    useEffect(() => {
        if (action === "rename" && folderRename) {
            setIsModalOpen(true);
        }

    }, [action, folderRename]);


    const modelOpen = () => {
        setIsModalOpen(true);
    }

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setFolderRename(undefined);
        getFolderData()
    };

    return (
        <>
            <Button icon={<AiOutlinePlusCircle className="colorWhite" />} style={{ background: '#845adf', display: 'flex', alignItems: 'center', borderRadius: '30px' }} type='primary' onClick={modelOpen}>
                Create Folder
            </Button>
            <Modal
                title={folderRename ? "Rename Folder" : "Create Folder"}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                width={500}
            >
                <FormModal
                    folderRename={folderRename} onClose={handleCancel} currentInnerFolderId={currentInnerFolderId}
                />
            </Modal>
        </>
    )
}
