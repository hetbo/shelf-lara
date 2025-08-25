import {ShelfState, Folder} from '../../types/shelf';
import * as shelfApi from '../../services/shelfApi';
import {updateFolderInTree} from './utils';

export const createRenameActions = (set: any, get: () => ShelfState) => ({
    startRename: (item: any) => {
        set({renamingItem: item});
    },

    cancelRename: () => {
        set({renamingItem: null});
    },

    confirmRename: async (newName: string) => {
        const itemToRename = get().renamingItem;
        if (!itemToRename) return;

        set({renamingItem: null});

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
                        folder.id === itemToRename.id ? {...folder, name: newName} : folder
                    )
                };
                set({currentFolderContent: updatedContent});

                const updateFolderInTreeLocal = (folders: Folder[]): Folder[] => {
                    return folders.map(folder => {
                        if (folder.id === itemToRename.id) {
                            return {...folder, name: newName};
                        } else if (folder.children) {
                            return {...folder, children: updateFolderInTreeLocal(folder.children)};
                        }
                        return folder;
                    });
                };

                set({rootFolders: updateFolderInTreeLocal(state.rootFolders)});

                const updatedBreadcrumbs = state.breadcrumbs.map(breadcrumb =>
                    breadcrumb.id === itemToRename.id ? {...breadcrumb, name: newName} : breadcrumb
                );
                set({breadcrumbs: updatedBreadcrumbs});

            } else {
                if (state.selectedFileId === itemToRename.id && state.selectedFileDetails) {
                    set({
                        selectedFileDetails: {
                            ...state.selectedFileDetails,
                            name: newName
                        }
                    });
                }

                const updatedContent = {
                    ...state.currentFolderContent,
                    files: state.currentFolderContent.files.map(file =>
                        file.id === itemToRename.id ? {...file, filename: newName} : file
                    )
                };
                set({currentFolderContent: updatedContent});
            }

        } catch (error) {
            console.error("Failed to rename item:", error);
        }
    }
});
