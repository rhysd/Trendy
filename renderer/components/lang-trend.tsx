import * as React from 'react';
import Repository from './repository';
import * as Action from '../actions';

interface Props {
    lang: string;
    repos: GitHubAPI.Repo[] | Object;
    key?: number;
    show_check: boolean;
}

export default class LangTrend extends React.Component<Props, {}> {
    constructor(props: Props) {
        super(props);
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
            return this.checkRepo.bind(this, repo.full_name);
        } else {
            return null;
        }
    }

    checkRepo(full_name: string) {
        Action.checkUnread(this.props.lang, full_name);
    }

    numRepos() {
        if (this.props.repos instanceof Array) {
            return (this.props.repos as GitHubAPI.Repo[]).length;
        } else {
            return Object.keys(this.props.repos as Object).length;
        }
    }

    render() {
        return (
            <div className="repos">
                <div className="lang">
                    <span className="octicon octicon-pulse"/>{this.props.lang ? this.props.lang : "all languages"}<span className="counter">{this.numRepos()}</span>
                </div>
                <div className="repo-list">
                    {this.repositories()}
                </div>
            </div>
        );
    }
}
