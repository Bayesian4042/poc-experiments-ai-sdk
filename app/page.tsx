'use client';

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import {
  Message,
  MessageContent,
  MessageResponse,
  MessageActions,
  MessageAction,
} from '@/components/ai-elements/message';
import {
  PromptInput,
  PromptInputBody,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputFooter,
} from '@/components/ai-elements/prompt-input';
import {
  ChainOfThought,
  ChainOfThoughtHeader,
  ChainOfThoughtContent,
  ChainOfThoughtStep,
} from '@/components/ai-elements/chain-of-thought';
import { useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { CopyIcon, RefreshCcwIcon, CloudIcon, NewspaperIcon, BarChart3Icon, ThermometerIcon, BrainIcon } from 'lucide-react';
import { Loader } from '@/components/ai-elements/loader';

export default function Chat() {
  const [input, setInput] = useState('');
  const { messages, sendMessage, status, regenerate } = useChat();

  const handleSubmit = (message: { text: string }) => {
    if (!message.text) return;
    sendMessage({ text: message.text });
    setInput('');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 relative size-full h-screen">
      <div className="flex flex-col h-full">
        <h1 className="text-2xl font-bold mb-4">Demand Forecasting Assistant</h1>
        
        <Conversation className="h-full">
          <ConversationContent>
            {messages.map((message) => (
              <div key={message.id}>
                {message.parts.map((part, i) => {
                  switch (part.type) {
                    case 'text':
                      return (
                        <Message key={`${message.id}-${i}`} from={message.role}>
                          <MessageContent>
                            <MessageResponse>{part.text}</MessageResponse>
                          </MessageContent>
                          {message.role === 'assistant' && (
                            <MessageActions>
                              <MessageAction
                                onClick={() => regenerate()}
                                label="Retry"
                              >
                                <RefreshCcwIcon className="size-3" />
                              </MessageAction>
                              <MessageAction
                                onClick={() =>
                                  navigator.clipboard.writeText(part.text)
                                }
                                label="Copy"
                              >
                                <CopyIcon className="size-3" />
                              </MessageAction>
                            </MessageActions>
                          )}
                        </Message>
                      );
                    case 'reasoning':
                      return (
                        <ChainOfThought key={`${message.id}-${i}`} defaultOpen>
                          <ChainOfThoughtHeader>
                            <ChainOfThoughtStep
                              icon={BrainIcon}
                              label="Chain of Thought"
                              description="AI reasoning process"
                              status={status === 'streaming' && i === message.parts.length - 1 ? 'active' : 'complete'}
                            />
                          </ChainOfThoughtHeader>
                          <ChainOfThoughtContent>
                            <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                              {part.text}
                            </div>
                          </ChainOfThoughtContent>
                        </ChainOfThought>
                      );
                    case 'tool-weather':
                      if ('output' in part && part.output) {
                        const result = part.output as any;
                        return (
                          <ChainOfThought key={`${message.id}-${i}`} defaultOpen>
                            <ChainOfThoughtHeader>
                              <ChainOfThoughtStep
                                icon={ThermometerIcon}
                                label="Weather Data"
                                status="complete"
                              />
                            </ChainOfThoughtHeader>
                            <ChainOfThoughtContent>
                              <div className="space-y-2">
                                <p className="font-semibold">{result.location}</p>
                                <p className="text-lg">{result.temperature}°{result.unit} - {result.condition}</p>
                                <div className="text-sm text-muted-foreground grid grid-cols-2 gap-2">
                                  <div>High: {result.high}°{result.unit}</div>
                                  <div>Low: {result.low}°{result.unit}</div>
                                  <div>Humidity: {Math.round(result.humidity * 100)}%</div>
                                  <div>Wind: {result.windKph} km/h</div>
                                </div>
                              </div>
                            </ChainOfThoughtContent>
                          </ChainOfThought>
                        );
                      }
                      return null;
                    case 'tool-news':
                      if ('output' in part && part.output) {
                        const result = part.output as any;
                        return (
                          <ChainOfThought key={`${message.id}-${i}`} defaultOpen>
                            <ChainOfThoughtHeader>
                              <ChainOfThoughtStep
                                icon={NewspaperIcon}
                                label={`News: ${result.topic}`}
                                description={`Found ${result.items.length} articles`}
                                status="complete"
                              />
                            </ChainOfThoughtHeader>
                            <ChainOfThoughtContent>
                              <div className="space-y-2">
                                {result.items.map((item: any) => (
                                  <div key={item.id} className="border-l-2 border-muted pl-3 py-1">
                                    <p className="font-medium">{item.title}</p>
                                    {item.url && (
                                      <a 
                                        href={item.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-xs text-blue-500 hover:underline"
                                      >
                                        {item.url}
                                      </a>
                                    )}
                                    {item.publishedAt && (
                                      <p className="text-xs text-muted-foreground">
                                        {new Date(item.publishedAt).toLocaleDateString()}
                                      </p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </ChainOfThoughtContent>
                          </ChainOfThought>
                        );
                      }
                      return null;
                    case 'tool-sentiment':
                      if ('output' in part && part.output) {
                        const result = part.output as any;
                        return (
                          <ChainOfThought key={`${message.id}-${i}`} defaultOpen>
                            <ChainOfThoughtHeader>
                              <ChainOfThoughtStep
                                icon={BarChart3Icon}
                                label="Sentiment Analysis"
                                status="complete"
                              />
                            </ChainOfThoughtHeader>
                            <ChainOfThoughtContent>
                              <div className="space-y-2">
                                <p className="text-lg font-semibold">{result.sentiment}</p>
                                <p className="text-sm text-muted-foreground">
                                  Score: {result.score}
                                </p>
                              </div>
                            </ChainOfThoughtContent>
                          </ChainOfThought>
                        );
                      }
                      return null;
                    case 'tool-prediction':
                      if ('output' in part && part.output) {
                        const result = part.output as any;
                        return (
                          <ChainOfThought key={`${message.id}-${i}`} defaultOpen>
                            <ChainOfThoughtHeader>
                              <ChainOfThoughtStep
                                icon={CloudIcon}
                                label="Time Series Prediction"
                                description={`${result.predictions.length} predictions`}
                                status="complete"
                              />
                            </ChainOfThoughtHeader>
                            <ChainOfThoughtContent>
                              <div className="space-y-1">
                                {result.predictions.map((pred: any, idx: number) => (
                                  <div key={idx} className="flex justify-between border-b py-1">
                                    <span className="text-sm">{pred.date}</span>
                                    <span className="font-medium">{pred.value.toLocaleString()}</span>
                                  </div>
                                ))}
                              </div>
                            </ChainOfThoughtContent>
                          </ChainOfThought>
                        );
                      }
                      return null;
                    default:
                      return null;
                  }
                })}
              </div>
            ))}
            {status === 'submitted' && <Loader />}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <PromptInput onSubmit={handleSubmit} className="mt-4">
          <PromptInputBody>
            <PromptInputTextarea
              onChange={(e) => setInput(e.target.value)}
              value={input}
              placeholder="Ask about demand forecasting..."
            />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputSubmit disabled={!input && !status} status={status} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
}