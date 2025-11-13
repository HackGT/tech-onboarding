import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  Text,
  Spinner,
  Box,
  Stack,
} from "@chakra-ui/react";
import axios from "axios";
import { apiUrl, Service } from "@hex-labs/core";

interface UserAppliedProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
}

interface Hexathon {
  _id: string;
  name: string;
  startDate?: string;
  endDate?: string;
}

const UserApplied: React.FC<UserAppliedProps> = ({ isOpen, onClose, userId }) => {
  const [hexathons, setHexathons] = useState<Hexathon[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !userId) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const applicationsUrl = apiUrl(Service.REGISTRATION, "applications");
        const { data: applicationsResponse } = await axios.get(applicationsUrl, {
          params: { userId },
        });

        const applications = applicationsResponse.applications || [];
        const hexathonIds = applications.map((a: any) => a.hexathon);

        const hexathonsUrl = apiUrl(Service.HEXATHONS, "hexathons");
        const { data: allHexathons } = await axios.get(hexathonsUrl);

        const applied = allHexathons.filter((h: any) =>
          hexathonIds.includes(h._id)
        );

        setHexathons(applied);
      } catch (err) {
        console.error(err);
        setError("Failed to load applications.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isOpen, userId]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Applications</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {loading ? (
            <Spinner />
          ) : error ? (
            <Text color="red.500">{error}</Text>
          ) : hexathons.length === 0 ? (
            <Text>No applications found.</Text>
          ) : (
            <Stack spacing={3}>
              {hexathons.map((hex) => (
                <Box
                  key={hex._id}
                  borderWidth="1px"
                  borderRadius="md"
                  p={3}
                  boxShadow="sm"
                >
                  <Text fontWeight="bold">{hex.name}</Text>
                  {hex.startDate && hex.endDate && (
                    <Text fontSize="sm" color="gray.500">
                      {new Date(hex.startDate).toLocaleDateString()} -{" "}
                      {new Date(hex.endDate).toLocaleDateString()}
                    </Text>
                  )}
                </Box>
              ))}
            </Stack>
          )}
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UserApplied;
