import * as React from 'react';
// import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import State from '../state';

interface AppProps {
}

class App extends React.Component<AppProps> {
    render() {
        return (
            <div>Hello, world</div>
        );
    }
}

const mapStateToProps = (_: State) => ({
});

export default connect(mapStateToProps)(App);
