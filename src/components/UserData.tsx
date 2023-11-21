import React, { useEffect, useState } from "react";
import { apiUrl, Service } from "@hex-labs/core";
import { Button, SimpleGrid, Text } from "@chakra-ui/react";
import axios from "axios";
import UserCard from "./UserCard";

const UserData: React.FC = () => {

  // The useState hook is used to store state in a functional component. The
  // first argument is the initial value of the state, and the second argument
  // is a function that can be used to update the state. The useState hook
  // returns an array with the first element being the state and the second
  // element being the function to update the state.

  const [users, setUsers] = useState<any[]>([]);

  // The useEffect hook basicaly runs the code inside of it when the component
  // mounts. This is useful for making API calls and other things that should
  // only happen once when the component is loaded.

  useEffect(() => {

    // This is an example of an async function. The async keyword tells the
    // function to wait for the axios request to finish before continuing. This
    // is useful because we can't use the data from the request until it is
    // finished.

    const getUsers = async () => {
      
      try {
          console.log("Try");
          const url = apiUrl(Service.USERS, "/users/hexlabs")
          // there is no way to send filters to the backend route,
          // so we have to filter client-side
          const {data} = await axios.get(url)
          setUsers(data)
          
      } catch (error) {
        console.error("Error fetching users:", error);
      }

      // TODO: Use the apiUrl() function to make a request to the /users endpoint of our USERS service. The first argument is the URL
      // of the request, which is created for the hexlabs api through our custom function apiUrl(), which builds the request URL based on
      // the Service enum and the following specific endpoint URL.

      // TODO: Also explore some of the other ways to configure the api call such as filtering and pagination.
      // Try to filter all the users with phone numbers starting with 470 or increase the amount of users returned from the default 50 (don't go above 100).

      // Postman will be your best friend here, because it's better to test out the API calls in Postman before implementing them here.

      // this is the endpoint you want to hit, but don't just hit it directly using axios, use the apiUrl() function to make the request
      const URL = 'https://users.api.hexlabs.org/users/hexlabs';

      // uncomment the line below to test if you have successfully made the API call and retrieved the data. The below line takes
      // the raw request response and extracts the actual data that we need from it.
      // setUsers(data?.data?.profiles);
    };
    document.title = "Hexlabs Users"
    getUsers();
  }, []);
  // ^^ The empty array at the end of the useEffect hook tells React that the
  // hook should only run once when the component is mounted. If you want it to
  // run every time a variable changes, you can put that variable in the array
  // and it will run every time that variable changes.

  const sortPhoneNumber = () => {
    setUsers(users?.filter((profile: any) => profile?.phoneNumber?.startsWith("470")));
  }

  const sortFirstName = () => {
    setUsers(users?.sort((a: any, b: any) => {
      const comparison = b?.name?.first?.localeCompare(a?.name?.first);
      return comparison !== 0 ? comparison : b?.name?.first?.localeCompare(a?.name?.first);
    }));
  }
  // TODO: Create a function that sorts the users array based on the first name of the users. Then, create a button that
  // calls this function and sorts the users alphabetically by first name. You can use the built in sort() function to do this.

  return (
    <>
      <Text fontSize="4xl">Hexlabs Users</Text>
      <Text fontSize="2xl">This is an example of a page that makes an API call to the Hexlabs API to get a list of users.</Text>
      <Button onClick={sortPhoneNumber}>Sort Phone Number</Button>
      <br></br>
      <Button onClick={sortFirstName}>Sort First Name</Button>

      <SimpleGrid columns={[2, 3, 5]} spacing={6} padding={10}>
        {users.map((user) => (
            <UserCard key={user.userId} user={user} />
        ))}
      </SimpleGrid>
    </>
  );
};

export default UserData;