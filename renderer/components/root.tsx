import * as React from 'react';
import RepoStore from '../store';
import * as Action from '../actions';
import LangTrend from './lang-trend';
import IconButton from './icon-button';
import EmbeddedBrowser from './embedded-browser';
import ErrorToast from './error-toast';

const ipc: ElectronRenderer.InProcess = global.require('ipc');
const remote: ElectronRenderer.Remote = global.require('remote');
const shell: ElectronRenderer.Shell = global.require('shell');

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

interface LangSelectorProps {
    onSelect: (selected: string) => void;
    selected_lang: string;
    langs: string[];
}

class LangSelector extends React.Component<LangSelectorProps, {}> {
    constructor(props: LangSelectorProps) {
        super(props);
    }

    langSelected(event) {
        let selected: string = null;
        for (const o of event.target.options) {
            if (o.selected) {
                if (o.value !== "any language") {
                    selected = o.value;
                    break;
                }
            }
        }

        if (selected !== this.props.selected_lang) {
            this.props.onSelect(selected);
        }
    }

    render() {
        let key = 0;
        let children = [
            <option>any language</option>
        ];

        for (const lang of this.props.langs) {
            children.push(<option key={key++}>{lang}</option>);
        }

        return (
            <select className="select select-sm" onChange={this.langSelected.bind(this)}>
                {children}
            </select>
        );
    }
}

interface RootState {
    tab: string;
    selected_lang: string;
}

export default class Root extends React.Component<{}, RootState> {
    repo_listener: () => void;
    config: ConfigJSON;

    constructor(props: {}) {
        super(props);

        this.state = {
            tab: 'current',
            selected_lang: null,
        };
        this.config = remote.getGlobal('config').load();
    }

    componentDidMount() {
        this.repo_listener = () => this.setState({
            tab: this.state.tab,
            selected_lang: this.state.selected_lang,
        });
        RepoStore.on('updated', this.repo_listener);

        remote.getCurrentWindow().on('focus', this.clearTrayIconOnNewTab.bind(this));
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
            this.setState({
                tab: tabname,
                selected_lang: this.state.selected_lang,
            });
        }
    }

    forceUpdateRepos() {
        console.log('force update');
        ipc.send('force-update-repos');
    }

    openConfigFile() {
        shell.openItem(remote.getGlobal('config').path);
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
        });
    }

    getSelectedRepos(all) {
        const l = this.state.selected_lang;
        if (l === null) {
            return all;
        }

        let selected = {};
        selected[l] = all[l];
        return selected;
    }

    render() {
        this.clearTrayIconOnNewTab();

        const all_repos = this.getReposToShow();
        const repos = this.getSelectedRepos(all_repos);

        return (
            <div className="root">
                <div className="root-header">
                    <div className="tabnav">
                        <div className="tabnav-extra right">
                            <LangSelector selected_lang={this.state.selected_lang} langs={Object.keys(all_repos)} onSelect={this.onLangSelected.bind(this)} />
                        </div>
                        <nav className="tabnav-tabs">
                            <Tab tabname="new" current={this.state.tab} onClick={this.onTabClicked.bind(this, 'new')}>New <span className="counter">{this.unreadCount()}</span></Tab>
                            <Tab tabname="current" current={this.state.tab} onClick={this.onTabClicked.bind(this, 'current')}>Current</Tab>
                            <Tab tabname="all" current={this.state.tab} onClick={this.onTabClicked.bind(this, 'all')}>All</Tab>
                        </nav>
                    </div>
                </div>
                <div className="contents">
                    <ErrorToast/>
                    <Trends repos={repos} kind={this.state.tab}/>
                </div>
                <div className="root-footer">
                    <span className="last-update">{RepoStore.getLastUpdateTime()}</span>
                    <IconButton icon="gear" color="white" onClick={this.openConfigFile}/>
                    <IconButton icon="sync" color="white" onClick={this.forceUpdateRepos}/>
                </div>
                <EmbeddedBrowser/>
            </div>
        );
    }
}
