/* eslint-disable @typescript-eslint/no-explicit-any */
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
  PromptInputTools,
  PromptInputSpeechButton,
} from '@/components/ai-elements/prompt-input';
import {
  ChainOfThought,
  ChainOfThoughtHeader,
  ChainOfThoughtContent,
  ChainOfThoughtStep,
} from '@/components/ai-elements/chain-of-thought';
import { useRef, useState } from 'react';
import { useChat } from '@ai-sdk/react';
import {
  CopyIcon,
  RefreshCcwIcon,
  CloudIcon,
  NewspaperIcon,
  BarChart3Icon,
  ThermometerIcon,
  BrainIcon,
  Volume2Icon,
  VolumeXIcon,
  UsersIcon,
} from 'lucide-react';
import { Loader } from '@/components/ai-elements/loader';
import type { SharkInvestmentToolResult } from '@/app/api/chat/tools/shark-investments';

const suggestedPrompts = [
  'Give me Kunal Bahl details',
  'Send me Amit Jain investment highlights',
  'What’s unique about Ritesh Agarwal investments?',
];

export default function Chat() {
  const [input, setInput] = useState('');
  const { messages, sendMessage, status, regenerate } = useChat();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const handleSubmit = (message: { text: string }) => {
    if (!message.text) return;
    sendMessage({ text: message.text });
    setInput('');
  };
  const handleSpeak = async (text: string, messageId: string) => {
    try {
      // If already playing this message, stop it
      if (playingAudioId === messageId && audioElement) {
        audioElement.pause();
        setPlayingAudioId(null);
        setAudioElement(null);
        return;
      }

      // Stop any currently playing audio
      if (audioElement) {
        audioElement.pause();
        setAudioElement(null);
      }

      setPlayingAudioId(messageId);

      // Call the TTS API
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate speech');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      audio.onended = () => {
        setPlayingAudioId(null);
        setAudioElement(null);
        URL.revokeObjectURL(audioUrl);
      };

      audio.onerror = () => {
        setPlayingAudioId(null);
        setAudioElement(null);
        URL.revokeObjectURL(audioUrl);
      };

      setAudioElement(audio);
      await audio.play();
    } catch (error) {
      console.error('Error playing audio:', error);
      setPlayingAudioId(null);
      setAudioElement(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 relative size-full h-screen">
      <div className="flex flex-col h-full">
        <div
          className="flex flex-col gap-3 mb-2 rounded-2xl p-4 shadow-2xl shadow-black/40 border border-yellow-300/60"
          style={{
            background:
              'linear-gradient(135deg, hsl(var(--sony-yellow)) 0%, hsl(var(--sony-gold)) 60%, hsl(var(--sony-orange)) 100%)',
          }}
        >
          <div className="flex flex-col gap-3">
            <div>
              <h1 className="text-2xl font-bold text-black">
                Shark Tank India Investment Assistant
              </h1>
              <p className="text-sm text-black/80 mt-1">
                Ask about sharks, companies, industries, or past deals and the assistant will ground its reasoning in the curated Shark Tank India dataset.
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-black/70">
                Give it a try:
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {suggestedPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => setInput(prompt)}
                    className="rounded-full border border-black/20 bg-white/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-black/80 transition hover:border-black hover:scale-105"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
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
                              <MessageAction
                                onClick={() => handleSpeak(part.text, message.id)}
                                label={playingAudioId === message.id ? "Stop" : "Speak"}
                              >
                                {playingAudioId === message.id ? (
                                  <VolumeXIcon className="size-3" />
                                ) : (
                                  <Volume2Icon className="size-3" />
                                )}
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
                    case 'tool-sharkInvestments':
                      if ('output' in part && part.output) {
                        const result = part.output as SharkInvestmentToolResult;
                        return (
                          <ChainOfThought key={`${message.id}-${i}`} defaultOpen>
                            <ChainOfThoughtHeader>
                              <ChainOfThoughtStep
                                icon={UsersIcon}
                                label="Shark Dataset Insight"
                                description={result.focus}
                                status="complete"
                              />
                            </ChainOfThoughtHeader>
                            <ChainOfThoughtContent>
                              <div className="space-y-3 text-sm">
                                <p className="text-lg font-semibold">{result.summary}</p>
                                {result.message && (
                                  <p className="text-xs text-amber-500">{result.message}</p>
                                )}
                                <div className="grid grid-cols-3 gap-2">
                                  {result.highlights.map((highlight) => (
                                    <div
                                      key={highlight.label}
                                      className="border border-muted/60 rounded-lg p-2 text-center text-xs"
                                    >
                                      <p className="text-muted-foreground uppercase tracking-wider">
                                        {highlight.label}
                                      </p>
                                      <p className="font-semibold">{highlight.value}</p>
                                    </div>
                                  ))}
                                </div>
                                {result.topCompanies.length > 0 && (
                                  <div className="space-y-1">
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                      Top companies
                                    </p>
                                    <div className="space-y-1 text-xs text-muted-foreground">
                                      {result.topCompanies.map((company) => (
                                        <div
                                          key={`${company.company}-${company.season}`}
                                          className="flex justify-between"
                                        >
                                          <span>{company.company}</span>
                                          <span className="text-right">
                                            {company.shark} · {company.industry}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                {result.focusedSharks.length > 0 && (
                                  <div className="space-y-1">
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                      Shark focus
                                    </p>
                                    <div className="flex flex-wrap gap-2 text-xs font-medium">
                                      {result.focusedSharks.map((shark) => (
                                        <span
                                          key={shark.slug}
                                          className="rounded-full bg-muted/20 px-3 py-1"
                                        >
                                          {shark.name} ({shark.role}) · {shark.dealCount} deals
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                {result.industries.length > 0 && (
                                  <div>
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                      Industries
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {result.industries.join(', ')}
                                    </p>
                                  </div>
                                )}
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
              ref={textareaRef} // for speech recognition
              placeholder="Ask about Shark Tank India sharks, deals, or industries..."
              value={input}
              onChange={(event) => setInput(event.currentTarget.value)}
            />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputTools>
            </PromptInputTools>
            <PromptInputSpeechButton
                onTranscriptionChange={setInput}
                textareaRef={textareaRef}
              />
            <PromptInputSubmit disabled={!input && !status} status={status} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
}