import axios from 'axios';
import { Folder, File, FileDetails } from '../types';

// Centralize your API base URL for easy configuration
const API_BASE_URL = '/api/file-manager';

// --- MOCK DATA ---
// This data simulates what your Laravel backend would return.
const mockFolders: Folder[] = [
    { id: '1', name: 'Documents', parentId: null, hasChildren: true },
    { id: '2', name: 'Images', parentId: null, hasChildren: true },
    { id: '3', name: 'Projects', parentId: '1', hasChildren: false },
];

const mockFiles: File[] = [
    { id: 'f1', filename: 'annual-report.pdf', mimeType: 'application/pdf', size: 2048000, folderId: '1', path: '/files/annual-report.pdf', createdAt: '2023-10-26T10:00:00Z' },
    { id: 'f2', filename: 'project-notes.txt', mimeType: 'text/plain', size: 1536, folderId: '3', path: '/files/project-notes.txt', createdAt: '2023-10-25T14:30:00Z' },
    { id: 'f3', filename: 'vacation-photo.jpg', mimeType: 'image/jpeg', size: 5120000, folderId: '2', path: '/files/vacation-photo.jpg', createdAt: '2023-08-15T18:45:00Z' },
];

/**
 * Fetches the initial, top-level folders.
 * In a real scenario, this would fetch folders where `parent_id` is null.
 */
export const fetchFolderTree = async (): Promise<Folder[]> => {
    console.log('API: Fetching initial folder tree...');

    // --- REAL IMPLEMENTATION (when backend is ready) ---
    // const response = await axios.get(`${API_BASE_URL}/folders/tree`);
    // return response.data;

    // --- MOCKED IMPLEMENTATION ---
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(mockFolders.filter(f => f.parentId === null));
        }, 500); // Simulate network delay
    });
};

/**
 * Fetches the contents (subfolders and files) for a specific folder.
 */
export const fetchFolderContents = async (folderId: string): Promise<{ folders: Folder[]; files: File[] }> => {
    console.log(`API: Fetching contents for folder ${folderId}...`);

    // --- REAL IMPLEMENTATION ---
    // const response = await axios.get(`${API_BASE_URL}/folders/${folderId}/contents`);
    // return response.data;

    // --- MOCKED IMPLEMENTATION ---
    return new Promise(resolve => {
        setTimeout(() => {
            const folders = mockFolders.filter(f => f.parentId === folderId);
            const files = mockFiles.filter(f => f.folderId === folderId);
            resolve({ folders, files });
        }, 700);
    });
};

/**
 * Fetches all the rich details for a single file, including metadata and links.
 */
export const fetchFileDetails = async (fileId: string): Promise<FileDetails> => {
    console.log(`API: Fetching details for file ${fileId}...`);

    // --- REAL IMPLEMENTATION ---
    // const response = await axios.get(`${API_BASE_URL}/files/${fileId}`);
    // return response.data;

    // --- MOCKED IMPLEMENTATION ---
    return new Promise(resolve => {
        setTimeout(() => {
            const file = mockFiles.find(f => f.id === fileId);
            if (!file) {
                throw new Error('File not found');
            }

            // Simulate fetching related metadata and fileable links
            const details: FileDetails = {
                file: file,
                metadata: [
                    { id: 1, key: 'Author', value: 'John Doe' },
                    { id: 2, key: 'Resolution', value: '1920x1080' },
                ],
                links: [
                    {
                        id: 1,
                        fileableType: 'App\\Models\\Post',
                        fileableId: 42,
                        role: 'featured_image',
                        linkedModelName: 'My Awesome Blog Post',
                        metadata: { alt: 'A beautiful vacation sunset' }
                    }
                ],
            };
            resolve(details);
        }, 600);
    });
};
