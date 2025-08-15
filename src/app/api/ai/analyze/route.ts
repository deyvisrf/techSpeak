import { NextRequest, NextResponse } from 'next/server';

// Types for the AI analysis
interface AnalysisRequest {
  transcript: string;
  scenario: string;
  userId?: string;
}

interface AnalysisResult {
  pronunciation: number;
  fluency: number;
  clarity: number;
  score: number;
  feedback: string;
  suggestions: string[];
}

export async function POST(request: NextRequest) {
  try {
    const { transcript, scenario, userId }: AnalysisRequest = await request.json();

    if (!transcript || !scenario) {
      return NextResponse.json(
        { error: 'Transcript and scenario are required' },
        { status: 400 }
      );
    }

    // Check if real AI is enabled
    const enableRealAI = process.env.NEXT_PUBLIC_ENABLE_REAL_AI === 'true';
    const aiProvider = process.env.NEXT_PUBLIC_AI_PROVIDER || 'openai';

    if (!enableRealAI) {
      // Return enhanced mock analysis
      return NextResponse.json(await getMockAnalysis(transcript, scenario));
    }

    // Real AI analysis
    if (aiProvider === 'openai') {
      return NextResponse.json(await getOpenAIAnalysis(transcript, scenario));
    } else if (aiProvider === 'anthropic') {
      return NextResponse.json(await getAnthropicAnalysis(transcript, scenario));
    }

    // Fallback to mock
    return NextResponse.json(await getMockAnalysis(transcript, scenario));

  } catch (error) {
    console.error('AI Analysis error:', error);
    
    // Graceful fallback to mock analysis
    try {
      const { transcript, scenario } = await request.json();
      return NextResponse.json(await getMockAnalysis(transcript, scenario));
    } catch {
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }
}

async function getOpenAIAnalysis(transcript: string, scenario: string): Promise<AnalysisResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    console.warn('OpenAI API key not found, falling back to mock');
    return getMockAnalysis(transcript, scenario);
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `Você é uma coach de inglês para profissionais de tecnologia. Avalie o texto abaixo (contexto: ${scenario}) e RETORNE APENAS JSON válido em português do Brasil. 
            Tom: amigável, direto, encorajador, levemente informal (sem gírias).
            Avalie e gere:
            1. pronunciation (0-100) — pronúncia
            2. fluency (0-100) — fluência
            3. clarity (0-100) — clareza
            4. score (0-100) — média geral
            5. feedback (string) — parágrafo curto em PT-BR com elogios e 1–2 pontos de melhoria
            6. suggestions (string[]) — até 3 sugestões práticas em PT-BR
            
            Formato JSON exato:
            {
              "pronunciation": 85,
              "fluency": 78,
              "clarity": 92,
              "score": 85,
              "feedback": "Sua explicação foi clara e bem estruturada...",
              "suggestions": ["Enfatize termos técnicos", "Reduza muletas como 'ãã' e 'éé'"]
            }`
          },
          {
            role: 'user',
            content: `Cenário: ${scenario}\nTranscrição: "${transcript}"`
          }
        ],
        max_tokens: 500,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content in OpenAI response');
    }

    // Parse JSON response
    const result = JSON.parse(content);
    
    // Validate the response structure
    if (typeof result.pronunciation !== 'number' || 
        typeof result.fluency !== 'number' || 
        typeof result.clarity !== 'number') {
      throw new Error('Invalid response structure from OpenAI');
    }

    return result;

  } catch (error) {
    console.error('OpenAI analysis failed:', error);
    return getMockAnalysis(transcript, scenario);
  }
}

async function getAnthropicAnalysis(transcript: string, scenario: string): Promise<AnalysisResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  
  if (!apiKey) {
    console.warn('Anthropic API key not found, falling back to mock');
    return getMockAnalysis(transcript, scenario);
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 500,
        messages: [
          {
            role: 'user',
            content: `Você é uma coach de inglês para profissionais de tecnologia. Avalie a transcrição abaixo (contexto: ${scenario}) e RETORNE APENAS JSON válido em PT-BR com o formato:
{
  "pronunciation": 85,
  "fluency": 78,
  "clarity": 92,
  "score": 85,
  "feedback": "Sua explicação foi clara e bem estruturada...",
  "suggestions": ["Enfatize termos técnicos", "Reduza muletas como 'ãã' e 'éé'"]
}
Transcrição: "${transcript}"`
          }
        ]
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.content[0]?.text;
    
    if (!content) {
      throw new Error('No content in Anthropic response');
    }

    // Extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in Anthropic response');
    }

    const result = JSON.parse(jsonMatch[0]);
    
    // Validate the response structure
    if (typeof result.pronunciation !== 'number' || 
        typeof result.fluency !== 'number' || 
        typeof result.clarity !== 'number') {
      throw new Error('Invalid response structure from Anthropic');
    }

    return result;

  } catch (error) {
    console.error('Anthropic analysis failed:', error);
    return getMockAnalysis(transcript, scenario);
  }
}

async function getMockAnalysis(transcript: string, scenario: string): Promise<AnalysisResult> {
  // Enhanced mock analysis based on transcript content
  const words = transcript.toLowerCase().split(' ');
  const technicalTerms = ['api', 'database', 'function', 'variable', 'algorithm', 'framework', 'microservice', 'docker', 'kubernetes', 'react', 'node', 'typescript'];
  
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));
  
  // Calculate metrics based on content analysis
  const hasUms = /\b(um|uh|er|like)\b/i.test(transcript);
  const hasTechnicalTerms = technicalTerms.some(term => words.includes(term));
  const wordCount = words.length;
  const sentenceCount = transcript.split(/[.!?]+/).length - 1;
  
  // Score calculation
  let pronunciation = Math.floor(70 + Math.random() * 25); // 70-95
  let fluency = Math.floor(60 + Math.random() * 30); // 60-90
  let clarity = Math.floor(65 + Math.random() * 25); // 65-90
  
  // Adjust based on content
  if (hasTechnicalTerms) {
    pronunciation += 5;
    clarity += 5;
  }
  
  if (hasUms) {
    fluency -= 10;
  }
  
  if (wordCount > 20) {
    fluency += 5;
    clarity += 5;
  }
  
  // Ensure scores are within bounds
  pronunciation = Math.min(100, Math.max(40, pronunciation));
  fluency = Math.min(100, Math.max(30, fluency));
  clarity = Math.min(100, Math.max(40, clarity));
  
  const score = Math.floor((pronunciation + fluency + clarity) / 3);
  
  // Generate contextual feedback
  let feedback = "Good effort! ";
  const suggestions: string[] = [];
  
  if (pronunciation < 70) {
    feedback += "Work on pronouncing technical terms more clearly. ";
    suggestions.push("Practice pronunciation of key technical vocabulary");
  }
  
  if (fluency < 60) {
    feedback += "Try to reduce hesitation and speak more confidently. ";
    suggestions.push("Practice speaking without filler words (um, uh)");
  }
  
  if (clarity < 60) {
    feedback += "Structure your explanations more clearly. ";
    suggestions.push("Use clear topic sentences and logical flow");
  }
  
  if (hasTechnicalTerms) {
    feedback += "Great use of technical terminology! ";
    suggestions.push("Continue using precise technical language");
  }
  
  if (score > 80) {
    feedback += "Excellent technical communication!";
  } else if (score > 60) {
    feedback += "Keep practicing - you're improving!";
  } else {
    feedback += "Focus on the fundamentals and practice regularly.";
  }
  
  // Scenario-specific suggestions
  switch (scenario.toLowerCase()) {
    case 'interview':
      suggestions.push("Use the STAR method for behavioral questions");
      break;
    case 'daily':
      suggestions.push("Keep updates concise: Yesterday/Today/Blockers");
      break;
    case 'bug_report':
      suggestions.push("Include steps to reproduce and expected vs actual behavior");
      break;
    case 'code_review':
      suggestions.push("Be specific about code sections and provide constructive feedback");
      break;
  }
  
  return {
    pronunciation,
    fluency,
    clarity,
    score,
    feedback: feedback.trim(),
    suggestions: suggestions.slice(0, 3) // Limit to 3 suggestions
  };
}
