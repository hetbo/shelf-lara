import React from 'react';
import {ConfigProvider} from "antd";
import Home from "./pages/Home";
import TreePage from "../pages/TreePage";

function App(): React.ReactElement {
    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#00b96b'
                }
            }}
        >
            <TreePage />
        </ConfigProvider>
    );
}

export default App;
