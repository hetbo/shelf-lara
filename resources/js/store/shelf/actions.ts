import {ShelfState} from '../../types/shelf';
import * as shelfApi from '../../services/shelfApi';
import {insertFolderChildren, findFolderInTree} from './utils';

export const createFolderActions = (set: any, get: () => ShelfState) => ({
    loadRootFolders: async () => {
        set({isLoadingFolders: true});
        try {
            const {expandedFolders} = get();
            const expandedIds = Array.from(expandedFolders);

            const rootFoldersData = await shelfApi.fetchRootFolders();
            set({
                rootFolders: rootFoldersData.map(folder => ({...folder, isLoaded: false})),
                isLoadingFolders: false
            });

            for (const folderId of expandedIds) {
                await get().loadFolderChildren(folderId);
            }
        } catch (error) {
            console.error(error);
            set({isLoadingFolders: false});
        }
    },

    loadFolderChildren: async (folderId: number) => {
        try {
            const children = await shelfApi.fetchFolderChildren(folderId);
            const childrenWithLoadState = children.map(child => ({...child, isLoaded: false}));
            set((state: ShelfState) => ({
                rootFolders: insertFolderChildren(state.rootFolders, folderId, childrenWithLoadState)
            }));
        } catch (error) {
            console.error(error);
        }
    },

    toggleFolderExpansion: (folderId: number) => {
        const {expandedFolders, loadFolderChildren, rootFolders} = get();
        const newExpanded = new Set(expandedFolders);

        if (expandedFolders.has(folderId)) {
            newExpanded.delete(folderId);
        } else {
            newExpanded.add(folderId);
            const folder = findFolderInTree(rootFolders, folderId);
            if (folder && !folder.isLoaded) {
                loadFolderChildren(folderId);
            }
        }
        set({expandedFolders: newExpanded});
    },

    buildBreadcrumbsFromApi: async (folderId: number | null) => {
        if (!folderId) {
            set({breadcrumbs: [{id: null, name: 'Root', type: 'folder'}]});
            return;
        }
        try {
            const breadcrumbsData = await shelfApi.fetchBreadcrumbs(folderId);
            set({breadcrumbs: breadcrumbsData});
        } catch (error) {
            console.error(error);
        }
    },

    loadFolderContent: async (folderId: number | null) => {
        set({isLoadingContent: true, currentFolderId: folderId});
        try {
            const content = await shelfApi.fetchFolderContent(folderId);
            set({
                currentFolderContent: content,
                isLoadingContent: false
            });
        } catch (error) {
            console.error(error);
            set({
                currentFolderContent: {folders: [], files: []},
                isLoadingContent: false
            });
        }
    },

    loadFolderDetails: async (folderId: number) => {
        set({isLoadingDetails: true, selectedFileDetails: null});
        try {
            const folderDetails = await shelfApi.fetchFolderDetails(folderId);
            set({selectedFolderDetails: folderDetails, isLoadingDetails: false});
        } catch (error) {
            console.error(error);
            set({selectedFolderDetails: null, isLoadingDetails: false});
        }
    },

    loadFileDetails: async (fileId: number) => {
        set({isLoadingDetails: true, selectedFolderDetails: null});
        try {
            const fileDetails = await shelfApi.fetchFileDetails(fileId);
            set({selectedFileDetails: fileDetails, isLoadingDetails: false});
        } catch (error) {
            console.error(error);
            set({selectedFileDetails: null, isLoadingDetails: false});
        }
    }
});
