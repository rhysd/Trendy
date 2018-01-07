import * as React from 'react';
import { connect } from 'react-redux';
import State, { TrendsState, ConfigState } from '../state';
import Config from '../components/config';
import MultiColumns from '../components/multi_columns';

interface LayoutSwitchProps {
    trends: TrendsState;
    config: ConfigState;
}

// Switch app's main contents by the state of components
//
// - When no trend is specified -> loading
// - When some trends fetched and window width is narrow -> tabs mode
// - When some trends fetched and window width is not narrow -> multi pane mode

class LayoutSwitch extends React.Component<LayoutSwitchProps> {
    render() {
        if (this.props.trends.size === 0) {
            return <Config config={this.props.config} />;
        }

        // XXX: Temporary
        return <MultiColumns trends={this.props.trends} />;
    }
}

function mapStateToProps(s: State) {
    return {
        trends: s.trends,
        config: s.config,
    };
}

export default connect(mapStateToProps)(LayoutSwitch);
