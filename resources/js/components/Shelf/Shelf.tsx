
import React from 'react';
import FolderTree from './FolderTree';
import Breadcrumbs from './Breadcrumbs';
import MainContent from './MainContent';
import DetailsPanel from './DetailsPanel';
import StatusBar from './StatusBar';

const Shelf: React.FC = () => {
    return (
        <div className="h-[98vh] flex flex-col bg-gray-100">
            {/* Top Bar - Breadcrumbs and Actions */}
            <Breadcrumbs />

            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Sidebar - Folder Tree */}
                <div className="w-64 flex-shrink-0">
                    <FolderTree />
                </div>

                {/* Center - Main Content */}
                <MainContent />

                {/* Right Sidebar - Details Panel */}
                <DetailsPanel />
            </div>

            {/* Bottom Status Bar */}
            <StatusBar />
        </div>
    );
};

export default Shelf;
