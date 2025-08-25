import React from 'react';
import { useShelfStore } from '../../store/shelf';
import Icon from '../../icons/Icon';
import {RenameForm} from "./RenameForm";


const DetailsPanel: React.FC = () => {
    const {
        selectedFolderId,
        selectedFileId,
        selectedFolderDetails,
        selectedFileDetails,
        isLoadingDetails,
        renamingItem,
        startRename,
        clipboardItem,
        copyItem,
        cutItem,
        pasteItem,
        currentFolderId,
        deleteItem
    } = useShelfStore();

    const currentItem = selectedFolderId
        ? { id: selectedFolderId, type: 'folder', name: selectedFolderDetails?.name }
        : { id: selectedFileId, type: 'file', name: selectedFileDetails?.name };

    const isRenaming = renamingItem?.id === currentItem.id && renamingItem?.type === currentItem.type;


    if (!selectedFolderId && !selectedFileId) {
        return (
            <div className="w-64 bg-white border-l border-gray-200 p-4">
                <div className="text-center">
                    <Icon name="info" className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-sm text-gray-500">
                        Select a file or folder to view details
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-64 bg-white border-l border-gray-200 overflow-y-auto">
            <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                    Properties
                </h3>

                {isLoadingDetails ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                        <p className="text-sm text-gray-500">Loading details...</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 mx-auto mb-3 bg-gray-100 rounded-lg flex items-center justify-center">
                                <Icon
                                    name={selectedFolderId ? "folder" : "file"}
                                    className="w-8 h-8 text-gray-600"
                                />
                            </div>
                            <p className="text-sm font-medium text-gray-800">
                                {(selectedFolderId ? selectedFolderDetails?.name : selectedFileDetails?.name) || (selectedFolderId ? "Folder" : "File")}
                            </p>
                        </div>

                        <div className="space-y-3">

                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                                    Name
                                </label>
                                <div
                                    onDoubleClick={() => startRename(currentItem as {
                                        id: number;
                                        type: 'file' | 'folder'
                                    })}
                                    className="cursor-pointer"
                                >
                                    {isRenaming ? (
                                        <RenameForm initialName={currentItem.name || ''} itemType={currentItem.type as 'file' | 'folder'}/>
                                    ) : (
                                        <p className="text-sm text-gray-800">
                                            {currentItem.name || '-'}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                                    Type
                                </label>
                                <p className="text-sm text-gray-800">
                                    {selectedFolderId ? "Folder" : (selectedFileDetails?.extension || "File")}
                                </p>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                                    Size
                                </label>
                                <p className="text-sm text-gray-800">
                                    {selectedFolderId
                                        ? `${selectedFolderDetails?.itemCount || 0} items`
                                        : selectedFileDetails?.size ? formatSize(selectedFileDetails.size) : '-'
                                    }
                                </p>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                                    Modified
                                </label>
                                <p className="text-sm text-gray-800">
                                    {(selectedFolderId ? selectedFolderDetails?.modifiedAt : selectedFileDetails?.modifiedAt)
                                        ? formatDate(selectedFolderId ? selectedFolderDetails!.modifiedAt : selectedFileDetails!.modifiedAt)
                                        : '-'}
                                </p>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                                    Created
                                </label>
                                <p className="text-sm text-gray-800">
                                    {(selectedFolderId ? selectedFolderDetails?.createdAt : selectedFileDetails?.createdAt)
                                        ? formatDate(selectedFolderId ? selectedFolderDetails!.createdAt : selectedFileDetails!.createdAt)
                                        : '-'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-6 pt-4 border-t border-gray-200">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                        Actions
                    </h4>
                    <div className="space-y-2">
                        <button
                            onClick={() => startRename(currentItem as { id: number; type: 'file' | 'folder' })}
                            className="w-full text-left px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded flex items-center"
                        >
                            <Icon name="edit" className="w-4 h-4 mr-2"/>
                            Rename
                        </button>
                        <button
                            onClick={() => {
                                if (selectedFileId && selectedFileDetails) {
                                    copyItem(selectedFileId, 'file', selectedFileDetails.name);
                                } else if (selectedFolderId && selectedFolderDetails) {
                                    copyItem(selectedFolderId, 'folder', selectedFolderDetails.name);
                                }
                            }}
                            disabled={!selectedFileId && !selectedFolderId}
                            className={`w-full text-left px-2 py-1 text-sm rounded flex items-center ${
                                (selectedFileId || selectedFolderId) ? 'text-gray-600 hover:bg-gray-100' : 'text-gray-400 cursor-not-allowed'
                            }`}
                            title="Copy item to clipboard"
                        >
                            <Icon name="copy" className="w-4 h-4 mr-2"/>
                            Copy
                        </button>

                        {clipboardItem && (
                            <button
                                onClick={() => pasteItem(currentFolderId)}
                                className="w-full text-left px-2 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded flex items-center"
                            >
                                <Icon name="clipboard" className="w-4 h-4 mr-2"/>
                                Paste "{clipboardItem.name}"
                            </button>
                        )}
                        <button
                            onClick={() => {
                                if (selectedFileId && selectedFileDetails) {
                                    cutItem(selectedFileId, 'file', selectedFileDetails.name);
                                } else if (selectedFolderId && selectedFolderDetails) {
                                    cutItem(selectedFolderId, 'folder', selectedFolderDetails.name);
                                }
                            }}
                            disabled={!selectedFileId && !selectedFolderId}
                            className={`w-full text-left px-2 py-1 text-sm rounded flex items-center ${
                                (selectedFileId || selectedFolderId) ? 'text-gray-600 hover:bg-gray-100' : 'text-gray-400 cursor-not-allowed'
                            }`}
                            title="Cut item to clipboard" // The functionality is "cut"
                        >
                            <Icon name="move" className="w-4 h-4 mr-2"/>
                            Cut / Move
                        </button>
                        <button
                            onClick={() => {
                                if (window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
                                    if (selectedFileId) {
                                        deleteItem({id: selectedFileId, type: 'file'});
                                    } else if (selectedFolderId) {
                                        deleteItem({id: selectedFolderId, type: 'folder'});
                                    }
                                }
                            }}
                            disabled={!selectedFileId && !selectedFolderId}
                            className={`w-full text-left px-2 py-1 text-sm rounded flex items-center ${
                                (selectedFileId || selectedFolderId)
                                    ? 'text-red-600 hover:bg-red-50'
                                    : 'text-gray-400 cursor-not-allowed'
                            }`}
                        >
                            <Icon name="trash" className="w-4 h-4 mr-2"/>
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString();
};
export default DetailsPanel;
