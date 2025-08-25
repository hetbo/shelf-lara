import {ShelfState} from '../../types/shelf';
import * as shelfApi from '../../services/shelfApi';

export const createClipboardActions = (set: any, get: () => ShelfState) => ({
    copyItem: (id: number, type: 'file' | 'folder', name: string) => {
        set({clipboardItem: {id, type, name, mode: 'copy'}});
    },

    cutItem: (id: number, type: 'file' | 'folder', name: string) => {
        set({clipboardItem: {id, type, name, mode: 'cut'}});
    },

    pasteItem: async (destinationFolderId: number | null) => {
        const {clipboardItem, loadFolderContent, loadRootFolders, currentFolderId} = get();
        if (!clipboardItem) return;

        const originalFolderId = currentFolderId;

        try {
            if (clipboardItem.mode === 'copy') {
                if (clipboardItem.type === 'file') {
                    await shelfApi.copyFile(clipboardItem.id, destinationFolderId);
                } else {
                    await shelfApi.copyFolder(clipboardItem.id, destinationFolderId);
                }
            } else if (clipboardItem.mode === 'cut') {
                await shelfApi.moveItem(clipboardItem.id, clipboardItem.type, destinationFolderId);
            }

            await loadFolderContent(destinationFolderId);

            if (clipboardItem.mode === 'cut' && originalFolderId !== destinationFolderId) {
                await loadFolderContent(originalFolderId);
            }

            if (clipboardItem.type === 'folder') {
                await loadRootFolders();
            }

            set({clipboardItem: null});
        } catch (error) {
            console.error(`Failed to paste item in ${clipboardItem.mode} mode:`, error);
        }
    },

    clearClipboard: () => {
        set({clipboardItem: null});
    }
});
