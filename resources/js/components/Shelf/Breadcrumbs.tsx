import React from 'react';
import { useShelfStore } from '../../store/shelf';
import Icon from '../../icons/Icon';

const Breadcrumbs: React.FC = () => {
    const { breadcrumbs, selectFolder } = useShelfStore();

    const handleBreadcrumbClick = (folderId: number | null) => {
        selectFolder(folderId);
    };

    return (
        <div className="flex items-center px-4 py-2 bg-white border-b border-gray-200">
            <div className="flex items-center space-x-1 flex-1 min-w-0">
                {breadcrumbs.map((item, index) => (
                    <React.Fragment key={`${item.id}-${index}`}>
                        <button
                            onClick={() => handleBreadcrumbClick(item.id)}
                            className="flex items-center px-2 py-1 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded transition-colors duration-150 max-w-xs truncate"
                        >
                            {index === 0 ? (
                                <Icon name="home" className="w-4 h-4 mr-1 flex-shrink-0" />
                            ) : (
                                <Icon name="folder" className="w-4 h-4 mr-1 flex-shrink-0" />
                            )}
                            <span className="truncate">{item.name}</span>
                        </button>

                        {index < breadcrumbs.length - 1 && (
                            <Icon
                                name="chevronRight"
                                className="w-3 h-3 text-gray-400 flex-shrink-0"
                            />
                        )}
                    </React.Fragment>
                ))}
            </div>

            <div className="flex items-center space-x-2 ml-4">
                <button className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors duration-150">
                    <Icon name="search" className="w-4 h-4" />
                </button>
                <button className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors duration-150">
                    <Icon name="refreshCw" className="w-4 h-4" />
                </button>
                <button className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors duration-150">
                    <Icon name="plus" className="w-4 h-4" />
                </button>
                <button className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors duration-150">
                    <Icon name="upload" className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default Breadcrumbs;
