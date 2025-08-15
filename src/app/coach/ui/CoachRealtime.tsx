"use client";

import { useState, useRef, useEffect, useCallback } from "react";
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
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}

export default function CoachRealtime() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTTSEnabled, setIsTTSEnabled] = useState(true);
  const [volume, setVolume] = useState(0);
  const [sttLang, setSttLang] = useState<"en-US" | "pt-BR">("en-US");
  
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    // Initialize Speech Recognition
    if (typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = sttLang;

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

        // Analyze with real AI
        await analyzeWithAI(transcript);
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
  }, [sttLang]);

  const analyzeWithAI = useCallback(async (userInput: string) => {
    try {
      // Call our AI analysis API
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcript: userInput,
          scenario: 'CONVERSATION', // You can make this dynamic
          userId: 'anonymous', // You can implement user tracking
        }),
      });

      if (!response.ok) {
        throw new Error(`AI API error: ${response.status}`);
      }

      const analysisResult = await response.json();
      
      const aiMessage: Message = {
        id: Date.now().toString(),
        type: "ai",
        content: `${analysisResult.feedback}\n\n📊 Análise: Pronúncia ${analysisResult.pronunciation}%, Fluência ${analysisResult.fluency}%, Clareza ${analysisResult.clarity}%\n\n💡 Sugestões:\n${analysisResult.suggestions.map((s: string, i: number) => `${i + 1}. ${s}`).join('\n')}`,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsProcessing(false);

      // Text-to-Speech for the main feedback
      if (isTTSEnabled && "speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(analysisResult.feedback);
        utterance.lang = 'pt-BR';
        utterance.rate = 0.95; // natural
        utterance.pitch = 1.1; // ligeiramente mais agudo (voz feminina)
        utterance.volume = 0.9;
        // Tenta selecionar uma voz feminina em PT-BR quando disponível
        const voices = window.speechSynthesis.getVoices();
        const brFemale = voices.find(v => v.lang?.toLowerCase().startsWith('pt-br') && /female|mulher|brasil/i.test(v.name));
        const brAny = voices.find(v => v.lang?.toLowerCase().startsWith('pt-br'));
        utterance.voice = brFemale || brAny || voices[0];
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
      }

    } catch (error) {
      console.error('AI Analysis failed:', error);
      
      // Fallback to local analysis
      const fallbackResult = analyzeInputLocal(userInput);
      
      const aiMessage: Message = {
        id: Date.now().toString(),
        type: "ai",
        content: `${fallbackResult.feedback}\n\n📊 Análise: Pronúncia ${fallbackResult.pronunciation}%, Fluência ${fallbackResult.fluency}%, Clareza ${fallbackResult.clarity}% (Modo offline)`,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsProcessing(false);
    }
  }, [isTTSEnabled]);

  // Local fallback analysis (renamed to avoid confusion)
  const analyzeInputLocal = (input: string) => {
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
      score: Math.floor((pronunciation + fluency + clarity) / 3),
      feedback: "Good effort! Keep practicing to improve your technical communication.",
      suggestions: ["Practice technical vocabulary", "Speak more confidently"]
    };
  };

  const startListening = async () => {
    if (!recognitionRef.current) {
      alert("Reconhecimento de fala não suportado neste navegador");
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
      // Atualiza o idioma selecionado antes de iniciar
      recognitionRef.current.lang = sttLang;
      recognitionRef.current.start();
      updateVolume();
      
    } catch (error) {
      console.error("Acesso ao microfone negado:", error);
      alert("O acesso ao microfone é necessário para o reconhecimento de fala");
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
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Conversation Coach</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Messages */}
            <div className="h-64 sm:h-96 overflow-y-auto space-y-4 border rounded-lg p-3 sm:p-4 bg-gray-50">
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
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:justify-between">
              <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto">
                <Button
                  onClick={isListening ? stopListening : startListening}
                  disabled={isProcessing}
                  variant={isListening ? "destructive" : "default"}
                  size="lg"
                  className="flex-1 sm:flex-none min-h-[48px]"
                  aria-label={isListening ? "Parar gravação de áudio" : "Iniciar gravação de áudio"}
                  aria-pressed={isListening}
                >
                  {isListening ? "🔴 Stop" : "🎤 Start Talking"}
                </Button>
                
                <Button
                  onClick={() => setIsTTSEnabled(!isTTSEnabled)}
                  variant="outline"
                  className="min-h-[48px] px-4"
                  aria-label={isTTSEnabled ? "Desativar síntese de voz" : "Ativar síntese de voz"}
                  aria-pressed={isTTSEnabled}
                >
                  {isTTSEnabled ? "🔊 TTS" : "🔇 TTS"}
                </Button>
                <select
                  value={sttLang}
                  onChange={(e) => setSttLang(e.target.value as "en-US" | "pt-BR")}
                  className="border rounded-md px-2 py-2 text-sm"
                  aria-label="Idioma do reconhecimento de fala"
                >
                  <option value="en-US">Inglês (EUA)</option>
                  <option value="pt-BR">Português (Brasil)</option>
                </select>
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
