import { create } from 'zustand';
import { FolderTree, Folder, File } from '../types';

interface ShelfState {
    folderTree: FolderTree | null;
    currentFolder: Folder | null;
    selectedFiles: string[]; // Array of file/folder IDs
    isLoading: boolean;
    error: string | null;

    // Actions
    setFolderTree: (tree: FolderTree) => void;
    setCurrentFolder: (folder: Folder) => void;
    // ... more actions will be added here
}

export const useFileManagerStore = create<ShelfState>((set) => ({
    // Initial State
    folderTree: null,
    currentFolder: null,
    selectedFiles: [],
    isLoading: false,
    error: null,

    // Actions to update the state
    setFolderTree: (tree) => set({ folderTree: tree, currentFolder: tree }),
    setCurrentFolder: (folder) => set({ currentFolder: folder }),
}));
