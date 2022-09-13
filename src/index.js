import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/style.css';
import MainScreen from './screens/MainScreen/index';
import MailScreen from './screens/MailScreen';
import { QueryClientProvider, QueryClient } from 'react-query';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserContextProvider } from './context/userContext.tsx';

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<UserContextProvider>
			<QueryClientProvider client={queryClient}>
				<Router>
					<Routes>
						<Route element={<MainScreen />} path='/' />
						<Route element={<MailScreen />} path='/mail' />
					</Routes>
				</Router>
			</QueryClientProvider>
		</UserContextProvider>
	</React.StrictMode>
);
