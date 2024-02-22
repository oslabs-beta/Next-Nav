import  { useState, useRef } from 'react';
import { FileNode } from '../TreeContainer';
import { IconType } from 'react-icons';
import {
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
  PopoverCloseButton,
  PopoverBody,
  PopoverArrow,
  Portal,
  Stack,
  Box,
  Button,
  Icon,
  Flex,
  IconButton,
  FormControl,
  Input,
} from '@chakra-ui/react';
import { PiTrashFill, PiFilePlusFill } from 'react-icons/pi';

import { useVsCodeApi } from '../../VsCodeApiContext';
import ListItem from './ListItem';

type Props = {
  props: FileNode;
  handlePostMessage: (filePath: string,
    command: string,
    setterFunc?: (string: string) => any) => void;
  getIcon: (id: string) => [IconType, string];
  isOpen: boolean;
  onClose: () => void;
  clickWrapper: Function,
  isDefault: boolean
};
const DetailsView = ({ props, handlePostMessage, getIcon, isOpen, onClose, clickWrapper, isDefault }: Props): JSX.Element => {
  let { contents, folderName, path }: FileNode = props;
  const vscode = useVsCodeApi();
  const ref = useRef(null);
  const [addFileValue, setAddFileValue] = useState('');

  if (!contents) {
    contents = [];
  }
  if (!path) {
    path = '';
  }
  const modalFiles: JSX.Element[] = [];
  for (let i = 0; i < contents.length; i++) {
    const icon = getIcon(contents[i]);
    modalFiles.push(
      <ListItem props={props} handlePostMessage={handlePostMessage} isOpen={isOpen} onClose={onClose} icon={icon[0]} fileName={contents[i]} containerRef={ref}/>
    );
  }

  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose} trapFocus={false}>
      <ModalOverlay
        bg="blackAlpha.300"
        backdropFilter="blur(10px) hue-rotate(90deg)"
      />
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
              autoFocus
              type="text"
              bgColor="#121212"
              placeholder="file name"
              flexGrow="3"
              textAlign="center"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  clickWrapper(handlePostMessage, isDefault, path.concat('/', addFileValue), 'addFile', setAddFileValue);                  
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
              clickWrapper(handlePostMessage, isDefault, path.concat('/', addFileValue), 'addFile', setAddFileValue);
            }}
          />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DetailsView;
