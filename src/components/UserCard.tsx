import {
  Box,
  Button,
  Flex,
  HStack,
  Link,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { UserModal } from "./Modals/UserModal";
import axios from "axios";
import { Service, apiUrl } from "@hex-labs/core";
import { AppsModal } from "./Modals/AppsModal";

type Props = {
  user: any;
  hexathons: any[];
};

// TODO: right now, the UserCard only displays the user's name and email. Create a new modal component <UserModal> that
// pops up when the card is clicked. In this modal, list all the user's information including name, email, phoneNumber,
// and userId.

// TODO: Explore if you can display the email as a link to the user's email that will open up the user's
// email client and start a new email to that user. Also explore if you can provide a link to the user's resume.

// TODO: In our database structure, every user has a userId that is unique to them. This is the primary key of the user
// and is referenced in their applications to all of our hexathons. Create a button that when clicked, will retrieve all of
// the hexathons that the user has applied to. You can use the /applications endpoint of the registration service to do this
// and the /hexathons endpoint of the hexathons service to get a list of all the hexathons.

const UserCard: React.FC<Props> = (props: Props) => {
  const [applications, setApplications] = useState<any[]>([]);
  const appsUrl = apiUrl(Service.REGISTRATION, "/applications");

  const getApps = (hexathons: any[], uid: string) => {
    let response = Promise.all(
      hexathons.map(async (hexathon) => {
        try {
          let data = await axios.get(appsUrl, {
            params: {
              hexathon: hexathon.id,
              userId: uid,
            },
          });
          return data?.data.applications;
        } catch (error) {
          console.error("Not found");
        }
      })
    );
    return response;
  };

  const fetchApps = async () => {
    const data = await getApps(props.hexathons, props.user.userId);
    setApplications(data);
  };

  const {
    isOpen: isOpenCard,
    onOpen: onOpenCard,
    onClose: onCloseCard,
  } = useDisclosure();

  const {
    isOpen: isOpenApps,
    onOpen: onOpenApps,
    onClose: onCloseApps,
  } = useDisclosure();

  const openFetchApps = () => {
    fetchApps();
    onOpenApps();
  };

  return (
    <Box
      borderWidth="1px"
      rounded="lg"
      boxShadow="lg"
      height="175px"
      fontWeight="bold"
      alignItems="center"
    >
      <UserModal user={props.user} isOpen={isOpenCard} onClose={onCloseCard} />
      <Flex padding="2" flexDirection="column">
        <HStack
          cursor={"pointer"}
          align="flex-end"
          justify="space-between"
          onClick={onOpenCard}
        >
          <Text fontSize="xl">{`${props.user.name.first} ${props.user.name.last}`}</Text>
        </HStack>
        <Stack direction="column" spacing={2}>
          <Text
            fontSize="sm"
            fontWeight="semibold"
            justifyContent="justify"
            mt="2"
          >
            {props.user.email}
          </Text>
          <Button colorScheme="linkedin" size="sm">
            <Link
              href={props.user.resume}
              target="_blank"
              rel="noopener noreferrer"
            >
              See Resume
            </Link>
          </Button>
          <Button colorScheme="linkedin" size="sm" onClick={openFetchApps}>
            See Applications
          </Button>
        </Stack>
      </Flex>
      <AppsModal
        apps={applications}
        hexathons={props.hexathons}
        user={props.user}
        isOpen={isOpenApps}
        onClose={onCloseApps}
      />
    </Box>
  );
};

export default UserCard;
