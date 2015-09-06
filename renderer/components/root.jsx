import React from 'react';
import RepoStore from '../store';
import RepoReceiver from '../repo-receiver';
import RepositoryList from './repository-list.jsx';

export default class Root extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            repos: RepoStore.getAllRepos()
        };
        this.repo_receiver = new RepoReceiver();
    }

    componentDidMount() {
        this.repo_listener = () => this.setState({repos: RepoStore.getCurrentRepos()});
        RepoStore.on('updated', this.repo_listener);
    }

    componentWillUnmount() {
        if (this.repo_listener) {
            RepoStore.removeListener('updated', this.repo_listener);
        }
    }

    prepareRepositoryLists() {
        let idx = 0;
        let lists = [];
        for (const lang in this.state.repos) {
            lists.push(<RepositoryList repos={this.state.repos[lang]} lang={lang} key={idx++}/>);
        }
        return lists;
    }

    render() {
        return (
            <div className="root">
                <div className="root-header"/>
                <div className="tabnav">
                    <div className="tabnav-extra right">
                        <select className="select select-sm">
                            <option>Language</option>
                            <option>all</option>
                            <option>vim</option>
                            <option>go</option>
                            <option>rust</option>
                            <option>javascript</option>
                            <option>c++</option>
                        </select>
                    </div>
                    <nav className="tabnav-tabs">
                        <a href="#" className="tabnav-tab">New <span className="counter">0</span></a>
                        <a href="#" className="tabnav-tab selected">Current</a>
                        <a href="#" className="tabnav-tab">All</a>
                    </nav>
                </div>
                <div className="contents">
                    {this.prepareRepositoryLists()}
                </div>
                <div className="root-footer">
                    <span className="octicon octicon-sync"/>
                    <span className="octicon octicon-gear"/>
                </div>
            </div>
        );
    }
}
