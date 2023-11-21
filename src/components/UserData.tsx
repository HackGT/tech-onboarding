import React, { useEffect, useState } from "react";
import { apiUrl, handleAxiosError, Service } from "@hex-labs/core";
import {
  SimpleGrid,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  VStack,
  Box,
  StackDivider,
} from "@chakra-ui/react";
import axios, { AxiosResponse } from "axios";
import UserCard from "./UserCard";

const UserData: React.FC = () => {
  // The useState hook is used to store state in a functional component. The
  // first argument is the initial value of the state, and the second argument
  // is a function that can be used to update the state. The useState hook
  // returns an array with the first element being the state and the second
  // element being the function to update the state.

  const [users, setUsers] = useState<any[]>([]);
  const [clickedUser, setClickedUser] = useState<any>();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [areUsersAscending, setAreUsersAscending] = useState<boolean>(true);
  const [selectedUserHackathons, setSelectedUserHackathons] = useState<any>();

  // The useEffect hook basicaly runs the code inside of it when the component
  // mounts. This is useful for making API calls and other things that should
  // only happen once when the component is loaded.

  useEffect(() => {
    // This is an example of an async function. The async keyword tells the
    // function to wait for the axios request to finish before continuing. This
    // is useful because we can't use the data from the request until it is
    // finished.

    const getUsers = async () => {
      // https://login.hexlabs.org/signup?redirect=http://localhost:3000/
      // https://login.hexlabs.org/login?redirect=http://localhost:3000/

      // TODO: Use the apiUrl() function to make a request to the /users endpoint of our USERS service. The first argument is the URL
      // of the request, which is created for the hexlabs api through our custom function apiUrl(), which builds the request URL based on
      // the Service enum and the following specific endpoint URL.

      // TODO: Also explore some of the other ways to configure the api call such as filtering and pagination.
      // Try to filter all the users with phone numbers starting with 470 or increase the amount of users returned from the default 50 (don't go above 100).

      // Postman will be your best friend here, because it's better to test out the API calls in Postman before implementing them here.

      // this is the endpoint you want to hit, but don't just hit it directly using axios, use the apiUrl() function to make the request
      const URL = "https://users.api.hexlabs.org/users/hexlabs";

      // uncomment the line below to test if you have successfully made the API call and retrieved the data. The below line takes
      // the raw request response and extracts the actual data that we need from it.

      const api: string = apiUrl(Service.USERS, "/users/hexlabs");

      try {
        const data: AxiosResponse = await axios.get(api);
        console.log(data);

        const filteredData = data?.data.filter((person: any) =>
          person.phoneNumber?.startsWith("470")
        );

        setUsers(filteredData);
      } catch (error: any) {
        handleAxiosError(error);
      }
    };
    document.title = "Hexlabs Users";
    getUsers();
  }, []);
  // ^^ The empty array at the end of the useEffect hook tells React that the
  // hook should only run once when the component is mounted. If you want it to
  // run every time a variable changes, you can put that variable in the array
  // and it will run every time that variable changes.

  // TODO: Create a function that sorts the users array based on the first name of the users. Then, create a button that
  // calls this function and sorts the users alphabetically by first name. You can use the built in sort() function to do this.
  const sortByFirstName = () => {
    const usersCopy: any[] = [...users].sort((a, b) =>
      areUsersAscending
        ? b?.name?.first.localeCompare(a?.name?.first)
        : -b?.name?.first.localeCompare(a?.name?.first)
    );

    setAreUsersAscending((prevState) => !prevState);

    setUsers(usersCopy);
  };

  const handleOnModalClose = () => {
    setShowModal(false);
    setClickedUser(null);
    setSelectedUserHackathons(null);
  };

  const handleOnUserClicked = async (user: any) => {
    try {
      const hexathonsApi = apiUrl(Service.HEXATHONS, "hexathons");
      const hexathonsResponse = await axios.get(hexathonsApi);
      hexathonsResponse?.data.forEach(async (hexathon: any) => {
        const registrationApi = apiUrl(
          Service.HEXATHONS,
          `hexathon-users/${hexathon.id}/users/${user.userId}`
        );
        const hexathonsResponse = await axios.get(registrationApi);
        if (!hexathonsResponse) {
          setClickedUser(user);
          setShowModal(true);
          return;
        }

        if (hexathonsResponse?.status === 200) {
          setSelectedUserHackathons(hexathon.name);
        }
      });
    } catch (error: any) {
      console.log(error);
    }

    setClickedUser(user);
    setShowModal(true);
  };

  const fetchHexathons = () => {
    // console.log(apiUrl(Service.USERS, URL));
    // console.log(apiUrl(Service.AUTH, URL));
    // console.log(apiUrl(Service.FINANCE, URL));
    // console.log(apiUrl(Service.FILES, URL));
  };

  return (
    <>
      <Text fontSize="4xl">Hexlabs Users</Text>
      <Text fontSize="2xl">
        This is an example of a page that makes an API call to the Hexlabs API
        to get a list of users.
      </Text>

      <Button colorScheme="blue" onClick={sortByFirstName}>
        Sort by First Name
      </Button>

      <SimpleGrid columns={[2, 3, 5]} spacing={6} padding={10}>
        {/* Here we are mapping every entry in our users array to a unique UserCard component, each with the unique respective
        data of each unique user in our array. This is a really important concept that we use a lot so be sure to familiarize
        yourself with the syntax - compartmentalizing code makes your work so much more readable. */}
        {users.map((user) => (
          <UserCard
            user={user}
            key={user.userId}
            onUserClicked={() => handleOnUserClicked(user)}
          />
        ))}
      </SimpleGrid>

      <Modal isOpen={showModal} onClose={handleOnModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {clickedUser?.name.first} {clickedUser?.name.last}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack
              divider={<StackDivider borderColor="gray.200" />}
              spacing={4}
              align="stretch"
            >
              {clickedUser?.email && (
                <Text fontSize="md">
                  <strong>Email: </strong>
                  {clickedUser?.email}
                </Text>
              )}
              {clickedUser?.phoneNumber && (
                <Text fontSize="md">
                  <strong>Phone: </strong>
                  {clickedUser?.phoneNumber}
                </Text>
              )}
              {selectedUserHackathons ? (
                <Text fontSize="md">
                  <strong>Hackathons: </strong>
                  {selectedUserHackathons}
                </Text>
              ) : (
                <></>
              )}
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleOnModalClose}>
              Done
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UserData;
