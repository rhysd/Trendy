import * as React from 'react';
import { TrendsState } from '../state';
import LangTrends from './lang_trends';

interface MultiColumnsProps {
    trends: TrendsState;
}

export default class MultiColumns extends React.Component<MultiColumnsProps, {}> {
    render() {
        // TEMPORARY
        return (
            <div className="multi-columns">
                <LangTrends name={''} trends={this.props.trends.get('')} />
                <LangTrends name={''} trends={this.props.trends.get('')} />
                <LangTrends name={''} trends={this.props.trends.get('')} />
            </div>
        );
    }
}
