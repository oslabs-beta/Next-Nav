import { IconType } from 'react-icons';

export type FileNode = {
  id: number;
  folderName: string;
  parentNode: number | null;
  contents?: string[];
  path?: string;
  render?: string;
};

export type Tree = FileNode[];

export type NodeProps = {
  props: FileNode;
  pathStack?: Array<string>;
  rootPath?: string;
  isOpen: boolean;
  icon?: [IconType, string];
  handlePostMessage: (
    filePath: string,
    command: string,
    setterFunc?: (string: string) => any
  ) => void;
  onPathChange?: (string: string) => void;
  getIcon?: (id: string) => [IconType, string];
  onRemovePath?: () => void;
  onClose: () => void;
};

export type ListItemProps = {
  props: FileNode;
  isOpen: boolean;
  icon: IconType;
  fileName: string;
  containerRef: React.RefObject<HTMLDivElement>;
  handlePostMessage: (
    filePath: string,
    command: string,
    setterFunc?: (string: string) => any
  ) => void;
  onClose: () => void;
};