import React, { useEffect, useState } from "react";

const ZaloLoginQR: React.FC = () => {
    const [qr, setQr] = useState<string | null>(null);
    console.log(setQr)
    console.log(qr)
    useEffect(() => {
        const handler = (e: any) => setQr(e.detail);
        window.addEventListener("zaloQR", handler);
        return () => window.removeEventListener("zaloQR", handler);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h2 className="text-xl font-semibold mb-4">Đăng nhập Zalo</h2>
            {qr ? (
                <img src={qr} alt="Zalo QR" className="border p-2 rounded-lg shadow" />
            ) : (
                <p>Đang chờ QR code từ server...</p>
            )}
        </div>
    );
};

export default ZaloLoginQR;
