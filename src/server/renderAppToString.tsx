import * as ReactDOM from 'react-dom/server';
import { Provider } from 'react-redux';
import { StaticRouter as Router } from 'react-router';
import {ThemeProvider} from 'react-jss';
import App from '../components/App';
import * as React from 'react';

import {
  createMuiTheme,
  ServerStyleSheets,
} from '@material-ui/core/styles';

export default function renderAppToString(req, context, store, mainClass = '') {
  const sheets = new ServerStyleSheets();

  // Create a theme instance.
  const theme = createMuiTheme({
    // palette: {
    //   primary: green,
    //   accent: red,
    //   type: 'light',
    // },
    typography: {},
  });

  const appString = ReactDOM.renderToString(
    sheets.collect(
      <Provider store={store}>
        <Router context={context} location={req.url}>
          <ThemeProvider theme={theme}>
            <App />
          </ThemeProvider>
        </Router>
      </Provider>
    ),
  );

  const css = sheets.toString();

  const storeScript = `<script>
    window.ESSDEV = {};
    window.ESSDEV.store = ${JSON.stringify(store.getState()).replace(
    /</g,
    '\\u003c'
  )};</script>`;

  return { html: `<div id="main" role="main" ${mainClass && `class="${mainClass}"`}>${appString}</div>` + storeScript, css };
}
