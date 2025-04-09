import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './pages/Login/Login';
import PublicRoute from './routes/PublicRoutes';
import { ConfigProvider } from 'antd';

function App() {
  return (
    <BrowserRouter>
    <ConfigProvider
           theme={{
             token: {
               fontFamily: "Outfit, sans-serif", // Replace with your font family
             },
           }}
         >
      <Routes>
        <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
      </Routes>
      </ConfigProvider>
    </BrowserRouter>
  );
}

export default App;


        {/* <PublicRoute component={SignUp} path="/signUp" exact="exact"/> */}
          {/* <Route path="/" element={<Collections />} />
          <Route path="/collections/:collectionId" element={<CollectionsDetails />} />   */}