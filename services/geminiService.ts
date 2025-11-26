import { GoogleGenAI, Type, Schema } from "@google/genai";
import { QuizQuestion } from "../types";

// Schema for Quiz Generation
const quizSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      question: {
        type: Type.STRING,
        description: "The quiz question text."
      },
      options: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "An array of 4 multiple choice options."
      },
      correctAnswerIndex: {
        type: Type.INTEGER,
        description: "The zero-based index of the correct answer (0-3)."
      },
      explanation: {
        type: Type.STRING,
        description: "A helpful explanation in Korean."
      }
    },
    required: ["question", "options", "correctAnswerIndex", "explanation"],
    propertyOrdering: ["question", "options", "correctAnswerIndex", "explanation"]
  }
};

const getClient = () => {
  let apiKey = '';
  
  // 1. Try Vercel / Vite Environment Variables first (Target Deployment Environment)
  // In Vite, import.meta.env is used to access env vars prefixed with VITE_
  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      // @ts-ignore
      const vaitKey = import.meta.env.VITE_VAIT_API_KEY;
      // @ts-ignore
      const viteKey = import.meta.env.VITE_API_KEY;
      
      if (vaitKey) {
        apiKey = vaitKey;
      } else if (viteKey) {
        apiKey = viteKey;
      }
    }
  } catch (e) {
    console.warn("Error accessing import.meta.env:", e);
  }

  // 2. Fallback to process.env (Sandbox / Node / AI Studio)
  // This is checked second so it doesn't crash browser builds that don't polyfill process
  if (!apiKey) {
    try {
      // Use a safe check for process
      if (typeof process !== 'undefined' && process.env) {
        if (process.env.API_KEY) {
          apiKey = process.env.API_KEY;
        }
      }
    } catch (e) {
      console.warn("Error accessing process.env:", e);
    }
  }

  if (!apiKey) {
    console.error("No API Key found in import.meta.env (VITE_VAIT_API_KEY) or process.env.API_KEY");
    throw new Error("API_KEY_MISSING");
  }

  return new GoogleGenAI({ apiKey });
};

export const generateQuiz = async (topic: string = "basic"): Promise<QuizQuestion[]> => {
  try {
    // Initialize client inside the function to ensure environment variables are loaded
    const ai = getClient();
    const model = "gemini-2.5-flash";
    const topicInstruction = topic === 'advanced' 
      ? 'Focus on: Distinction between Gerunds and Participles, verbs with meaning changes (remember/forget/try/stop), and prepositions + gerunds.' 
      : 'Focus on: Basic usage as Subject/Object/Complement, and verbs taking only gerunds (enjoy, finish, mind, keep, avoid).';

    const prompt = `
      Create 5 high-quality multiple-choice questions about English Gerunds (동명사) for 3rd-year middle school students in South Korea.
      
      Topic: ${topicInstruction}
      
      Requirements:
      1. Questions should be educational and appropriate for the level.
      2. Ensure exactly 4 options per question.
      3. Explanation must be in Korean and helpful for students.
      4. Output strictly valid JSON matching the schema.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: quizSchema,
        systemInstruction: "You are an expert English grammar teacher for Korean students. Always output strictly structured JSON."
      }
    });

    const rawData = response.text;
    if (!rawData) {
      console.error("Empty response from AI");
      return [];
    }
    
    // Safety parsing
    let parsedData;
    try {
        parsedData = JSON.parse(rawData);
    } catch (e) {
        // If strict JSON fails, try to find JSON array in text
        const match = rawData.match(/\[.*\]/s);
        if (match) {
            parsedData = JSON.parse(match[0]);
        } else {
            throw new Error("Failed to parse JSON response");
        }
    }

    if (!Array.isArray(parsedData)) {
        throw new Error("Response is not an array");
    }

    return parsedData.map((q: any, index: number) => ({ ...q, id: Date.now() + index }));
  } catch (error: any) {
    console.error("Failed to generate quiz:", error);
    if (error.message === "API_KEY_MISSING") {
      throw error;
    }
    throw new Error("QUIZ_GENERATION_FAILED");
  }
};

export const getTutorResponse = async (history: { role: string, parts: { text: string }[] }[], message: string): Promise<string> => {
  try {
    const ai = getClient();
    const model = "gemini-2.5-flash";
    const chat = ai.chats.create({
      model,
      config: {
        systemInstruction: `
          당신은 'GerundBot'입니다. 한국의 중학교 3학년 학생들에게 영문법 '동명사(Gerund)'를 가르치는 AI 튜터입니다.
          
          성격:
          - 매우 친절하고 에너지 넘치는 선생님
          - 이모지를 적절히 사용하여 딱딱하지 않게 대화
          - 학생이 틀려도 격려하고 다시 설명해줌
          
          가이드라인:
          1. 동명사 외의 질문이 들어오면 "지금은 동명사에 대해 이야기해볼까?"라고 부드럽게 유도하세요.
          2. 설명은 최대한 쉬운 예문(중학 필수 단어)을 사용하세요.
          3. 핵심 개념: 명사적 용법, 동명사 vs 현재분사, 동명사 목적어 취하는 동사 등.
          4. 답변 길이는 너무 길지 않게, 모바일에서 읽기 편하게 끊어주세요.
        `
      },
      history: history
    });

    const result = await chat.sendMessage({ message });
    return result.text || "미안해, 다시 한번 말해줄래? 😅";
  } catch (error: any) {
    console.error("Chat error:", error);
    if (error.message === "API_KEY_MISSING") {
        return "API 키 설정 오류가 발생했어. (API Key Missing)";
    }
    return "어라? 연결에 문제가 생긴 것 같아. 잠시 후에 다시 시도해줘! 🚧";
  }
};