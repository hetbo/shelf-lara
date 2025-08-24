import { API_BASE, handleResponse, createAuthenticatedRequest } from '../http/httpClient';

/**
 * Renames a file or folder.
 */
export const renameItem = (id: number, type: 'file' | 'folder', newName: string): Promise<void> => {
    return fetch(`${API_BASE}/rename/${type}/${id}`, createAuthenticatedRequest('PATCH', {
        name: newName
    })).then(res => handleResponse(res, `Failed to rename ${type}`));
};

/**
 * Moves a file or folder to a destination folder.
 */
export const moveItem = (
    id: number,
    type: 'file' | 'folder',
    destinationId: number | null
): Promise<void> => {
    return fetch(`${API_BASE}/move`, createAuthenticatedRequest('POST', {
        id,
        type,
        destination_id: destinationId // Use snake_case to match Laravel's request validation
    })).then(res => handleResponse(res, `Failed to move ${type}`));
};
