import React, {Component} from 'react';
import Icon from "../../icons/Icon.jsx";

class Home extends Component {
    render() {
        return (
                <div className="p-2 font-mono space-y-2">
                    <h1 className="text-3xl font-bold">Hello from React + TypeScript!</h1>
                    <p>This component is rendered inside a Laravel Blade file.</p>
                </div>
        );
    }
}

export default Home;
