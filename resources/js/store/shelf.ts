import { create } from 'zustand';
import { ShelfState, Folder } from '../types/shelf';
// 1. Import all our new API functions
import * as shelfApi from '../services/shelfApi';

// Helper function remains unchanged as it's pure state logic
const insertFolderChildren = (folders: Folder[], parentId: number, children: Folder[]): Folder[] => {
    return folders.map(folder => {
        if (folder.id === parentId) {
            return { ...folder, children: children, isLoaded: true };
        } else if (folder.children) {
            return { ...folder, children: insertFolderChildren(folder.children, parentId, children) };
        }
        return folder;
    });
};

// Helper function to update folder names in tree recursively
const updateFolderInTree = (folders: Folder[], targetId: number, newName: string): Folder[] => {
    return folders.map(folder => {
        if (folder.id === targetId) {
            return { ...folder, name: newName };
        } else if (folder.children) {
            return { ...folder, children: updateFolderInTree(folder.children, targetId, newName) };
        }
        return folder;
    });
};

export const useShelfStore = create<ShelfState>()(
        (set, get) => ({
            // --- INITIAL STATE (Unchanged) ---
            rootFolders: [],
            expandedFolders: new Set<number>(),
            selectedFolderId: null,
            selectedFileId: null,
            currentFolderContent: { folders: [], files: [] },
            breadcrumbs: [{ id: null, name: 'Root', type: 'folder' }],
            isLoadingFolders: false,
            isLoadingContent: false,
            selectedFolderDetails: null,
            selectedFileDetails: null,
            isLoadingDetails: false,
            renamingItem: null,
            clipboardItem: null,
            currentFolderId: null,

            // --- REFACTORED ACTIONS ---

            loadRootFolders: async () => {
                set({ isLoadingFolders: true });
                try {
                    // 2. Call the API service instead of fetch
                    const rootFoldersData = await shelfApi.fetchRootFolders();
                    set({
                        rootFolders: rootFoldersData.map(folder => ({ ...folder, isLoaded: false })),
                        isLoadingFolders: false
                    });
                } catch (error) {
                    console.error(error);
                    set({ isLoadingFolders: false });
                }
            },

            loadFolderChildren: async (folderId: number) => {
                try {
                    // 3. Call the API service
                    const children = await shelfApi.fetchFolderChildren(folderId);
                    const childrenWithLoadState = children.map(child => ({ ...child, isLoaded: false }));
                    set(state => ({
                        rootFolders: insertFolderChildren(state.rootFolders, folderId, childrenWithLoadState)
                    }));
                } catch (error) {
                    console.error(error);
                }
            },

            // This action's internal logic remains the same, but it now calls a decoupled `loadFolderChildren`
            toggleFolderExpansion: (folderId: number) => {
                const { expandedFolders, loadFolderChildren, rootFolders } = get();
                const newExpanded = new Set(expandedFolders);

                if (expandedFolders.has(folderId)) {
                    newExpanded.delete(folderId);
                } else {
                    newExpanded.add(folderId);
                    const findFolder = (folders: Folder[], targetId: number): Folder | null => {
                        for (const folder of folders) {
                            if (folder.id === targetId) return folder;
                            if (folder.children) {
                                const result = findFolder(folder.children, targetId);
                                if (result) return result;
                            }
                        }
                        return null;
                    };
                    const folder = findFolder(rootFolders, folderId);
                    if (folder && !folder.isLoaded) {
                        loadFolderChildren(folderId);
                    }
                }
                set({ expandedFolders: newExpanded });
            },

            buildBreadcrumbsFromApi: async (folderId: number | null) => {
                if (!folderId) {
                    set({ breadcrumbs: [{ id: null, name: 'Root', type: 'folder' }] });
                    return;
                }
                try {
                    // 4. Call the API service
                    const breadcrumbsData = await shelfApi.fetchBreadcrumbs(folderId);
                    set({ breadcrumbs: breadcrumbsData });
                } catch (error) {
                    console.error(error);
                }
            },

            selectFolder: (folderId: number | null) => {
                const { loadFolderContent, buildBreadcrumbsFromApi, loadFolderDetails } = get();

                set({
                    selectedFolderId: folderId,
                    selectedFileId: null,  // Clear file selection when folder is selected
                    selectedFileDetails: null,
                    renamingItem: null,     // Cancel any ongoing rename
                    currentFolderId: folderId
                });

                buildBreadcrumbsFromApi(folderId);
                loadFolderContent(folderId);

                if (folderId) {
                    loadFolderDetails(folderId);
                } else {
                    set({ selectedFolderDetails: null });
                }
            },

            selectFile: (fileId: number | null) => {
                const { loadFileDetails } = get();

                set({
                    selectedFileId: fileId,
                    selectedFolderId: null,  // Clear folder selection when file is selected
                    selectedFolderDetails: null,
                    renamingItem: null       // Cancel any ongoing rename
                });

                if (fileId) {
                    loadFileDetails(fileId);
                } else {
                    set({ selectedFileDetails: null });
                }
            },


            loadFolderContent: async (folderId: number | null) => {
                set({ isLoadingContent: true, currentFolderId: folderId });
                try {
                    // 5. Call the API service
                    const content = await shelfApi.fetchFolderContent(folderId);
                    set({
                        currentFolderContent: content,
                        isLoadingContent: false
                    });
                } catch (error) {
                    console.error(error);
                    set({
                        currentFolderContent: { folders: [], files: [] },
                        isLoadingContent: false
                    });
                }
            },

            loadFolderDetails: async (folderId: number) => {
                set({ isLoadingDetails: true, selectedFileDetails: null });
                try {
                    // 6. Call the API service
                    const folderDetails = await shelfApi.fetchFolderDetails(folderId);
                    set({ selectedFolderDetails: folderDetails, isLoadingDetails: false });
                } catch (error) {
                    console.error(error);
                    set({ selectedFolderDetails: null, isLoadingDetails: false });
                }
            },

            loadFileDetails: async (fileId: number) => {
                set({ isLoadingDetails: true, selectedFolderDetails: null });
                try {
                    // 7. Call the API service
                    const fileDetails = await shelfApi.fetchFileDetails(fileId);
                    set({ selectedFileDetails: fileDetails, isLoadingDetails: false });
                } catch (error) {
                    console.error(error);
                    set({ selectedFileDetails: null, isLoadingDetails: false });
                }
            },
            startRename: (item) => {
                set({ renamingItem: item });
            },

            cancelRename: () => {
                set({ renamingItem: null });
            },

            confirmRename: async (newName) => {
                const itemToRename = get().renamingItem;
                if (!itemToRename) return;

                set({ renamingItem: null });

                try {
                    await shelfApi.renameItem(itemToRename.id, itemToRename.type, newName);

                    const state = get();

                    if (itemToRename.type === 'folder') {
                        if (state.selectedFolderId === itemToRename.id && state.selectedFolderDetails) {
                            set({
                                selectedFolderDetails: {
                                    ...state.selectedFolderDetails,
                                    name: newName
                                }
                            });
                        }

                        const updatedContent = {
                            ...state.currentFolderContent,
                            folders: state.currentFolderContent.folders.map(folder =>
                                folder.id === itemToRename.id ? { ...folder, name: newName } : folder
                            )
                        };
                        set({ currentFolderContent: updatedContent });

                        const updateFolderInTree = (folders: Folder[]): Folder[] => {
                            return folders.map(folder => {
                                if (folder.id === itemToRename.id) {
                                    return { ...folder, name: newName };
                                } else if (folder.children) {
                                    return { ...folder, children: updateFolderInTree(folder.children) };
                                }
                                return folder;
                            });
                        };

                        set({ rootFolders: updateFolderInTree(state.rootFolders) });

                        const updatedBreadcrumbs = state.breadcrumbs.map(breadcrumb =>
                            breadcrumb.id === itemToRename.id ? { ...breadcrumb, name: newName } : breadcrumb
                        );
                        set({ breadcrumbs: updatedBreadcrumbs });

                    } else {
                        // Update file details if this is the selected file
                        if (state.selectedFileId === itemToRename.id && state.selectedFileDetails) {
                            set({
                                selectedFileDetails: {
                                    ...state.selectedFileDetails,
                                    name: newName
                                }
                            });
                        }

                        // Update in current folder content if visible
                        const updatedContent = {
                            ...state.currentFolderContent,
                            files: state.currentFolderContent.files.map(file =>
                                file.id === itemToRename.id ? { ...file, filename: newName } : file
                            )
                        };
                        set({ currentFolderContent: updatedContent });
                    }

                } catch (error) {
                    console.error("Failed to rename item:", error);
                    // Here you would trigger a UI notification to inform the user of the failure.
                }
            },
            copyItem: (id: number, type: 'file', name: string) => {
                set({ clipboardItem: { id, type, name } });
            },

            pasteItem: async (destinationFolderId: number | null) => {
                const { clipboardItem } = get();
                if (!clipboardItem) return;

                try {
                    await shelfApi.copyFile(clipboardItem.id, destinationFolderId);

                    // Refresh current folder content to show the new file
                    await get().loadFolderContent(destinationFolderId);

                    // Clear clipboard after successful paste
                    set({ clipboardItem: null });
                } catch (error) {
                    console.error('Failed to paste file:', error);
                }
            },

            clearClipboard: () => {
                set({ clipboardItem: null });
            },
        })
);
