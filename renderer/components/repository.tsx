import * as React from 'react';
import ExternalLink from './external-link';

interface Props {
    repo: GitHubAPI.Repo;
    key?: number;
}

export default class Repository extends React.Component<Props, {}> {
    constructor(props: Props) {
        super(props);
    }

    titleIcon() {
        return this.props.repo.fork ? 'octicon octicon-repo-forked' : 'octicon octicon-repo';
    }

    render() {
        return (
            <div className="repo">
                <div className="secondary">
                    <div className="title">
                        <span className={this.titleIcon()}/>
                        <ExternalLink url={this.props.repo.owner.html_url}>
                            {this.props.repo.owner.login}
                        </ExternalLink> / <ExternalLink url={this.props.repo.html_url}>
                            {this.props.repo.name}
                        </ExternalLink>
                    </div>
                    <div className="metadata">
                        <span className="counter"><span className="octicon octicon-star"/>{this.props.repo.stargazers_count}</span>
                    </div>
                </div>
                <div className="primary">
                    {this.props.repo.description}
                </div>
            </div>
        );
    }
}
