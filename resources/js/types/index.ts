export interface File {
    id: string;
    name: string;
    type: 'file';
}

export interface Folder {
    id: string;
    name: string;
    type: 'folder';
    children: (Folder | File)[];
}


export const isFolder = (item: Folder | File): item is Folder => {
    return item.type === 'folder';
};
