import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import "./i18n"
import { Loader } from './components/Loader';

ReactDOM.render(
  <React.StrictMode>
    <React.Suspense fallback={<Loader />}>
      <App />
    </React.Suspense>
  </React.StrictMode>,
  document.getElementById('root')
);

