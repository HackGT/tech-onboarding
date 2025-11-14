import {
  Box,
  Flex,
  HStack,
  Link,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  ListItem,
  UnorderedList,
} from "@chakra-ui/react";
import {
  PhoneIcon,
  EmailIcon,
  InfoIcon,
  EditIcon,
} from "@chakra-ui/icons";
import React, {useState} from "react";
import axios from "axios";
import { apiUrl, Service } from "@hex-labs/core";

type Props = {
  user: any;
};

type ModProps = {
  isOpen: boolean,
  onClose: () => void,
  user: any;
}

// TODO: right now, the UserCard only displays the user's name and email. Create a new modal component <UserModal> that
// pops up when the card is clicked. In this modal, list all the user's information including name, email, phoneNumber,
// and userId. 

const UserModal: React.FC<ModProps> = (props: ModProps) => {
  const [hexathons, setHexathons] = useState<any>(null);
  const getApplications = async () => {
    const data = await axios.get(
      apiUrl(
        Service.HEXATHONS, 
        '/hexathons')
    );
    const allHexathons = data.data;
    const applications = await Promise.all(allHexathons.map(async (hexathon: any) => {
      const app = await axios.get(
        apiUrl(
          Service.REGISTRATION,
          '/applications'
        ),
        {
          params: {
            hexathon: hexathon.id,
            userId: props.user.userId
          }
        }
      );
      return app ? hexathon.name : null;
    }));
    setHexathons(applications.filter((app: any) => app !== null));
  }

  return (
    <>
      <Modal isOpen={props.isOpen} onClose={props.onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{`${props.user.name.first} ${props.user.name.last}`}</ModalHeader>
          <ModalCloseButton />
          <ModalBody mt={-3}>
            <Text fontSize='md'><EmailIcon/> : <Link href={`mailto:${props.user.email}`}>{`${props.user.email}`}</Link></Text>
            <Text fontSize='md'><PhoneIcon/> : {props.user.phoneNumber?.length > 9 && (`${ '+1 (' + props.user.phoneNumber.substring(0,3) + ')'
                  + ' ' + props.user.phoneNumber.substring(3,6) 
                  + '-' + props.user.phoneNumber.substring(6)}`)}</Text>
            <Text fontSize='md'><InfoIcon/> : {`${props.user.userId}`}</Text>

            {!hexathons && (
              <Button onClick={getApplications} colorScheme='gray' size='sm' mt={2} ml={-1}>Load Hexathons</Button>
            )}

            { hexathons && (
              <Text fontSize='md'><EditIcon/> : Applied Hexathons:
                <UnorderedList ml={7}>
                  {hexathons.map((hexathon : string) => (
                    <ListItem fontSize='sm' ml={5}>{hexathon}</ListItem>
                  ))}
                  
                  {hexathons.length == 0 && (
                    <>No hexathons found.</>
                  )}

                </UnorderedList>
              </Text>
              
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' onClick={props.onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

// TODO: Explore if you can display the email as a link to the user's email that will open up the user's 
// email client and start a new email to that user. Also explore if you can provide a link to the user's resume.

// TODO: In our database structure, every user has a userId that is unique to them. This is the primary key of the user
// and is referenced in their applications to all of our hexathons. Create a button that when clicked, will retrieve all of
// the hexathons that the user has applied to. You can use the /applications endpoint of the registration service to do this
// and the /hexathons endpoint of the hexathons service to get a list of all the hexathons.

const UserCard: React.FC<Props> = (props: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
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

      <UserModal isOpen={isOpen} onClose={onClose} user={props.user} />
    </>
  );
};

export default UserCard;