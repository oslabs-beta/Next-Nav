//directory
export interface Directory {
    id: number;
    folderName: string;
    parentNode: number | null;
    contents: (string | Directory)[];
  }

  //for finding a directory
  export interface Output {
    status: string,
    message?: string,
    data?: string,
  }