import React from 'react';
import RepoStore from '../store';
import RepoReceiver from '../repo-receiver';
import RepositoryList from './repository-list.jsx';

class Tab extends React.Component {
    constructor(props) {
        super(props);
    }

    getClassName() {
        if (this.props.tabname === this.props.current) {
            return 'tabnav-tab selected';
        } else {
            return 'tabnav-tab';
        }
    }

    render() {
        return (
            <a href="#" className={this.getClassName()} onClick={this.props.onClick} ref="new">
                {this.props.children}
            </a>
        );
    }
}

export default class Root extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            repos: RepoStore.getCurrentRepos(),
            tab: 'current',
        };
        this.repo_receiver = new RepoReceiver();
    }

    componentDidMount() {
        this.repo_listener = () =>
            this.setState({
                repos: RepoStore.getCurrentRepos(),
                tab: this.state.tab
            });
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

    onTabClicked(tabname, event) {
        event.preventDefault();

        if (this.state.tab === tabname) {
            return;
        }

        this.setState({
            repos: RepoStore.getCurrentRepos(),
            tab: tabname
        });
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
                        <Tab tabname="new" current={this.state.tab} onClick={this.onTabClicked.bind(this, 'new')}>New <span className="counter">0</span></Tab>
                        <Tab tabname="current" current={this.state.tab} onClick={this.onTabClicked.bind(this, 'current')}>Current</Tab>
                        <Tab tabname="all" current={this.state.tab} onClick={this.onTabClicked.bind(this, 'all')}>All</Tab>
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
