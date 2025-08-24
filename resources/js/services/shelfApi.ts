import { Folder, FolderContent, BreadcrumbItem, FolderDetails, FileDetails } from '../types/shelf';

const API_BASE = '/api';

/**
 * A helper to handle fetch responses and errors consistently.
 * @param response The fetch Response object.
 * @param errorMessage The error message to throw if the response is not ok.
 */
const handleResponse = async (response: Response, errorMessage: string) => {
    if (!response.ok) {
        // You could add more sophisticated error handling here, like logging the status code
        throw new Error(errorMessage);
    }
    return response.json();
};

/**
 * Fetches the initial, top-level folders for the tree.
 */
export const fetchRootFolders = (): Promise<Folder[]> => {
    return fetch(`${API_BASE}/folders/root`)
        .then(res => handleResponse(res, 'Failed to fetch root folders'));
};

/**
 * Fetches the immediate children for a given folder ID.
 */
export const fetchFolderChildren = (folderId: number): Promise<Folder[]> => {
    return fetch(`${API_BASE}/folders/${folderId}/children`)
        .then(res => handleResponse(res, 'Failed to fetch folder children'));
};

/**
 * Fetches the breadcrumb path for a given folder ID from the server.
 */
export const fetchBreadcrumbs = (folderId: number): Promise<BreadcrumbItem[]> => {
    return fetch(`${API_BASE}/folders/${folderId}/breadcrumbs`)
        .then(res => handleResponse(res, 'Failed to load breadcrumbs'));
};

/**
 * Fetches the contents (files and subfolders) for a given folder ID, or the root.
 */
export const fetchFolderContent = (folderId: number | null): Promise<FolderContent> => {
    const endpoint = folderId
        ? `${API_BASE}/folders/${folderId}/content`
        : `${API_BASE}/folders/root/content`;

    return fetch(endpoint)
        .then(res => handleResponse(res, 'Failed to load folder content'));
};

/**
 * Fetches the detailed information for a specific folder.
 */
export const fetchFolderDetails = (folderId: number): Promise<FolderDetails> => {
    return fetch(`${API_BASE}/folders/${folderId}/details`)
        .then(res => handleResponse(res, 'Failed to load folder details'));
};

/**
 * Fetches the detailed information for a specific file.
 */
export const fetchFileDetails = (fileId: number): Promise<FileDetails> => {
    return fetch(`${API_BASE}/files/${fileId}/details`)
        .then(res => handleResponse(res, 'Failed to load file details'));
};

export const renameItem = (id: number, type: 'file' | 'folder', newName: string): Promise<void> => {
    // Note: For PATCH/POST requests with a body, you often need a CSRF token.
    // Your global fetch/axios instance should be configured to handle this.
    const csrfMeta = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]');
    const csrfToken = csrfMeta?.getAttribute('content') ?? '';

    return fetch(`${API_BASE}/rename/${type}/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-CSRF-TOKEN': csrfToken,
        },
        body: JSON.stringify({ name: newName }),
    }).then(res => handleResponse(res, `Failed to rename ${type}`));
};

export const copyFile = (fileId: number, destinationFolderId: number | null): Promise<void> => {
    const csrfMeta = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]');
    const csrfToken = csrfMeta?.getAttribute('content') ?? '';

    return fetch(`${API_BASE}/files/copy`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-CSRF-TOKEN': csrfToken,
        },
        body: JSON.stringify({
            fileId,
            destinationFolderId
        }),
    }).then(res => handleResponse(res, 'Failed to copy file'));
};
