import React, { useState } from 'react';
import {
  Box,
  Flex,
  Stack,
  Avatar,
  Text,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Link,
  Button,
  Badge
} from "@chakra-ui/react";
import { EmailIcon, PhoneIcon } from '@chakra-ui/icons';
import axios from 'axios';

type Props = {
  user: any;
};


const UserCard: React.FC<Props> = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hexathons, setHexathons] = useState<any[]>([]);
  const cardBackground = useColorModeValue('gray.100', 'gray.200');

  const handleOpenModal = () => {
    setIsOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsOpen(false);
  }

  const handleClickonEmail = () => {
    window.open(`mailto:${props.user.email}`);
  }

  const handleViewHexathons = async () => {
    try {
      const response = await axios.get(`/api/applications?userId=${props.user.userId}`);
      const applications = response.data.data;
      const hexathonIds = applications.map((application: any) => application.hexathonId);
      const hexathonsResponse = await axios.get(`/api/hexathons?ids=${hexathonIds.join(",")}`);
      const userHexathons = hexathonsResponse.data.data;
      setHexathons(userHexathons);
    } catch (error) {
      console.error("Error fetching user hexathons:", error);
    }
  };

  return (
    <>
      <Box
        bg={cardBackground}
        maxW="sm"
        borderWidth="1px"
        borderColor="gray.300"
        shadow="md"
        borderRadius="lg"
        overflow="hidden"
        position="relative"
        _hover={{ shadow: "xl" }}
        onClick={handleOpenModal}
        cursor="pointer"
        p={5}
      >
        <Flex align="center" mb={4}>
          <Stack spacing={1} flex={1}>
            <Text 
             fontWeight="bold"
             fontSize="lg"
             bgGradient="linear(to-r, teal.500, blue.500)"
             bgClip= "text" 
            >
              {`${props.user.name.first} ${props.user.name.last}`}
            </Text>
          </Stack>
          
        </Flex>
        <Stack spacing={2}>
          <Flex align="center">
                <EmailIcon mr={2} color="blue.400" />
                <Text fontSize="sm">{props.user.email}</Text>
              </Flex>

          <Flex align="center">
            <PhoneIcon mr={2} color="orange.400" />
            <Text fontSize="sm">{props.user.phoneNumber}</Text>
          </Flex>

          <Flex justify="center">
            <Badge px={2} py={1} colorScheme="green">
              {props.user.status || 'Active'}
            </Badge>
          </Flex>
        </Stack>
      </Box>


  <Modal isOpen={isOpen} onClose={handleCloseModal} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>User Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontSize="x1" mb="2">{`${props.user.name.first} ${props.user.name.last}`}</Text>
            <Text fontSize="sm" fontWeight="semibold" mb="2">
              <Link color="blue.500" textDecoration="underline" onClick={() => handleClickonEmail()}>
                {props.user.email}
              </Link>
            </Text>
            <Text fontSize="sm" fontWeight="semibold">{props.user.phoneNumber}</Text>
            <Text fontSize="sm" fontWeight="semibold">{`User ID: ${props.user.userId}`}</Text>
            {props.user.resume && (
              <>
                <Text fontSize="sm" fontWeight="semibold" mt="2">
                  <Link
                    color="blue.500"
                    textDecoration="underline"
                  >
                    View Resume
                  </Link>
                </Text>
                <Button mt="4" colorScheme="blue" onClick={handleViewHexathons}>
                  View Applied Hexathons
                </Button>
              </>
            )}
            {hexathons.length > 0 && (
              <>
                <Text fontSize="lg" fontWeight="bold" mt="4">
                  Applied Hexathons:
                </Text>
                {hexathons.map((hexathon: any) => (
                  <Text key={hexathon.Id} fontSize="sm">
                    {hexathon.name}
                  </Text>
                ))}
              </>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
export default UserCard;