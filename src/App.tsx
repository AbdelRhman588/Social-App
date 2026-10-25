
import './App.css'
import { createBrowserRouter, RouterProvider} from 'react-router-dom'
import Layout from './Layout/Layout';
import Home from './Pages/Home';
import Profile from './Pages/Profile';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Notfound from './Pages/Notfound';
import CounterContextProvider from './Context/CounterContext';
import AuthContextProvider from './Context/AuthContext';
import ProtectedRoute from './components/protectedRoute/ProtectedRoute';
import { QueryClientProvider ,QueryClient  } from '@tanstack/react-query';
import PostDetails from './Pages/PostDetails/PostDetails';
// import { Toaster } from 'react-hot-toast';
import {useNetworkState} from "react-use"


const query = new QueryClient()


const routers = createBrowserRouter([
  { path: "", element:<Layout/>, children: [ 
    { index:true, element:<ProtectedRoute><Home/></ProtectedRoute>} ,
    { path: "/home", element:<ProtectedRoute><Home/></ProtectedRoute>} ,
  { path: "profile", element:<ProtectedRoute><Profile/></ProtectedRoute> },
  { path: "postdetails/:id", element:<ProtectedRoute><PostDetails/></ProtectedRoute> },
  { path: "login", element:<Login/>},
  { path: "register", element:<Register/>},
  { path: "*", element:<Notfound/>},]} ,
 

   
]);






function App() {
  const { online } = useNetworkState();

  return (
    <>
      {!online && (
        <div className='text-4xl text-white fixed inset-0 bg-slate-900/90 flex justify-center items-center'>
          Your Are Offline Now!
        </div>
      )}

      <QueryClientProvider client={query}>
        <AuthContextProvider>
          {/* <Toaster position="top-right" /> */}
          <CounterContextProvider>
            <RouterProvider router={routers} />
          </CounterContextProvider>
        </AuthContextProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
