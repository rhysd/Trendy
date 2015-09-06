import React from 'react';

export default class Repository extends React.Component {
    constructor(props) {
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
                        <span className={this.titleIcon()}/><a href={this.props.repo.owner.html_url}>{this.props.repo.owner.login}</a> / <a href={this.props.repo.html_url}>{this.props.repo.name}</a>
                    </div>
                    <div className="metadata">
                        <span className="octicon octicon-star"/>{this.props.repo.stargazers_count}
                        <span className="octicon octicon-eye"/>{this.props.repo.watchers_count}
                    </div>
                </div>
                <div className="primary">
                    {this.props.repo.description}
                </div>
            </div>
        );
    }
}
