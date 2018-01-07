import * as React from 'react';
import { List } from 'immutable';
import { FullRepository } from 'github-trend';
import Repo from './repo';

interface LangTrendsProps {
    name: string;
    trends: List<FullRepository>;
}

export default class LangTrends extends React.PureComponent<LangTrendsProps, {}> {
    private list: HTMLDivElement;

    scrollListToTop = () => {
        if (this.list !== undefined) {
            this.list.scrollTop = 0;
        }
    };

    render() {
        const { name, trends } = this.props;
        const list = trends.map((repo, i) => this.renderTrend(repo, name, i));
        return (
            <div className="lang-trends bg-white border-right">
                {this.renderHeader()}
                <div className="lang-trends_repos-list" ref={e => (this.list = e)}>
                    {list}
                </div>
            </div>
        );
    }

    private renderTrend(repo: FullRepository, lang: string, key: number) {
        return (
            <div className="lang-trends_item border-bottom" key={key}>
                <Repo repo={repo} forAll={!lang || lang === 'all'} />
            </div>
        );
    }

    private renderHeader() {
        const { name } = this.props;
        return (
            <h2 className="lang-trends_header border-bottom bg-gray-light" onClick={this.scrollListToTop}>
                {name || 'All'}
            </h2>
        );
    }
}
