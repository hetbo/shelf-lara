import {ShelfState} from '../../types/shelf';

export const initialState: Omit<ShelfState, keyof ReturnType<any>> = {
    rootFolders: [],
    expandedFolders: new Set<number>(),
    selectedFolderId: null,
    selectedFileId: null,
    currentFolderContent: {folders: [], files: []},
    breadcrumbs: [{id: null, name: 'Root', type: 'folder'}],
    isLoadingFolders: false,
    isLoadingContent: false,
    selectedFolderDetails: null,
    selectedFileDetails: null,
    isLoadingDetails: false,
    renamingItem: null,
    clipboardItem: null,
    currentFolderId: null
};
