import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import VideoRecorder from './components/VideoRecorder';

const App: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <VideoRecorder />
      </main>
      <Footer />
    </div>
  );
};

export default App;
