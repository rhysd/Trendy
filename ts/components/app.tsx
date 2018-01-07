import * as React from 'react';
import SideMenu from './side_menu';
import LayoutSwitch from '../containers/layout_switch';

interface AppProps {}

export default class App extends React.PureComponent<AppProps> {
    render() {
        return (
            <div className="root bg-gray-dark">
                <SideMenu />
                <LayoutSwitch />
            </div>
        );
    }
}
