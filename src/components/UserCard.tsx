import {
  Box,
  Flex,
  HStack,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Link,
  Button,
  VStack,
  Spinner,
} from "@chakra-ui/react";
import React, { useState } from "react";
import axios from "axios";
import { apiUrl, Service } from "@hex-labs/core";

type Props = {
  user: any;
};

const UserCard: React.FC<Props> = (props: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [hexathons, setHexathons] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchHexathons = async () => {
    setLoading(true);
    try {
      const applicationsResponse = await axios.get(
        apiUrl(Service.REGISTRATION, '/applications'),
        {
          params: {
            filter: {
              userId: props.user.userId
            }
          }
        }
      );

      const hexathonIds = applicationsResponse.data.applications.map(
        (app: any) => app.hexathonId
      );

      const hexathonsResponse = await axios.get(
        apiUrl(Service.HEXATHONS, '/hexathons'),
        {
          params: {
            filter: {
              _id: { $in: hexathonIds }
            }
          }
        }
      );

      setHexathons(hexathonsResponse.data.hexathons);
    } catch (error) {
      console.error('Error fetching hexathons:', error);
    }
    setLoading(false);
  };

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
        onClick={onOpen}
        transition="transform 0.2s"
        _hover={{ transform: 'scale(1.02)' }}
      >
        <Flex padding="2" flexDirection="column">
          <HStack align="flex-end" justify="space-between">
            <Text fontSize='xl'>{`${props.user.name.first} ${props.user.name.last}`}</Text>
          </HStack>
          <Text
            fontSize="sm"
            fontWeight="semibold"
            justifyContent="justify"
            mt="2"
          >
            {props.user.email}
          </Text>
        </Flex>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>User Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack align="start" spacing={3}>
              <Text><strong>Name:</strong> {props.user.name.first} {props.user.name.last}</Text>
              <Text>
                <strong>Email:</strong>{' '}
                <Link href={`mailto:${props.user.email}`} color="blue.500">
                  {props.user.email}
                </Link>
              </Text>
              <Text><strong>Phone:</strong> {props.user.phoneNumber}</Text>
              {props.user.resume && (
                <Link href={props.user.resume} color="blue.500" isExternal>
                  View Resume
                </Link>
              )}
              
              <Button colorScheme="blue" onClick={fetchHexathons} mt={4}>
                View Hexathons
              </Button>

              {loading ? (
                <Spinner />
              ) : (
                hexathons.length > 0 && (
                  <VStack align="start" spacing={2}>
                    <Text fontWeight="bold">Applied Hexathons:</Text>
                    {hexathons.map((hexathon) => (
                      <Text key={hexathon._id}>{hexathon.name}</Text>
                    ))}
                  </VStack>
                )
              )}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UserCard;