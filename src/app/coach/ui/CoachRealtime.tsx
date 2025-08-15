"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
}

// Type declarations for Web APIs
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function CoachRealtime() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTTSEnabled, setIsTTSEnabled] = useState(true);
  const [volume, setVolume] = useState(0);
  
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    // Initialize Speech Recognition
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = async (event: any) => {
        const transcript = event.results[0][0].transcript;
        const userMessage: Message = {
          id: Date.now().toString(),
          type: "user",
          content: transcript,
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, userMessage]);
        setIsListening(false);
        setIsProcessing(true);

        // Simulate AI response (replace with real API)
        await simulateAIResponse(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
        setIsProcessing(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const simulateAIResponse = async (userInput: string) => {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    // Analyze input for feedback
    const analysisResult = analyzeInput(userInput);
    
    let aiResponse = "Good job! ";
    
    // Add pronunciation feedback
    if (analysisResult.pronunciation < 70) {
      aiResponse += "Try to pronounce technical terms more clearly. ";
    }
    
    // Add fluency feedback  
    if (analysisResult.fluency < 60) {
      aiResponse += "Reduce hesitation - speak with more confidence. ";
    }
    
    // Add content feedback
    if (analysisResult.clarity < 50) {
      aiResponse += "Make your explanation more structured and concise. ";
    }
    
    // Add positive reinforcement
    aiResponse += analysisResult.score > 70 
      ? "Excellent technical communication!" 
      : "Keep practicing - you're improving!";
    
    const aiMessage: Message = {
      id: Date.now().toString(),
      type: "ai",
      content: `${aiResponse}\n\n📊 Feedback: Pronunciation ${analysisResult.pronunciation}%, Fluency ${analysisResult.fluency}%, Clarity ${analysisResult.clarity}%`,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, aiMessage]);
    setIsProcessing(false);

    // Text-to-Speech
    if (isTTSEnabled && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(aiResponse);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  // Simulated pronunciation analysis
  const analyzeInput = (input: string) => {
    const words = input.toLowerCase().split(' ');
    const technicalTerms = ['api', 'database', 'function', 'variable', 'algorithm', 'framework'];
    
    // Mock analysis based on input characteristics
    const pronunciation = Math.floor(60 + Math.random() * 40); // 60-100%
    const fluency = words.length > 10 ? Math.floor(70 + Math.random() * 30) : Math.floor(40 + Math.random() * 40);
    const clarity = technicalTerms.some(term => words.includes(term)) ? Math.floor(70 + Math.random() * 30) : Math.floor(50 + Math.random() * 30);
    
    return {
      pronunciation,
      fluency,
      clarity,
      score: Math.floor((pronunciation + fluency + clarity) / 3)
    };
  };

  const startListening = async () => {
    if (!recognitionRef.current) {
      alert("Speech recognition not supported");
      return;
    }

    try {
      // Request microphone access and set up audio visualization
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      
      analyserRef.current.fftSize = 256;
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateVolume = () => {
        if (analyserRef.current && isListening) {
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / bufferLength;
          setVolume(average / 255);
          animationRef.current = requestAnimationFrame(updateVolume);
        }
      };

      setIsListening(true);
      recognitionRef.current.start();
      updateVolume();
      
    } catch (error) {
      console.error("Microphone access denied:", error);
      alert("Microphone access is required for speech recognition");
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Conversation Coach</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Messages */}
            <div className="h-96 overflow-y-auto space-y-4 border rounded-lg p-4 bg-gray-50">
              {messages.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  Start a conversation by clicking the microphone button below
                </div>
              )}
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      message.type === "user"
                        ? "bg-purple-600 text-white"
                        : "bg-white border"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              {isProcessing && (
                <div className="flex justify-start">
                  <div className="bg-white border rounded-lg px-4 py-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  onClick={isListening ? stopListening : startListening}
                  disabled={isProcessing}
                  variant={isListening ? "destructive" : "default"}
                  size="lg"
                  aria-label={isListening ? "Parar gravação de áudio" : "Iniciar gravação de áudio"}
                  aria-pressed={isListening}
                >
                  {isListening ? "🔴 Stop" : "🎤 Start Talking"}
                </Button>
                
                <Button
                  onClick={() => setIsTTSEnabled(!isTTSEnabled)}
                  variant="outline"
                  aria-label={isTTSEnabled ? "Desativar síntese de voz" : "Ativar síntese de voz"}
                  aria-pressed={isTTSEnabled}
                >
                  {isTTSEnabled ? "🔊 TTS On" : "🔇 TTS Off"}
                </Button>
              </div>

              {/* Volume Meter */}
              {isListening && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Volume:</span>
                  <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-600 transition-all duration-100"
                      style={{ width: `${volume * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Status */}
            <div className="text-sm text-gray-600 text-center">
              {isListening && "🎤 Listening... Speak now"}
              {isProcessing && "🤖 AI is thinking..."}
              {!isListening && !isProcessing && "Ready to start conversation"}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
