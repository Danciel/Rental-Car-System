import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Loader2, ArrowRight } from 'lucide-react';
import { Card } from '@/app/components/ui/card';

export function VerifyEmailPage({ onNavigate }) {
    const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
    const [message, setMessage] = useState('Đang xác thực tài khoản của bạn...');

    useEffect(() => {
        // Dùng JS thuần để lấy token trên URL thay vì react-router-dom
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');

        if (!token) {
            setStatus('error');
            setMessage('Không tìm thấy mã xác thực trên đường dẫn!');
            return;
        }

        const verifyToken = async () => {
            try {
                const res = await fetch(`http://localhost:8080/api/users/verify-email?token=${token}`);
                const data = await res.json();

                if (res.ok) {
                    setStatus('success');
                    setMessage(data.message || 'Xác thực email thành công! Tài khoản của bạn đã được kích hoạt.');
                } else {
                    setStatus('error');
                    setMessage(data.message || 'Mã xác thực không hợp lệ hoặc đã hết hạn.');
                }
            } catch (err) {
                setStatus('error');
                setMessage('Lỗi kết nối đến máy chủ. Vui lòng thử lại sau.');
            }
        };

        verifyToken();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <Card className="max-w-md w-full p-8 text-center rounded-2xl shadow-lg border-0 bg-white">
                <div className="flex justify-center mb-6">
                    {status === 'loading' && <Loader2 className="w-16 h-16 text-[#1E40AF] animate-spin" />}
                    {status === 'success' && <CheckCircle className="w-16 h-16 text-emerald-500" />}
                    {status === 'error' && <XCircle className="w-16 h-16 text-red-500" />}
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {status === 'loading' && 'Đang xử lý...'}
                    {status === 'success' && 'Xác thực thành công!'}
                    {status === 'error' && 'Xác thực thất bại'}
                </h2>

                <p className="text-gray-600 mb-8">{message}</p>

                {status !== 'loading' && (
                    <button
                        onClick={onNavigate}
                        className="w-full py-3 bg-[#1E40AF] text-white rounded-xl font-bold hover:bg-blue-800 transition-colors flex items-center justify-center gap-2"
                    >
                        Vào trang cá nhân <ArrowRight className="w-4 h-4" />
                    </button>
                )}
            </Card>
        </div>
    );
}