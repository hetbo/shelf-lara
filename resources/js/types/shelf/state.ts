import {Folder} from './entities';
import {FolderDetails, FileDetails} from './details';
import {BreadcrumbItem, FolderContent} from './navigation';
import {ClipboardItem} from './operations';

export interface ShelfState {
    rootFolders: Folder[];
    expandedFolders: Set<number>;
    selectedFolderId: number | null;
    selectedFileId: number | null;
    currentFolderContent: FolderContent;
    breadcrumbs: BreadcrumbItem[];
    isLoadingFolders: boolean;
    isLoadingContent: boolean;
    selectedFolderDetails: FolderDetails | null;
    selectedFileDetails: FileDetails | null;
    isLoadingDetails: boolean;
    renamingItem: { id: number; type: 'file' | 'folder' } | null;
    clipboardItem: ClipboardItem | null;
    copyItem: (id: number, type: 'file' | 'folder', name: string) => void;
    cutItem: (id: number, type: 'file' | 'folder', name: string) => void;
    pasteItem: (destinationFolderId: number | null) => Promise<void>;
    currentFolderId: number | null;
    loadRootFolders: () => Promise<void>;
    loadFolderChildren: (folderId: number) => Promise<void>;
    selectFolder: (folderId: number | null) => void;
    selectFile: (fileId: number | null) => void;
    toggleFolderExpansion: (folderId: number) => void;
    loadFolderContent: (folderId: number | null) => Promise<void>;
    buildBreadcrumbsFromApi: (folderId: number | null) => Promise<void>;
    loadFolderDetails: (folderId: number) => Promise<void>;
    loadFileDetails: (fileId: number) => Promise<void>;
    startRename: (item: { id: number; type: 'file' | 'folder' }) => void;
    cancelRename: () => void;
    confirmRename: (newName: string) => Promise<void>;
    clearClipboard: () => void;
    deleteItem: (item: { id: number; type: 'file' | 'folder' }) => Promise<void>;
}
