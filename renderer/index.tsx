import * as React from 'react';
import Root from './components/root';
import * as Action from './actions';
import RepoReceiver from './repo-receiver';

React.render(
        <Root />,
        document.body
    );

const repo_receiver = new RepoReceiver();
