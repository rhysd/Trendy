import * as React from 'react';
import * as Slideout from 'slideout';
import RepoStore from '../store';
import * as Action from '../actions';
import LangTrend from './lang-trend';
import IconButton from './icon-button';
import EmbeddedBrowser from './embedded-browser';
import ErrorToast from './error-toast';
import SlideMenu from './slide-menu';

const ipc: ElectronRenderer.InProcess = global.require('ipc');
const remote: ElectronRenderer.Remote = global.require('remote');

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
    selected_lang: string;
    search_word: string;
}

export default class Root extends React.Component<{}, RootState> {
    repo_listener: () => void;
    config: ConfigJSON;
    slideout: SlideoutStatic.Slideout;

    constructor(props: {}) {
        super(props);

        this.state = {
            tab: 'current',
            selected_lang: null,
            search_word: '',
        };
        this.config = remote.getGlobal('config').load();
    }

    componentDidMount() {
        // TODO: Use update instead of setState
        this.repo_listener = () => this.setState({
            tab: this.state.tab,
            selected_lang: this.state.selected_lang,
            search_word: this.state.search_word,
        });
        RepoStore.on('updated', this.repo_listener);

        remote.getCurrentWindow().on('focus', this.clearTrayIconOnNewTab.bind(this));

        if (this.config.mode === 'menubar') {
            this.slideout = new Slideout({
                panel: React.findDOMNode(this.refs['panel']),
                menu: React.findDOMNode(this.refs['menu']),
                side: 'right',
            });
        }
    }

    componentWillUnmount() {
        if (this.repo_listener) {
            RepoStore.removeListener('updated', this.repo_listener);
        }
    }

    clearTrayIconOnNewTab() {
        if (this.state.tab === 'new') {
            // Clear notified icon
            ipc.send('tray-icon-normal');
        }
    }

    getReposToShow(): UnorderedreposList | OrderedReposList {
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
            this.setState({
                tab: tabname,
                selected_lang: this.state.selected_lang,
                search_word: this.state.search_word,
            });
        }
    }

    getUserAgent() {
        if (this.config.mode === 'menubar') {
            return 'Mozilla/5.0 (iPhone; CPU iPhone OS 7_0 like Mac OS X; en-us) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A465 Safari/9537.53';
        } else {
            return null;
        }
    }

    onLangSelected(selected: string) {
        this.setState({
            tab: this.state.tab,
            selected_lang: selected,
            search_word: this.state.search_word,
        });
        this.slideout.close();
    }

    shouldSelect(repo) {
        if (repo.full_name.indexOf(this.state.search_word) !== -1) {
            return true;
        }

        if (repo.description.indexOf(this.state.search_word) !== -1) {
            return true;
        }

        return false;
    }

    filterBySearch(repos) {
        if (!this.state.search_word) {
            return repos;
        }

        if (repos instanceof Array) {
            let filtered = [];
            for (const repo of repos) {
                if (this.shouldSelect(repo)) {
                    filtered.push(repo);
                }
            }
            return filtered;
        } else {
            let filtered = {};
            for (const full_name in repos) {
                const r = repos[full_name];
                if (this.shouldSelect(r)) {
                    filtered[full_name] = r;
                }
            }
            return filtered;
        }
    }

    getSelectedRepos(trends) {
        const l = this.state.selected_lang;
        let selected = {};

        if (l === null) {
            for (const lang in trends) {
                selected[lang] = this.filterBySearch(trends[lang]);
            }
        } else {
            selected[l] = this.filterBySearch(trends[l]);
        }

        return selected;
    }

    setSearchWord(word: string) {
        this.setState({
            tab: this.state.tab,
            selected_lang: this.state.selected_lang,
            search_word: word,
        });
        this.slideout.close();
    }

    render() {
        this.clearTrayIconOnNewTab();

        const all_trends = this.getReposToShow();
        const trends = this.getSelectedRepos(all_trends);

        const slidemenu_props = {
            onLangSelect: this.onLangSelected.bind(this),
            selected_lang: this.state.selected_lang,
            trends: all_trends,
            onClose: () => this.slideout.close(),
            onSearch: this.setSearchWord.bind(this),
        };

        return (
            <div className={this.config.mode === 'menubar' ? 'root' : 'root isolated'}>
                <nav ref="menu">
                    <SlideMenu {...slidemenu_props} />
                </nav>
                <main className="contents-wrapper" ref="panel">
                    <div className="tabnav">
                        <div className="tabnav-extra right">
                            <IconButton mega icon="list-unordered" color="white" onClick={() => this.slideout.toggle()}/>
                        </div>
                        <nav className="tabnav-tabs">
                            <Tab tabname="new" current={this.state.tab} onClick={this.onTabClicked.bind(this, 'new')}>New <span className="counter">{this.unreadCount()}</span></Tab>
                            <Tab tabname="current" current={this.state.tab} onClick={this.onTabClicked.bind(this, 'current')}>Current</Tab>
                            <Tab tabname="all" current={this.state.tab} onClick={this.onTabClicked.bind(this, 'all')}>All</Tab>
                        </nav>
                    </div>
                    <div className="contents">
                        <ErrorToast/>
                        <Trends repos={trends} kind={this.state.tab}/>
                    </div>
                </main>
                <EmbeddedBrowser/>
            </div>
        );
    }
}
