import React from 'react';
import RepoStore from '../store';
import RepoReceiver from '../repo-receiver';
import RepositoryList from './repository-list.jsx';

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
                <div className="tabnav">
                    <div className="tabnav-extra right">
                        Tabnav widget text here.
                    </div>
                    <nav className="tabnav-tabs">
                        <a href="#" className="tabnav-tab">New</a>
                        <a href="#" className="tabnav-tab selected">All</a>
                        <a href="#" className="tabnav-tab">History</a>
                    </nav>
                </div>
                <div className="contents">
                    <RepositoryList repos={this.state.repos}/>
                </div>
            </div>
        );
    }
}
