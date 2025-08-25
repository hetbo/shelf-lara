import {Folder, File} from './entities';

export interface BreadcrumbItem {
    id: number | null;
    name: string;
    type: 'folder' | 'file';
}

export interface FolderContent {
    folders: Folder[];
    files: File[];
}
