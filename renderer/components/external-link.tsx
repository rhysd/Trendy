import * as React from 'react';
import * as Action from '../actions';

const openExternal: (url: string) => void = global.require("shell").openExternal;

export function openExternalLink(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    // Note: EventTarget is not compatible to HTMLAnchorElement
    let target: any = event.target;
    while (target !== null) {
        if (target.href !== undefined && target.className.indexOf("external-link") === 0) {
            if ((event.nativeEvent as MouseEvent).metaKey) {
                openExternal(target.href);
            } else {
                Action.openURL(target.href);
            }
            return;
        }
        target = target.parentNode;
    }
    console.log("_openExternalLink: Unexpected link", event.target);
}

interface Props {
    url: string;
    children?: React.ReactElement<any>[];
}

export default class ExternalLink extends React.Component<Props, {}> {
    constructor(props: Props) {
        super(props);
    }

    render() {
        return (
            <a className="external-link" href={this.props.url} onClick={openExternalLink}>
                {this.props.children}
            </a>
        );
    }
}
