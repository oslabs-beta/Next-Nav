import React, { useState } from 'react';
import { FileNode } from './TreeContainer';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  Button,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Stack,
  Box,
  Spacer,
  Icon,
  Flex,
  IconButton,
  transition,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
} from '@chakra-ui/react';
import {
  PiFileCodeFill,
  PiFolderNotchOpenFill,
  PiTrashFill,
  PiFolderNotchPlusFill,
} from 'react-icons/pi';

import { Background } from 'reactflow';
import { useVsCodeApi } from '../VsCodeApiContext';

type Props = {
  props: FileNode;
};

const Node = ({ props }: Props): JSX.Element => {
  //deconstruct props here. Used let to account for undefined checking.
  let { contents, parentNode, folderName, path }: FileNode = props;
  const vscode = useVsCodeApi();

  const OverlayOne = () => (
    <ModalOverlay
      bg="blackAlpha.300"
      backdropFilter="blur(10px) hue-rotate(90deg)"
    />
  );

  const {
    isOpen: nodeIsOpen,
    onOpen: nodeOnOpen,
    onClose: nodeOnClose,
  } = useDisclosure();
  const {
    isOpen: addIsOpen,
    onOpen: addOnOpen,
    onClose: addOnClose,
  } = useDisclosure();
  const {
    isOpen: deleteIsOpen,
    onOpen: deleteOnOpen,
    onClose: deleteOnClose,
  } = useDisclosure();

  const [overlay, setOverlay] = React.useState(<OverlayOne />);

  const [addFolderValue, setAddFolderValue] = useState('');
  const [deleteFolderValue, setDeleteFolderValue] = useState('');
  const [addFileValue, setAddFileValue] = useState('');

  //ensures obj.contents is never undefined
  if (!contents) {
    contents = [];
  }
  if (!path) {
    path = '';
  }

  //opens file in a new tab
  const handleOpenTab: (
    filePath: string,
    event: React.MouseEvent<HTMLButtonElement>
  ) => void = (filePath, event) => {
    console.log('Opening path:', filePath);
    console.log('Event:', event);
    vscode.postMessage({
      command: 'open_file',
      filePath: filePath,
    });
  };

  //add a file need path and filename.extension
  const handleAddFile: (
    filePath: string,
    event: React.MouseEvent<HTMLButtonElement>
  ) => void = (filePath, event) => {
    console.log(path);
    vscode.postMessage({
      command: 'addFile',
      filePath: filePath,
    });
  };

  const handleAddFolder: (
    filePath: string,
    event: React.MouseEvent<HTMLButtonElement>
  ) => void = (filePath, event) => {
    console.log(path);
    vscode.postMessage({
      command: 'addFolder',
      filePath: filePath,
    });
  };

  //delete a file need path and filename.extension
  const handleDeleteFile: (
    filePath: string,
    event: React.MouseEvent<HTMLButtonElement>
  ) => void = (filePath, event) => {
    vscode.postMessage({
      command: 'deleteFile',
      filePath: filePath,
    });
  };

  const handleDeleteFolder: (
    filePath: string,
    event: React.MouseEvent<HTMLButtonElement>
  ) => void = (filePath, event) => {
    vscode.postMessage({
      command: 'deleteFolder',
      filePath: filePath,
    });
  };

  //generate the amount of file icons based on the number of contents
  const files: JSX.Element[] = [];
  const modalFiles: JSX.Element[] = [];
  for (let i = 0; i < contents.length; i++) {
    files.push(
      <div
        style={{
          borderRadius: '3px',
          border: '1px solid white',
          rotate: '45deg',
          width: '20px',
          height: '20px',
          backgroundColor: 'black',
        }}
      ></div>
    );
    modalFiles.push(
      <Box>
        {' '}
        <Flex gap="2">
          {' '}
          <Button
            size="sm"
            variant="outline"
            bgColor="#010101"
            color="white"
            _hover={{ bg: 'white', textColor: 'black' }}
            leftIcon={<Icon as={PiFileCodeFill} />}
            onClick={(e) => {
              handleOpenTab(path.concat('/', contents[i]), e);
            }}
          >
            {' '}
            {contents[i]}
          </Button>
          <Spacer />
          <IconButton
            isRound={true}
            variant="solid"
            size="xs"
            colorScheme="red"
            aria-label="Done"
            icon={<Icon as={PiTrashFill} />}
            onClick={(e) => {
              handleDeleteFile(path.concat('/', contents[i]), e);
            }}
          />
        </Flex>
      </Box>
    );
  }

  return (
    <div
      className="test"
      style={{
        border: 'none',
        position: 'relative',
      }}
    >
      <Card
        bgColor="#050505"
        align="center"
        minW="15rem"
        w="15rem"
        minH="12rem"
        padding="10px 20px"
        borderRadius="15px"
        position="relative"
        onClick={() => {
          setOverlay(<OverlayOne />);
          nodeOnOpen();
        }}
        boxShadow={`0px 0px 7px 1px ${
          parentNode === null ? '#24FF00' : '#FFF616'
        }`}
      >
        <CardHeader>
          <Heading size="lg" color="#FFFFFF">
            {folderName}
          </Heading>
        </CardHeader>
        <CardBody padding="0">
          <div
            style={{
              marginTop: '25px',
              display: 'flex',
              gap: '15px',
            }}
          >
            {files}
          </div>
        </CardBody>
      </Card>

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
            parentNode === null ? '#24FF00' : '#FFF616'
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
        +
      </Button>
      
      { parentNode !== null && <Button
        position="absolute"
        bgColor="#050505"
        textColor="#050505"
        padding="0"
        right="left"
        bottom="0"
        h="100%"
        borderRadius="15px 0 0 15px"
        // linear-gradient(90deg, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%)
        _hover={{
          bg: `linear-gradient(270deg, #050505 0%, ${parentNode === null ? '#24FF00' : '#FFF616'
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
        -
      </Button>}

      {/* node modal */}
      <Modal isCentered isOpen={nodeIsOpen} onClose={nodeOnClose}>
        {overlay}
        <ModalContent
          boxShadow="2xl"
          bgColor="#454545"
          textColor="#FFFFFF"
          borderRadius="10px"
        >
          <ModalHeader>{folderName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack>{modalFiles}</Stack>
          </ModalBody>
          <ModalFooter display="flex" flexDir="column">
            {/* input form */}
            <FormControl>
              <Input
                id="fileName"
                type="text"
                bgColor="#121212"
                placeholder="new file name"
                onChange={(e) => {
                  setAddFileValue(e.currentTarget.value);
                }}
                value={addFileValue}
              />
            </FormControl>

            <Button
              bgColor="#010101"
              color="white"
              justifySelf="bottom"
              _hover={{ bg: 'white', textColor: 'black' }}
              onClick={(e) => {
                console.log(addFileValue);
                handleAddFile(path.concat('/', addFileValue), e);
              }}
            >
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* folder add modal */}
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
            <FormControl>
              <FormLabel>new folder name:</FormLabel>
              <Input
                id="folderName"
                type="text"
                bgColor="#121212"
                onChange={(e) => {
                  setAddFolderValue(e.currentTarget.value);
                }}
                value={addFolderValue}
              />
              <Button
                bgColor="#010101"
                color="white"
                onClick={(e) => {
                  handleAddFolder(path.concat('/', addFolderValue), e);
                  addOnClose();
                }}
              >
                Submit
              </Button>
            </FormControl>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>

      {/* folder delete modal */}
      <Modal isCentered isOpen={deleteIsOpen} onClose={deleteOnClose}>
        {overlay}
        <ModalContent
          //style modal here:
          boxShadow="2xl"
          bgColor="#454545"
          textColor="#FFFFFF"
          borderRadius="10px"
        >
          <ModalHeader>Delete Folder</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isInvalid={deleteFolderValue !== folderName}>
              <FormLabel>Type folder name to confirm:</FormLabel>
              <Input
                id="folderName"
                type="text"
                bgColor="#121212"
                placeholder={`${folderName}`}
                onChange={(e) => {
                  setDeleteFolderValue(e.currentTarget.value);
                }}
                value={deleteFolderValue}
              />
              <FormErrorMessage>Input must match folder name</FormErrorMessage>
              <Button
                bgColor="#010101"
                color="white"
                onClick={(e) => {
                  handleDeleteFolder(path, e);
                  deleteOnClose();
                }}
              >
                Submit
              </Button>
            </FormControl>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Node;
