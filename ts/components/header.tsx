import * as React from 'react';

interface HeaderProps {
}

export default class Header extends React.PureComponent<HeaderProps, {}> {
    render() {
        return (
            <div className="header bg-gray-dark">
                Trendy
            </div>
        );
    }
}
