import {
  Box,
  Flex,
  HStack,
  Text,
} from "@chakra-ui/react";
import React from "react";

type Props = {
  user: any;
};


const UserCard: React.FC<Props> = (props: Props) => {

  return (
    <Box
    borderWidth="1px"
    rounded="lg"
    boxShadow="lg"
    height="175px"
    fontWeight="bold"
    alignItems="center"
    transition="background-color 0.2s ease"
    _hover={{
      backgroundColor: "gray.100",
      _dark: { backgroundColor: "gray.700" },
      cursor: "pointer",
    }}
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
  );
};

export default UserCard;