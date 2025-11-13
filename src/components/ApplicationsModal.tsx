import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Box,
  Text,
} from "@chakra-ui/react";

import axios from "axios";
import { useState, useEffect } from "react";

import { apiUrl } from "@hex-labs/core";
import { Service } from "@hex-labs/core";

type UserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  user: any;
};

const ApplicationsModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  const [hexathons, setHexathons] = useState<any[]>([]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const loadApps = async () => {
      let URL = apiUrl(Service.HEXATHONS, "/hexathons");
      const { data } = await axios.get(URL);

      const applications = await Promise.all(
        data.map(async (hexathon: any) => {
          const res = await axios.get(
            apiUrl(Service.REGISTRATION, "/applications"),
            {
              params: {
                hexathon: hexathon.id,
                userId: user.userId,
              },
            },
          );
          if (res.data.applications.length > 0) {
            return hexathon.name;
          } else {
            return null;
          }
        }),
      );
      const filteredHexathons = applications.filter(
        (hexathon) => hexathon !== null,
      );
      setHexathons(filteredHexathons);
      console.log(user.userId);
    };
    loadApps();
  }, [isOpen, user?.userId]);
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Applications</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box>
            <b>Applied Hexathons: </b>
            {hexathons.length > 0 ? (
              <Box>
                {hexathons.map((hexathon) => (
                  <Text key={hexathon}>{hexathon}</Text>
                ))}
              </Box>
            ) : (
              <Text>No hexathons applied</Text>
            )}
          </Box>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ApplicationsModal;
