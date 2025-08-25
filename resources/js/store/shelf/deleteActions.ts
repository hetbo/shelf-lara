import {ShelfState, Folder} from '../../types/shelf';
import * as shelfApi from '../../services/shelfApi';
import {findFolderInTree} from './utils';

export const createDeleteActions = (set: any, get: () => ShelfState) => ({
    deleteItem: async (item: { id: number; type: 'file' | 'folder' }) => {
        const {
            currentFolderContent,
            rootFolders,
            loadFolderContent,
            loadRootFolders,
            selectFolder
        } = get();

        let parentFolderId: number | null = null;

        if (item.type === 'file') {
            const file = currentFolderContent.files.find(f => f.id === item.id);
            parentFolderId = file?.folder_id ?? null;
        } else if (item.type === 'folder') {
            const folder = findFolderInTree(rootFolders, item.id);
            parentFolderId = folder?.parent_id ?? null;
        }

        try {
            await shelfApi.deleteItem(item.id, item.type);
            selectFolder(parentFolderId);
            await loadRootFolders();
        } catch (error) {
            console.error("Delete action failed:", error);
        }
    }
});
