import * as React from 'react';
import RepoStore from '../store';
import RepoReceiver from '../repo-receiver';
import LangTrend from './lang-trend';

interface TabProps {
    tabname: string;
    current: string;
    children?: React.ReactElement<any>[];
    onClick: (event: React.SyntheticEvent) => void;
}

class Tab extends React.Component<TabProps, {}> {
    constructor(props: TabProps) {
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

interface RootState {
    tab: string;
}

export default class Root extends React.Component<{}, RootState> {
    repo_receiver: RepoReceiver;
    repo_listener: () => void;

    constructor(props: {}) {
        super(props);

        this.state = {
            tab: 'current',
        };
        this.repo_receiver = new RepoReceiver();
    }

    componentDidMount() {
        this.repo_listener = () =>
            this.setState({
                tab: this.state.tab
            });
        RepoStore.on('updated', this.repo_listener);
    }

    componentWillUnmount() {
        if (this.repo_listener) {
            RepoStore.removeListener('updated', this.repo_listener);
        }
    }

    prepareTrends() {
        const repos = (() => {
            switch(this.state.tab) {
                case 'new':     return RepoStore.getUnreadRepos();
                case 'current': return RepoStore.getCurrentRepos();
                case 'all':     return RepoStore.getAllRepos();
                default:        return {};
            }
        })();

        let idx = 0;
        let lists = [];

        for (const lang in repos) {
            lists.push(<LangTrend repos={repos[lang]} lang={lang} key={idx++}/>);
        }

        return lists;
    }

    onTabClicked(tabname: string, event: React.SyntheticEvent) {
        event.preventDefault();

        if (this.state.tab === tabname) {
            return;
        }

        this.setState({
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
                    {this.prepareTrends()}
                </div>
                <div className="root-footer">
                    <span className="octicon octicon-sync"/>
                    <span className="octicon octicon-gear"/>
                </div>
            </div>
        );
    }
}
