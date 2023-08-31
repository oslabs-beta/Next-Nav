import React from 'react';
import { FileNode } from './TreeContainer';

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  HStack,
  useDisclosure,
  Icon,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';

import { IconType } from 'react-icons';
import { PiFileCodeFill } from 'react-icons/pi';
import { SiCss3, SiReact, SiJavascript, SiTypescript } from 'react-icons/si';

import DetailsView from './modals/DetailsView';
import FolderAdd from './modals/FolderAdd';
import FolderDelete from './modals/FolderDelete';

type Props = {
  data: FileNode;
  handlePostMessage: (
    filePath: string,
    command: string,
    setterFunc?: (string: string) => any
  ) => void;
};

const Node = ({ data, handlePostMessage }: Props): JSX.Element => {
  //deconstruct props here. Used let to account for undefined checking.
  let { contents, parentNode, folderName, path }: FileNode = data;

  const {
    isOpen: nodeIsOpen,
    onOpen: nodeOnOpen,
    onClose: nodeOnClose,
  } = useDisclosure();

  //ensures obj.contents is never undefined
  if (!contents) {
    contents = [];
  }
  if (!path) {
    path = '';
  }

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

  for (let i = 0; i < contents.length; i++) {
    const icon = getIcon(contents[i]);
    files.push(
      <Tooltip label={`${contents[i]}`} fontSize="md">
        <IconButton
          aria-label="file icon"
          isRound={true}
          variant={'solid'}
          color="#050505"
          backgroundColor={icon[1]}
          icon={<Icon as={icon[0]} />}
          onClick={() => {
            handlePostMessage(path.concat('/', contents[i]), 'open_file');
          }}
        />
      </Tooltip>
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
          parentNode === null ? '#FF9ED2' : '#9FFFCB'
        }`}
      >
        <CardHeader>
          <Heading size="lg" color="#FFFFFF">
            {folderName}
          </Heading>
        </CardHeader>
        <CardBody padding="0px 28px 0px 28px">
          <HStack spacing="10px" wrap="wrap" justify={'center'}>
            {files}
          </HStack>
        </CardBody>
        <CardFooter></CardFooter>
      </Card>

      <FolderAdd
        path={path}
        parentNode={parentNode}
        handlePostMessage={handlePostMessage}
      />

      <FolderDelete
        path={path}
        folderName={folderName}
        parentNode={parentNode}
        handlePostMessage={handlePostMessage}
      />

      {/* node modal */}
      <DetailsView
        props={data}
        handlePostMessage={handlePostMessage}
        getIcon={getIcon}
        isOpen={nodeIsOpen}
        onClose={nodeOnClose}
      />
    </div>
  );
};

export default Node;
