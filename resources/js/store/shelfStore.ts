import { create } from 'zustand';
import { Folder, File } from '../types';

export interface ShelfState {

    folderTree: Folder[] | null;

    activeFolderId: string | null;

    expandedFolderIds: Set<string>;

    getActiveFolder: () => Folder | null;

    loadTree: (tree: Folder[]) => void;

    selectFolder: (folderId: string) => void;

    toggleFolderExpansion: (folderId: string) => void;
}


const findFolderById = (folders: Folder[], id: string): Folder | null => {
    for (const folder of folders) {
        if (folder.id === id) return folder;
        const found = findFolderById(folder.children.filter(c => c.type === 'folder') as Folder[], id);
        if (found) return found;
    }
    return null;
};

export const useFileManagerStore = create<ShelfState>((set, get) => ({

    folderTree: null,
    activeFolderId: null,
    expandedFolderIds: new Set(),


    getActiveFolder: () => {
        const { folderTree, activeFolderId } = get();
        if (!folderTree || !activeFolderId) return null;
        return findFolderById(folderTree, activeFolderId);
    },


    loadTree: (tree) => set({ folderTree: tree }),

    selectFolder: (folderId) => set((state) => ({
        activeFolderId: folderId,

        expandedFolderIds: new Set(state.expandedFolderIds).add(folderId),
    })),

    toggleFolderExpansion: (folderId) => set((state) => {
        const newExpandedIds = new Set(state.expandedFolderIds);
        if (newExpandedIds.has(folderId)) {
            newExpandedIds.delete(folderId); // Contract
        } else {
            newExpandedIds.add(folderId); // Expand
        }
        return { expandedFolderIds: newExpandedIds };
    }),
}));
