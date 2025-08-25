
import React from 'react';
import FolderTree from './FolderTree';
import Breadcrumbs from './Breadcrumbs';
import MainContent from './MainContent';
import DetailsPanel from './DetailsPanel';
import StatusBar from './StatusBar';

const Shelf: React.FC = () => {
    return (
        <div className="h-[98vh] flex flex-col bg-gray-100">
            <Breadcrumbs />

            <div className="flex-1 flex overflow-hidden">

                <div className="w-64 flex-shrink-0">
                    <FolderTree />
                </div>

                <MainContent />

                <DetailsPanel />
            </div>

            <StatusBar />
        </div>
    );
};

export default Shelf;
