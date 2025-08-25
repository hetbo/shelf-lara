import {ShelfState} from '../../types/shelf';

export const createSelectionActions = (set: any, get: () => ShelfState) => ({
    selectFolder: async (folderId: number | null) => {
        const {loadFolderContent, buildBreadcrumbsFromApi, loadFolderDetails, expandFolderPath} = get();

        set({
            selectedFolderId: folderId,
            selectedFileId: null,
            selectedFileDetails: null,
            renamingItem: null,
            currentFolderId: folderId
        });

        buildBreadcrumbsFromApi(folderId);
        loadFolderContent(folderId);

        if (folderId) {
            loadFolderDetails(folderId);
            await expandFolderPath(folderId);
        } else {
            set({selectedFolderDetails: null});
        }
    },

    selectFile: (fileId: number | null) => {
        const {loadFileDetails} = get();

        set({
            selectedFileId: fileId,
            selectedFolderId: null,
            selectedFolderDetails: null,
            renamingItem: null
        });

        if (fileId) {
            loadFileDetails(fileId);
        } else {
            set({selectedFileDetails: null});
        }
    }
});
