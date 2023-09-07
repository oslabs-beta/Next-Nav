import React, { useState } from 'react';
import { FileNode } from '../TreeContainer';
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

type Props = {
  props: FileNode;
  handlePostMessage: (filePath: string,
    command: string,
    setterFunc?: (string: string) => any) => void;
  getIcon: Function;
  isOpen: boolean;
  onClose: () => void;
};
const DetailsView = ({ props, handlePostMessage, getIcon, isOpen, onClose }: Props): JSX.Element => {
  let { contents, folderName, path }: FileNode = props;
  const vscode = useVsCodeApi();
  const ref = React.useRef(null);
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
            onClick={() => {
              handlePostMessage(path.concat("/", contents[i]), "open_file");
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
                      handlePostMessage(path.concat('/', contents[i]), 'deleteFile');
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
              type="text"
              bgColor="#121212"
              placeholder="file name"
              flexGrow="3"
              textAlign="center"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handlePostMessage(path.concat('/', addFileValue), 'addFile', setAddFileValue);
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
              handlePostMessage(path.concat('/', addFileValue), 'addFile', setAddFileValue);
            }}
          />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DetailsView;
