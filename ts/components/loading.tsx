import * as React from 'react';

interface LoadingProps {
}

export default class Loading extends React.PureComponent<LoadingProps, {}> {
    render() {
        return (
            <div>Now loading...</div>
        );
    }
}
