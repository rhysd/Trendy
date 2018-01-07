import * as React from 'react';
import Octicon from 'react-component-octicons';

interface SideMenuProps {}

export default class SideMenu extends React.PureComponent<SideMenuProps, {}> {
    render() {
        return (
            <div className="side-menu">
                <Octicon name="flame" zoom="x2" />
                <Octicon name="octoface" zoom="x2" />
                <div className="spacer" />
                <Octicon name="gear" />
            </div>
        );
    }
}
