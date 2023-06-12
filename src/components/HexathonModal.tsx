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
  
  type HexModalProps = {
      user: any;
      isOpen: boolean;
      onClose: () => void;
  };
  
  const HexathonModal: React.FC<HexModalProps> = ({ user, isOpen, onClose,}) => {

      const currUser = user;
      console.log(`current userId: ${currUser.userId}`);

      return (
        <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader><Text fontSize='xl'>{`${user.name.first} ${user.name.last}'s Hexathons`}</Text></ModalHeader>
          <ModalCloseButton />
          <ModalBody>
              {/* add list of hexathons */}
              Hi
          </ModalBody>
        </ModalContent>
        </Modal>
      )
  }
  
  export default HexathonModal;