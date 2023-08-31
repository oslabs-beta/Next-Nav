//directory
export interface Directory {
    id: number,
    folderName: string,
    parentNode: number | null,
    path: string,
    render: 'server' | 'client',
    contents: (string | Directory)[];
  }
