import React, { useState, SetStateAction } from 'react';
import {
  Button,
  FormControl,
  Icon,
  IconButton,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { PiFolderNotchPlusFill, PiPlusCircleBold } from 'react-icons/pi';

type Props = {
  path: String;
  parentNode: Number | null;
  render: string;
  handlePostMessage: (
    filePath: string,
    // event:
    //   | React.MouseEvent<HTMLButtonElement>
    //   | React.KeyboardEvent<HTMLInputElement>,
    command: string,
    setterFunc?: (string: string) => any
  ) => void;
};

const FolderAdd = ({ path, parentNode, render, handlePostMessage }: Props) => {
  const OverlayOne = () => (
    <ModalOverlay
      bg="blackAlpha.300"
      backdropFilter="blur(10px) hue-rotate(90deg)"
    />
  );

  const [overlay, setOverlay] = React.useState(<OverlayOne />);
  const [addFolderValue, setAddFolderValue] = useState('');

  const {
    isOpen: addIsOpen,
    onOpen: addOnOpen,
    onClose: addOnClose,
  } = useDisclosure();

  const boxShadowColor = render === 'client' ? '#ffcf9e' : '#9FFFCB';

  return (
    <>
      <Button
        position="absolute"
        bgColor="#050505"
        textColor="#050505"
        padding="0"
        right="0"
        bottom="0"
        h="100%"
        borderRadius="0 15px 15px 0"
        // linear-gradient(90deg, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%)
        _hover={{
          bg: `linear-gradient(90deg, #050505 0%, ${
            parentNode === null ? '#FF9ED2' : boxShadowColor
          } 100%)`,
        }}
        // _hover={{boxShadow: `0px 0px 7px 1px ${
        //   parentNode === null ? "#24FF00" : "#FFF616"
        // }`, textColor: 'white'}}
        onClick={() => {
          setOverlay(<OverlayOne />);
          addOnOpen();
        }}
      >
        <Icon as={PiPlusCircleBold} />
      </Button>

      <Modal isCentered isOpen={addIsOpen} onClose={addOnClose}>
        {overlay}
        <ModalContent
          //style modal here:
          boxShadow="2xl"
          bgColor="#454545"
          textColor="#FFFFFF"
          borderRadius="10px"
        >
          <ModalHeader>Add Folder</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl display="flex" flexDir="row" gap="2">
              <Input
                id="folderName"
                type="text"
                bgColor="#121212"
                placeholder="new folder"
                flexGrow="3"
                textAlign="center"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handlePostMessage(
                      path.concat('/', addFolderValue),
                      'addFolder'
                    );
                    addOnClose();
                  }
                }}
                onChange={(e) => {
                  setAddFolderValue(e.currentTarget.value);
                }}
                value={addFolderValue}
              />
              <IconButton
                color="white"
                justifySelf="bottom"
                aria-label="file add button"
                isRound={true}
                variant="solid"
                size="md"
                isDisabled={!addFolderValue}
                colorScheme="green"
                icon={<Icon as={PiFolderNotchPlusFill} />}
                onClick={(e) => {
                  handlePostMessage(
                    path.concat('/', addFolderValue),
                    'addFolder',
                    setAddFolderValue
                  );
                  addOnClose();
                }}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default FolderAdd;
