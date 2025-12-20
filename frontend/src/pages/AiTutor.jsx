import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Play, MessageCircle, Loader2, Send, Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import api from "../utils/api.js";

function AiTutor() {
  const [topic, setTopic] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleStartSession = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;
    
    setLoading(true);
    try {
      // Initialize with a welcome message
      setMessages([
        { 
          role: "assistant", 
          content: `Hello! I'm your AI tutor for **${topic}**. Ask me anything about this topic, and I'll help you learn!` 
        }
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;
    
    const userMessage = inputMessage.trim();
    setInputMessage("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);
    
    try {
      // Create context from topic and recent history (last 3 interaction pairs)
      const recentHistory = messages.slice(-6).map(m => `${m.role}: ${m.content}`).join('\n');
      const contextStr = `Topic: ${topic}. \nPrevious conversation:\n${recentHistory}`;

      const { data } = await api.post("/paths/ai-chat", { 
        message: userMessage,
        context: contextStr
      });
      
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: data.response || "I'm not sure about that. Could you rephrase your question?" 
      }]);
    } catch (err) {
      console.error("AI Tutor error:", err);
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "Sorry, I encountered an error. Please try again." 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const suggestedTopics = [
    "React Hooks", "Python Basics", "Machine Learning", 
    "Data Structures", "System Design", "JavaScript ES6"
  ];

  return (
    <div className="h-[calc(100vh-64px)] bg-[#0a0a0a] overflow-hidden flex flex-col">
      <div className="max-w-[900px] mx-auto w-full h-full flex flex-col p-6">
        
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col justify-center items-center overflow-y-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 text-[12px] text-[#FF6B35] mb-4 tracking-[0.15em] font-mono">
                <span className="w-2 h-2 bg-[#FF6B35] rounded-full"></span>
                [ AI TUTOR ]
              </div>
              <h1 className="text-[48px] font-bold text-white mb-4 leading-tight">
                AI Tutor
              </h1>
              <p className="text-[#666] text-[16px] max-w-xl mx-auto">
                Get personalized help on any topic. Start a session to begin learning.
              </p>
            </div>

            {/* Topic Input */}
            <div className="max-w-[600px] w-full mx-auto mb-12">
              <div className="bg-[#111] border border-[#2a2a2a]">
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#2a2a2a]">
                  <code className="text-[12px] text-[#555] tracking-wide font-mono">USER@EDUVERSE:~/TUTOR</code>
                  <div className="flex gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#555]"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#555]"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#555]"></div>
                  </div>
                </div>
                <form onSubmit={handleStartSession} className="p-6">
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="What would you like to learn about?"
                    className="w-full bg-transparent text-white text-[18px] placeholder:text-[#444] focus:outline-none mb-6 font-mono"
                  />
                  
                  <button 
                    type="submit"
                    disabled={!topic.trim() || loading}
                    className="w-full px-6 py-3 bg-[#FF6B35] hover:bg-[#ff7a4a] disabled:opacity-40 text-black font-bold text-[13px] flex items-center justify-center gap-2 transition-all"
                  >
                    {loading ? (
                      <><Loader2 size={16} className="animate-spin" /> STARTING...</>
                    ) : (
                      <><Play size={14} fill="currentColor" /> START SESSION</>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Suggested Topics */}
            <div>
              <h2 className="text-[14px] font-mono text-[#FF6B35] mb-4 tracking-wide text-center">&gt;_ SUGGESTED_TOPICS</h2>
              <div className="flex flex-wrap justify-center gap-3">
                {suggestedTopics.map((t, i) => (
                  <button
                    key={i}
                    onClick={() => setTopic(t)}
                    className="px-4 py-2 bg-[#0f0f0f] border border-[#1f1f1f] hover:border-[#FF6B35] text-[#999] hover:text-white text-[13px] transition-all"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Chat Interface */
          <div className="flex flex-col h-full">
            {/* Chat Header */}
            <div className="flex items-center justify-between mb-6 flex-shrink-0">
              <div>
                <div className="text-[12px] text-[#FF6B35] font-mono mb-1">ACTIVE SESSION</div>
                <h2 className="text-[24px] font-bold text-white">{topic}</h2>
              </div>
              <button
                onClick={() => { setMessages([]); setTopic(""); }}
                className="px-4 py-2 bg-[#1a1a1a] border border-[#2a2a2a] text-[#999] hover:text-white text-[13px] transition-all"
              >
                END SESSION
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-6 mb-6 pr-4 min-h-0">
              {messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : ''}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded bg-[#1f1f1f] border border-[#333] flex items-center justify-center flex-shrink-0">
                      <Bot size={16} className="text-[#FF6B35]" />
                    </div>
                  )}
                  
                  <div className={`max-w-[85%] p-5 rounded-lg border ${
                    msg.role === 'user' 
                      ? 'bg-[#1a1a1a] border-[#2a2a2a]' 
                      : 'bg-[#0f0f0f] border-[#1f1f1f]'
                  }`}>
                    {msg.role === 'assistant' ? (
                      <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-[#050505] prose-pre:border prose-pre:border-[#222] prose-p:my-2 [&>ul]:list-disc [&>ul]:pl-4 [&>ol]:list-decimal [&>ol]:pl-4">
                        <ReactMarkdown components={{
                          code: ({node, inline, className, children, ...props}) => (
                            <code className={`${className} ${inline ? 'bg-[#222] px-1 py-0.5 rounded text-[#ABF182]' : 'block bg-[#050505] p-3 rounded border border-[#222] overflow-x-auto text-xs'}`} {...props}>
                              {children}
                            </code>
                          )
                        }}>
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-white text-[14px] leading-relaxed whitespace-pre-wrap font-mono">
                        {msg.content}
                      </p>
                    )}
                  </div>

                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded bg-[#333] border border-[#444] flex items-center justify-center flex-shrink-0">
                      <User size={16} className="text-white" />
                    </div>
                  )}
                </div>
              ))}
              
              {loading && (
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded bg-[#1f1f1f] border border-[#333] flex items-center justify-center flex-shrink-0">
                    <Bot size={16} className="text-[#FF6B35]" />
                  </div>
                  <div className="bg-[#0f0f0f] border border-[#1f1f1f] p-4 rounded-lg flex items-center gap-3">
                    <Loader2 size={16} className="text-[#FF6B35] animate-spin" />
                    <span className="text-xs text-[#555] font-mono tracking-wide">THINKING...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="flex gap-3 relative flex-shrink-0">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask a question about this topic..."
                className="flex-1 bg-[#111] border border-[#2a2a2a] px-4 py-4 text-white text-[14px] placeholder:text-[#444] focus:outline-none focus:border-[#FF6B35] font-mono rounded-lg transition-all"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || loading}
                className="px-6 bg-[#FF6B35] hover:bg-[#ff7a4a] disabled:opacity-40 text-black rounded-lg transition-all flex items-center justify-center"
              >
                <Send size={20} />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default AiTutor;
