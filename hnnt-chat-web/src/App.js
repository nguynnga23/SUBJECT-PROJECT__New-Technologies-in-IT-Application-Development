import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Authentication from './screens/Authentication/Authentication';
import Home from './screens/Home';
import { useEffect } from 'react';
import { socket } from './configs/socket';

export default function App() {
    useEffect(() => {
        socket.connect(); // Kết nối khi ứng dụng khởi động

        socket.on('connect', () => {
            console.log('✅ Đã kết nối với server socket:', socket.id);
        });

        return () => {
            socket.disconnect(); // Ngắt kết nối khi unmount
        };
    }, []);
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Authentication />} />
                <Route path="/home" element={<Home />} />
            </Routes>
        </Router>
    );
}
