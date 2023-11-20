import React, { useState } from "react";
import {
  Box, Flex, HStack, Text, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Button, Link
} from "@chakra-ui/react";
import axios from "axios";
import { apiUrl, Service } from "@hex-labs/core";

const UserModal: React.FC<{ user: any; isOpen: boolean; onClose: () => void; }> = ({ user, isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>User Information</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>Name: {`${user.name.first} ${user.name.last}`}</Text>
          <Text>Email: <Link href={`mailto:${user.email}`}>{user.email}</Link></Text>
          <Text>Phone Number: {user.phoneNumber}</Text>
          <Text>User ID: {user.userId}</Text>
          <Text>Resume: <Link href={apiUrl(Service.FILES, `/files/${user.resume}/view`)} isExternal>View Resume</Link></Text>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

const HexathonModal: React.FC<{ user: any; isOpen: boolean; onClose: () => void; hexathons: any[]; }> = ({ user, isOpen, onClose, hexathons }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{`${user.name.first} ${user.name.last}`}'s Hexathons</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {hexathons.map((hexathon: any) => {
                    return (
                        <Text>{hexathon.name}</Text>
                    )
                })}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

const UserCard: React.FC<{ user: any; }> = ({ user }) => {
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isHexathonModalOpen, setIsHexathonModalOpen] = useState(false);
  const [hexathons, setHexathons] = useState<any[]>([]);

  const handleUserModalToggle = () => setIsUserModalOpen(!isUserModalOpen);
  const handleHexathonModalToggle = () => setIsHexathonModalOpen(!isHexathonModalOpen);

  const handleViewHexathons = async (userId: String) => {
    const hexathonsUrl = apiUrl(Service.HEXATHONS, "/hexathons");
    const response = await axios.get(hexathonsUrl);
    const hexathons = response.data;

    const currentHexathons: any[] = [];

    hexathons.forEach(async (hexathon: { id: String }) => {
      const url = apiUrl(Service.HEXATHONS, `hexathon-users/${hexathon.id}/users`);
      const user_response = await axios.get(url);
      if (user_response.data) {
        currentHexathons.push(
          hexathons.find((hex: { id: String }) => hex.id === hexathon.id)
        );
      }
      setHexathons(currentHexathons);
    });
  };
  // useEffect to retrieve appliedHexathons
  React.useEffect(() => {
    handleViewHexathons(user.userId);
  }, []);

  return (
    <>
      <Box
        borderWidth="1px"
        rounded="lg"
        boxShadow="lg"
        height="175px"
        fontWeight="bold"
        alignItems="center"
        cursor="pointer"
      >
        <Button onClick={handleHexathonModalToggle}>View Hexathons</Button>
        <Flex padding="2" flexDirection="column" onClick={handleUserModalToggle}>
          <HStack align="flex-end" justify="space-between">
            <Text fontSize='xl'>{`${user.name.first} ${user.name.last}`}</Text>
          </HStack>
          <Text color="blue" fontSize="sm" fontWeight="semibold" mt="2">
            <Link href={`mailto:${user.email}`}>{user.email}</Link>
          </Text>
        </Flex>

      </Box>

      <UserModal user={user} isOpen={isUserModalOpen} onClose={handleUserModalToggle} />
      <HexathonModal user = {user} isOpen={isHexathonModalOpen} onClose={handleHexathonModalToggle} hexathons={hexathons} />
    </>
  );
};

export default UserCard;