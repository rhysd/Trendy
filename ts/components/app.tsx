import * as React from 'react';
import SideMenu from './side_menu';
import Switch from '../containers/switch';

interface AppProps {}

export default class App extends React.PureComponent<AppProps> {
    render() {
        return (
            <div className="root bg-gray-dark">
                <SideMenu />
                <Switch />
            </div>
        );
    }
}
