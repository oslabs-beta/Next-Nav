import React from 'react';
import { FileNode } from './TreeContainer';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  Button,
  Text,
} from '@chakra-ui/react';

type Props = {
  obj: FileNode;
};

const Node = ({ obj }: Props): JSX.Element => {
  if (!obj.contents) {
    obj.contents = [];
  }
  const files = obj.contents.map((el) => {
    return <li>{el}</li>;
  });
  return (
    <div style={{ border: 'none' }}>
      <Card align="center" padding="1px 30px">
        <CardHeader>
          <Heading size="md"> {obj.folderName}</Heading>
        </CardHeader>
        <CardBody>
          <Text>
            <ul>{files}</ul>
          </Text>
        </CardBody>
        <CardFooter>
          <Button colorScheme="blue">View here</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Node;
