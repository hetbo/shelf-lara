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

export interface Folder {
    id: number;
    name: string;
    parent_id: number | null;
    user_id: number;
    created_at: string;
    updated_at: string;
    children?: Folder[];
    isLoaded?: boolean;
    has_children: boolean
}

export interface File {
    id: number;
    filename: string;
    path: string;
    disc: string;
    mime_type: string;
    size: number;
    hash: string;
    user_id: number;
    folder_id: number | null;
    created_at: string;
    updated_at: string;
    metadata?: FileMetadata[];
}

export interface FileMetadata {
    id: number;
    file_id: number;
    key: string;
    value: string;
}

export interface Fileable {
    id: number;
    file_id: number;
    fileable_type: string;
    fileable_id: number;
    role: string;
    order: number;
    metadata: Record<string, any>;
}

export interface BreadcrumbItem {
    id: number | null;
    name: string;
    type: 'folder' | 'file';
}

export interface FolderContent {
    folders: Folder[];
    files: File[];
}

export interface ShelfState {
    // Folder Tree State
    rootFolders: Folder[];
    expandedFolders: Set<number>;

    // Current Selection
    selectedFolderId: number | null;
    selectedFileId: number | null;

    // Main Content
    currentFolderContent: FolderContent;

    // Navigation
    breadcrumbs: BreadcrumbItem[];

    // Loading States
    isLoadingFolders: boolean;
    isLoadingContent: boolean;

    selectedFolderDetails: FolderDetails | null;
    selectedFileDetails: FileDetails | null;
    isLoadingDetails: boolean;

    renamingItem: { id: number; type: 'file' | 'folder' } | null;

    // Actions
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
}
