import * as React from 'react';
import Header from './header';
import Switch from '../containers/switch';

interface AppProps {
}

export default class App extends React.PureComponent<AppProps> {
    render() {
        return (
            <div className="root">
                <Header/>
                <Switch/>
            </div>
        );
    }
}
