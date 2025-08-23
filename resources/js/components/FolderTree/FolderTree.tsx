import React from 'react';
import { useFileManagerStore } from '../../store/shelfStore';
import { FolderTreeNode } from './FolderTreeNode';

export function FolderTree() {
    const folderTree = useFileManagerStore((state) => state.folderTree);

    if (!folderTree) {
        // You can replace this with a proper loading skeleton
        return <div>Loading tree...</div>;
    }

    return (
        <div className="p-2">
            {folderTree.map((rootNode) => (
                <FolderTreeNode key={rootNode.id} node={rootNode} depth={0} />
            ))}
        </div>
    );
}
