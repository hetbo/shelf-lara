export interface Folder {
    id: number;
    name: string;
    parent_id: number | null;
    user_id: number;
    created_at: string;
    updated_at: string;
    children?: Folder[];
    isLoaded?: boolean;
    has_children: boolean;
}

export interface File {
    id: number;
    filename: string;
    path: string;
    disc: string;
    mime_type: string;
    size: number;
    hash: string;
    user_id: number;
    folder_id: number | null;
    created_at: string;
    updated_at: string;
    metadata?: FileMetadata[];
}

export interface FileMetadata {
    id: number;
    file_id: number;
    key: string;
    value: string;
}

export interface Fileable {
    id: number;
    file_id: number;
    fileable_type: string;
    fileable_id: number;
    role: string;
    order: number;
    metadata: Record<string, any>;
}
