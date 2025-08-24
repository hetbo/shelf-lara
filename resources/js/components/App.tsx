import React from 'react';
import {ConfigProvider} from "antd";
import Shelf from "./Shelf/Shelf";

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
                <Shelf/>
            </div>
        </ConfigProvider>
    );
}

export default App;
