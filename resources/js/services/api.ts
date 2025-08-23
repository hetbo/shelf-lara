import {Folder} from '../types';

// This is a mock. In a real app, this would be an Axios call.
const mockData: Folder[] = [
    {
        id: '1', name: 'Documents', type: 'folder', children: [
            {
                id: '2', name: 'Work', type: 'folder', children: [
                    {
                        id: '3', name: 'Projects', type: 'folder', children: [
                            {
                                id: '4', name: 'Project Alpha', type: 'folder', children: [
                                    {id: 'f1', name: 'report.docx', type: 'file'}
                                ]
                            }
                        ]
                    },
                    {id: 'f2', name: 'notes.txt', type: 'file'}
                ]
            },
            {id: 'f3', name: 'personal.pdf', type: 'file'}
        ]
    },
    {
        id: '5', name: 'Photos', type: 'folder', children: [
            {id: '6', name: 'Vacation 2024', type: 'folder', children: []}
        ]
    }
];

export const fetchFolderTree = (): Promise<Folder[]> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(mockData);
        }, 500); // Simulate network delay
    });
};
