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
import { apiUrl, Service } from "@hex-labs/core";
import axios from "axios";
import React from "react";
  
  type HexModalProps = {
      user: any;
      isOpen: boolean;
      onClose: () => void;
      applied: string[];
  };
  
  const HexathonModal: React.FC<HexModalProps> = ({ user, isOpen, onClose, applied}) => {
      return (
        <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader><Text fontSize='xl'>{`${user.name.first} ${user.name.last}'s Hexathons`}</Text></ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          <Text fontSize='xl'>Applied Hexathons</Text>
            <ul>
              {applied.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </ModalBody>
        </ModalContent>
        </Modal>
      )
  }
  
  export default HexathonModal;