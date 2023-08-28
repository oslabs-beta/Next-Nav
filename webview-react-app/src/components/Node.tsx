import React, { useState } from 'react';
import { FileNode } from './TreeContainer';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Container,
  Heading,
  HStack,
  Button,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
  Portal,
  useDisclosure,
  Stack,
  Box,
  Spacer,
  Icon,
  Flex,
  IconButton,
  Tooltip,
  transition,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
} from '@chakra-ui/react';
import {
  PiTrashFill,
  PiFilePlusFill,
  PiFolderNotchPlusFill,
  PiFileCodeFill,
} from 'react-icons/pi';

import { SiCss3, SiReact, SiJavascript, SiTypescript } from 'react-icons/si';

import { Background } from 'reactflow';
import { useVsCodeApi } from '../VsCodeApiContext';
import { IconType } from 'react-icons';

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

  const ref = React.useRef(null);

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
    event:
      | React.MouseEvent<HTMLButtonElement>
      | React.KeyboardEvent<HTMLInputElement>
  ) => void = (filePath, event) => {
    console.log(path);
    vscode.postMessage({
      command: 'addFile',
      filePath: filePath,
    });
    setAddFileValue('');
  };

  const handleAddFolder: (
    filePath: string,
    event:
      | React.MouseEvent<HTMLButtonElement>
      | React.KeyboardEvent<HTMLInputElement>
  ) => void = (filePath, event) => {
    console.log(path);
    vscode.postMessage({
      command: 'addFolder',
      filePath: filePath,
    });
    setAddFolderValue('');
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
    event:
      | React.MouseEvent<HTMLButtonElement>
      | React.KeyboardEvent<HTMLInputElement>
  ) => void = (filePath, event) => {
    vscode.postMessage({
      command: 'deleteFolder',
      filePath: filePath,
    });
    setDeleteFolderValue('');
  };

  // interface iconDic {
  //   default: IconType;
  //   css: IconType;
  //   jsx: IconType;
  //   js: IconType;
  //   ts: IconType;
  //   tsx: IconType;
  // }

  // selects an icon to use based on a file name
  const getIcon = (fileString: string): [IconType, string] => {
    // store of file extensions and their respective icons and icon background color
    const iconStore: { [index: string]: [IconType, string] } = {
      default: [PiFileCodeFill, 'white'],
      css: [SiCss3, '#264de4'],
      jsx: [SiReact, '#61DBFB'],
      js: [SiJavascript, '#f7df1e'],
      ts: [SiTypescript, '#007acc'],
      tsx: [SiReact, '#007acc'],
    };
    // finds files extension type with regEx matching
    const ext: RegExpMatchArray | null = fileString.match(/[^.]*$/); //['ts']
    // returns a default icon for non-matching files
    if (ext === null) {
      return iconStore.default;
    }
    // converts extension to lowercase
    const extStr: string = ext[0].toLowerCase();
    console.log('extension string', extStr);
    if (iconStore.hasOwnProperty(extStr)) {
      return iconStore[extStr];
    } else {
      return iconStore.default;
    }
  };
  //generate the amount of file icons based on the number of contents
  const files: JSX.Element[] = [];
  const modalFiles: JSX.Element[] = [];
  for (let i = 0; i < contents.length; i++) {
    const icon = getIcon(contents[i]);
    files.push(
      // <div
      //   style={{
      //     borderRadius: '3px',
      //     border: '1px solid white',
      //     rotate: '45deg',
      //     width: '20px',
      //     height: '20px',
      //     backgroundColor: 'black',
      //   }}
      // ></div>
      <Tooltip label={`${contents[i]}`} fontSize="md">
        <IconButton
          aria-label="file icon"
          isRound={true}
          variant={'solid'}
          color="#050505"
          backgroundColor={icon[1]}
          icon={<Icon as={icon[0]} />}
          onClick={(e) => {
            handleOpenTab(path.concat('/', contents[i]), e);
          }}
        />
      </Tooltip>
    );
    // generates modal stack elements with passed in file icon
    modalFiles.push(
      <Box>
        {' '}
        <Flex gap="2">
          {' '}
          <Button
            bgColor="#010101"
            color="white"
            flexGrow="3"
            _hover={{ bg: 'white', textColor: 'black' }}
            leftIcon={<Icon as={icon[0]} />}
            onClick={(e) => {
              handleOpenTab(path.concat('/', contents[i]), e);
            }}
          >
            {' '}
            {contents[i]}
          </Button>
          {/* <Spacer /> */}
          <Popover>
            <PopoverTrigger>
              <IconButton
                isRound={true}
                variant="solid"
                size="md"
                colorScheme="red"
                aria-label="Done"
                icon={<Icon as={PiTrashFill} />}
              />
            </PopoverTrigger>
            <Portal containerRef={ref}>
              <PopoverContent
                // boxShadow="2xl"
                bgColor="#010101"
                textColor="#FFFFFF"
                borderRadius="10px"
                maxWidth="unset"
                width="unset"
              >
                <PopoverArrow bgColor="#010101" />
                <PopoverBody>
                  <Button
                    size="sm"
                    colorScheme="red"
                    onClick={(e) => {
                      handleDeleteFile(path.concat('/', contents[i]), e);
                    }}
                  >
                    Confirm
                  </Button>
                </PopoverBody>
              </PopoverContent>
            </Portal>
          </Popover>
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
        onClick={() => {
          setOverlay(<OverlayOne />);
          nodeOnOpen();
        }}
        bgColor="#050505"
        align="center"
        minW="15rem"
        w="15rem"
        minH="12rem"
        padding="10px 20px"
        borderRadius="15px"
        position="relative"
        boxShadow={`0px 0px 7px 1px ${
          parentNode === null ? '#24FF00' : '#FFF616'
        }`}
      >
        <CardHeader>
          <Heading size="lg" color="#FFFFFF">
            {folderName}
          </Heading>
        </CardHeader>
        <CardBody padding="0px 28px 0px 28px">
          {/* <div
            style={{
              marginTop: '25px',
              display: 'flex',
              gap: '15px',
            }}
          >
            
          </div> */}
          {/* <Container maxW="15rem"> */}
          <HStack spacing="10px" wrap="wrap" justify={'center'}>
            {files}
          </HStack>
          {/* </Container> */}
        </CardBody>
        <CardFooter
        // onClick={() => {
        //   setOverlay(<OverlayOne />);
        //   nodeOnOpen();
        // }}
        ></CardFooter>
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

      {parentNode !== null && (
        <Button
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
            bg: `linear-gradient(270deg, #050505 0%, ${
              parentNode === null ? '#24FF00' : '#FFF616'
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
        </Button>
      )}

      {/* node modal */}
      <Modal isCentered isOpen={nodeIsOpen} onClose={nodeOnClose}>
        {overlay}
        <ModalContent
          boxShadow="2xl"
          bgColor="#454545"
          textColor="#FFFFFF"
          borderRadius="10px"
          ref={ref}
        >
          <ModalHeader>{folderName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={'0.75rem'}>{modalFiles}</Stack>
          </ModalBody>
          <ModalFooter display="flex" flexDir="row" gap="2">
            {/* input form */}
            <FormControl justifyContent={'center'}>
              <Input
                id="fileName"
                type="text"
                bgColor="#121212"
                placeholder="file name"
                flexGrow="3"
                textAlign="center"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddFile(path.concat('/', addFileValue), e);
                  }
                }}
                onChange={(e) => {
                  setAddFileValue(e.currentTarget.value);
                }}
                value={addFileValue}
              />
            </FormControl>

            <IconButton
              color="white"
              justifySelf="bottom"
              aria-label="file add button"
              isRound={true}
              variant="solid"
              size="md"
              isDisabled={!addFileValue}
              colorScheme="green"
              icon={<Icon as={PiFilePlusFill} />}
              onClick={(e) => {
                console.log(addFileValue);
                handleAddFile(path.concat('/', addFileValue), e);
              }}
            />
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
                    handleAddFolder(path.concat('/', addFolderValue), e);
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
                  handleAddFolder(path.concat('/', addFolderValue), e);
                  addOnClose();
                }}
              />
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
          <ModalBody display="flex" gap="2" flexDir="row">
            <FormControl
              flexDir="column"
              isInvalid={deleteFolderValue !== folderName}
            >
              <Input
                id="folderName"
                type="text"
                bgColor="#121212"
                textAlign="center"
                flexGrow="3"
                placeholder={`${folderName}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleDeleteFolder(path, e);
                    deleteOnClose();
                  }
                }}
                onChange={(e) => {
                  setDeleteFolderValue(e.currentTarget.value);
                }}
                value={deleteFolderValue}
              />
              <FormErrorMessage justifyContent="center">
                Input must match folder name
              </FormErrorMessage>
            </FormControl>
            <Button
              isDisabled={deleteFolderValue !== folderName}
              colorScheme="red"
              onClick={(e) => {
                handleDeleteFolder(path, e);
                deleteOnClose();
              }}
            >
              Confirm
            </Button>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Node;
