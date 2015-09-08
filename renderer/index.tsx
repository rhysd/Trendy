import * as React from 'react';
import Root from './components/root';
import * as Action from './actions';

global.require('remote')
      .getCurrentWindow()
      .on('blur', (event: Event) => Action.clearUnread());

React.render(
        <Root />,
        document.body
    );
