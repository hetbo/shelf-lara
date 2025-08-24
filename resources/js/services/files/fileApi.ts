import { FileDetails } from '../../types/shelf';
import { API_BASE, handleResponse, createAuthenticatedRequest } from '../http/httpClient';

/**
 * Fetches the detailed information for a specific file.
 */
export const fetchFileDetails = (fileId: number): Promise<FileDetails> => {
    return fetch(`${API_BASE}/files/${fileId}/details`)
        .then(res => handleResponse(res, 'Failed to load file details'));
};

/**
 * Copies a file to a destination folder.
 */
export const copyFile = (fileId: number, destinationFolderId: number | null): Promise<void> => {
    return fetch(`${API_BASE}/files/copy`, createAuthenticatedRequest('POST', {
        fileId,
        destinationFolderId
    })).then(res => handleResponse(res, 'Failed to copy file'));
};
