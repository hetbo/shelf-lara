// resources/js/components/Shelf/MainContent.tsx

import React from 'react';
import { useShelfStore } from '../../store/shelf';
import { Folder, File } from '../../types/shelf';
import Icon from '../../icons/Icon';

interface ContentItemProps {
    item: Folder | File;
    type: 'folder' | 'file';
}

const ContentItem: React.FC<ContentItemProps> = ({ item, type }) => {
    const { selectFolder, selectFile, selectedFolderId, selectedFileId } = useShelfStore();

    const isSelected = type === 'folder'
        ? selectedFolderId === item.id
        : selectedFileId === item.id;

    const handleClick = () => {
        if (type === 'folder') {
            selectFolder(item.id);
        } else {
            selectFile(item.id);
        }
    };

    const handleDoubleClick = () => {
        if (type === 'folder') {
            selectFolder(item.id);
        }
        // For files, we'll handle opening later
    };

    const getFileIcon = (file: File) => {
        if (file.mime_type.startsWith('image/')) return 'image';
        if (file.mime_type.startsWith('video/')) return 'video';
        if (file.mime_type.startsWith('audio/')) return 'music';
        if (file.mime_type === 'application/pdf') return 'fileText';
        if (file.mime_type.includes('document') || file.mime_type.includes('word')) return 'fileText';
        if (file.mime_type.includes('sheet') || file.mime_type.includes('excel')) return 'fileSpreadsheet';
        return 'file';
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div
            className={`
        flex items-center p-2 hover:bg-gray-50 cursor-pointer rounded border
        ${isSelected ? 'bg-blue-50 border-blue-200' : 'border-transparent'}
      `}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
        >
            <div className="flex-shrink-0 mr-3">
                <Icon
                    name={type === 'folder' ? 'folder' : getFileIcon(item as File)}
                    className={`w-6 h-6 ${
                        type === 'folder' ? 'text-blue-600' : 'text-gray-600'
                    }`}
                />
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
          <span className="text-sm text-gray-900 truncate">
            {type === 'folder' ? (item as Folder).name : (item as File).filename}
          </span>

                    {type === 'file' && (
                        <div className="flex items-center space-x-4 text-xs text-gray-500 ml-4">
                            <span>{formatFileSize((item as File).size)}</span>
                            <span>{new Date(item.created_at).toLocaleDateString()}</span>
                        </div>
                    )}
                </div>

                {type === 'file' && (
                    <div className="text-xs text-gray-500 mt-1">
                        {(item as File).mime_type}
                    </div>
                )}
            </div>
        </div>
    );
};

const MainContent: React.FC = () => {
    const {
        currentFolderContent,
        isLoadingContent,
        selectedFolderId,
        breadcrumbs
    } = useShelfStore();

    if (isLoadingContent) {
        return (
            <div className="flex-1 bg-white">
                <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                        <Icon name="loader" className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-500">Loading content...</p>
                    </div>
                </div>
            </div>
        );
    }

    const { folders, files } = currentFolderContent;
    const totalItems = folders.length + files.length;

    return (
        <div className="flex-1 bg-white overflow-hidden">
            <div className="h-full overflow-y-auto">
                <div className="p-4">
                    {totalItems === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-center">
                            <Icon name="folderOpen" className="w-16 h-16 text-gray-300 mb-4" />
                            <h3 className="text-lg font-medium text-gray-500 mb-2">
                                This folder is empty
                            </h3>
                            <p className="text-gray-400">
                                Drop files here or use the upload button to add content
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {/* Folders first */}
                            {folders.map(folder => (
                                <ContentItem
                                    key={`folder-${folder.id}`}
                                    item={folder}
                                    type="folder"
                                />
                            ))}

                            {/* Then files */}
                            {files.map(file => (
                                <ContentItem
                                    key={`file-${file.id}`}
                                    item={file}
                                    type="file"
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MainContent;
