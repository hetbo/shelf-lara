import { FolderTree } from '../types';
// We use the globally configured axios from bootstrap.ts
import axios from 'axios';

const API_BASE_URL = '/api/shelf'; // Example base URL

export const getFolderTree = async (): Promise<FolderTree> => {
    const response = await axios.get(`${API_BASE_URL}/tree`);
    return response.data;
};

// You will add more functions here later:
// export const renameFile = async (id, newName) => { ... };
// export const deleteItems = async (ids) => { ... };
