import { GoogleGenAI, Type, Schema } from "@google/genai";
import { QuizQuestion } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Schema for Quiz Generation
const quizSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      question: {
        type: Type.STRING,
        description: "The quiz question text in Korean or English (mixed appropriately for Korean middle schoolers)."
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
        description: "A helpful explanation in Korean explaining why the answer is correct."
      }
    },
    required: ["question", "options", "correctAnswerIndex", "explanation"]
  }
};

export const generateQuiz = async (topic: string = "basic"): Promise<QuizQuestion[]> => {
  try {
    const model = "gemini-2.5-flash";
    const topicInstruction = topic === 'advanced' 
      ? 'Focus on: Distinction between Gerunds and Participles, specific verbs (remember/forget/try/stop) with meaning changes, and prepositions + gerunds.' 
      : 'Focus on: Basic usage as Subject/Object/Complement, and common verbs that take only gerunds (enjoy, finish, mind, keep, avoid).';

    const prompt = `
      Create 5 high-quality multiple-choice questions about English Gerunds (동명사) for 3rd-year middle school students in South Korea (중3 영어).
      
      ${topicInstruction}
      
      Guidelines:
      1. Mixed Korean/English context is okay to ensure understanding, but keep example sentences in English.
      2. Make sure the distinction is clear (no ambiguous grammar).
      3. The explanation should be friendly, encouraging, and clear (in Korean).
      4. Ensure options are plausible distractors.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: quizSchema,
        systemInstruction: "You are a top-tier English grammar teacher for Korean middle school students. You are precise, encouraging, and clear."
      }
    });

    const rawData = response.text;
    if (!rawData) return [];
    
    const parsedData = JSON.parse(rawData);
    return parsedData.map((q: any, index: number) => ({ ...q, id: Date.now() + index }));
  } catch (error) {
    console.error("Failed to generate quiz:", error);
    return [];
  }
};

export const getTutorResponse = async (history: { role: string, parts: { text: string }[] }[], message: string): Promise<string> => {
  try {
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
  } catch (error) {
    console.error("Chat error:", error);
    return "어라? 네트워크 연결이 불안정한 것 같아. 잠시 후에 다시 물어봐줘! 🚧";
  }
};