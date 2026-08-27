import React, { useState } from 'react';

export default function App() {
  // Multi-item cart state
  const [cartItems, setCartItems] = useState([
    { id: '1', name: 'Ultra-Noise Cancelling Wireless Headphones', price: 4999, margin_cap_percentage: 0.15 },
    { id: '2', name: 'Minimalist Silicone Protective Case', price: 799, margin_cap_percentage: 0.25 }
  ]);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0);
  
  const [messages, setMessages] = useState([
    { sender: 'agent', text: `Welcome to BargainNode. I see you have a premium audio bundle in your cart. Ready to secure a custom deal today?` }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [discountApplied, setDiscountApplied] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const finalTotal = Math.max(0, subtotal - discountApplied);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    const userText = inputMessage;
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/negotiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems,
          user_message: userText,
          discount_history: discountApplied
        })
      });

      const data = await response.json();
      setMessages(prev => [...prev, { sender: 'agent', text: data.agent_reply }]);
      
      if (data.discount_granted > 0) {
        setDiscountApplied(prev => prev + data.discount_granted);
        // Mint dynamic coupon code
        setCouponCode(`BARGAIN_${Math.floor(finalTotal)}_${Math.floor(Math.random() * 899 + 100)}`);
      }
      
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'agent', text: "Connection error: Ensure FastAPI backend is running on port 8000." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckoutClick = () => {
    setIsModalOpen(true);
  };

  const simulateRazorpayPayment = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setPaymentSuccess(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-gray-100 flex flex-col justify-between p-6 md:p-10 font-sans relative overflow-hidden">
      
      {/* Background Ambient Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-900/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-emerald-900/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Header */}
      <header className="max-w-6xl w-full mx-auto flex justify-between items-center border-b border-white/10 pb-6 relative z-10">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-lavender-400 rounded-full shadow-[0_0_12px_#C084FC] animate-pulse"></div>
          <span className="text-lg font-bold tracking-widest uppercase text-white">Bargain<span className="text-lavender-400">Node</span></span>
        </div>
        <span className="text-xs uppercase bg-white/5 border border-white/10 text-sage-400 px-4 py-1.5 rounded-full backdrop-blur-md">
          Razorpay Buildathon Sandbox v2.5
        </span>
      </header>

      {/* Main Checkout Dashboard */}
      <main className="max-w-5xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 my-auto py-6 relative z-10">
        
        {/* Left Column: Multi-Item Cart & Summary */}
        <div className="lg:col-span-6 bg-[#0E131F]/80 border border-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs uppercase tracking-widest text-lavender-300 font-semibold">Active Cart Session</span>
              <span className="text-xs text-gray-400">Items: {cartItems.length}</span>
            </div>
            
            {/* Cart Items List */}
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
                  <div>
                    <p className="text-sm font-medium text-white">{item.name}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Verified Stock Unit</p>
                  </div>
                  <span className="text-sm font-semibold text-gray-200">₹{item.price}</span>
                </div>
              ))}
            </div>

            {/* Dynamic Coupon Banner */}
            {couponCode && (
              <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 p-4 rounded-2xl mb-6 flex justify-between items-center animate-fade-in">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-emerald-400 font-semibold">Crypto-Minted Coupon</p>
                  <p className="text-xs font-mono text-white mt-0.5">{couponCode}</p>
                </div>
                <span className="text-xs text-emerald-400 font-bold bg-emerald-500/20 px-2.5 py-1 rounded-lg">Active</span>
              </div>
            )}
            
            <div className="space-y-3 py-4 border-y border-white/10 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              {discountApplied > 0 && (
                <div className="flex justify-between text-sage-400 font-medium">
                  <span>Agent Negotiated Discount</span>
                  <span>-₹{discountApplied}</span>
                </div>
              )}
            </div>
          </div>

          <div className="pt-6">
            <div className="flex justify-between items-end mb-6">
              <span className="text-sm text-gray-400 uppercase tracking-wider">Total Payable</span>
              <span className="text-3xl font-light text-white">₹{finalTotal}</span>
            </div>
            
            <button 
              onClick={handleCheckoutClick}
              className="w-full bg-gradient-to-r from-lavender-400 to-indigo-500 text-navy-900 font-semibold py-4 rounded-2xl shadow-[0_0_25px_rgba(192,132,252,0.2)] hover:opacity-95 transition uppercase tracking-wider text-xs">
              Secure Checkout via Razorpay
            </button>
          </div>
        </div>

        {/* Right Column: AI Negotiator Chat Widget with Bargain Meter */}
        <div className="lg:col-span-6 bg-[#0E131F]/80 border border-white/10 backdrop-blur-xl rounded-3xl shadow-2xl flex flex-col h-[540px] overflow-hidden">
          
          {/* Chat Header & Bargain Meter */}
          <div className="p-5 border-b border-white/10 bg-white/[0.02]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-2.5 h-2.5 bg-sage-400 rounded-full shadow-[0_0_8px_#4ADE80]"></div>
                <span className="text-xs font-semibold uppercase tracking-widest text-white">Autonomous Negotiator</span>
              </div>
              <span className="text-[10px] text-gray-400 uppercase tracking-widest">Gemini 2.5 Flash</span>
            </div>
            {/* Bargain Meter Visualizer */}
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-sage-400 to-lavender-400 h-full transition-all duration-500" 
                style={{ width: `${Math.min(100, (discountApplied / (subtotal * 0.15)) * 100)}%` }}>
              </div>
            </div>
            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
              <span>Margin Guard Active</span>
              <span>Discount Cap: 15%</span>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.sender === 'user' 
                    ? 'bg-lavender-400 text-navy-900 rounded-br-none font-medium shadow-lg' 
                    : 'bg-white/[0.04] text-gray-200 rounded-bl-none border border-white/10'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/[0.04] border border-white/10 text-gray-400 text-xs px-4 py-3 rounded-2xl animate-pulse">
                  Analyzing store profit margins...
                </div>
              </div>
            )}
          </div>

          {/* Input Bar */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10 bg-white/[0.01] flex gap-3">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Negotiate terms (e.g. Can you bundle the case for free?)..."
              className="flex-1 bg-[#07090E] border border-white/10 rounded-2xl px-5 py-3.5 text-sm text-gray-200 focus:outline-none focus:border-lavender-400"
            />
            <button type="submit" className="bg-sage-500 text-navy-900 px-6 py-3.5 rounded-2xl font-semibold text-xs uppercase hover:bg-sage-400 transition">
              Send
            </button>
          </form>
        </div>
      </main>

      {/* Razorpay Sandbox Payment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-[#0E131F] border border-white/10 max-w-md w-full p-8 rounded-3xl shadow-2xl relative">
            <button onClick={() => { setIsModalOpen(false); setPaymentSuccess(false); }} className="absolute top-6 right-6 text-gray-400 hover:text-white text-sm">✕</button>
            
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
              <span className="text-xs uppercase tracking-widest text-indigo-400 font-bold">Razorpay Secure Sandbox</span>
            </div>

            {!paymentSuccess ? (
              <div>
                <h3 className="text-xl font-light text-white mb-2">Complete Payment</h3>
                <p className="text-xs text-gray-400 mb-6">Negotiated discount successfully locked in for order #BN-9021.</p>
                
                <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl mb-6 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-300">
                    <span>Total Payable Amount</span>
                    <span className="text-lavender-400 font-bold text-lg">₹{finalTotal}</span>
                  </div>
                </div>

                <button 
                  onClick={simulateRazorpayPayment}
                  disabled={loading}
                  className="w-full bg-emerald-500 text-navy-900 font-bold py-4 rounded-2xl uppercase tracking-wider text-xs hover:bg-emerald-400 transition shadow-[0_0_20px_rgba(74,222,128,0.2)]">
                  {loading ? "Processing Secure Gateway..." : `Pay ₹{finalTotal} Now`}
                </button>
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">✓</div>
                <h3 className="text-xl font-light text-white mb-2">Payment Successful!</h3>
                <p className="text-xs text-gray-400 mb-6">Autonomous negotiation settled via Razorpay gateway. Inventory dispatched.</p>
                <button 
                  onClick={() => { setIsModalOpen(false); setPaymentSuccess(false); }}
                  className="w-full bg-white/10 text-white font-semibold py-3 rounded-xl text-xs uppercase tracking-wider hover:bg-white/20 transition">
                  Close Window
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto text-center text-xs text-gray-500 border-t border-white/10 pt-6 relative z-10 flex justify-between">
        <span>BargainNode • Autonomous Agentic Commerce</span>
        <span className="text-[10px] uppercase text-gray-600">Trionn-Inspired Minimalist Dark UI</span>
      </footer>
    </div>
  );
}