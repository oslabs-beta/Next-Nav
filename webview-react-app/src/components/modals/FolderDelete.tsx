import React, { useState, SetStateAction } from 'react';
import {
  Button,
  FormControl,
  FormErrorMessage,
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
import { PiMinusCircleBold } from 'react-icons/pi';

type Props = {
  path: string;
  parentNode: Number | null;
  folderName: string;
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

const FolderDelete = ({
  path,
  parentNode,
  folderName,
  render,
  handlePostMessage,
}: Props) => {
  const OverlayOne = () => (
    <ModalOverlay
      bg='blackAlpha.300'
      backdropFilter='blur(10px) hue-rotate(90deg)'
    />
  );

  const [overlay, setOverlay] = React.useState(<OverlayOne />);
  const [deleteFolderValue, setDeleteFolderValue] = useState('');

  const {
    isOpen: deleteIsOpen,
    onOpen: deleteOnOpen,
    onClose: deleteOnClose,
  } = useDisclosure();
  const boxShadowColor = render === 'client' ? '#ffcf9e' : '#9FFFCB';

  return (
    <>
      {parentNode !== null && (
        <Button
          position='absolute'
          bgColor='#050505'
          textColor='#050505'
          padding='0'
          right='left'
          bottom='0'
          h='100%'
          borderRadius='15px 0 0 15px'
          // linear-gradient(90deg, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%)
          _hover={{
            bg: `linear-gradient(270deg, #050505 0%, ${
              parentNode === null ? '#FF9ED2' : boxShadowColor
            } 100%)`,
          }}
          // _hover={{boxShadow: `0px 0px 7px 1px ${
          //   parentNode === null ? "#24FF00" : "#FFF616"
          // }`, textColor: 'white'}}
          onClick={() => {
            setOverlay(<OverlayOne />);
            deleteOnOpen();
          }}
        >
          <Icon marginRight='0.5rem' as={PiMinusCircleBold} />
        </Button>
      )}

      <Modal
        isCentered
        isOpen={deleteIsOpen}
        onClose={deleteOnClose}
        trapFocus={false}
      >
        {overlay}
        <ModalContent
          //style modal here:
          boxShadow='2xl'
          bgColor='#454545'
          textColor='#FFFFFF'
          borderRadius='10px'
        >
          <ModalHeader>Delete Folder</ModalHeader>
          <ModalCloseButton />
          <ModalBody display='flex' gap='2' flexDir='row'>
            <FormControl
              flexDir='column'
              isInvalid={deleteFolderValue !== folderName}
            >
              <Input
                id='folderName'
                type='text'
                bgColor='#121212'
                textAlign='center'
                flexGrow='3'
                placeholder={`${folderName}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && deleteFolderValue === folderName) {
                    handlePostMessage(
                      path,
                      'deleteFolder',
                      setDeleteFolderValue
                    );
                    deleteOnClose();
                  }
                }}
                onChange={(e) => {
                  setDeleteFolderValue(e.currentTarget.value);
                }}
                value={deleteFolderValue}
              />
              <FormErrorMessage justifyContent='center'>
                Input must match folder name
              </FormErrorMessage>
            </FormControl>
            <Button
              isDisabled={deleteFolderValue !== folderName}
              colorScheme='red'
              onClick={(e) => {
                handlePostMessage(path, 'deleteFolder', setDeleteFolderValue);
                deleteOnClose();
              }}
            >
              Confirm
            </Button>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default FolderDelete;
