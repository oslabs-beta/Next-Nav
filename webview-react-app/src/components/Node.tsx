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
} from "@chakra-ui/react";
import { Background } from "reactflow";

type Props = {
  props: FileNode;
};

const Node = ({ props }: Props): JSX.Element => {
  //deconstruct props here. Used let to account for undefined checking.
  let { contents, parentNode, folderName }: FileNode = props;

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
      style={{
        border: "none",
      }}>
      <Card
        bgColor="#050505"
        align="center"
        minW="15rem"
        minH='12rem'
        padding="10px 20px"
        borderRadius="15px"
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
              display: "flex",
              gap: "15px",
            }}>
            {files}
          </div>
        </CardBody>
        <CardFooter>
          {/*Add on click for this button to open modal */}
          <Button bgColor="#303030" textColor='white' padding="0">
            +
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Node;
