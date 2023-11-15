import React, { useEffect, useState } from "react";
import { apiUrl, Service } from "@hex-labs/core";
import { SimpleGrid, Text, Button, filter } from "@chakra-ui/react";
import axios from "axios";
import UserCard from "./UserCard";


// shuffle to prove functionality of alphabetize button
const shuffleArray = (inputArray: any[]): any[] => {
  let arrayToShuffle = [...inputArray];
  let currentIndex = arrayToShuffle.length;

  while (currentIndex !== 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    let temporaryValue = arrayToShuffle[currentIndex];
    arrayToShuffle[currentIndex] = arrayToShuffle[randomIndex];
    arrayToShuffle[randomIndex] = temporaryValue;
  }

  return arrayToShuffle;
};

const UserData: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);

  const getUsers = async () => {
    try {
      const url = apiUrl(Service.USERS, '/users/hexlabs');
      const response = await axios.get(url)
      console.log("Initial users (check if alphabetized):", response.data);
      const filtered = response.data.filter((user: any) =>
        typeof user.phoneNumber === 'string' && user.phoneNumber.startsWith('470')
      );
      const shuffled = shuffleArray(filtered)
      console.log("Fetched users (check if alphabetized):", shuffled); 
      setUsers(shuffled);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  useEffect(() => {
    document.title = "Hexlabs Users";
    getUsers();
  }, []);

  const sortUsersByName = () => {
    const sortedUsers = [...users].sort((a, b) => {
      const aName = a.name.first.toLowerCase();
      const bName = b.name.first.toLowerCase();
      if (aName < bName) {
         return -1; 
      } else if (aName > bName) {
        return 1; 
      } else { return 0; 
      }
    });
    setUsers(sortedUsers);
    console.log(sortedUsers); // Log the users data to the console
  };

  return (
    <>
      <Text fontSize="4xl">Hexlabs Users</Text>

      <Text fontSize="2xl">This makes an API call to the Hexlabs API to get a list of users</Text>

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
