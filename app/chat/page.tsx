'use client';

import { useState, useRef, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Send, Bot, User } from 'lucide-react';

export default function Chat() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { messages, sendMessage } = useChat();
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setLoading(true);
    await sendMessage({ text: input });
    setInput('');
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-[90vh] w-full px-6 py-8">
      <div className="flex justify-center">
        <div className="w-full max-w-2xl">
          <h1 className="text-2xl font-semibold text-center mb-6">Materna Chat</h1>

          {/* Chat messages */}
          <div className="flex flex-col flex-1 space-y-4 overflow-y-auto mb-6 scrollbar-hide h-[65vh]">
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${
                  m.role === 'assistant' ? 'justify-start' : 'justify-end'
                }`}
              >
                <div
                  className={`flex items-start max-w-[85%] ${
                    m.role === 'assistant' ? 'flex-row' : 'flex-row-reverse'
                  }`}
                >
                  <div className="flex-shrink-0 mt-1">
                    {m.role === 'assistant' ? (
                      <Bot className="w-6 h-6 text-blue-500" />
                    ) : (
                      <User className="w-6 h-6 text-gray-500" />
                    )}
                  </div>

                  <Card
                    className={`mx-2 rounded-2xl px-4 py-2 shadow-sm break-words ${
                      m.role === 'assistant'
                        ? 'bg-blue-50 text-gray-900 border border-blue-100'
                        : 'bg-white text-gray-900 border border-gray-200'
                    }`}
                  >
                    <CardContent className="p-0">
                      <div className="flex flex-col space-y-2">
                        {m.parts.map((part, i) => {
                          switch (part.type) {
                            case 'text':
                              return (
                                <p
                                  key={i}
                                  className="text-sm leading-relaxed whitespace-pre-wrap"
                                >
                                  {part.text}
                                </p>
                              );
                            case 'tool-getInformation':
                              return (
                                <div
                                  key={i}
                                  className="text-xs bg-white border rounded-md p-2"
                                >
                                  <p className="font-medium text-gray-600">
                                    {part.state === 'output-available'
                                      ? 'Retrieved context:'
                                      : 'Retrieving context...'}
                                  </p>
                                  {part.state === 'output-available' && (
                                    <pre className="text-xs text-gray-700 overflow-x-auto whitespace-pre-wrap mt-1">
                                      {JSON.stringify(part.input, null, 2)}
                                    </pre>
                                  )}
                                </div>
                              );
                            default:
                              return null;
                          }
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            ))}
            <div ref={endRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 mt-auto sticky bottom-0 transparent py-3"
          >
            <Input
              placeholder="Ask Materna something..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 border-gray-300 focus-visible:ring-blue-500"
            />
            <Button type="submit" disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
