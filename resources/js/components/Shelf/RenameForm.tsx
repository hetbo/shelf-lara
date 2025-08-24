import React, { useState, useEffect, useRef } from 'react';
import {useShelfStore} from "../../store/shelf";

interface RenameFormProps {
    initialName: string;
    itemType: 'file' | 'folder';
}

const getNameWithoutExtension = (filename: string, isFile: boolean): string => {
    if (!isFile) return filename;
    const lastDotIndex = filename.lastIndexOf('.');
    return lastDotIndex > 0 ? filename.substring(0, lastDotIndex) : filename;
};

const getFileExtension = (filename: string): string => {
    const lastDotIndex = filename.lastIndexOf('.');
    return lastDotIndex > 0 ? filename.substring(lastDotIndex) : '';
};

export function RenameForm({ initialName, itemType }: RenameFormProps) {
    const isFile = itemType === 'file';
    const nameWithoutExtension = getNameWithoutExtension(initialName, isFile);
    const extension = getFileExtension(initialName);
    const [name, setName] = useState(nameWithoutExtension);
    const { confirmRename, cancelRename } = useShelfStore();
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalName = isFile ? name.trim() + extension : name.trim();
        if (name.trim() && finalName.trim() !== initialName) {
            confirmRename(finalName);
        } else {
            cancelRename();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full">
            <div className="flex items-center">
                <input
                    ref={inputRef}
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={handleSubmit}
                    onKeyDown={(e) => e.key === 'Escape' && cancelRename()}
                    className="text-sm text-gray-800 p-0 border-blue-400 border rounded flex-1 outline-none ring-2 ring-blue-200"
                />
                {isFile && extension && (
                    <span className="text-sm text-gray-500 ml-1">{extension}</span>
                )}
            </div>
        </form>
    );
}
