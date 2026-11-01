import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Building,
  User,
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  Sparkles,
  Smile,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ChatMessage } from '../../types';

export const ChatWindow: React.FC = () => {
  const {
    role,
    conversations,
    messages,
    activeConversationId,
    setActiveConversationId,
    sendMessage,
    candidate,
  } = useApp();

  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find((c) => c.id === activeConversationId) || conversations[0];
  const currentMessages = activeConv ? messages[activeConv.id] || [] : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !activeConv) return;
    sendMessage(activeConv.id, inputText.trim(), role === 'candidate' ? 'candidate' : 'recruiter');
    setInputText('');
  };

  const quickReplies = role === 'candidate'
    ? [
        'Namaste! I am available to join immediately.',
        'Yes sir, I have experience in this domain.',
        'I am comfortable with the scheduled interview time.',
        'Can you please share the exact office address?',
      ]
    : [
        'Hello! Are you open for immediate joining?',
        'We have shortlisted your profile for the next round.',
        'Can you come tomorrow at 11:30 AM for a face-to-face round?',
        'Please bring your Aadhar card and certificate copies.',
      ];

  const handleQuickReply = (text: string) => {
    if (!activeConv) return;
    sendMessage(activeConv.id, text, role === 'candidate' ? 'candidate' : 'recruiter');
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col md:flex-row h-[75vh]">
      {/* Sidebar / Conversations List */}
      <div className="w-full md:w-80 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50/50 dark:bg-slate-950/40">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <h2 className="font-bold text-sm text-slate-900 dark:text-white">Active Chats</h2>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
            {conversations.length} Active
          </span>
        </div>

        <div className="overflow-y-auto flex-1 divide-y divide-slate-100 dark:divide-slate-800">
          {conversations.map((conv) => {
            const isSelected = activeConv?.id === conv.id;

            return (
              <div
                key={conv.id}
                onClick={() => setActiveConversationId(conv.id)}
                className={`p-3.5 cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-blue-50 dark:bg-blue-950/50 border-l-4 border-blue-600'
                    : 'hover:bg-slate-100/60 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                    {role === 'candidate' ? conv.companyName : conv.candidateName}
                  </h4>
                  <span className="text-[10px] text-slate-400 shrink-0">{conv.lastTimestamp}</span>
                </div>
                <p className="text-[11px] font-medium text-blue-600 dark:text-blue-400 truncate">
                  {conv.jobTitle}
                </p>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">{conv.lastMessage}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Chat Conversation Pane */}
      {activeConv ? (
        <div className="flex-1 flex flex-col h-full bg-white dark:bg-slate-900">
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center">
                {role === 'candidate' ? (
                  <Building className="w-5 h-5" />
                ) : (
                  <User className="w-5 h-5" />
                )}
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  {role === 'candidate' ? activeConv.companyName : activeConv.candidateName}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Regarding: <span className="text-blue-600 dark:text-blue-400 font-medium">{activeConv.jobTitle}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Online
              </span>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/40 dark:bg-slate-950/20">
            {currentMessages.map((msg) => {
              const isMine =
                (role === 'candidate' && msg.senderRole === 'candidate') ||
                (role === 'recruiter' && msg.senderRole === 'recruiter');

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                >
                  <div className="text-[10px] text-slate-400 mb-1 px-1">
                    {msg.senderName} • {msg.timestamp}
                  </div>

                  <div
                    className={`max-w-md p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-sm ${
                      isMine
                        ? 'bg-blue-600 text-white rounded-br-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-bl-xs'
                    }`}
                  >
                    {msg.text}

                    {/* Interview Invitation Card inside Chat Stream */}
                    {msg.interviewInvite && (
                      <div className="mt-3 p-3 rounded-xl bg-slate-900/10 dark:bg-slate-950/60 border border-current/20 space-y-2 text-xs">
                        <div className="flex items-center gap-1.5 font-bold">
                          <Calendar className="w-4 h-4" />
                          <span>Interview Invitation: {msg.interviewInvite.jobTitle}</span>
                        </div>
                        <p><strong>Date & Time:</strong> {msg.interviewInvite.date} at {msg.interviewInvite.time}</p>
                        <p><strong>Mode:</strong> {msg.interviewInvite.mode}</p>
                        <p><strong>Location:</strong> {msg.interviewInvite.locationOrLink}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Canned Replies Bar */}
          <div className="p-2 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[11px]">
            <span className="text-slate-400 text-[10px] uppercase font-bold shrink-0 px-1">Quick:</span>
            {quickReplies.map((reply, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleQuickReply(reply)}
                className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-600 dark:hover:text-blue-400 text-slate-700 dark:text-slate-300 font-medium whitespace-nowrap transition-colors border border-slate-200 dark:border-slate-700"
              >
                {reply}
              </button>
            ))}
          </div>

          {/* Chat Input */}
          <form
            onSubmit={handleSend}
            className="p-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 bg-white dark:bg-slate-900"
          >
            <input
              type="text"
              placeholder={role === 'candidate' ? 'Type message to recruiter...' : 'Type message to candidate...'}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-blue-500/20 flex items-center gap-1.5"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
          <MessageSquare className="w-12 h-12 mb-3 opacity-40" />
          <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300">No conversation selected</h3>
          <p className="text-xs text-slate-500 mt-1">Select an active chat from the left sidebar.</p>
        </div>
      )}
    </div>
  );
};
