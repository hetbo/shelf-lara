import { Folder, FolderContent, BreadcrumbItem, FolderDetails, FileDetails } from '../types/shelf';

const API_BASE = '/api';

/*
const handleResponse = async (response: Response, errorMessage: string) => {
    if (!response.ok) {
        // You could add more sophisticated error handling here, like logging the status code
        throw new Error(errorMessage);
    }
    return response.json();
};
*/

const handleResponse = async (response: Response, defaultErrorMessage: string) => {
    if (response.ok) {
        if (response.headers.get('Content-Length') === '0') {
            return Promise.resolve(null);
        }
        return response.json();
    }

    // --- THIS IS THE NEW PART ---
    try {
        const errorData = await response.json();
        const message = errorData.message || defaultErrorMessage;

        // Dispatch a global event with the error message
        window.dispatchEvent(new CustomEvent('api-error', { detail: { message } }));

        throw new Error(message);
    } catch (e) {
        // Fallback for non-json errors
        window.dispatchEvent(new CustomEvent('api-error', { detail: { message: defaultErrorMessage } }));
        throw new Error(defaultErrorMessage);
    }
    // --- END OF NEW PART ---
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

export const moveItem = (
    id: number,
    type: 'file' | 'folder',
    destinationId: number | null
): Promise<void> => {
    // Get the CSRF token from the meta tag in your Blade layout
    const csrfMeta = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]');
    const csrfToken = csrfMeta?.getAttribute('content') ?? '';

    return fetch(`${API_BASE}/move`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-CSRF-TOKEN': csrfToken,
        },
        // The body contains all the necessary information for the controller
        body: JSON.stringify({
            id,
            type,
            destination_id: destinationId // Use snake_case to match Laravel's request validation
        }),
    }).then(res => handleResponse(res, `Failed to move ${type}`));
};


export const copyFolder = (folderId: number, destinationFolderId: number | null): Promise<void> => {
    const csrfMeta = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]');
    const csrfToken = csrfMeta?.getAttribute('content') ?? '';

    return fetch(`${API_BASE}/folders/copy`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-CSRF-TOKEN': csrfToken,
        },
        body: JSON.stringify({
            folderId,
            destinationFolderId
        }),
    }).then(res => handleResponse(res, 'Failed to copy folder'));
};
