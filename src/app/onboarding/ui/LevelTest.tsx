"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

interface LevelTestProps {
  onComplete: (level: string, testResults: Record<string, unknown>) => void;
  onSkip: () => void;
}

export default function LevelTest({ onComplete, onSkip }: LevelTestProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [canAnswer, setCanAnswer] = useState(false);

  const questions = [
    {
      type: "listening",
      question: "Listen and choose the correct answer:",
      audio: "What is the main advantage of microservices?",
      options: [
        "Better scalability and independent deployment",
        "Simpler architecture",
        "Lower costs",
        "Faster development"
      ],
      correct: 0
    },
    {
      type: "speaking",
      question: "Describe a recent bug you fixed in 30 seconds:",
      prompt: "Talk about: What was the problem? How did you solve it?",
      options: [] // Speaking test - no options
    },
    {
      type: "reading",
      question: "What does this code snippet do?",
      code: "const users = await db.users.findMany({ where: { active: true } });",
      options: [
        "Creates new users in the database",
        "Finds all active users from the database",
        "Updates user status to active",
        "Deletes inactive users"
      ],
      correct: 1
    }
  ];

  const currentQ = questions[currentQuestion];

  // Reset audio state when question changes
  useEffect(() => {
    setAudioPlaying(false);
    setCanAnswer(currentQ.type !== "listening"); // Allow immediate answer for non-listening questions
    // Stop any playing audio when question changes
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, [currentQuestion, currentQ.type]);

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers, answerIndex.toString()];
    setAnswers(newAnswers);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate level based on answers
      const correctAnswers = newAnswers.filter((answer, index) => {
        const q = questions[index];
        return q.correct !== undefined && parseInt(answer) === q.correct;
      }).length;
      
      let level = "Beginner";
      if (correctAnswers >= 2) level = "Intermediate";
      if (correctAnswers === 3) level = "Advanced";
      
      onComplete(level, { answers: newAnswers, score: correctAnswers });
    }
  };

  const playAudio = () => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-Speech não é suportado neste navegador. Por favor, leia o texto abaixo.');
      setCanAnswer(true);
      return;
    }

    setAudioPlaying(true);
    setCanAnswer(false);
    
    const utterance = new SpeechSynthesisUtterance(currentQ.audio);
    utterance.lang = 'en-US';
    utterance.rate = 0.8; // Um pouco mais devagar para teste
    utterance.pitch = 1;
    utterance.volume = 0.9;
    
    utterance.onend = () => {
      setAudioPlaying(false);
      setCanAnswer(true);
    };
    
    utterance.onerror = () => {
      setAudioPlaying(false);
      setCanAnswer(true);
      alert('Erro ao reproduzir áudio. Por favor, leia o texto abaixo.');
    };
    
    // Parar qualquer síntese anterior
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const startSpeakingTest = () => {
    setIsListening(true);
    // Simulate recording for 30 seconds
    setTimeout(() => {
      setIsListening(false);
      handleAnswer(1); // Mock answer for speaking test
    }, 3000); // Shortened for demo
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-0">
      <Card>
        <CardHeader>
          <CardTitle>
            Teste Rápido de Nível ({currentQuestion + 1}/{questions.length})
          </CardTitle>
          <p className="text-gray-600">
            Vamos avaliar seu nível atual para personalizar sua experiência
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>

          <div>
            <h3 className="font-semibold mb-4">{currentQ.question}</h3>
            
            {currentQ.type === "listening" && (
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg border">
                  <p className="text-sm text-blue-800 mb-3">🔊 Clique para ouvir o áudio:</p>
                  <div className="flex items-center gap-4">
                    <Button 
                      onClick={playAudio}
                      disabled={audioPlaying}
                      variant={audioPlaying ? "ghost" : "default"}
                      size="lg"
                      className="w-full sm:w-auto min-h-[48px]"
                    >
                      {audioPlaying ? "🔊 Reproduzindo..." : "▶️ Tocar Áudio"}
                    </Button>
                    {audioPlaying && (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-200"></div>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-blue-600 mt-2">
                    Você pode tocar o áudio quantas vezes quiser
                  </p>
                </div>
                
                {canAnswer && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700 mb-3">
                      Agora escolha a resposta correta:
                    </p>
                    {currentQ.options.map((option, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="w-full text-left justify-start h-auto p-3 sm:p-4 hover:bg-blue-50 touch-manipulation min-h-[56px]"
                        onClick={() => handleAnswer(index)}
                      >
                        <span className="text-sm sm:text-base">
                          {String.fromCharCode(65 + index)}. {option}
                        </span>
                      </Button>
                    ))}
                  </div>
                )}
                
                {!canAnswer && !audioPlaying && (
                  <div className="text-center p-6 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">
                      👆 Clique no botão acima para ouvir o áudio primeiro
                    </p>
                  </div>
                )}
              </div>
            )}

            {currentQ.type === "speaking" && (
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg border">
                  <p className="text-sm text-green-800 mb-2">📝 Prompt:</p>
                  <p className="font-medium">{currentQ.prompt}</p>
                </div>
                <div className="text-center">
                  {!isListening ? (
                    <Button onClick={startSpeakingTest} size="lg">
                      🎤 Começar Gravação (30s)
                    </Button>
                  ) : (
                    <div className="space-y-4">
                      <div className="text-red-600 font-semibold">
                        🔴 Gravando... Fale agora!
                      </div>
                      <div className="w-16 h-16 mx-auto bg-red-500 rounded-full animate-pulse"></div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {currentQ.type === "reading" && (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg border font-mono text-sm">
                  <code>{currentQ.code}</code>
                </div>
                <div className="space-y-2">
                  {currentQ.options.map((option, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full text-left justify-start h-auto p-4"
                      onClick={() => handleAnswer(index)}
                    >
                      {String.fromCharCode(65 + index)}. {option}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="ghost" onClick={onSkip}>
              Pular Teste
            </Button>
            <p className="text-sm text-gray-500 self-center">
              Tempo estimado: {questions.length - currentQuestion} min
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

