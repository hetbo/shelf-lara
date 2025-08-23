import React, { useEffect } from 'react';
import { Layout } from 'antd';
import { fetchFolderTree } from '../services/api';
import {useFileManagerStore} from "../store/shelfStore";
import {FolderTree} from "../components/FolderTree/FolderTree";
import {MainSection} from "../components/MainSection/MainSection";

const { Sider, Content } = Layout;

function TreePage() {
    // Get the 'loadTree' action from our store
    const loadTree = useFileManagerStore((state) => state.loadTree);

    // Fetch initial data when the component mounts
    useEffect(() => {
        async function loadData() {
            const tree = await fetchFolderTree();
            loadTree(tree);
        }
        loadData();
    }, [loadTree]); // Dependency array ensures this runs only once

    return (
        <Layout style={{ minHeight: '98vh' }}>
            <Sider width={300} theme="light" style={{ borderRight: '1px solid #f0f0f0' }}>
                <FolderTree />
            </Sider>
            <Content>
                {/* The main section will be added here */}
                <MainSection />
            </Content>
        </Layout>
    );
}

export default TreePage;
