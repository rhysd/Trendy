import React from 'react';
import RepoStore from '../store';
import RepoReceiver from '../repo-receiver';

export default class Root extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            repos: RepoStore.getAll()
        };
        this.repo_receiver = new RepoReceiver();
    }

    componentDidMount() {
        this.repo_listener = () => this.setState({repos: RepoStore.getAll()});
        RepoStore.on('updated', this.repo_listener);
    }

    componentWillUnmount() {
        if (this.repo_listener) {
            RepoStore.removeListener('updated', this.repo_listener);
        }
    }

    render() {
        return (
            <div className="root">
                {this.state.repos.map((r, i) => <div key={i}>{r.full_name}</div>)}
            </div>
        );
    }
}
