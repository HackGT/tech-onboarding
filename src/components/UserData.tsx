import React, { useEffect, useState } from "react";
import axios from "axios";
import { SimpleGrid, Text, Button, Container, Heading, VStack } from "@chakra-ui/react";
import { apiUrl, Service } from "@hex-labs/core";
import UserCard from "./UserCard";

const UserData = () => {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const url = apiUrl(Service.USERS, '/users/hexlabs');
        const response = await axios.get(url);
        setUsers(response?.data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    document.title = "Hexlabs Users";
    getUsers();
  }, []);

  const sortUsersByFirstName = () => {
    const sortedUsers = [...users].sort((a, b) => {
      const aName = a.name.first.toLowerCase();
      const bName = b.name.first.toLowerCase();
      if (aName < bName) return -1;
      if (aName > bName) return 1;
      return 0;
    });
    setUsers(sortedUsers);
  };

  return (
    <Container maxW="container.xl" centerContent p={8}>
      <VStack spacing={8} align="stretch">
        <Heading as="h1" size="2xl" textAlign="center">Hexlabs Users</Heading>
        <Text fontSize="xl" textAlign="center">
        </Text>

        <Button colorScheme="blue" onClick={sortUsersByFirstName}>
          Sort Users By First Name
        </Button>

        <SimpleGrid columns={[1, 2, 3, 4]} spacing={4} w= "full" >
          {users.map((user) => (
            <UserCard key={user.userId} user={user} />
          ))}
        </SimpleGrid>
      </VStack>
    </Container>
  );
};

export default UserData;
