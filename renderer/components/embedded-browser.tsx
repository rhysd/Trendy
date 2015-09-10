import * as React from 'react';
import Store from '../store';

const openExternal: (url: string) => boolean = global.require('shell').openExternal;

export default class EmbeddedBrowser extends React.Component<{}, {}> {
    url_click_listener: (url: string) => void;

    constructor(props: {}) {
        super(props);
    }

    getUserAgent(elem: Element) {
        if (elem.clientWidth < 1000) {
            return 'Mozilla/5.0 (iPhone; CPU iPhone OS 7_0 like Mac OS X; en-us) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A465 Safari/9537.53';
        } else {
            return null;
        }
    }

    componentDidMount() {
        let body = this.refs['body'].getDOMNode();
        let webview = document.createElement('webview') as ElectronRenderer.Webview;
        webview.id = 'embedded-webview';
        webview.style.display = 'none';
        webview.addEventListener('did-finish-load', () => {
            let title = this.refs['title'].getDOMNode() as HTMLSpanElement;
            title.innerText = webview.getTitle();
        });
        body.appendChild(webview);

        this.url_click_listener = url => {
            if (!url) {
                return;
            }

            let root = this.refs['root'].getDOMNode() as HTMLElement;
            root.style.display = '';
            root.className = "embedded-browser anime-slidein";

            let body = this.refs['body'].getDOMNode();

            let webview = document.getElementById('embedded-webview') as ElectronRenderer.Webview;
            webview.style.display = '';
            webview.style.height = body.clientHeight + 'px';
            webview.style.width = body.clientWidth + 'px';

            const useragent = this.getUserAgent(body);
            if (useragent) {
                webview.useragent = useragent;
            }

            webview.src = url;
        };
        Store.on('url-clicked', this.url_click_listener);
    }

    componentWillUnmount() {
        if (this.url_click_listener) {
            Store.removeListener('url-clicked', this.url_click_listener);
        }
    }

    goBack() {
        let webview = document.getElementById('embedded-webview') as ElectronRenderer.Webview;
        if (webview && webview.canGoBack()) {
            webview.goBack();
        }
    }

    goForward() {
        let webview = document.getElementById('embedded-webview') as ElectronRenderer.Webview;
        if (webview && webview.canGoForward()) {
            webview.goForward();
        }
    }

    close() {
        let root = this.refs['root'].getDOMNode() as HTMLElement;
        root.className = "embedded-browser anime-slideout";
        const animation_ended = () => {
            root.style.display = 'none';
            root.removeEventListener('animationend', animation_ended);
        };
        root.addEventListener('animationend', animation_ended);
        let webview = document.getElementById('embedded-webview') as ElectronRenderer.Webview;
        webview.style.display = 'none';
    }

    openUrlExternal() {
        let webview = document.getElementById('embedded-webview') as ElectronRenderer.Webview;
        openExternal(webview.getUrl());
    }

    render() {
        return (
            <div className="embedded-browser" ref="root" style={{display: 'none'}}>
                <div className="browser-title-bar">
                    <span className="page-back" onClick={this.goBack}>
                        <span className="mega-octicon octicon-arrow-left"/>
                    </span>
                    <span className="page-forward" onClick={this.goForward}>
                        <span className="mega-octicon octicon-arrow-right"/>
                    </span>
                    <span className="page-title" ref="title"/>
                    <span className="page-external" onClick={this.openUrlExternal}>
                        <span className="mega-octicon octicon-link-external"/>
                    </span>
                    <span className="browser-close" onClick={() => this.close()}>
                        <span className="mega-octicon octicon-x"/>
                    </span>
                </div>
                <div className="browser-body" ref="body">
                </div>
            </div>
        );
    }
}
