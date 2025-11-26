import c from 'classnames';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { HomePage } from '~/pages/HomePage';
import { RepositoryPage } from '~/pages/RepositoryPage';

function App() {
  return (
    <Router>
      <div className={c('min-h-screen bg-gray-50')}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/:owner/:repo" element={<RepositoryPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
