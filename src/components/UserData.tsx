import React, { useEffect, useState } from "react";
import { apiUrl, Service } from "@hex-labs/core";
import { SimpleGrid, Text } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
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
    	// TODO: Use the apiUrl() function to make a request to the /users endpoint of our USERS service. The first argument is the URL
    	// of the request, which is created for the hexlabs api through our custom function apiUrl(), which builds the request URL based on
    	// the Service enum and the following specific endpoint URL.
	try {
	  const url = apiUrl(Service.USERS, '/users');
	  const response = await axios.get(url);
	  const data = response.data;
	  // uncomment the line below to test if you have successfully made the API call and retrieved the data. The below line takes
          // the raw request response and extracts the actual data that we need from it.
	  setUsers(data?.data?.profiles);
	} catch (error) {
	  console.error('Error fetching users:', error);
	}
      // TODO: Also explore some of the other ways to configure the api call such as filtering and pagination.
      // Try to filter all the users by @hexlabs.org emails or increase the amount of users returned from the default 50.

      // Postman will be your best friend here, because it's better to test out the API calls in Postman before implementing them here.
	try {
	  const url = apiUrl(Service.USERS, "/users");
	  const params =  {email: "@hexlabs.org", limit:100};
	  const response = await axios.get(url, { params });
	  const data = response.data;
	// uncomment the line below to test if you have successfully made the API call and retrieved the data. The below line takes
        // the raw request response and extracts the actual data that we need from it.
          setUsers(data?.data?.profiles);
        } catch (error) {
	  console.error("Error fetching users:", error);
	}
    };
    document.title = "Hexlabs Users"
    getUsers();
  }, []);
  // ^^ The empty array at the end of the useEffect hook tells React that the
  // hook should only run once when the component is mounted. If you want it to
  // run every time a variable changes, you can put that variable in the array
  // and it will run every time that variable changes.


  // TODO: Create a function that sorts the users array based on the first name of the users. Then, create a button that
  // calls this function and sorts the users alphabetically by first name. You can use the built in sort() function to do this.
  const sortUsersByFirstName = () => {
    const sortedUsers = [...users].sort((a, b) => {
      const nameA = a.firstName.toUpperCase();
      const nameB = b.firstName.toUpperCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
    setUsers(sortedUsers);
  };

  return (
    <>
      <Text fontSize="4xl">Hexlabs Users</Text>
      <Text fontSize="2xl">This is an example of a page that makes an API call to the Hexlabs API to get a list of users.</Text>

      <Button onClick={sortUsersByFirstName}>Sort by First Name</Button>

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
