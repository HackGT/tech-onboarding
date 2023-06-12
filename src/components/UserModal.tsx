import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Text,
  Link
} from "@chakra-ui/react";
import React from "react";
import UserEmail from "./UserEmail";
import UserResume from "./UserResume";

type ModalProps = {
    user: any;
    isOpen: boolean;
    onClose: () => void;
    // resumeUrl: string;
};

const UserModal: React.FC<ModalProps> = ({ user, isOpen, onClose,}) => {
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader><Text fontSize='xl'>{`${user.name.first} ${user.name.last}`}</Text></ModalHeader>
        <ModalCloseButton />
        <ModalBody>
            <UserEmail user={user} />
            <Text fontSize='l'>{`Phone: ${user.phoneNumber}`}</Text>
            <Text fontSize='l'>{`UserID: ${user.userId}`}</Text>
            {/* <Link href={resumeUrl} isExternal>
                Resume
            </Link> */}
            {/* <UserResume user={user}></UserResume> */}
        </ModalBody>
      </ModalContent>
      </Modal>
    )
}

export default UserModal;