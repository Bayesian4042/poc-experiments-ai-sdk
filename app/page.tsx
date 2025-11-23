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
import { CopyIcon, RefreshCcwIcon, CloudIcon, NewspaperIcon, BarChart3Icon, ThermometerIcon, BrainIcon, Volume2Icon, VolumeXIcon } from 'lucide-react';
import { Loader } from '@/components/ai-elements/loader';

export default function Chat() {
  const [input, setInput] = useState('');
  const { messages, sendMessage, status, regenerate } = useChat();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [testLoading, setTestLoading] = useState(false);
  
  const handleSubmit = (message: { text: string }) => {
    if (!message.text) return;
    sendMessage({ text: message.text });
    setInput('');
  };

  const testSpeech = async () => {
    try {
      setTestLoading(true);
      
      // Call the TTS API
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: 'Hello! This is a test of the text to speech functionality. Can you hear me?' }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate speech');
      }

      // Create an audio element and play the audio
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        setTestLoading(false);
      };

      audio.onerror = () => {
        URL.revokeObjectURL(audioUrl);
        setTestLoading(false);
      };

      await audio.play();
    } catch (error) {
      console.error('Error playing audio:', error);
      setTestLoading(false);
    }
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

      // Create an audio element and play the audio
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
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Demand Forecasting Assistant</h1>
          <button
            onClick={testSpeech}
            disabled={testLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Volume2Icon className="size-4" />
            {testLoading ? 'Playing...' : 'Test Speech'}
          </button>
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
              placeholder="Ask about demand forecasting..."
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