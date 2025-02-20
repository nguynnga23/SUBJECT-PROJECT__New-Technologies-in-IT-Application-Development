import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Authentication from './screens/Authentication/Authentication';
import Home from './screens/Home';

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Authentication />} />
                <Route path="/home" element={<Home />} />
            </Routes>
        </Router>
    );
}
