import * as React from 'react';
import { FullRepository } from 'github-trend';
import Octicon from 'react-component-octicons';

interface RepoProps extends React.Props<Repo> {
    repo: FullRepository;
    forAll: boolean;
}

export default class Repo extends React.PureComponent<RepoProps, {}> {
    render() {
        return (
            <div className="repo">
                {this.renderSlug()}
                {this.renderDescription()}
                {this.renderFooter()}
            </div>
        );
    }

    private renderSlug() {
        const { repo } = this.props;
        const url = `https://github.com/${repo.owner}/${repo.name}`;
        return (
            <h3>
                <a href={url} target="_blank">
                    {repo.owner}
                    <span className="repo_slug-sep">/</span>
                    {repo.name}
                </a>
            </h3>
        );
    }

    private renderDescription() {
        const { repo } = this.props;
        const desc = repo.description || '';
        return <div className="repo_description text-gray">{desc}</div>;
    }

    private renderStarred(count: number) {
        return (
            <div className="repo_counter">
                <span className="repo_counter-icon">
                    <Octicon name="star" />
                </span>
                {count}
            </div>
        );
    }

    private renderFooter() {
        const { repo } = this.props;

        let lang;
        if (this.props.forAll && repo.langColor) {
            const style = { backgroundColor: repo.langColor };
            lang = (
                <div className="repo_lang">
                    <span className="repo_lang-color" style={style} />
                    {repo.language}
                </div>
            );
        }

        let forked;
        if (repo.forks) {
            forked = (
                <div className="repo_counter">
                    <span className="repo_counter-icon">
                        <Octicon name="repo-forked" />
                    </span>
                    {repo.forks}
                </div>
            );
        }

        return (
            <div className="repo_footer text-gray">
                {lang}
                {this.renderStarred(repo.allStars)}
                {forked}
                <div className="spacer" />
                {this.renderStarred(repo.todaysStars)}
                stars today
            </div>
        );
    }
}
