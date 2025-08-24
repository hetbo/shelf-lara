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

export const deleteItem = (id: number, type: 'file' | 'folder'): Promise<void> => {

    const csrfMeta = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]');
    const csrfToken = csrfMeta?.getAttribute('content') ?? '';

    return fetch(`${API_BASE}/delete/${type}/${id}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'X-CSRF-TOKEN': csrfToken,
        },
    }).then(res => handleResponse(res, `Failed to delete ${type}`));
};
