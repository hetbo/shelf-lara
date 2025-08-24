import { create } from 'zustand';
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


export const useShelfStore = create<ShelfState>()(
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
            selectedFolderDetails: null,
            selectedFileDetails: null,
            isLoadingDetails: false,

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

/*            selectFolder: (folderId: number | null) => {
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
            },*/
            // Replace the selectFolder method with:
            selectFolder: (folderId: number | null) => {
                const { loadFolderContent, buildBreadcrumbsFromApi, loadFolderDetails } = get();

                set({
                    selectedFolderId: folderId,
                    selectedFileId: null,
                    selectedFileDetails: null
                });

                buildBreadcrumbsFromApi(folderId);
                loadFolderContent(folderId);

                if (folderId) {
                    loadFolderDetails(folderId);
                } else {
                    set({ selectedFolderDetails: null });
                }
            },

// Replace the selectFile method with:
            selectFile: (fileId: number | null) => {
                const { loadFileDetails } = get();

                set({
                    selectedFileId: fileId,
                    selectedFolderId: null,
                    selectedFolderDetails: null
                });

                if (fileId) {
                    loadFileDetails(fileId);
                } else {
                    set({ selectedFileDetails: null });
                }
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
            // Load folder details
            loadFolderDetails: async (folderId: number) => {
                set({ isLoadingDetails: true, selectedFileDetails: null });
                try {
                    const response = await fetch(`${API_BASE}/folders/${folderId}/details`);
                    const folderDetails = await response.json();
                    set({ selectedFolderDetails: folderDetails, isLoadingDetails: false });
                } catch (error) {
                    console.error('Failed to load folder details:', error);
                    set({ selectedFolderDetails: null, isLoadingDetails: false });
                }
            },

// Load file details
            loadFileDetails: async (fileId: number) => {
                set({ isLoadingDetails: true, selectedFolderDetails: null });
                try {
                    const response = await fetch(`${API_BASE}/files/${fileId}/details`);
                    const fileDetails = await response.json();
                    set({ selectedFileDetails: fileDetails, isLoadingDetails: false });
                } catch (error) {
                    console.error('Failed to load file details:', error);
                    set({ selectedFileDetails: null, isLoadingDetails: false });
                }
            },
        })
);
