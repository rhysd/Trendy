import * as React from 'react';

interface Props {
    icon: string;
    color: string;
    onClick: (event: React.SyntheticEvent) => void;
}

interface InnerProps {
    className: string;
    onClick: (event: React.SyntheticEvent) => void;
    style?: React.CSSProperties;
}

export default class IconButton extends React.Component<Props, {}> {
    constructor(props: Props) {
        super(props);
    }

    render() {
        let props: InnerProps = {
            className: "octicon octicon-" + this.props.icon + " icon-button",
            onClick: this.props.onClick,
        };

        props.style = {
            cursor: 'pointer',
            color: this.props.color,
        };

        return <span {...props} />;
    }
}

