import React from 'react';

export default class RepositoryList extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="repos">
                {this.props.repos.map((r, i) => <div key={i}>{r.full_name}</div>)}
            </div>
        );
    }
}
