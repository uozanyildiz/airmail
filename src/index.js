import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/style.css';
import MainScreen from './screens/MainScreen';
import MailScreen from './screens/MailScreen';
import { ReactQueryDevtools } from 'react-query/devtools';
import { QueryClientProvider, QueryClient } from 'react-query';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<Router>
				<Routes>
					<Route element={<MainScreen />} path='/' />
					<Route element={<MailScreen />} path='/mail' />
				</Routes>
			</Router>
			<ReactQueryDevtools initialIsOpen={false} position='bottom-right' />
		</QueryClientProvider>
	</React.StrictMode>
);
