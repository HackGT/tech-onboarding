import {
  Box,
  Flex,
  Stack,
  VStack,
  HStack,
  Avatar,
  Text,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Link,
  Button,
  Badge
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { EmailIcon, PhoneIcon, InfoIcon } from '@chakra-ui/icons';


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
  const [isOpen, setIsOpen] = useState(false);
  const [hexathons, setHexathons] = useState<any[]>([]);
  const [showHexathons, setShowHexathons] = useState(false);

  const handleOpenModal = () => {
    setIsOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsOpen(false);
  }
  

  const handleClickonEmail = () => {
    window.open(`mailto:${props.user.email}`);
  }
  const cardBackground = useColorModeValue('gray.100', 'gray.700');


  const handleViewHexathons = async () => {
    setShowHexathons(true);
    try {
      const response = await axios.get(`/api/applications?userId=${props.user.userId}`);
      const applications = response.data.data;
      const hexathonIds = applications.map((application: any) => application.hexathonId);
      const hexathonsResponse = await axios.get(`/api/hexathons?ids=${hexathonIds.join(",")}`);
      const userHexathons = hexathonsResponse.data.data;
      setHexathons(userHexathons);
      console.log("hexathons")
      console.log(userHexathons)

    } catch (error) {
      console.error("Error fetching user hexathons:", error);
    }
  };

  return (
    <>
      <Box
        bg={cardBackground}
        maxW="sm"
        borderWidth="1px"
        rounded="lg"
        shadow="md"
        position="relative"
        _hover={{ shadow: "lg" }}
        onClick={handleOpenModal}
        cursor="pointer"
      >
        <Avatar
          size="xl"
          name={`${props.user.name.first} ${props.user.name.last}`}
          src={props.user.avatarUrl} // Assuming you have an avatar URL
          mt={-6}
          ml={7}
          mb={4}
          borderWidth="4px"
          borderColor="white"
        />
        <Stack spacing={1} p={4}>
          <Text fontWeight="bold" fontSize="lg" align="center">
            {`${props.user.name.first} ${props.user.name.last}`}
          </Text>
          <Stack direction="row" align="center" justify="center">
            <EmailIcon mr={2} />
            <Link href={`mailto:${props.user.email}`} isExternal>
              {props.user.email}
            </Link>
          </Stack>
          <Stack direction="row" align="center" justify="center">
            <PhoneIcon mr={2} />
            <Text>{props.user.phoneNumber}</Text>
          </Stack>
          <Flex justify="center">
            <Badge px={2} py={1} colorScheme="green">
              {props.user.status || 'Active'} {/* Assuming you have a status field */}
            </Badge>
          </Flex>
        </Stack>
      </Box>

      <Modal isOpen={isOpen} onClose={handleCloseModal} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>User Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontSize="x1" mb="2">{`${props.user.name.first} ${props.user.name.last}`}</Text>
            <Text fontSize="sm" fontWeight="semibold" mb="2">
              <Link color="blue.500" textDecoration="underline" onClick={() => handleClickonEmail()}>
                {props.user.email}
              </Link>
            </Text>
            <Text fontSize="sm" fontWeight="semibold" mt="2">
        {props.user.resume ? (
          <Link
            color="blue.500"
            href={props.user.resume}
            target="_blank"
            rel="noopener noreferrer"
            textDecoration="underline"
          >
            View Resume
          </Link>
        ) : (
          'No resume available'
        )}
      </Text>
      
      <Button mt="4" colorScheme="blue" onClick={handleViewHexathons}>
  View Applied Hexathons
</Button>

{showHexathons && (
  hexathons.length > 0 ? (
    <>
      <Text fontSize="lg" fontWeight="bold" mt="4">
        Applied Hexathons:
      </Text>
      {hexathons.map((hexathon: any) => (
        <Text key={hexathon.Id} fontSize="sm">
          {hexathon.name}
        </Text>
      ))}
    </>
  ) : (
    <Text fontSize="sm" mt="4">
      No applied hexathons
    </Text>
  )
)}
    </ModalBody>
  </ModalContent>
</Modal>
    </>
  );
};

export default UserCard;