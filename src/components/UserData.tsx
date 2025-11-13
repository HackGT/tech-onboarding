import React, { useEffect, useState } from "react";
import { apiUrl, Service } from "@hex-labs/core";
import {
  Button,
  SimpleGrid,
  Text,
  useDisclosure,
  Box,
} from "@chakra-ui/react";
import axios from "axios";
import UserCard from "./UserCard";
import UserModal from "./UserModal";

enum SortBy {
  FIRST = "first",
  LAST = "last",
}

interface User {
  userId: string;
  name: {
    first: string;
    last: string;
  };
  email: string;
  phoneNumber?: string;
}

const UserData: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [modalUser, setModalUser] = useState<User | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const getUsers = async () => {
      const URL = apiUrl(Service.USERS, "users/hexlabs");
      const { data } = await axios.get(URL);
      setUsers(data);
    };
    document.title = "Hexlabs Users";
    getUsers();
  }, []);

  const openUserModal = (user: User) => {
    setModalUser(user);
    onOpen();
  };

  const sortByName = (field: SortBy) => {
    const sortedUsers = [...users].sort((a, b) => {
      const valA = a.name?.[field]?.toLowerCase() || "";
      const valB = b.name?.[field]?.toLowerCase() || "";
      return valA.localeCompare(valB);
    });
    setUsers(sortedUsers);
  };

  return (
    <>
      <Text fontSize="4xl">Hexlabs Users</Text>
      <Text fontSize="2xl" mb={4}>
        This page fetches user data from the Hexlabs API.
      </Text>
      <Button colorScheme="blue" mr={2} onClick={() => sortByName(SortBy.FIRST)}>
        Sort by first name
      </Button>
      <Button colorScheme="blue" onClick={() => sortByName(SortBy.LAST)}>
        Sort by last name
      </Button>

      <SimpleGrid columns={[2, 3, 5]} spacing={6} padding={10}>
        {users.map((user) => (
          <Box key={user.userId} onClick={() => openUserModal(user)}>
            <UserCard user={user} />
          </Box>
        ))}
      </SimpleGrid>

      <UserModal isOpen={isOpen} onClose={onClose} user={modalUser} />
    </>
  );
};

export default UserData;
