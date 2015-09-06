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
                <div className="root-header"/>
                <div className="tabnav">
                    <div className="tabnav-extra right">
                        Search by language name
                    </div>
                    <nav className="tabnav-tabs">
                        <a href="#" className="tabnav-tab">New <span className="counter">0</span></a>
                        <a href="#" className="tabnav-tab selected">All</a>
                        <a href="#" className="tabnav-tab">History</a>
                    </nav>
                </div>
                <div className="contents">
                    <RepositoryList repos={this.state.repos} lang={""}/>
                </div>
                <div className="root-footer"/>
            </div>
        );
    }
}
