import { useRef } from 'react';

import { Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverCloseButton,
    PopoverBody,
    PopoverArrow,
    Portal,
    Box,
    Button,
    Flex,
    Icon,
    IconButton
  } from '@chakra-ui/react';

import { PiTrashFill } from 'react-icons/pi';
 
import { FileNode, ListItemProps } from '../../../utils/types';


const ListItem = ({props, handlePostMessage, isOpen, onClose, icon, fileName, containerRef}: ListItemProps): JSX.Element => {
  let path = props.path ?? '';
  let contents = props.contents ?? [];
  
  const ref = useRef(null);
  
  return (
    <Box>
        {' '}
        <Flex gap="2">
          {' '}
          <Button
            bgColor="#010101"
            color="white"
            flexGrow="3"
            _hover={{ bg: 'white', textColor: 'black' }}
            leftIcon={<Icon as={icon} />}
            onClick={() => {
              handlePostMessage(path.concat("/", fileName), "open_file");
            }}
          >
            {' '}
            {fileName}
          </Button>
          {/* <Spacer /> */}
          <Popover initialFocusRef={ref}>
          {({ onClose }) => (
            <>
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
              <Portal containerRef={containerRef}>
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
                      handlePostMessage(path.concat('/', fileName), 'deleteFile');
                      onClose();
                    }}
                    ref={ref}
                  >

                    Confirm
                    </Button>
                  </PopoverBody>
                </PopoverContent>
                </Portal>
              </>
            )}
          </Popover>
        </Flex>
      </Box>
  );
};

export default ListItem;