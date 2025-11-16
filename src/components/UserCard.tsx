import {
  Box,
  Button,
  Flex,
  HStack,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { apiUrl, Service } from "@hex-labs/core";
import axios from "axios";
import React, { useState } from "react";

type Props = {
  user: any;
};

const UserModal: React.FC<{
  user: any;
  isOpen: boolean;
  onClose: () => void;
}> = ({ user, isOpen, onClose }) => {
  const [hexathons, setHexathons] = useState<any[]>([]);
  const [loadingHexathons, setLoadingHexathons] = useState(false);
  const [hexathonError, setHexathonError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  const emailHref = user?.email ? `mailto:${user.email}` : undefined;
  const resumeHref =
    user?.resumeUrl || user?.resumeLink || user?.resume?.url || user?.resume;

  const fetchHexathons = async () => {
    if (loadingHexathons) return;

    setLoadingHexathons(true);
    setHexathonError(null);
    setHasFetched(true);

    try {
      const userId = user?.userId ?? user?.id ?? user?._id;

      const applicationsResp = await axios.get(
        apiUrl(Service.REGISTRATION, "/applications"),
        {
          params: {
            userId,         
            hexathon: "hexlabs", 
          },
        }
      );

      console.log("applicationsResp.data =", applicationsResp.data);

      const applications: any[] = applicationsResp?.data ?? [];
      const hexathonIds: string[] = applications
        .map(
          (app: any) =>
            app?.hexathon ?? app?.hexathonId ?? app?.hexathonID
        )
        .filter(Boolean);

      if (hexathonIds.length === 0) {
        setHexathons([]);
        return;
      }
      const hexathonsResp = await axios.get(
        apiUrl(Service.HEXATHONS, "/hexathons")
      );
      const allHexathons: any[] = hexathonsResp?.data ?? [];

      const matchedHexathons = allHexathons.filter(
        (hex: any) =>
          hexathonIds.includes(hex?.id) || hexathonIds.includes(hex?._id)
      );

      setHexathons(matchedHexathons);
    } catch (error) {
      console.error("Error while fetching hexathons:", error);
      setHexathonError("Failed to load hexathons for this user.");
    } finally {
      setLoadingHexathons(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {`${user?.name?.first ?? ""} ${user?.name?.last ?? ""}`}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={2}>
            <Text>
              <strong>User ID:</strong> {user?.userId ?? "Unknown"}
            </Text>

            <Text>
              <strong>Email:</strong>{" "}
              {emailHref ? (
                <Link href={emailHref} color="blue.500">
                  {user.email}
                </Link>
              ) : (
                "Not provided"
              )}
            </Text>

            <Text>
              <strong>Phone:</strong>{" "}
              {user?.phoneNumber ?? "Not provided"}
            </Text>

            {resumeHref ? (
              <Text>
                <strong>Resume:</strong>{" "}
                <Link href={resumeHref} color="blue.500" isExternal>
                  View Resume
                </Link>
              </Text>
            ) : null}

            <Button
              colorScheme="blue"
              alignSelf="flex-start"
              onClick={fetchHexathons}
              isLoading={loadingHexathons}
              loadingText="Loading hexathons"
              size="sm"
            >
              View Applied Hexathons
            </Button>

            {hexathonError ? (
              <Text color="red.500" fontSize="sm">
                {hexathonError}
              </Text>
            ) : null}

            {loadingHexathons ? (
              <HStack spacing={2}>
                <Spinner size="sm" />
                <Text fontSize="sm">Fetching applications...</Text>
              </HStack>
            ) : null}

            {!loadingHexathons && hasFetched && !hexathonError ? (
              hexathons.length > 0 ? (
                <Stack spacing={1}>
                  <Text fontWeight="bold">Hexathons:</Text>
                  {hexathons.map((hex) => (
                    <Text key={hex?.id ?? hex?._id} fontSize="sm">
                      {hex?.name ?? hex?.id ?? hex?._id}
                    </Text>
                  ))}
                </Stack>
              ) : (
                <Text fontSize="sm" color="gray.600">
                  No applications found for this user.
                </Text>
              )
            ) : null}
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const UserCard: React.FC<Props> = (props: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box
      borderWidth="1px"
      rounded="lg"
      boxShadow="lg"
      height="175px"
      fontWeight="bold"
      alignItems="center"
      cursor="pointer"
      onClick={onOpen}
    >
      <Flex padding="2" flexDirection="column">
        <HStack align="flex-end" justify="space-between">
          <Text fontSize="xl">
            {`${props.user.name.first} ${props.user.name.last}`}
          </Text>
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

      <UserModal user={props.user} isOpen={isOpen} onClose={onClose} />
    </Box>
  );
};

export default UserCard;