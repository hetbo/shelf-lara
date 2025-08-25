import { FileDetails } from '../../types/shelf';
import { API_BASE, handleResponse, createAuthenticatedRequest } from '../http/httpClient';

export const fetchFileDetails = (fileId: number): Promise<FileDetails> => {
    return fetch(`${API_BASE}/files/${fileId}/details`)
        .then(res => handleResponse(res, 'Failed to load file details'));
};

export const copyFile = (fileId: number, destinationFolderId: number | null): Promise<void> => {
    return fetch(`${API_BASE}/files/copy`, createAuthenticatedRequest('POST', {
        fileId,
        destinationFolderId
    })).then(res => handleResponse(res, 'Failed to copy file'));
};
