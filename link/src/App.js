import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SendMessagePage from './pages/SendMessagePage';
import ThankYouPage from './pages/ThankYouPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/:uid/:questionId?" element={<SendMessagePage />} />
        <Route path="/thank-you" element={<ThankYouPage />} />
      </Routes>
    </Router>
  );
};

export default App;
