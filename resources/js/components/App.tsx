import React from 'react';
import {ConfigProvider} from "antd";
import Home from "./pages/Home";

function App(): React.ReactElement {
    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#00b96b'
                }
            }}
        >
            <Home />
        </ConfigProvider>
    );
}

export default App;
