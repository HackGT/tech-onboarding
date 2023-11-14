import React, { useEffect, useState } from "react";
import { apiUrl, Service } from "@hex-labs/core";
import { SimpleGrid, Text, Button } from "@chakra-ui/react";
import axios from "axios";
import UserCard from "./UserCard";

// Function to shuffle the array
const shuffleArray = (array: any[]) => {
  let shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

const UserData: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);

  const getUsers = async () => {
    try {
      const url = apiUrl(Service.USERS, '/users/hexlabs');
      const response = await axios.get(url);
      const filteredUsers = response.data.filter((user: any) =>
        typeof user.phoneNumber === 'string' && user.phoneNumber.startsWith('470')
      );
      // Shuffle the filtered users before setting them
      const shuffledUsers = shuffleArray(filteredUsers);
      setUsers(shuffledUsers);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  useEffect(() => {
    document.title = "Hexlabs Users";
    getUsers();
  }, []);

  const sortUsersByName = () => {
    const sortedUsers = [...users].sort((a, b) => a.name.first.localeCompare(b.name.first));
    setUsers(sortedUsers);
  };

  return (
    <>
      <Text fontSize="4xl">Hexlabs Users</Text>
      <Text fontSize="2xl">This is an example of a page that makes an API call to the Hexlabs API to get a list of users made with love by aryan garg.</Text>

      <Button onClick={sortUsersByName} colorScheme="blue" marginY={4}>
        Sort by First Name
      </Button>

      <SimpleGrid columns={[2, null, 3, 5]} spacing={6} padding={10}>
        {users.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </SimpleGrid>
    </>
  );
};

export default UserData;
