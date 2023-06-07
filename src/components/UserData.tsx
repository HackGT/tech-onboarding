import React, { useEffect, useState } from "react";
import { apiUrl, HeaderItem, Service, Header, Footer } from "@hex-labs/core";
import {
  SimpleGrid,
  Text,
  Button,
  Stack,
  Container,
  useDisclosure,
} from "@chakra-ui/react";
import { ChevronDownIcon, SmallCloseIcon } from "@chakra-ui/icons";
import axios from "axios";
import UserCard from "./UserCard";
import { SortModal } from "./Modals/SortModal";

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

  const [hexathons, setHexathons] = useState<any[]>([]);

  useEffect(() => {
    // This is an example of an async function. The async keyword tells the
    // function to wait for the axios request to finish before continuing. This
    // is useful because we can't use the data from the request until it is
    // finished.

    const getUsers = async () => {
      let usersUrl = apiUrl(Service.USERS, "/users");
      const data = await axios.get(usersUrl, {
        params: {
          regex: true,
          search: "@hexlabs.org",
          limit: 20,
        },
      });
      // TODO: Use the apiUrl() function to make a request to the /users endpoint of our USERS service. The first argument is the URL
      // of the request, which is created for the hexlabs api through our custom function apiUrl(), which builds the request URL based on
      // the Service enum and the following specific endpoint URL.

      // TODO: Also explore some of the other ways to configure the api call such as filtering and pagination.
      // Try to filter all the users by @hexlabs.org emails or increase the amount of users returned from the default 50.

      // Postman will be your best friend here, because it's better to test out the API calls in Postman before implementing them here.

      // uncomment the line below to test if you have successfully made the API call and retrieved the data. The below line takes
      // the raw request response and extracts the actual data that we need from it.
      setUsers(data?.data?.profiles);
    };

    const getHexathons = async () => {
      let hexUrl = apiUrl(Service.HEXATHONS, "/hexathons");
      const data = await axios.get(hexUrl);
      setHexathons(data?.data);
    };

    document.title = "Hexlabs Users";
    getUsers();
    getHexathons();
  }, []);

  // ^^ The empty array at the end of the useEffect hook tells React that the
  // hook should only run once when the component is mounted. If you want it to
  // run every time a variable changes, you can put that variable in the array
  // and it will run every time that variable changes.

  // TODO: Create a function that sorts the users array based on the first name of the users. Then, create a button that
  // calls this function and sorts the users alphabetically by first name. You can use the built in sort() function to do this.

  const [sorted, setSorted] = useState<boolean>(false);
  const [filteredUsers, setFilteredUsers] = useState<any[]>(users);

  const [value, setValue] = React.useState("1");
  const {
    isOpen: isOpenSort,
    onOpen: onOpenSort,
    onClose: onCloseSort,
  } = useDisclosure();

  const sortUsers = () => {
    setSorted(true);
    let filteredUsers: any[] = [];
    switch (value) {
      case "1":
        filteredUsers = [...users].sort((a, b) =>
          a.name.first < b.name.first ? -1 : a.name.first > b.name.first ? 1 : 0
        );
        break;
      case "2":
        filteredUsers = [...users].sort((a, b) =>
          a.name.last < b.name.last ? -1 : a.name.last > b.name.last ? 1 : 0
        );
        break;
      case "3":
        filteredUsers = [...users].sort((a, b) =>
          a.email < b.email ? -1 : a.email > b.email ? 1 : 0
        );
        break;
      default:
        filteredUsers = [...users].sort((a, b) =>
          a.name.first < b.name.first ? -1 : a.name.first > b.name.first ? 1 : 0
        );
    }
    setFilteredUsers(filteredUsers);
  };

  console.log(users);
  return (
    <>
      <Header
        rightItem={<HeaderItem>Sign Out</HeaderItem>}
        rightItemMobile={<HeaderItem>Sign Out</HeaderItem>}
      >
        <HeaderItem>Home</HeaderItem>
        <HeaderItem>Profile</HeaderItem>
      </Header>
      <Container centerContent>
        <Stack direction="column" spacing={3}>
          <Text fontSize="4xl" align="center" mt="4">
            Hexlabs Users
          </Text>
          <Stack direction="row" spacing={2}>
            <Button
              rightIcon={<ChevronDownIcon />}
              colorScheme="linkedin"
              size="sm"
              onClick={onOpenSort}
            >
              Sort Users
            </Button>
            <SortModal
              value={value}
              setValue={setValue}
              sortUsers={sortUsers}
              isOpen={isOpenSort}
              onOpen={onOpenSort}
              onClose={onCloseSort}
            />
            <Button
              rightIcon={<SmallCloseIcon />}
              colorScheme="red"
              size="sm"
              onClick={() => setSorted(false)}
            >
              Clear Filters
            </Button>
          </Stack>
        </Stack>
      </Container>
      <SimpleGrid columns={[2, 3, 5]} spacing={6} padding={10}>
        {sorted
          ? filteredUsers.map((user) => (
              <UserCard user={user} hexathons={hexathons} />
            ))
          : users.map((user) => <UserCard user={user} hexathons={hexathons} />)}
      </SimpleGrid>
      <Footer />
    </>
  );
};

export default UserData;
