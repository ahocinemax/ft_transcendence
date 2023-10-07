import {BrowserRouter} from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import React from 'react';
import App from './pages/App';
import './index.css';
import reportWebVitals from './reportWebVitals';


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	 <React.StrictMode>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	 </React.StrictMode>
);
reportWebVitals();
