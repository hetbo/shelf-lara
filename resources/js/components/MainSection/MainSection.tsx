import React from 'react';
import {useFileManagerStore} from "../../store/shelfStore";
import Icon from "../../icons/Icon";

export function MainSection() {
    const activeFolder = useFileManagerStore((state) => state.getActiveFolder());

    if (!activeFolder) {
        return <div className="p-8 text-gray-500">Select a folder to see its contents</div>;
    }

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">{activeFolder.name}</h2>
            <ul>
                {activeFolder.children.map(item => (
                    <li key={item.id} className="flex items-center p-2 rounded hover:bg-gray-100">
                        <Icon name={item.type === 'folder' ? 'FolderIcon' : 'FileIcon'} className="h-5 w-5 mr-3 text-gray-600" />
                        <span>{item.name}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
