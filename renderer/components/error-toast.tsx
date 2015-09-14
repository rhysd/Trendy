import * as React from 'react';
import Store from '../store';

const ipc: ElectronRenderer.InProcess = global.require('ipc');

interface State {
    last_reason: string;
}

export default class ErrorToast extends React.Component<{}, State> {
    failure_listener: (reason: string) => void;

    constructor(props: {}) {
        super(props);

        this.state = {
            last_reason: ''
        };
    }

    componentDidMount() {
        this.failure_listener = reason => {
            this.setState({last_reason: reason});
        };
        Store.on('scraping-failed', this.failure_listener);
    }

    componentWillUnmount() {
        if (this.failure_listener) {
            Store.removeListener('scraping-failed', this.failure_listener);
        }
    }

    clicked() {
        let root = React.findDOMNode(this.refs['root']);
        root.addEventListener('animationend', () => this.setState({last_reason: ''}));
        root.className = "toast anime-fadeout";
    }

    startLogin() {
        ipc.send('start-github-login');
        this.clicked();
    }

    renderError() {
        if (this.state.last_reason === 'API-limit-exceeded') {
            return (
                <span>
                    API limit exceeded.  Please <a href="#" onClick={this.startLogin.bind(this)}>login</a> or reduce the number of languages to scrape to avoid this propblem.
                </span>
            );
        }

        return <span>{this.state.last_reason}</span>;
    }

    render() {
        if (this.state.last_reason === '') {
            return <span/>;
        }

        return (
            <div className="toast" ref="root">
                <div className="flash flash-error">
                    <div className="close">
                        <span className="octicon octicon-x" onClick={this.clicked.bind(this)}/>
                    </div>
                    <div className="main">
                        {this.renderError()}
                    </div>
                </div>
            </div>
        );
    }
}
