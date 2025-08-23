import React from 'react';
import { Button, message } from "antd";

function Home(): React.ReactElement {

    const [messageApi, contextHolder] = message.useMessage();


    const success = () => {
        messageApi.open({
            type: 'success',
            content: 'This is a success message!',
        });
    };

    return (

        <>
            {contextHolder}
            <div className="p-2 font-mono space-y-2">
                <h1 className="text-3xl font-bold">Hello from a Function Component!</h1>
                <p>This component is rendered inside a Laravel Blade file.</p>
                <Button type="primary" onClick={success}>
                    Show Success Message
                </Button>
            </div>
        </>
    );
}

export default Home;
