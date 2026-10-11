import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { ContactMessage } from '../../types/portfolio';
import { 
  Mail, 
  Star, 
  Trash2, 
  Archive, 
  Check, 
  Reply, 
  Clock, 
  DollarSign, 
  Filter,
  CheckCheck
} from 'lucide-react';

export const AdminMessagesInbox: React.FC = () => {
  const { messages, updateMessageStatus, deleteMessage, refreshMessages } = usePortfolio();
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'starred' | 'archived'>('all');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  const filteredMessages = messages.filter(m => {
    if (activeFilter === 'unread') return !m.read && !m.archived;
    if (activeFilter === 'starred') return m.starred && !m.archived;
    if (activeFilter === 'archived') return m.archived;
    return !m.archived; // 'all' displays all non-archived
  });

  const handleSelectMessage = (msg: ContactMessage) => {
    setSelectedMessage(msg);
    if (!msg.read) {
      updateMessageStatus(msg.id, { read: true });
    }
  };

  const handleToggleStar = (e: React.MouseEvent, msg: ContactMessage) => {
    e.stopPropagation();
    updateMessageStatus(msg.id, { starred: !msg.starred });
  };

  const handleToggleArchive = (e: React.MouseEvent, msg: ContactMessage) => {
    e.stopPropagation();
    updateMessageStatus(msg.id, { archived: !msg.archived });
    if (selectedMessage?.id === msg.id) {
      setSelectedMessage(null);
    }
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Permanently delete this message?')) {
      deleteMessage(id);
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
    }
  };

  const handleReply = (msg: ContactMessage) => {
    const subject = encodeURIComponent(`Re: ${msg.subject}`);
    const body = encodeURIComponent(
      `Hi ${msg.name},\n\nThank you for reaching out regarding "${msg.subject}".\n\n[Your response here]\n\nBest regards,\nAlex Rivera`
    );
    window.location.href = `mailto:${msg.email}?subject=${subject}&body=${body}`;
    updateMessageStatus(msg.id, { replied: true });
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <h2 className="text-xl font-bold text-neutral-100">
            Contact Submissions Inbox
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Incoming inquiries from prospective clients and collaborators
          </p>
        </div>

        {/* Filter Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-neutral-900 rounded-lg border border-neutral-800">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              activeFilter === 'all' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            All ({messages.filter(m => !m.archived).length})
          </button>
          <button
            onClick={() => setActiveFilter('unread')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              activeFilter === 'unread' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Unread ({messages.filter(m => !m.read && !m.archived).length})
          </button>
          <button
            onClick={() => setActiveFilter('starred')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              activeFilter === 'starred' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Starred
          </button>
          <button
            onClick={() => setActiveFilter('archived')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              activeFilter === 'archived' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Archive
          </button>
        </div>
      </div>

      {/* 2-Pane Inbox View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[480px]">
        
        {/* Messages List (Left 5 Cols) */}
        <div className="lg:col-span-5 space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
          {filteredMessages.map(msg => (
            <div
              key={msg.id}
              onClick={() => handleSelectMessage(msg)}
              className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                selectedMessage?.id === msg.id
                  ? 'border-blue-500 bg-neutral-900 shadow-md'
                  : !msg.read
                  ? 'border-blue-900/60 bg-blue-950/20 hover:bg-blue-950/30'
                  : 'border-neutral-800 bg-neutral-900/40 hover:bg-neutral-900/70'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className={`text-xs font-bold ${!msg.read ? 'text-white' : 'text-neutral-300'}`}>
                  {msg.name}
                </span>
                <span className="text-[11px] text-neutral-500 font-mono">
                  {new Date(msg.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="text-xs font-semibold text-blue-300 mb-1 line-clamp-1">
                {msg.subject}
              </div>

              <p className="text-xs text-neutral-400 line-clamp-2">
                {msg.message}
              </p>

              {/* Actions row */}
              <div className="flex items-center justify-between pt-3 mt-2 border-t border-neutral-800/60 text-[11px]">
                <span className="text-neutral-500 font-mono">
                  {msg.budget ? `${msg.budget}` : 'General'}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleToggleStar(e, msg)}
                    className={`p-1 rounded hover:bg-neutral-800 ${
                      msg.starred ? 'text-amber-400' : 'text-neutral-500'
                    }`}
                  >
                    <Star className="w-3.5 h-3.5 fill-current" />
                  </button>
                  <button
                    onClick={(e) => handleToggleArchive(e, msg)}
                    className="p-1 rounded text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800"
                    title={msg.archived ? 'Unarchive' : 'Archive'}
                  >
                    <Archive className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredMessages.length === 0 && (
            <div className="p-8 rounded-xl border border-neutral-800 text-center text-xs text-neutral-500">
              No messages found in this folder.
            </div>
          )}
        </div>

        {/* Selected Message Detail Pane (Right 7 Cols) */}
        <div className="lg:col-span-7">
          {selectedMessage ? (
            <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/40 space-y-6">
              
              {/* Header */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-neutral-800">
                <div>
                  <h3 className="text-lg font-bold text-neutral-100">
                    {selectedMessage.subject}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-neutral-400 mt-1 font-mono">
                    <span className="text-neutral-200 font-semibold">{selectedMessage.name}</span>
                    <span>&lt;{selectedMessage.email}&gt;</span>
                  </div>
                  <div className="text-[11px] text-neutral-500 mt-0.5">
                    Received: {new Date(selectedMessage.createdAt).toLocaleString()}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleReply(selectedMessage)}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Reply className="w-3.5 h-3.5" />
                    <span>Reply</span>
                  </button>

                  <button
                    onClick={(e) => handleDelete(e, selectedMessage.id)}
                    className="p-1.5 rounded-lg border border-neutral-800 text-red-400 hover:bg-red-950/40"
                    title="Delete message"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Message Scope & Budget info */}
              {selectedMessage.budget && (
                <div className="p-3 rounded-lg border border-neutral-800 bg-neutral-950/60 text-xs text-neutral-400 font-mono">
                  Target Scope / Budget: <span className="text-blue-400 font-semibold">{selectedMessage.budget}</span>
                </div>
              )}

              {/* Message Body */}
              <div className="text-sm text-neutral-200 leading-relaxed whitespace-pre-wrap py-2">
                {selectedMessage.message}
              </div>

              {/* Reply simulator box */}
              <div className="pt-4 border-t border-neutral-800">
                <div className="text-xs font-semibold text-neutral-400 mb-2">
                  Quick Actions
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleReply(selectedMessage)}
                    className="px-4 py-2 rounded-lg border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 text-xs font-semibold transition-colors flex items-center gap-2"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Open Email Client</span>
                  </button>

                  <button
                    onClick={() => updateMessageStatus(selectedMessage.id, { replied: !selectedMessage.replied })}
                    className="px-3 py-2 rounded-lg border border-neutral-800 text-neutral-400 hover:text-white text-xs"
                  >
                    {selectedMessage.replied ? 'Mark as Not Replied' : 'Mark as Replied'}
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div className="h-full min-h-[300px] rounded-2xl border border-neutral-800/80 bg-neutral-900/20 flex flex-col items-center justify-center text-center p-8 text-neutral-500">
              <Mail className="w-8 h-8 mb-2 opacity-50" />
              <div className="text-xs font-semibold text-neutral-400">Select an inquiry to view details</div>
              <div className="text-[11px] text-neutral-500 mt-1">Read, reply, and track candidate communications</div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
