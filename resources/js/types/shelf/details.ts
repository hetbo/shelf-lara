export interface FolderDetails {
    id: number;
    name: string;
    itemCount: number;
    createdAt: string;
    modifiedAt: string;
}

export interface FileDetails {
    id: number;
    name: string;
    extension: string;
    size: number;
    createdAt: string;
    modifiedAt: string;
}
