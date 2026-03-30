"use client";

import { useState, useRef, useEffect } from "react";
import { Send, User as UserIcon, Search, ChevronLeft, MessageSquare } from "lucide-react";
import { CONTACTS, INITIAL_MESSAGES, type Message, type Contact } from "@/lib/mock/chats";

export default function ChatPage() {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(CONTACTS[0]);
  const [messages, setMessages] = useState<Record<string, Message[]>>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const [showMobileList, setShowMobileList] = useState(true);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [selectedContact, messages]);

  const handleSelectContact = (contact: Contact) => {
    setSelectedContact(contact);
    setShowMobileList(false);
  };

  const handleSendMessage = () => {
    if (!inputText.trim() || !selectedContact) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: "me",
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => ({
      ...prev,
      [selectedContact.id]: [...(prev[selectedContact.id] || []), newMessage]
    }));
    setInputText("");
  };

  const activeMessages = selectedContact ? messages[selectedContact.id] || [] : [];

  return (
    <div className="h-[calc(100vh-140px)] flex bg-current/5 border border-current/10 rounded-4xl md:rounded-[2.5rem] overflow-hidden relative">
      {/* Contact List */}
      <aside className={`
        absolute inset-0 z-10 w-full md:relative md:w-90 border-r border-current/10 flex flex-col bg-background md:bg-background/20 backdrop-blur-sm transition-transform duration-300
        ${showMobileList ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        <div className="p-6 border-b border-current/10">
          <h2 className="text-xl font-bold mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={16} />
            <input 
              type="text" 
              placeholder="Search chats..."
              className="w-full bg-current/5 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {CONTACTS.map(contact => (
            <button
              key={contact.id}
              onClick={() => handleSelectContact(contact)}
              className={`w-full flex items-center gap-4 p-4 transition-all hover:bg-current/5 text-left border-b border-current/5 ${
                selectedContact?.id === contact.id ? "bg-current/10" : ""
              }`}
            >
              <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-2xl bg-current/10 flex items-center justify-center overflow-hidden">
                  <UserIcon size={24} className="text-foreground/40" />
                </div>
                {contact.status === "online" && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-background rounded-full" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between mb-0.5">
                  <p className="font-bold truncate">
                    {contact.name} <span className="text-foreground/30 font-normal text-[10px]">#{contact.username}</span>
                  </p>
                  <span className="text-[10px] text-foreground/40">{contact.lastActive}</span>
                </div>
                <p className="text-xs text-foreground/50 truncate">
                  {contact.lastMessage || "Start a conversation"}
                </p>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* Chat Window */}
      <div className={`flex-1 flex flex-col bg-background/10 transition-transform duration-300 ${!showMobileList ? "translate-x-0" : "translate-x-full md:translate-x-0"}`}>
        {selectedContact ? (
          <>
            {/* Header */}
            <header className="px-4 py-4 md:px-6 border-b border-current/10 flex items-center justify-between bg-background/20 backdrop-blur-sm">
              <div className="flex items-center gap-3 md:gap-4">
                <button 
                  onClick={() => setShowMobileList(true)}
                  className="md:hidden p-2 -ml-2 hover:bg-current/5 rounded-lg transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="w-10 h-10 rounded-xl bg-current/10 flex items-center justify-center shrink-0">
                  <UserIcon size={20} className="text-foreground/40" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-sm truncate">
                    {selectedContact.name} <span className="text-foreground/30 font-normal text-xs">#{selectedContact.username}</span>
                  </p>
                  <p className="text-[10px] text-green-500 font-medium tracking-widest leading-none">
                    {selectedContact.status}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 md:gap-2">
                {/* Icons removed per user request */}
              </div>
            </header>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar"
            >
              {activeMessages.map((msg) => {
                const isMe = msg.senderId === "me";
                return (
                  <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[70%] space-y-1 ${isMe ? "items-end" : "items-start"}`}>
                      <div className={`px-4 py-3 rounded-3xl text-sm ${
                        isMe 
                          ? "bg-foreground text-background rounded-tr-none" 
                          : "bg-current/5 text-foreground rounded-tl-none border border-current/10"
                      }`}>
                        {msg.text}
                      </div>
                      <p className="text-[10px] text-foreground/30 px-2">{msg.timestamp}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input */}
            <div className="p-6 pt-0">
              <div className="relative flex items-center gap-3">
                <div className="flex-1 relative">
                  <input 
                    type="text" 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder={`Message ${selectedContact.name}...`}
                    className="w-full bg-current/5 border border-current/10 rounded-2xl py-4 pl-6 pr-14 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                  />
                  <button 
                    onClick={handleSendMessage}
                    disabled={!inputText.trim()}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-foreground text-background rounded-xl hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-foreground/30 space-y-4">
            <div className="p-8 bg-current/5 rounded-full">
              <MessageSquare size={48} strokeWidth={1} />
            </div>
            <p className="text-xl font-medium">Select a contact to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}
