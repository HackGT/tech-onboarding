import {
  Box,
  Flex,
  HStack,
  Text,
  Button,
  Link,
  Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    useFocusEffect,
} from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import axios from "axios";
import { apiUrl, Service } from "@hex-labs/core";

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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [userHexathons, setUserHexathons] = useState<any[]>([]);
  const mailtoURL="mailto:%20"+props.user.email;

  useEffect(()=>{

    

    const getApplications = async(currentUser: any)=>{
      const allhexathons = await axios.get(apiUrl(Service.HEXATHONS, `/hexathons`),{
      });
      const onlyIds = allhexathons.data.map((d: { id: any; })=>(d.id));
      console.log(onlyIds);
      //console.log(hexathonsIds);
      onlyIds.map(async (id: any)=>{
        const currhexathon = await axios.get(apiUrl(Service.REGISTRATION, `/applications`),{
          params:{
            hexathon: id,
            userId: currentUser.id
          }
        });
        if (currhexathon.data.count!=0){
          setUserHexathons((prevUserHexathons)=>[...prevUserHexathons, currhexathon.data.name]);
        }
      })
      console.log(userHexathons);
      
      
    }
    getApplications(props.user);
    
  }, []);//run once

  /*
  const getApplications=async (currentUser: any)=>{
    const allhexathons = await axios.get(apiUrl(Service.HEXATHONS, `/hexathons`),{
    });
    const onlyIds = allhexathons.data.map((d: { id: any; })=>(d.id));
    console.log(onlyIds);
    //console.log(hexathonsIds);
    onlyIds.map(async (id: any)=>{
      const currhexathon = await axios.get(apiUrl(Service.REGISTRATION, `/applications`),{
        params:{
          hexathon: id,
          userId: currentUser.id
        }
      });
      if (currhexathon.data.count!=0){
        setUserHexathons((prevUserHexathons)=>[...prevUserHexathons, currhexathon.data.name]);
      }
    })
    console.log(userHexathons);
  }
  getApplications(props.user);
  */
  

  

  return (
    
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
      
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{`${props.user.name.first} ${props.user.name.last}`}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Phone Number: {`${props.user.phoneNumber}`}</Text>
            <Text>Email: <a href = {mailtoURL}>{`${props.user.email}`}</a></Text>
            <Text> Id: {`${props.user.id}`}</Text>
            <Text> </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant='ghost'>Get applied to hexathons</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </Box>
    
  );
};

export default UserCard;