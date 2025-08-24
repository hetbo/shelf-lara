// resources/js/stores/shelf.ts

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { ShelfState, Folder, File, FolderContent, BreadcrumbItem } from '../types/shelf';

const API_BASE = '/api';

// Helper function to build folder tree
const insertFolderChildren = (folders: Folder[], parentId: number, children: Folder[]): Folder[] => {
    return folders.map(folder => {
        if (folder.id === parentId) {
            return {
                ...folder,
                children: children,
                isLoaded: true
            };
        } else if (folder.children) {
            return {
                ...folder,
                children: insertFolderChildren(folder.children, parentId, children)
            };
        }
        return folder;
    });
};

// Helper function to build breadcrumbs
const buildBreadcrumbs = (folderId: number | null, folders: Folder[]): BreadcrumbItem[] => {
    if (!folderId) {
        return [{ id: null, name: 'Root', type: 'folder' }];
    }

    const breadcrumbs: BreadcrumbItem[] = [];

    const findFolderPath = (folders: Folder[], targetId: number, path: Folder[] = []): Folder[] | null => {
        for (const folder of folders) {
            const currentPath = [...path, folder];
            if (folder.id === targetId) {
                return currentPath;
            }
            if (folder.children) {
                const result = findFolderPath(folder.children, targetId, currentPath);
                if (result) return result;
            }
        }
        return null;
    };

    const path = findFolderPath(folders, folderId);
    if (path) {
        breadcrumbs.push({ id: null, name: 'Root', type: 'folder' });
        path.forEach(folder => {
            breadcrumbs.push({ id: folder.id, name: folder.name, type: 'folder' });
        });
    }

    return breadcrumbs;
};


export const useShelfStore = create<ShelfState>()(
    devtools(
        (set, get) => ({
            // Initial State
            rootFolders: [],
            expandedFolders: new Set<number>(),
            selectedFolderId: null,
            selectedFileId: null,
            currentFolderContent: { folders: [], files: [] },
            breadcrumbs: [{ id: null, name: 'Root', type: 'folder' }],
            isLoadingFolders: false,
            isLoadingContent: false,

            // Load root folders
            loadRootFolders: async () => {
                set({ isLoadingFolders: true });
                try {
                    const response = await fetch(`${API_BASE}/folders/root`);
                    const rootFolders: Folder[] = await response.json();

                    set({
                        rootFolders: rootFolders.map(folder => ({ ...folder, isLoaded: false })),
                        isLoadingFolders: false
                    });
                } catch (error) {
                    console.error('Failed to load root folders:', error);
                    set({ isLoadingFolders: false });
                }
            },

            // Load folder children
            loadFolderChildren: async (folderId: number) => {
                try {
                    const response = await fetch(`${API_BASE}/folders/${folderId}/children`);
                    const children: Folder[] = await response.json();

                    const childrenWithLoadState = children.map(child => ({ ...child, isLoaded: false }));

                    set(state => ({
                        rootFolders: insertFolderChildren(state.rootFolders, folderId, childrenWithLoadState)
                    }));
                } catch (error) {
                    console.error('Failed to load folder children:', error);
                }
            },

            // Toggle folder expansion
            toggleFolderExpansion: (folderId: number) => {
                const { expandedFolders, loadFolderChildren } = get();
                const newExpanded = new Set(expandedFolders);

                if (expandedFolders.has(folderId)) {
                    newExpanded.delete(folderId);
                } else {
                    newExpanded.add(folderId);

                    // Check if children are already loaded
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

                    const folder = findFolder(get().rootFolders, folderId);
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
                    const response = await fetch(`${API_BASE}/folders/${folderId}/breadcrumbs`);
                    const breadcrumbsData = await response.json();
                    set({ breadcrumbs: breadcrumbsData });
                } catch (error) {
                    console.error('Failed to load breadcrumbs:', error);
                }
            },


            // Select folder
/*            selectFolder: (folderId: number | null) => {
                const { rootFolders, loadFolderContent } = get();

                set({
                    selectedFolderId: folderId,
                    selectedFileId: null,
                    breadcrumbs: buildBreadcrumbs(folderId, rootFolders)
                });

                loadFolderContent(folderId);
            }*/
            selectFolder: (folderId: number | null) => {
                const { loadFolderContent, buildBreadcrumbsFromApi } = get();

                set({
                    selectedFolderId: folderId,
                    selectedFileId: null,
                });

                buildBreadcrumbsFromApi(folderId);
                loadFolderContent(folderId);
            },

            // Select file
            selectFile: (fileId: number | null) => {
                set({
                    selectedFileId: fileId
                });
            },

            // Load folder content
            loadFolderContent: async (folderId: number | null) => {
                set({ isLoadingContent: true });
                try {
                    const endpoint = folderId
                        ? `${API_BASE}/folders/${folderId}/content`
                        : `${API_BASE}/folders/root/content`;

                    const response = await fetch(endpoint);
                    const content: FolderContent = await response.json();

                    set({
                        currentFolderContent: content,
                        isLoadingContent: false
                    });
                } catch (error) {
                    console.error('Failed to load folder content:', error);
                    set({
                        currentFolderContent: { folders: [], files: [] },
                        isLoadingContent: false
                    });
                }
            },
            // Add this method in the store actions:
        }),
        { name: 'shelf-store' }
    )
);
