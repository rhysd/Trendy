import * as React from 'react';
import Repository from './repository';

interface Props {
    lang: string;
    repos: GitHubAPI.Repo[] | Object;
    key?: number;
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
            children.push(<Repository key={idx++} repo={this.props.repos[key]}/>);
        }
        return children;
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
