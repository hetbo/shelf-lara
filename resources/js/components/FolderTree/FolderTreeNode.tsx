import React from 'react';
import { Folder, isFolder } from '../../types';
import { useFileManagerStore } from '../../store/shelfStore';
import Icon from '../../icons/Icon'; // Your dynamic Icon component

interface FolderTreeNodeProps {
    node: Folder;
    depth: number; // For indentation
}

export function FolderTreeNode({ node, depth }: FolderTreeNodeProps) {
    // Get state and actions from our Zustand store
    const { activeFolderId, expandedFolderIds, selectFolder, toggleFolderExpansion } = useFileManagerStore();

    const isExpanded = expandedFolderIds.has(node.id);
    const isActive = activeFolderId === node.id;
    const hasChildren = node.children.some(isFolder);

    // Event handlers that call our decoupled store actions
    const handleChevronClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent the name click event from firing
        toggleFolderExpansion(node.id);
    };

    const handleNameClick = () => {
        selectFolder(node.id);
    };

    return (
        <div className="text-black">
            {/* The main row for this folder node */}
            <div
                className={`flex items-center p-1 rounded cursor-pointer ${isActive ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                style={{ paddingLeft: `${depth * 16 + 4}px` }} // Dynamic indentation
                onClick={handleNameClick}
            >
                {/* Chevron */}
                {hasChildren ? (
                    <div onClick={handleChevronClick} className="p-1 hover:bg-gray-200 rounded">
                        <Icon name={isExpanded ? 'ChevronDownIcon' : 'ChevronRightIcon'} className="h-4 w-4" />
                    </div>
                ) : (
                    <div className="w-6" /> // Placeholder for alignment
                )}

                {/* Folder Icon and Name */}
                <Icon name="FolderIcon" className={`h-5 w-5 mr-2 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                <span className={`select-none ${isActive ? 'font-bold' : ''}`}>{node.name}</span>
            </div>

            {/* Recursive Rendering: If expanded, render children */}
            {isExpanded && hasChildren && (
                <div>
                    {node.children.filter(isFolder).map((childNode) => (
                        <FolderTreeNode key={childNode.id} node={childNode} depth={depth + 1} />
                    ))}
                </div>
            )}
        </div>
    );
}
