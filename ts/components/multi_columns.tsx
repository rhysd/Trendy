import * as React from 'react';
import { TrendsState } from '../state';
import LangTrends from './lang_trends';

interface MultiColumnsProps {
    trends: TrendsState;
}

export default class MultiColumns extends React.Component<MultiColumnsProps, {}> {
    renderColumns() {
        const { trends } = this.props;
        return trends
            .entrySeq()
            .toArray()
            .map(([name, repos], i) => <LangTrends name={name} trends={repos} key={i} />);
    }
    render() {
        return <main className="multi-columns bg-gray-light">{this.renderColumns()}</main>;
    }
}
