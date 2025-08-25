export interface ClipboardItem {
    id: number;
    type: 'file' | 'folder';
    name: string;
    mode: 'copy' | 'cut';
}
