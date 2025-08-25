import {create} from 'zustand';
import {ShelfState} from '../../types/shelf';
import {initialState} from './initialState';
import {createFolderActions} from './actions';
import {createSelectionActions} from './selectionActions';
import {createRenameActions} from './renameActions';
import {createClipboardActions} from './clipboardActions';
import {createDeleteActions} from './deleteActions';

export const useShelfStore = create<ShelfState>()((set, get) => {
    const folderActions = createFolderActions(set, get);
    const selectionActions = createSelectionActions(set, get);
    const renameActions = createRenameActions(set, get);
    const clipboardActions = createClipboardActions(set, get);
    const deleteActions = createDeleteActions(set, get);

    return {
        ...initialState,
        ...folderActions,
        ...selectionActions,
        ...renameActions,
        ...clipboardActions,
        ...deleteActions
    } as ShelfState;
});
