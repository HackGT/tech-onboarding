import {
  Box,
  Button,
  Flex,
  HStack,
  Text,
} from "@chakra-ui/react";
import React from "react";
import UserModal from "./UserModal";
import HexathonModal from "./HexathonModal";
import axios from "axios";
import { apiUrl, Service, Footer } from "@hex-labs/core";

type Props = {
  user: any;
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
  const [isInfoOpen, setIsInfoOpen] = React.useState(false);
  const [appliedHexs, setAppliedHexs] = React.useState<string[]>([]);
  // const [resumeUrl, setResumeUrl] = React.useState("");
  const showInfoModal = () => {
      setIsInfoOpen(true);
  }
  const closeInfoModal = () => {
      setIsInfoOpen(false);
  }

  const [isHexOpen, setIsHexOpen] = React.useState(false);
  const showHexModal = () => {
      setIsHexOpen(true);
  }
  const closeHexModal = () => {
      setIsHexOpen(false);
  }

  // if ('resume' in props.user && isOpen) {
  //   console.log("resume found");
  //   const requestUrl = apiUrl(Service.FILES, `/files/${props.user.resume}/view`);
  //   console.log(`requestUrl: ${requestUrl}`);

  //   axios.get(requestUrl)
  //   .then((response => {
  //       console.log("resume retrieved");
  //       setResumeUrl(response.data);
  //   }))
  // }

  const addItem = (item: string) => {
    setAppliedHexs(prevList => [...prevList, item]);
  };
  
  React.useEffect(() => {
    const viewHexathons = async () => {
      var requestUrl = apiUrl(Service.HEXATHONS, 'hexathons');
      var response = await axios.get(requestUrl);
      const hexathons = response.data;
      for (var hexathon of hexathons) {
        const hexathonId = hexathon.id;
        requestUrl = apiUrl(Service.REGISTRATION, `applications`);
        response = await axios.get(requestUrl, { params: { hexathon: hexathonId, userId: props.user.userId} });
        const applications = response.data;
        // console.log(applications);
        if (applications.total != 0) {
          setAppliedHexs([...appliedHexs, hexathon.name]);
          // console.log(appliedHexs);
        }
        // const userIds: string[] = applications.map((obj: any) => obj.userId);
        // console.log(`userIds: ${JSON.stringify(userIds)}`);
        // const requestUrl1 = apiUrl(Service.USERS, `users/${props.user.userId}`);
        // const response1 = await axios.get(requestUrl1);
        // console.log(`${response1.data.name.first} ${response1.data.name.last} : ${props.user.userId}`);
        // if (props.user.userId in userIds) {
        //   setAppliedHexs([...appliedHexs, hexathon.name]);
          // console.log(appliedHexs);
        // }
        // break;
      }
    }
    viewHexathons();
  }, []);



  return (
    <>
      {/* resumeUrl={resumeUrl} */}
      {isInfoOpen && (<UserModal user={props.user} isOpen={isInfoOpen} onClose={closeInfoModal}></UserModal>)}
      {isHexOpen && (<HexathonModal user={props.user} isOpen={isHexOpen} onClose={closeHexModal} applied={appliedHexs}></HexathonModal>)}

      <Box
      borderWidth="1px"
      rounded="lg"
      boxShadow="lg"
      height="175px"
      fontWeight="bold"
      alignItems="center"
      >
        <Flex padding="2" flexDirection="column">
          <HStack align="flex-end" justify="space-between">
            <Text fontSize='xl'>{`${props.user.name.first} ${props.user.name.last}`}</Text>
          </HStack>
          <Text
            fontSize="sm"
            fontWeight="semibold"
            justifyContent="justify"
            mt="2"
          >
            {props.user.email}
          </Text>
          <Flex flexDirection="row">
            <Button onClick={showInfoModal}>Info</Button>
            <Button onClick={showHexModal}>Hexathons</Button>
          </Flex>
        </Flex>
      </Box>
    </>
  );
};

export default UserCard;