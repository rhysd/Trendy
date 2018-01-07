import * as React from 'react';
import Octicon from 'react-component-octicons';

interface SideMenuProps {}

export default class SideMenu extends React.PureComponent<SideMenuProps, {}> {
    render() {
        return (
            <div className="side-menu">
                <Octicon name="flame" />
                <Octicon name="octoface" />
                <div className="spacer" />
                <Octicon name="gear" />
            </div>
        );
    }
}
