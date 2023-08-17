export default interface Directory {
    id: number;
    folderName: string;
    parentNode: number | null;
    contents: (string | Directory)[];
  }