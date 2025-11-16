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
      const response = await axios.get(apiUrl(Service.USERS, "/users/hexlabs"), {
        // Request a larger page (default is 50) and ask the API to prefilter.
        params: { limit: 100, phoneNumberStartsWith: "470", page: 0 },
      });
      const profiles: any[] = response?.data ?? [];
      // Fallback client-side filter so we only show users whose numbers start with 470.
      const filtered = profiles.filter((profile: any) =>
        profile?.phoneNumber?.startsWith("470")
      );
      setUsers(filtered);
    };
    document.title = "Hexlabs Users"
    getUsers();
  }, []);
  // ^^ The empty array at the end of the useEffect hook tells React that the
  // hook should only run once when the component is mounted. If you want it to
  // run every time a variable changes, you can put that variable in the array
  // and it will run every time that variable changes.

  const sortByFirstName = () => {
    setUsers(prevUsers =>
      [...prevUsers].sort((a, b) => {
        const aName = a?.name?.first || "";
        const bName = b?.name?.first || "";
        return aName.localeCompare(bName);
      })
    );
  };

  return (
    <>
      <Text fontSize="4xl">Hexlabs Users</Text>
      <Text fontSize="2xl">This is an example of a page that makes an API call to the Hexlabs API to get a list of users.</Text>
      <Button colorScheme="blue" onClick={sortByFirstName} mt={4}>
        Sort by first name
      </Button>


      <SimpleGrid columns={[2, 3, 5]} spacing={6} padding={10}>

        {/* Here we are mapping every entry in our users array to a unique UserCard component, each with the unique respective
        data of each unique user in our array. This is a really important concept that we use a lot so be sure to familiarize
        yourself with the syntax - compartmentalizing code makes your work so much more readable. */}
        { users.map((user) => (
          <UserCard user={user} />
        ))}

      </SimpleGrid>
    </>
  );
};

export default UserData;