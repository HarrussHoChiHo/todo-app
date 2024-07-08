import {Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure} from "@nextui-org/react";
import React from "react";

interface ModalProps {
    isOpen: boolean; 
    onOpen: () => void; 
    onOpenChange: () => void;
    onClose: () => void;
    children: React.ReactNode;
}

const Modals = ({
                    isOpen,
                    onOpenChange,
                    onClose,
                    children
                }: ModalProps) => {
    
    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen}
               onOpenChange={onOpenChange}
               onClose={onClose}
        >
            <ModalContent>
                {(
                    <>
                        <ModalHeader className="flex flex-col gap-1">Edit</ModalHeader>
                        <ModalBody>
                            {children}
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger"
                                    variant="light"
                                    onPress={onClose}>
                                Close
                            </Button>
                            <Button color="primary"
                                    onPress={onClose}>
                                Action
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}

export default Modal;