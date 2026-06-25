'use client';
import { useState, useRef, useEffect } from 'react';
import { useHrmsStore } from '../../stores/hrmsStore';
import { Send, Sparkles, X, Bot, User as UserIcon } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function CopilotDrawer() {
  const { copilotOpen, setCopilotOpen, activeRole, currentView, isOnboarding } = useHrmsStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      role: 'assistant',
      content: `Hi! I'm your **HR Copilot** 👋 I'm here to help you with anything HR-related — leave requests, payroll questions, policies, onboarding guidance, and more. What can I help you with today?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const QUICK_ACTIONS = isOnboarding ? [
    'What is my onboarding progress?',
    'Who is my buddy & coordinator?',
    'How do I submit relocation tickets?',
    'What are my pending onboarding tasks?',
  ] : [
    'How many leave days do I have?',
    'When is my next payslip?',
    'How to apply for comp-off?',
    'What are my pending tasks?',
  ];

  useEffect(() => {
    if (copilotOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [copilotOpen, messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text.trim(), timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text.trim(), currentView, userRole: activeRole, isOnboarding }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { id: Date.now().toString() + 'a', role: 'assistant', content: data.response, timestamp: new Date() }]);
    } catch {
      setMessages(prev => [...prev, { id: Date.now().toString() + 'e', role: 'assistant', content: 'Sorry, I encountered an issue. Please try again.', timestamp: new Date() }]);
    } finally {
      setLoading(false);
    }
  };

  if (!copilotOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        style={{ position: 'fixed', inset: 0, background: 'rgb(0 0 0 / 0.4)', zIndex: 90, backdropFilter: 'blur(4px)' }}
        onClick={() => setCopilotOpen(false)}
      />
      {/* Drawer */}
      <div style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 'var(--shell-max-width)',
        height: '80dvh', background: 'white', borderRadius: 'var(--radius-2xl) var(--radius-2xl) 0 0',
        zIndex: 95, display: 'flex', flexDirection: 'column',
        animation: 'slide-up 0.3s ease-out',
        boxShadow: '0 -8px 32px rgb(0 0 0 / 0.15)',
      }}>
        {/* Header */}
        <div style={{
          padding: '1rem 1.25rem', borderBottom: '1px solid rgb(var(--color-border)/0.5)',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #0d9488, #f97316)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Sparkles size={18} color="white" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9375rem' }}>HR Copilot</p>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'rgb(var(--color-muted-foreground))' }}>AI-powered assistant · Always available</p>
          </div>
          <button
            onClick={() => setCopilotOpen(false)}
            style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: '#f1f5f9', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <X size={16} color="#64748b" />
          </button>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {messages.map((msg) => (
            <div key={msg.id} style={{ display: 'flex', gap: 8, justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              {msg.role === 'assistant' && (
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #0d9488, #f97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                  <Bot size={14} color="white" />
                </div>
              )}
              <div style={{
                maxWidth: '80%', padding: '0.625rem 0.875rem',
                borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                background: msg.role === 'user' ? 'linear-gradient(135deg, #0d9488, #14b8a6)' : '#f8fafc',
                color: msg.role === 'user' ? 'white' : 'var(--foreground)',
                fontSize: '0.875rem', lineHeight: 1.5,
                border: msg.role === 'assistant' ? '1px solid rgb(var(--color-border)/0.5)' : 'none',
                boxShadow: msg.role === 'user' ? '0 2px 8px rgb(13 148 136 / 0.3)' : 'none',
              }}>
                <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{msg.content}</p>
                <p style={{ margin: '4px 0 0', fontSize: '0.65rem', opacity: 0.6, textAlign: 'right' }}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              {msg.role === 'user' && (
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                  <UserIcon size={14} color="#64748b" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #0d9488, #f97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Bot size={14} color="white" />
              </div>
              <div style={{ padding: '0.75rem 1rem', borderRadius: '18px 18px 18px 4px', background: '#f8fafc', border: '1px solid rgb(var(--color-border)/0.5)', display: 'flex', gap: 4, alignItems: 'center' }}>
                {[0, 0.15, 0.3].map((delay, i) => (
                  <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: '#0d9488', animation: `bounce-gentle 1s ease-in-out ${delay}s infinite` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick actions */}
        {messages.length <= 1 && (
          <div style={{ padding: '0 1.25rem 0.5rem', display: 'flex', gap: 6, overflowX: 'auto' }}>
            {QUICK_ACTIONS.map(q => (
              <button key={q} onClick={() => sendMessage(q)} style={{
                flexShrink: 0, padding: '0.375rem 0.75rem', borderRadius: 999,
                border: '1.5px solid rgb(var(--color-primary)/0.25)', background: 'rgb(var(--color-primary)/0.05)',
                color: 'rgb(var(--color-primary))', fontSize: '0.75rem', fontWeight: 600,
                cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'Inter, sans-serif',
              }}>
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div style={{ padding: '0.75rem 1.25rem 1.25rem', borderTop: '1px solid rgb(var(--color-border)/0.5)', display: 'flex', gap: 8, alignItems: 'flex-end' }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
            placeholder="Ask anything about HR, policies, leave..."
            rows={1}
            style={{
              flex: 1, resize: 'none', border: '1.5px solid rgb(var(--color-border))',
              borderRadius: 'var(--radius-lg)', padding: '0.625rem 0.875rem',
              fontSize: '0.9rem', fontFamily: 'Inter, sans-serif', outline: 'none',
              maxHeight: 120, lineHeight: 1.4, transition: 'border-color 0.15s',
            }}
            onFocus={e => e.target.style.borderColor = '#0d9488'}
            onBlur={e => e.target.style.borderColor = 'rgb(var(--color-border))'}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            style={{
              width: 42, height: 42, borderRadius: 12, border: 'none',
              background: !input.trim() || loading ? '#e2e8f0' : 'linear-gradient(135deg, #0d9488, #14b8a6)',
              cursor: !input.trim() || loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s', flexShrink: 0,
              boxShadow: input.trim() && !loading ? '0 2px 8px rgb(13 148 136 / 0.3)' : 'none',
            }}
          >
            <Send size={18} color={!input.trim() || loading ? '#94a3b8' : 'white'} />
          </button>
        </div>
      </div>
    </>
  );
}
