import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY not found in environment variables. Using fallback content.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

// Fallback words if API fails or key is missing
const FALLBACK_WORDS = "the be to of and a in that have i it for not on with he as you do at this but his by from they we say her she or an will my one all would there their what so up out if about who get which go me when make can like time no just him know take people into year your good some could them see other than then now look only come its over think also back after use two how our work first well way even new want because any these give day most us".split(" ");

export const generateTypingContent = async (mode: 'words' | 'sentences', difficulty: 'easy' | 'hard' = 'easy'): Promise<string[]> => {
  const ai = getClient();
  
  if (!ai) {
    return shuffleArray(FALLBACK_WORDS).slice(0, 50);
  }

  try {
    const prompt = mode === 'words' 
      ? `Generate a list of 40 random ${difficulty === 'hard' ? 'complex' : 'common'} English words for a typing test. Return only the words separated by spaces. No punctuation, no bullets, lowercase only.`
      : `Generate 5 random interesting sentences for a typing test. Return them as a single block of text.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const text = response.text;
    if (!text) return shuffleArray(FALLBACK_WORDS).slice(0, 50);

    // Clean up the text
    const cleanText = text.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
    
    if (mode === 'words') {
      return cleanText.split(' ');
    } else {
      return cleanText.split(''); // For sentences, we might want char array logic, but let's stick to word array for consistency in main app, or just return the full string split by spaces
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    return shuffleArray(FALLBACK_WORDS).slice(0, 50);
  }
};

function shuffleArray(array: string[]) {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}