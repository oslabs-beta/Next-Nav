// import React from 'react';
// import { FileNode } from './TreeContainer';
// import { Text } from '@chakra-ui/react';
// import { Button, ButtonGroup } from '@chakra-ui/react';
// import { useDisclosure } from '@chakra-ui/react';
// import Node from './Node';
// import {
//     Modal,
//     ModalOverlay,
//     ModalContent,
//     ModalHeader,
//     ModalFooter,
//     ModalBody,
//     ModalCloseButton,
//   } from '@chakra-ui/react';

//   type Props = {
//     obj: FileNode
//     direction: string
//   };

//   export default function NodeModal({ obj, direction }: Props): JSX.Element {
//     const OverlayOne = () => (
//       <ModalOverlay
//         bg='blackAlpha.300'
//         backdropFilter='blur(10px) hue-rotate(90deg)'
//       />
//     );
  
//     const { isOpen, onOpen, onClose } = useDisclosure();
//     const [overlay, setOverlay] = React.useState(<OverlayOne />);
  
//     return (
//       <>
//         <Button
//           onClick={() => {
//             setOverlay(<OverlayOne />);
//             onOpen();
//           }}
//           w="14rem">
//           <Node props={obj} direction={direction} />
//         </Button>
//         <Button
//           bgColor="white"
//           textColor="#050505"
//           padding="0"
//           ml='-30px'
//           h="100%"
//           borderRadius="15px"
//           onClick={() => alert("adding a new node")}>
//           Test
//         </Button>

//         <Modal isCentered isOpen={isOpen} onClose={onClose}>
//           {overlay}
//           <ModalContent>
//             <ModalHeader>{obj.folderName}</ModalHeader>
//             <ModalCloseButton />
//             <ModalBody>
//               <Text>{obj.contents}</Text>
//             </ModalBody>
//             <ModalFooter>
//               <Button onClick={onClose}>Close</Button>
//             </ModalFooter>
//           </ModalContent>
//         </Modal>
//       </>
//     );
//   }