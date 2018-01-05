import * as React from 'react';
import { List } from 'immutable';
import { FullRepository } from 'github-trend';
import Repo from './repo';

interface TrendsListProps {
    name: string;
    trends: List<FullRepository>;
}

export default class TrendsList extends React.PureComponent<TrendsListProps, {}> {
    renderTrend(repo: FullRepository, lang: string, key: number) {
        return (
            <div className="trends-list_item border-bottom" key={key}>
                <Repo repo={repo} forAll={!lang || lang === 'all'}/>
            </div>
        );
    }

    render() {
        const {name, trends} = this.props;
        const list = trends.map((repo, i) => this.renderTrend(repo, name, i));
        return (
            <div className="trends-list">
                <h2 className="trends-list_header border-bottom">
                    {name || 'All'}
                </h2>
                {list}
            </div>
        );
    }
}
