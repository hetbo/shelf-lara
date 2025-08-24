// resources/js/components/Shelf/FolderTree.tsx

import React, { useEffect } from 'react';
import { useShelfStore } from '../../store/shelf';
import { Folder } from '../../types/shelf';
import Icon from '../../icons/Icon';

interface FolderTreeItemProps {
    folder: Folder;
    level: number;
}

const FolderTreeItem: React.FC<FolderTreeItemProps> = ({ folder, level }) => {
    const {
        expandedFolders,
        selectedFolderId,
        toggleFolderExpansion,
        selectFolder
    } = useShelfStore();

    const isExpanded = expandedFolders.has(folder.id);
    const isSelected = selectedFolderId === folder.id;
//    const hasChildren = folder.children && folder.children.length > 0;
    const hasChildren = folder.has_children;

    const handleToggleExpansion = (e: React.MouseEvent) => {
        e.stopPropagation();
        toggleFolderExpansion(folder.id);
    };

    const handleSelect = () => {
        selectFolder(folder.id);
    };

    return (
        <div className="select-none">
            <div
                className={`
    flex items-center py-1 hover:bg-gray-100 cursor-pointer
    ${isSelected ? 'bg-blue-50 border-r-2 border-blue-500' : ''}
  `}
                onClick={handleSelect}
                style={{paddingLeft: `${level * 20 + 8}px`, paddingRight: '8px'}}
            >
                <div
                    className="flex items-center justify-center w-4 h-4 mr-1"
                    onClick={handleToggleExpansion}
                >
                    {hasChildren && (
                        <Icon
                            name={isExpanded ? 'chevronDown' : 'chevronRight'}
                            className="w-3 h-3 text-gray-500 hover:text-gray-700"
                        />
                    )}
                </div>

                <Icon
                    name={isExpanded && hasChildren ? 'folderOpen' : 'folder'}
                    className="w-4 h-4 mr-2 text-blue-600"
                />

                <span className="text-sm text-gray-700 truncate">
          {folder.name}
        </span>
            </div>

            {isExpanded && hasChildren && (
                <div>
                    {folder.children?.map(child => (
                        <FolderTreeItem
                            key={child.id}
                            folder={child}
                            level={level + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const FolderTree: React.FC = () => {
    const {rootFolders, selectedFolderId, isLoadingFolders, loadRootFolders, selectFolder} = useShelfStore();

    useEffect(() => {
        loadRootFolders();
    }, []);

    const handleRootSelect = () => {
        selectFolder(null);
    };

    if (isLoadingFolders) {
        return (
            <div className="h-full bg-white border-r border-gray-200">
                <div className="p-4">
                    <div className="flex items-center justify-center">
                        <Icon name="loader" className="w-4 h-4 animate-spin" />
                        <span className="ml-2 text-sm text-gray-500">Loading folders...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full bg-white border-r border-gray-200 overflow-y-auto">
            <div className="p-2">
                <div className="mb-2">
                    <div
                        className={`
              flex items-center px-2 py-2 hover:bg-gray-100 cursor-pointer rounded
              ${selectedFolderId === null ? 'bg-blue-50 border border-blue-200' : ''}
            `}
                        onClick={handleRootSelect}
                    >
                        <Icon name="hardDrive" className="w-4 h-4 mr-2 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">My Files</span>
                    </div>
                </div>

                <div className="space-y-1">
                    {rootFolders.map(folder => (
                        <FolderTreeItem
                            key={folder.id}
                            folder={folder}
                            level={0}
                        />
                    ))}
                </div>

                {rootFolders.length === 0 && (
                    <div className="p-4 text-center">
                        <Icon name="folder" className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                        <p className="text-sm text-gray-500">No folders found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FolderTree;
