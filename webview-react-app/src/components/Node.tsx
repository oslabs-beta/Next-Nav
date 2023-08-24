import React from "react";
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
        borderRadius="15px"
        onClick={
          () => {
            setOverlay(<OverlayOne />);
            addOnOpen();
          }
        }>
        +
      </Button>

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

      <Modal isCentered isOpen={addIsOpen} onClose={addOnClose}>
        {overlay}
        <ModalContent>
          <ModalHeader>Test</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Test</Text>
          </ModalBody>
          <ModalFooter>
            <Button onClick={addOnClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Node;
