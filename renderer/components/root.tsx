import * as React from 'react';
import RepoStore from '../store';
import RepoReceiver from '../repo-receiver';
import * as Action from '../actions';
import LangTrend from './lang-trend';
import IconButton from './icon-button';

const ipc: any = global.require('ipc');

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

interface TrendsProps {
    repos: GitHubAPI.Repo[] | Object;
    kind: string;
}

class Trends extends React.Component<TrendsProps, {}> {
   constructor(props: TrendsProps) {
       super(props);
   }

   getChildren() {
        let idx = 0;
        let lists = [];

        for (const lang in this.props.repos) {
            lists.push(<LangTrend repos={this.props.repos[lang]} lang={lang} key={idx++} show_check={this.props.kind === 'new'}/>);
        }

        return lists;
   }

   render() {
       const children = this.getChildren();

       if (children.length === 0) {
            return (
                <div className="trends blankslate spacious">
                    <span className="mega-octicon octicon-graph"/>
                    <h3>Nothing to Show</h3>
                    <p>New repositories will be shown here</p>
                </div>
            );
       }

       return (
            <div className="trends">
                {children}
            </div>
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
        this.repo_listener = () => this.setState({tab: this.state.tab});
        RepoStore.on('updated', this.repo_listener);
    }

    componentWillUnmount() {
        if (this.repo_listener) {
            RepoStore.removeListener('updated', this.repo_listener);
        }
    }

    getReposToShow() {
        switch(this.state.tab) {
            case 'new':     return RepoStore.getUnreadRepos();
            case 'current': return RepoStore.getCurrentRepos();
            case 'all':     return RepoStore.getAllRepos();
            default:        return {};
        }
    }

    unreadCount() {
        let count = 0;
        const unread = RepoStore.getUnreadRepos();
        for (const lang in unread) {
            count += Object.keys(unread[lang]).length;
        }
        return count;
    }

    onTabClicked(tabname: string, event: React.SyntheticEvent) {
        event.preventDefault();
        window.scrollTo(0, 0);
        if (this.state.tab !== tabname) {
            this.setState({tab: tabname});
        }
    }

    forceUpdateRepos() {
        console.log('force update');
        ipc.send('force-update-repos');
    }

    render() {
        if (this.state.tab === 'new') {
            // Clear notified icon
            ipc.send('tray-icon-normal');
        }

        return (
            <div className="root">
                <div className="root-header">
                    <div className="tabnav">
                        <div className="tabnav-extra right">
                            <select className="select select-sm">
                                <option>Language</option>
                                <option>Not</option>
                                <option>Implemented</option>
                                <option>Yet</option>
                            </select>
                        </div>
                        <nav className="tabnav-tabs">
                            <Tab tabname="new" current={this.state.tab} onClick={this.onTabClicked.bind(this, 'new')}>New <span className="counter">{this.unreadCount()}</span></Tab>
                            <Tab tabname="current" current={this.state.tab} onClick={this.onTabClicked.bind(this, 'current')}>Current</Tab>
                            <Tab tabname="all" current={this.state.tab} onClick={this.onTabClicked.bind(this, 'all')}>All</Tab>
                        </nav>
                    </div>
                </div>
                <div className="contents">
                    <Trends repos={this.getReposToShow()} kind={this.state.tab}/>
                </div>
                <div className="root-footer">
                    <IconButton icon="gear" color="white" onClick={() => console.log('not implemented :(')}/>
                    <IconButton icon="sync" color="white" onClick={this.forceUpdateRepos}/>
                </div>
            </div>
        );
    }
}
