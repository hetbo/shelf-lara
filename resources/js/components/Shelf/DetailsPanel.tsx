// resources/js/components/Shelf/DetailsPanel.tsx

import React from 'react';
import { useShelfStore } from '../../store/shelf';
import Icon from '../../icons/Icon';

const DetailsPanel: React.FC = () => {
    const { selectedFolderId, selectedFileId } = useShelfStore();

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

                <div className="space-y-4">
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 mx-auto mb-3 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Icon
                                name={selectedFolderId ? "folder" : "file"}
                                className="w-8 h-8 text-gray-600"
                            />
                        </div>
                        <p className="text-sm font-medium text-gray-800">
                            {selectedFolderId ? "Folder Selected" : "File Selected"}
                        </p>
                    </div>

                    {/* Placeholder content */}
                    <div className="space-y-3">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                                Name
                            </label>
                            <p className="text-sm text-gray-800">-</p>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                                Type
                            </label>
                            <p className="text-sm text-gray-800">
                                {selectedFolderId ? "Folder" : "File"}
                            </p>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                                Size
                            </label>
                            <p className="text-sm text-gray-800">-</p>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                                Modified
                            </label>
                            <p className="text-sm text-gray-800">-</p>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                                Created
                            </label>
                            <p className="text-sm text-gray-800">-</p>
                        </div>
                    </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                        Actions
                    </h4>
                    <div className="space-y-2">
                        <button className="w-full text-left px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded flex items-center">
                            <Icon name="edit" className="w-4 h-4 mr-2" />
                            Rename
                        </button>
                        <button className="w-full text-left px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded flex items-center">
                            <Icon name="copy" className="w-4 h-4 mr-2" />
                            Copy
                        </button>
                        <button className="w-full text-left px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded flex items-center">
                            <Icon name="move" className="w-4 h-4 mr-2" />
                            Move
                        </button>
                        <button className="w-full text-left px-2 py-1 text-sm text-red-600 hover:bg-red-50 rounded flex items-center">
                            <Icon name="trash" className="w-4 h-4 mr-2" />
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailsPanel;
