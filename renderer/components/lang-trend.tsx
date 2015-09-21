import * as React from 'react';
import Repository from './repository';
import IconButton from './icon-button';
import * as Action from '../actions';
import Store from '../store';

const openExternal: (url: string) => boolean = global.require('shell').openExternal;

interface Props {
    lang: string;
    repos: GitHubAPI.Repo[] | {[full_name: string]: GitHubAPI.Repo};
    key?: number;
    show_check: boolean;
}

interface State {
    show_mark_all: boolean;
}

export default class LangTrend extends React.Component<Props, State> {
    public static defaultProps = {show_check: false};

    constructor(props: Props) {
        super(props);

        this.state = {
            show_mark_all: false
        };
    }

    repositories() {
        let idx = 0;
        let children: React.ReactElement<any>[] = [];

        // Note:
        // 'for of' in TypeScript does not support iterating Object
        // when target is ES5...
        for (const key in this.props.repos) {
            children.push(
                <Repository key={idx++} repo={this.props.repos[key]} onCheckClicked={this.getCheckCallback(this.props.repos[key])}/>
            );
        }
        return children;
    }

    getCheckCallback(repo: GitHubAPI.Repo) {
        if (this.props.show_check) {
            return this.checkRepoAsRead.bind(this, repo.full_name);
        } else {
            return null;
        }
    }

    checkRepoAsRead(full_name: string) {
        Action.checkUnread(this.props.lang, full_name);
    }

    checkAllReposAsRead() {
        Action.checkUnread(this.props.lang, '*');
    }

    numRepos() {
        if (this.props.repos instanceof Array) {
            return (this.props.repos as GitHubAPI.Repo[]).length;
        } else {
            return Object.keys(this.props.repos as Object).length;
        }
    }

    onLangNameClicked(event) {
        event.preventDefault();
        const query = this.props.lang === 'all languages' ? '' : `?l=${this.props.lang}`;
        openExternal('https://github.com/trending' + query);
    }

    toggleCheck() {
        this.setState({
            show_mark_all: !this.state.show_mark_all
        });
    }

    render() {
        const markable = this.props.show_check && this.state.show_mark_all;

        const header_props: React.CSSProperties = {
            style: {
                borderLeftColor: Store.getLangColor(this.props.lang) || 'black',
            },
            onMouseOver: this.toggleCheck.bind(this),
            onMouseOut: this.toggleCheck.bind(this),
        };

        return (
            <div className="repos">
                <div className="header" {...header_props}>
                    <div className="lang">
                        <span className="octicon octicon-pulse"/>
                        <a className="lang-link" href="#" onClick={this.onLangNameClicked.bind(this)}>
                            {this.props.lang ? this.props.lang : 'all languages'}
                        </a>
                        <span className="counter">{this.numRepos()}</span>
                    </div>
                    <IconButton mega icon="check" color="black" visible={markable} onClick={markable ? this.checkAllReposAsRead.bind(this) : null}/>
                </div>
                <div className="repo-list">
                    {this.repositories()}
                </div>
            </div>
        );
    }
}
