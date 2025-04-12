import { QRCodeCanvas } from 'qrcode.react';
import { useEffect, useState } from 'react';

function QRLogin({ shouldStart, onStatusChange, setShouldStart }) {
    const [url, setUrl] = useState('');

    useEffect(() => {
        if (!shouldStart) return;

        const createQR = async () => {
            console.log('Tạo mã QR...');
            try {
                const res = await fetch('http://localhost:4000/api/auth/qr-login/create', { method: 'POST' });
                const data = await res.json();
                const generatedToken = data.token;
                const qrUrl = `qr-login://${generatedToken}`;

                setShouldStart(false);
                setUrl(qrUrl);
                onStatusChange?.('waiting for scan code');

                const interval = setInterval(async () => {
                    const checkRes = await fetch(
                        `http://localhost:4000/api/auth/qr-login/status?token=${generatedToken}`,
                    );
                    const checkData = await checkRes.json();

                    if (checkData.status === 'LOGGED_IN') {
                        clearInterval(interval);
                        const message = checkData.userId;
                        onStatusChange?.(message);
                    } else if (checkData.status === 'EXPIRED') {
                        clearInterval(interval);
                        onStatusChange?.('QR expired');
                    }
                }, 2000);
            } catch (error) {
                console.error('Lỗi tạo mã QR:', error);
                onStatusChange?.('Có lỗi xảy ra.');
            }
        };

        createQR();
    }, [shouldStart]);

    return url ? <QRCodeCanvas value={url} size={200} /> : null;
}

export default QRLogin;
