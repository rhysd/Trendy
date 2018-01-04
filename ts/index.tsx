import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import App from './containers/App';
import Store from './store';
import { scrapeDummyTrends } from './services/scrape';

render(
    <Provider store={Store}>
        <App />
    </Provider>,
    document.getElementById('entry-point'),
);

// XXX: Test
scrapeDummyTrends();
