import React from 'react';
import { useShelfStore } from '../../store/shelf';

const StatusBar: React.FC = () => {
    const { currentFolderContent, selectedFolderId, selectedFileId } = useShelfStore();

    const totalFolders = currentFolderContent.folders.length;
    const totalFiles = currentFolderContent.files.length;
    const totalItems = totalFolders + totalFiles;

    const getTotalSize = () => {
        const totalBytes = currentFolderContent.files.reduce((sum, file) => sum + file.size, 0);
        if (totalBytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(totalBytes) / Math.log(k));
        return parseFloat((totalBytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getItemsText = () => {
        if (totalItems === 0) return 'Empty folder';

        const parts = [];
        if (totalFolders > 0) {
            parts.push(`${totalFolders} folder${totalFolders === 1 ? '' : 's'}`);
        }
        if (totalFiles > 0) {
            parts.push(`${totalFiles} file${totalFiles === 1 ? '' : 's'}`);
        }

        return parts.join(', ');
    };

    const getSelectionText = () => {
        if (selectedFileId || selectedFolderId) {
            return '1 item selected';
        }
        return '';
    };

    return (
        <div className="h-6 bg-gray-50 border-t border-gray-200 px-4 py-1 text-xs text-gray-600 flex items-center justify-between">
            <div className="flex items-center space-x-4">
                <span>{getItemsText()}</span>
                {totalFiles > 0 && (
                    <span className="text-gray-400">•</span>
                )}
                {totalFiles > 0 && (
                    <span>{getTotalSize()}</span>
                )}
            </div>

            <div className="flex items-center space-x-4">
                <span>{getSelectionText()}</span>
                <span className="text-gray-400">Ready</span>
            </div>
        </div>
    );
};

export default StatusBar;
