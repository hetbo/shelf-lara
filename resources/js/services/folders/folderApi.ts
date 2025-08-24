import { Folder, FolderContent, BreadcrumbItem, FolderDetails } from '../../types/shelf';
import { API_BASE, handleResponse, createAuthenticatedRequest } from '../http/httpClient';

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
 * Copies a folder to a destination folder.
 */
export const copyFolder = (folderId: number, destinationFolderId: number | null): Promise<void> => {
    return fetch(`${API_BASE}/folders/copy`, createAuthenticatedRequest('POST', {
        folderId,
        destinationFolderId
    })).then(res => handleResponse(res, 'Failed to copy folder'));
};
