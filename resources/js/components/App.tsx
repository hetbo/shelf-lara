import React from 'react';
import {ConfigProvider} from "antd";
import Shelf from "./Shelf/Shelf";
import {ApiErrorHandler} from "./Shelf/ApiErrorHandler";

function App(): React.ReactElement {
    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#00b96b'
                }
            }}
        >
            <div className="antialiased">
                <ApiErrorHandler />
                <Shelf/>
            </div>
        </ConfigProvider>
    );
}

export default App;
