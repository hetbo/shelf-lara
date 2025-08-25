import { Folder, FolderContent, BreadcrumbItem, FolderDetails } from '../../types/shelf';
import { API_BASE, handleResponse, createAuthenticatedRequest } from '../http/httpClient';

export const fetchRootFolders = (): Promise<Folder[]> => {
    return fetch(`${API_BASE}/folders/root`)
        .then(res => handleResponse(res, 'Failed to fetch root folders'));
};

export const fetchFolderChildren = (folderId: number): Promise<Folder[]> => {
    return fetch(`${API_BASE}/folders/${folderId}/children`)
        .then(res => handleResponse(res, 'Failed to fetch folder children'));
};

export const fetchBreadcrumbs = (folderId: number): Promise<BreadcrumbItem[]> => {
    return fetch(`${API_BASE}/folders/${folderId}/breadcrumbs`)
        .then(res => handleResponse(res, 'Failed to load breadcrumbs'));
};

export const fetchFolderContent = (folderId: number | null): Promise<FolderContent> => {
    const endpoint = folderId
        ? `${API_BASE}/folders/${folderId}/content`
        : `${API_BASE}/folders/root/content`;

    return fetch(endpoint)
        .then(res => handleResponse(res, 'Failed to load folder content'));
};

export const fetchFolderDetails = (folderId: number): Promise<FolderDetails> => {
    return fetch(`${API_BASE}/folders/${folderId}/details`)
        .then(res => handleResponse(res, 'Failed to load folder details'));
};

export const copyFolder = (folderId: number, destinationFolderId: number | null): Promise<void> => {
    return fetch(`${API_BASE}/folders/copy`, createAuthenticatedRequest('POST', {
        folderId,
        destinationFolderId
    })).then(res => handleResponse(res, 'Failed to copy folder'));
};
