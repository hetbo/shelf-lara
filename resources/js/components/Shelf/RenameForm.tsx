import React, { useState, useEffect, useRef } from 'react';
import {useShelfStore} from "../../store/shelf";

interface RenameFormProps {
    initialName: string;
}

export function RenameForm({ initialName }: RenameFormProps) {
    const [name, setName] = useState(initialName);
    const { confirmRename, cancelRename } = useShelfStore();
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim() && name.trim() !== initialName) {
            confirmRename(name.trim());
        } else {
            cancelRename();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full">
            <input
                ref={inputRef}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={handleSubmit}
                onKeyDown={(e) => e.key === 'Escape' && cancelRename()}
                className="text-sm text-gray-800 p-0 border-blue-400 border rounded w-full outline-none ring-2 ring-blue-200"
            />
        </form>
    );
}
