import React, {useState, useRef, useEffect} from 'react';
import ReactMarkdown from 'react-markdown';

const AiAssistantModal = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: 'ai',
            content: 'Chào bạn! Mình là trợ lý AI. Bạn cần tìm xe như thế nào ạ? (Ví dụ: Xe 7 chỗ đi Đà Lạt tầm 1 triệu)'
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});

    useEffect(() => {
        if (isModalOpen) scrollToBottom();
    }, [messages, isModalOpen]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = {role: 'user', content: input};
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:8085/api/ai/chat', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({message: userMessage.content})
            });
            const data = await response.json();
            if (response.ok) {
                setMessages((prev) => [...prev, {role: 'ai', content: data.reply}]);
            }
        } catch (error) {
            setMessages((prev) => [...prev, {role: 'ai', content: 'Lỗi kết nối Server AI.'}]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="w-full sm:w-auto px-10 py-4 rounded-xl font-bold transition-all border-2 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 hover:scale-105 flex items-center justify-center gap-3 shadow-2xl"
                style={{borderColor: '#ffffff'}}
            >
                <span className="text-2xl">✨</span> AI GỢI Ý XE
            </button>

            {isModalOpen && (
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6">

                    {/* CỬA SỔ CHAT: Tăng chiều rộng lên max-w-6xl và chiều cao 90% màn hình */}
                    <div
                        className="flex h-[85vh] w-full max-w-6xl flex-col rounded-3xl bg-white shadow-2xl overflow-hidden border border-gray-200">

                        {/* Header */}
                        <div className="flex items-center justify-between bg-[#1E40AF] px-8 py-5 text-white">
                            <div className="flex items-center gap-3">
                                <div className="bg-white p-2 rounded-xl text-[#1E40AF] font-black text-xl">AI</div>
                                <div>
                                    <h3 className="font-bold text-xl leading-none">RentalCar Smart Assistant</h3>
                                    <p className="text-xs text-blue-200 mt-1">Hỗ trợ tìm xe tự động bằng trí tuệ nhân
                                        tạo</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="hover:bg-white/20 rounded-full w-10 h-10 flex items-center justify-center text-2xl transition-all"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Khung Chat: Ép text về bên trái */}
                        <div className="flex-1 space-y-6 overflow-y-auto bg-[#f8fafc] p-6 md:p-10 text-left">
                            {messages.map((msg, index) => (
                                <div key={index}
                                     className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`relative max-w-[75%] px-6 py-4 shadow-sm transition-all ${
                                        msg.role === 'user'
                                            ? 'bg-[#1E40AF] text-white rounded-2xl rounded-tr-none'
                                            : 'bg-white text-gray-800 border border-gray-100 rounded-2xl rounded-tl-none'
                                    }`}>
                                        {msg.role === 'user' ? (
                                            <div
                                                className="text-base font-medium whitespace-pre-wrap">{msg.content}</div>
                                        ) : (
                                            /* NỘI DUNG AI */
                                            <div className="text-base leading-relaxed text-left prose prose-blue max-w-none
    [&_a]:bg-blue-50 [&_a]:px-3 [&_a]:py-1 [&_a]:rounded-lg [&_a]:text-blue-700 [&_a]:font-bold [&_a]:no-underline [&_a]:border [&_a]:border-blue-200 hover:[&_a]:bg-blue-100
    [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-2 [&_p]:mb-3">
                                                <ReactMarkdown
                                                    components={{
                                                        // Ghi đè cách render thẻ 'a'
                                                        a: ({node, ...props}) => (
                                                            <a
                                                                {...props}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                onClick={(e) => {
                                                                    // Ngăn chặn hành vi mặc định nếu cần xử lý thêm,
                                                                    // nhưng thường target="_blank" là đủ.
                                                                }}
                                                            />
                                                        )
                                                    }}
                                                >
                                                    {msg.content}
                                                </ReactMarkdown>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {isLoading && (
                                <div className="flex justify-start">
                                    <div
                                        className="flex items-center gap-2 rounded-2xl rounded-tl-none bg-white px-6 py-4 shadow-sm border border-gray-100">
                                        <div className="h-2 w-2 animate-bounce rounded-full bg-blue-500"></div>
                                        <div className="h-2 w-2 animate-bounce rounded-full bg-blue-500"
                                             style={{animationDelay: '0.2s'}}></div>
                                        <div className="h-2 w-2 animate-bounce rounded-full bg-blue-500"
                                             style={{animationDelay: '0.4s'}}></div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef}/>
                        </div>

                        {/* Input Form */}
                        <form onSubmit={handleSendMessage} className="bg-white p-6 border-t shadow-inner flex gap-4">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Nhập yêu cầu của bạn tại đây..."
                                className="flex-1 rounded-2xl border border-gray-200 bg-gray-50 px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-sm"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !input.trim()}
                                className="rounded-2xl bg-[#1E40AF] px-10 py-4 font-black text-white transition-all hover:bg-blue-800 disabled:bg-gray-300 shadow-lg flex items-center gap-2"
                            >
                                GỬI <span>✈️</span>
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default AiAssistantModal;