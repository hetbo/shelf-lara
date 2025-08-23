export interface File {
    id: string;
    name: string;
    size: number;
    type: 'file';
    path: string;
    lastModified: string;
    url: string;
}
export interface Folder {
    id:string;
    name: string;
    type: 'folder';
    path: string;
    children: (Folder | File)[];
}

export type FolderTree = Folder;
