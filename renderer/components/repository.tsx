import * as React from 'react';
import ExternalLink from './external-link';
import IconButton from './icon-button';

interface Props {
    repo: GitHubAPI.Repo;
    onCheckClicked?: () => void;
    key?: number;
}

interface State {
    check_visible: boolean;
}

export default class Repository extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            check_visible: false,
        };
    }

    showCheck() {
        this.setState({
            check_visible: true,
        });
    }

    hideCheck() {
        this.setState({
            check_visible: false,
        });
    }

    getRepoURL() {
        if (this.props.repo.readme_url !== undefined) {
            return this.props.repo.readme_url;
        } else {
            return this.props.repo.html_url;
        }
    }

    render() {
        return (
            <div className="repo" ref="root" onMouseOver={this.showCheck.bind(this)} onMouseOut={this.hideCheck.bind(this)}>
                <div className="secondary">
                    <div className="title">
                        <ExternalLink url={this.props.repo.owner.html_url}>
                            <img className="author-icon" src={this.props.repo.owner.avatar_url}/>
                            {this.props.repo.owner.login}
                        </ExternalLink> / <ExternalLink url={this.getRepoURL()}>
                            {this.props.repo.name}
                        </ExternalLink>
                    </div>
                    <div className="metadata">
                        <span className="counter"><span className="octicon octicon-star"/>{this.props.repo.stargazers_count}</span>
                    </div>
                </div>
                <div className="primary">
                    <IconButton icon="check" color="#4078c0" mega={true} visible={this.state.check_visible} onClick={this.props.onCheckClicked} />
                    <div className="description">
                        {this.props.repo.description}
                    </div>
                </div>
                <div className="footer">
                    <div className="lang-name">
                        {this.props.repo.language ? this.props.repo.language : ""}
                    </div>
                </div>
            </div>
        );
    }
}
