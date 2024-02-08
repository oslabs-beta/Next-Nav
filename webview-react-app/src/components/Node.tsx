import React from 'react';
import { FileNode } from './TreeContainer';
import { useVsCodeApi } from '../VsCodeApiContext';

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
import { PiFileCodeFill, PiDotsThreeOutlineFill } from 'react-icons/pi';
import {
  SiCss3,
  SiReact,
  SiJavascript,
  SiTypescript,
  SiSass,
  SiHtml5,
} from 'react-icons/si';
import { BiImport, BiArrowBack } from 'react-icons/bi';

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
  onPathChange: (string: string) => void;
  pathStack: Array<string>;
  onRemovePath: () => void;
  rootPath: string;
};

const Node = ({
  data,
  handlePostMessage,
  onPathChange,
  pathStack,
  onRemovePath,
  rootPath,
}: Props): JSX.Element => {
  //deconstruct props here. Used let to account for undefined checking.
  let { contents, parentNode, folderName, path, render }: FileNode = data;
  const vscode = useVsCodeApi();

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

  //function that creates a new view using this node as the root node when we go into a subtree
  const handleSubmitDir = () => {
    onPathChange(rootPath);
    console.log(vscode);
    console.log('Creating new root with', path);
    console.log('path', pathStack);
    vscode.postMessage({
      command: 'submitDir',
      folderName: path,
      showError: false,
    });
  };

  const handlePrevDir = () => {
    const newDir = pathStack[pathStack.length - 1];
    console.log('newDir', newDir);
    onRemovePath();
    console.log('path', pathStack);
    vscode.postMessage({
      command: 'submitDir',
      folderName: newDir,
      showError: false,
    });
  };

  // selects an icon to use based on a file name
  const getIcon = (fileString: string): [IconType, string] => {
    // store of file extensions and their respective icons and icon background color
    const iconStore: { [index: string]: [IconType, string] } = {
      default: [PiFileCodeFill, 'white'],
      html: [SiHtml5,'#e34c26'],
      css: [SiCss3, '#264de4'],
      sass: [SiSass, '#cf6d99'],
      scss: [SiSass, '#cf6d99'],
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
    //console.log('extension string', extStr);
    if (iconStore.hasOwnProperty(extStr)) {
      return iconStore[extStr];
    } else {
      return iconStore.default;
    }
  };
  //generate the amount of file icons based on the number of contents
  const files: JSX.Element[] = [];
  const length = Math.min(contents.length, 8);
  for (let i = 0; i < length; i++) {
    const icon = getIcon(contents[i]);
    files.push(
      <Tooltip label={`${contents[i]}`} fontSize='md'>
        <IconButton
          aria-label='file icon'
          isRound={true}
          variant={'solid'}
          color='#050505'
          backgroundColor={icon[1]}
          icon={<Icon as={icon[0]} />}
          onClick={(e) => {
            e.stopPropagation();
            handlePostMessage(path.concat('/', contents[i]), 'open_file');
          }}
        />
      </Tooltip>
    );
  }

  const boxShadowColor = render === 'client' ? '#ffcf9e' : '#9FFFCB';

  return (
    <div
      className='test'
      style={{
        border: 'none',
        position: 'relative',
      }}
    >
      <Card
        onClick={() => {
          nodeOnOpen();
        }}
        bgColor='#050505'
        align='center'
        minW='15rem'
        w='15rem'
        minH='12rem'
        padding='10px 20px'
        borderRadius='15px'
        position='relative'
        boxShadow={`0px 0px 7px 1px ${
          parentNode === null ? '#FF9ED2' : boxShadowColor
        }`}
      >
        <CardHeader>
          <Heading size='lg' color='#FFFFFF' wordBreak='break-word'>
            {folderName}
          </Heading>
        </CardHeader>
        <CardBody padding='0px 28px 0px 28px'>
          <HStack spacing='10px' wrap='wrap' justify={'center'}>
            {files}
            {contents.length > 8 && (
              <Tooltip label='more files' fontSize='md'>
                <IconButton
                  aria-label='more icon'
                  isRound={true}
                  variant={'solid'}
                  color='#050505'
                  backgroundColor={'#FFFFFF'}
                  icon={<Icon as={PiDotsThreeOutlineFill} />}
                />
              </Tooltip>
            )}
          </HStack>
        </CardBody>
        <CardFooter
          color='#454545'
          fontSize='20px'
          m='3px 0 0 0'
          padding='0'
          justify='space-between'
          alignItems='center'
          gap='5px'
        >
          {render === 'client' ? 'Client' : 'Server'}
          {parentNode !== null ? (
            //forward button
            <Tooltip label='subtree'>
              <IconButton
                size='lg'
                color='white'
                aria-label='set source'
                variant='ghost'
                icon={<Icon as={BiImport} />}
                _hover={{ bg: 'white', textColor: 'black' }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSubmitDir();
                }}
              />
            </Tooltip>
          ) : //back button
          pathStack.length === 0 ? null : (
            <Tooltip label='previous tree'>
              <IconButton
                size='lg'
                color='white'
                aria-label='set source'
                variant='ghost'
                icon={<Icon as={BiArrowBack} />}
                _hover={{ bg: 'white', textColor: 'black' }}
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevDir();
                }}
              />
            </Tooltip>
          )}
        </CardFooter>
      </Card>

      <FolderAdd
        path={path}
        parentNode={parentNode}
        render={render}
        handlePostMessage={handlePostMessage}
      />

      <FolderDelete
        path={path}
        folderName={folderName}
        parentNode={parentNode}
        render={render}
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
