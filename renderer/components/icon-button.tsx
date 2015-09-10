import * as React from 'react';

interface Props {
    icon: string;
    color: string;
    onClick: (event: React.SyntheticEvent) => void;
    visible?: boolean;
    mega?: boolean;
}

interface InnerProps {
    className: string;
    onClick: (event: React.SyntheticEvent) => void;
    style?: React.CSSProperties;
}

export default class IconButton extends React.Component<Props, {}> {
    public static defaultProps = {visible: true, mega: false};

    constructor(props: Props) {
        super(props);
    }

    getClassName() {
        return `${this.props.mega ? "mega-octicon" : "octicon"} octicon-${this.props.icon} icon-button`;
    }

    render() {
        let props: InnerProps = {
            className: this.getClassName(),
            onClick: this.props.onClick,
        };

        props.style = {
            cursor: this.props.onClick ? 'pointer' : '',
            color: this.props.visible && this.props.onClick ? this.props.color : 'transparent',
        };

        return <span {...props} />;
    }
}

// Note:
// react.d.ts doesn't support defaultProps
