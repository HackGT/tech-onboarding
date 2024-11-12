import React, { useEffect, useState } from "react";
import { apiUrl, Service } from "@hex-labs/core";
import { SimpleGrid, Text, Button, HStack } from "@chakra-ui/react";
import axios from "axios";
import UserCard from "./UserCard";

const UserData: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [sortAscending, setSortAscending] = useState(true);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await axios.get(
          apiUrl(Service.USERS, '/users/hexlabs'), 
          {
            params: {
              filter: {
                phoneNumber: {
                  $regex: '^470'
                }
              },
              limit: 100
            }
          }
        );
        setUsers(response?.data?.profiles || []);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    
    document.title = "Hexlabs Users"
    getUsers();
  }, []);

  const handleSort = () => {
    const sortedUsers = [...users].sort((a, b) => {
      const comparison = a.name.first.localeCompare(b.name.first);
      return sortAscending ? comparison : -comparison;
    });
    setUsers(sortedUsers);
    setSortAscending(!sortAscending);
  };

  return (
    <>
      <Text fontSize="4xl">Hexlabs Users</Text>
      <Text fontSize="2xl">This is an example of a page that makes an API call to the Hexlabs API to get a list of users.</Text>
      
      <HStack spacing={4} padding={4}>
        <Button colorScheme="blue" onClick={handleSort}>
          Sort by First Name {sortAscending ? '↓' : '↑'}
        </Button>
      </HStack>

      <SimpleGrid columns={[2, 3, 5]} spacing={6} padding={10}>
        {users.map((user) => (
          <UserCard key={user.userId} user={user} />
        ))}
      </SimpleGrid>
    </>
  );
};

export default UserData;