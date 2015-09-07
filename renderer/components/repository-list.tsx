import * as React from 'react';
import Repository from './repository';

interface Props {
    lang: string;
    repos: GitHubAPI.Repo[];
    key?: number;
}

export default class RepositoryList extends React.Component<Props, {}> {
    constructor(props: Props) {
        super(props);
    }

    render() {
        return (
            <div className="repos">
                <div className="lang">
                    <span className="octicon octicon-pulse"/>{this.props.lang ? this.props.lang : "all languages"}<span className="counter">{this.props.repos.length}</span>
                </div>
                <div className="repo-list">
                    {this.props.repos.map((r, i) => <Repository key={i} repo={r}/>)}
                </div>
            </div>
        );
    }
}
