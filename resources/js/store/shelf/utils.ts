import {Folder} from '../../types/shelf';

export const insertFolderChildren = (folders: Folder[], parentId: number, children: Folder[]): Folder[] => {
    return folders.map(folder => {
        if (folder.id === parentId) {
            return {...folder, children: children, isLoaded: true};
        } else if (folder.children) {
            return {...folder, children: insertFolderChildren(folder.children, parentId, children)};
        }
        return folder;
    });
};

export const updateFolderInTree = (folders: Folder[], targetId: number, newName: string): Folder[] => {
    return folders.map(folder => {
        if (folder.id === targetId) {
            return {...folder, name: newName};
        } else if (folder.children) {
            return {...folder, children: updateFolderInTree(folder.children, targetId, newName)};
        }
        return folder;
    });
};

export const findFolderInTree = (folders: Folder[], targetId: number): Folder | null => {
    for (const folder of folders) {
        if (folder.id === targetId) return folder;
        if (folder.children) {
            const result = findFolderInTree(folder.children, targetId);
            if (result) return result;
        }
    }
    return null;
};
