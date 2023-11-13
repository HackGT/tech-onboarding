import {
  Box,
  Flex,
  HStack,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Heading,
  Link
} from "@chakra-ui/react";

import React, { useState } from "react";
import { apiUrl, Service } from '@hex-labs/core'
import axios from 'axios'

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
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [hexathonsApplied, setHexathonsApplied] = useState<any[]>([])

  // Note: cannot implement this because I don't have member status so the API
  // won't give me the right data
  // const getHexathonsAppliedTo = async () => {
  //   const hexathonsListRoute = apiUrl(Service.HEXATHONS, '/hexathons')

  //   const { data: hexathonsData } = await axios.get(hexathonsListRoute)

  //   const applicationsListRoute = apiUrl(Service.REGISTRATION, '/applications')

  //   const userHasAppliedTo = []

  //   for (const hexathon of hexathonsData) {
  //   }
  // }

  return (
    <>
      <Box
      borderWidth="1px"
      rounded="lg"
      boxShadow="lg"
      height="175px"
      fontWeight="bold"
      alignItems="center"
      onClick={onOpen}
      cursor="pointer"
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
        </Flex>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Member information</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Heading size='sm'>Name</Heading>
            <Text>
              {props.user.name.first} {props.user.name.last}
            </Text>

            <Heading size='sm' mt='3'>Email (click to email)</Heading>
            <Link href={`mailto:${props.user.email}`}>
              {props.user.email}
            </Link>

            <Heading size='sm' mt='3'>Phone number</Heading>
            <Text>
              {props.user.phoneNumber}
            </Text>

            <Heading size='sm' mt='3'>UserId</Heading>
            <Text>
              {props.user.userId}
            </Text>

            {props.user.resume &&
              <>
                <Heading size='sm' mt='3'>
                  <Link href={apiUrl(Service.FILES, `/files/${props.user.resume}/view`)} isExternal>
                    <Button>
                      View Resume
                    </Button>
                  </Link>
                </Heading>
              </>
            }
          </ModalBody>

          <ModalFooter>
            {/* <Button colorScheme='gray' mr={3} onClick={getHexathonsAppliedTo}>
              Find Hexathons
            </Button> */}

            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UserCard;