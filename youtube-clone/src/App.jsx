import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import Channel from './pages/Channel';
import VideoPage from './pages/VideoPage';
import { Header } from './components/Header';
import { useState } from 'react';
import CreateChannel from './components/CreateChannel';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  return (
    <>
      <div className="bg-black">
        <Header isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        <Routes>
          <Route path="/" element={<HomePage isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/video/:videoId" element={<VideoPage />} />
          <Route path="/channel" element={<Channel />} />
          <Route path="/create-channel" element={<CreateChannel />} />
        </Routes>
      </div>
    </>
  );
}

export default App;