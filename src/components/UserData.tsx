import React, { useEffect, useState } from "react";
import { apiUrl, Service } from "@hex-labs/core";
import { SimpleGrid, Text, Button } from "@chakra-ui/react";
import axios from "axios";
import UserCard from "./UserCard";

const UserData: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const getUsers = async () => {
      const URL = apiUrl(Service.USERS, '/users/hexlabs');
      try {
        const response = await axios.get(URL);
        const filteredUsers = response.data.profiles.filter((user: { phoneNumber: string }) => user.phoneNumber.startsWith('470'));
        setUsers(filteredUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

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
      <Text fontSize="2xl">This is an example of a page that makes an API call to the Hexlabs API to get a list of users.</Text>
      <Button onClick={sortUsersByName} my={4}>Sort by Name</Button>
      <SimpleGrid columns={[2, 3, 5]} spacing={6} padding={10}>
        {users.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </SimpleGrid>
    </>
  );
};

export default UserData;
