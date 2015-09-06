import React from 'react';
import Repository from './repository.jsx';

export default class RepositoryList extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="repos">
                <div className="lang">
                    <span className="octicon octicon-pulse"/>{this.props.lang ? this.props.lang : "all languages"}
                </div>
                <div className="repo-list">
                    {this.props.repos.map((r, i) => <Repository key={i} repo={r}/>)}
                </div>
            </div>
        );
    }
}
