import * as React from 'react';
import { connect } from 'react-redux';
import State, { TrendsState } from '../state';
import Loading from '../components/loading';
import MultiColumns from '../components/multi_columns';

interface LayoutSwitchProps {
    trends: TrendsState;
}

// Switch app's main contents by the state of components
//
// - When no trend is specified -> loading
// - When some trends fetched and window width is narrow -> tabs mode
// - When some trends fetched and window width is not narrow -> multi pane mode

class LayoutSwitch extends React.Component<LayoutSwitchProps> {
    render() {
        if (this.props.trends.size === 0) {
            return <Loading />;
        }

        // XXX: Temporary
        return <MultiColumns trends={this.props.trends} />;
    }
}

function mapStateToProps(s: State) {
    return {
        trends: s.trends,
    };
}

export default connect(mapStateToProps)(LayoutSwitch);
