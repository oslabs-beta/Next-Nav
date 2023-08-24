import React, { useState } from "react";
import { FileNode } from "./TreeContainer";
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
  transition,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
} from "@chakra-ui/react";
import { Background } from "reactflow";

type Props = {
  props: FileNode;
};

const Node = ({ props }: Props): JSX.Element => {
  //deconstruct props here. Used let to account for undefined checking.
  let { contents, parentNode, folderName }: FileNode = props;

  const OverlayOne = () => (
    <ModalOverlay
      bg='blackAlpha.300'
      backdropFilter='blur(10px) hue-rotate(90deg)'
    />
  );

  const { isOpen: nodeIsOpen, onOpen: nodeOnOpen, onClose: nodeOnClose } = useDisclosure();
  const { isOpen: addIsOpen, onOpen: addOnOpen, onClose: addOnClose } = useDisclosure();
  const [overlay, setOverlay] = React.useState(<OverlayOne />);

  const [addFolderValue, setAddFolderValue] = useState('');

  //ensures obj.contents is never undefined
  if (!contents) {
    contents = [];
  }

  //generate the amount of file icons based on the number of contents
  const files: JSX.Element[] = [];
  for (let i = 0; i < contents.length; i++) {
    files.push(
      <div
        style={{
          borderRadius: "3px",
          border: "1px solid white",
          rotate: "45deg",
          width: "20px",
          height: "20px",
          backgroundColor: "black",
        }}></div>
    );
  }

  return (
    <div
      className="test"
      style={{
        border: "none",
        position: "relative",
      }}>
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
          parentNode === null ? "#24FF00" : "#FFF616"
        }`}>
        <CardHeader>
          <Heading size="lg" color="#FFFFFF">
            {folderName}
          </Heading>
        </CardHeader>
        <CardBody padding="0">
          <div
            style={{
              marginTop: "25px",
              display: "flex",
              gap: "15px",
            }}>
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
          parentNode === null ? "#24FF00" : "#FFF616"
        } 100%)`,
        }}
        // _hover={{boxShadow: `0px 0px 7px 1px ${
        //   parentNode === null ? "#24FF00" : "#FFF616"
        // }`, textColor: 'white'}}
        onClick={
          () => {
            setOverlay(<OverlayOne />);
            addOnOpen();
          }
        }>
        +
      </Button>

        {/* node modal */}
      <Modal isCentered isOpen={nodeIsOpen} onClose={nodeOnClose}>
        {overlay}
        <ModalContent>
          <ModalHeader>{folderName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>{contents}</Text>
          </ModalBody>
          <ModalFooter>
            <Button onClick={nodeOnClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

        {/* folder add modal */}
      <Modal 
        isCentered isOpen={addIsOpen} 
        onClose={addOnClose}

      >
          {overlay}
        <ModalContent
          //style modal here:
          boxShadow='2xl'
          bgColor="#454545"
          textColor='#FFFFFF'
          borderRadius="10px"
        >
            <ModalHeader>Add Folder</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl>
                <FormLabel>new folder name:</FormLabel>
                <Input
                  id='folderName'
                  type='text'
                  bgColor='#121212'
                  onChange={(e) => { setAddFolderValue(e.currentTarget.value); }}
                  value={addFolderValue} />
              </FormControl>
            </ModalBody>
            <ModalFooter>
            <Button
              bgColor="#010101"
              color="white"
              onClick={() => {
                  console.log(addFolderValue);
                  addOnClose();
                }
              }>Submit</Button>
            </ModalFooter>
          </ModalContent>
      </Modal>
    </div>
  );
};

export default Node;
