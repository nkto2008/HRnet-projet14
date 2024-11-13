import { Route, Routes, Link } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';
import LoadingSpinner from './components/LoadingSpinner';
import { HelmetProvider } from 'react-helmet-async';

const CreateEmployee = lazy(() => import('./components/CreateEmployee'));
const EmployeeList = lazy(() => import('./components/EmployeeList'));


const ErrorPage = () => {
  return (
    <>
          <Helmet>
        <title>404 - Page Not Found | HRnet</title>
        <meta name="description" content="404 - Page Not Found | HRne" />
      
      </Helmet>
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>404 - Page Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      <Link to="/">Return to Home Page</Link>
    </div>
    </>
  );
};

const App = () => {
  return (

    <HelmetProvider>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route
            path="/"
            element={<CreateEmployee />}
          />
          <Route
            path="/employee-list"
            element={<EmployeeList />}
          />
          <Route
            path="*"
            element={<ErrorPage />}
          />
        </Routes>
      </Suspense>
    </HelmetProvider>
  );
};


export default App;