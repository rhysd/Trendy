import * as React from 'react';
import Store from '../store';

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

    render() {
        if (this.state.last_reason === '') {
            return <span/>;
        }

        return (
            <div className="toast" ref="root">
                <div className="flash flash-error">
                    <span className="octicon octicon-x" onClick={this.clicked.bind(this)}/>{this.state.last_reason}
                    API Rate Limit has been reached!
                </div>
            </div>
        );
    }
}
