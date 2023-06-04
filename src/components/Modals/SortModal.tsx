import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  RadioGroup,
  Radio,
  Button,
  Stack,
} from "@chakra-ui/react";

type modalValues = {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  sortUsers: () => void;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const SortModal: React.FC<modalValues> = ({
  value,
  setValue,
  sortUsers,
  isOpen,
  onOpen,
  onClose,
}: modalValues) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Sort Users By...</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <RadioGroup onChange={setValue} value={value}>
            <Stack direction="column">
              <Radio value="1">First Name Alphabetically</Radio>
              <Radio value="2">Last Name Alphabetically</Radio>
              <Radio value="3">Email Alphabetically</Radio>
            </Stack>
          </RadioGroup>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={sortUsers}>
            Sort
          </Button>
          <Button mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
