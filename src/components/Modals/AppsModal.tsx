import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Flex,
  Text,
} from "@chakra-ui/react";

type appsValues = {
  user: any;
  apps: any[];
  hexathons: any[];
  isOpen: boolean;
  onClose: () => void;
};

export const AppsModal: React.FC<appsValues> = ({
  user,
  apps,
  hexathons,
  isOpen,
  onClose,
}: appsValues) => {
  let userApps = apps
    .map((app) => {
      if (app.length > 0) {
        return app[0].hexathon;
      }
    })
    .filter((id) => id !== undefined);

  let userHexathons = hexathons
    .filter((hexathon) => userApps.includes(hexathon.id))
    .map((hexathon) => hexathon.name);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader></ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex padding="2" flexDirection="column">
            <Text fontSize="xl" as="b">
              Applied Hexathons
            </Text>
            {userHexathons.map((userHexathon) => (
              <Text fontSize="md">{`${userHexathon}`}</Text>
            ))}
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Button mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
