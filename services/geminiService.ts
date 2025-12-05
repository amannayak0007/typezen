// Local word and sentence bank - no external API calls
const COMMON_WORDS = [
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "i", "it", "for", "not", "on", "with",
  "he", "as", "you", "do", "at", "this", "but", "his", "by", "from", "they", "we", "say", "her", "she",
  "or", "an", "will", "my", "one", "all", "would", "there", "their", "what", "so", "up", "out", "if",
  "about", "who", "get", "which", "go", "me", "when", "make", "can", "like", "time", "no", "just", "him",
  "know", "take", "people", "into", "year", "your", "good", "some", "could", "them", "see", "other", "than",
  "then", "now", "look", "only", "come", "its", "over", "think", "also", "back", "after", "use", "two",
  "how", "our", "work", "first", "well", "way", "even", "new", "want", "because", "any", "these", "give",
  "day", "most", "us", "life", "man", "world", "own", "part", "place", "right", "old", "great", "where",
  "through", "much", "before", "here", "over", "also", "around", "another", "well", "such", "many", "then",
  "them", "these", "so", "some", "her", "would", "make", "like", "into", "him", "has", "two", "more",
  "very", "after", "words", "long", "about", "than", "first", "been", "call", "who", "oil", "sit", "now",
  "find", "down", "day", "did", "get", "come", "made", "may", "part", "over", "new", "sound", "take",
  "only", "little", "work", "know", "place", "year", "live", "me", "back", "give", "most", "very", "after",
  "thing", "our", "just", "name", "good", "sentence", "man", "think", "say", "great", "where", "help", "through",
  "much", "before", "line", "right", "too", "mean", "old", "any", "same", "tell", "boy", "follow", "came",
  "want", "show", "also", "around", "form", "three", "small", "set", "put", "end", "does", "another", "well",
  "large", "must", "big", "even", "such", "because", "turn", "here", "why", "ask", "went", "men", "read",
  "need", "land", "different", "home", "us", "move", "try", "kind", "hand", "picture", "again", "change",
  "off", "play", "spell", "air", "away", "animal", "house", "point", "page", "letter", "mother", "answer",
  "found", "study", "still", "learn", "should", "America", "world", "high", "every", "near", "add", "food",
  "between", "own", "below", "country", "plant", "last", "school", "father", "keep", "tree", "never", "start",
  "city", "earth", "eye", "light", "thought", "head", "under", "story", "saw", "left", "don't", "few", "while",
  "along", "might", "close", "something", "seem", "next", "hard", "open", "example", "begin", "life", "always",
  "those", "both", "paper", "together", "got", "group", "often", "run", "important", "until", "children", "side",
  "feet", "car", "mile", "night", "walk", "white", "sea", "began", "grow", "took", "river", "four", "carry",
  "state", "once", "book", "hear", "stop", "without", "second", "later", "miss", "idea", "enough", "eat", "face",
  "watch", "far", "indian", "real", "almost", "let", "above", "girl", "sometimes", "mountain", "cut", "young",
  "talk", "soon", "list", "song", "leave", "family", "body", "music", "color", "stand", "sun", "questions",
  "fish", "area", "mark", "dog", "horse", "birds", "problem", "complete", "room", "knew", "since", "ever", "piece",
  "told", "usually", "didn't", "friends", "easy", "heard", "order", "red", "door", "sure", "become", "top", "ship",
  "across", "today", "during", "short", "better", "best", "however", "low", "hours", "black", "products", "happened",
  "whole", "measure", "remember", "early", "waves", "reached", "listen", "wind", "rock", "space", "covered", "fast",
  "several", "hold", "himself", "toward", "five", "step", "morning", "passed", "vowel", "true", "hundred", "against",
  "pattern", "numeral", "table", "north", "slowly", "money", "map", "farm", "pulled", "draw", "voice", "seen", "cold",
  "cried", "plan", "notice", "south", "sing", "war", "ground", "fall", "king", "town", "I'll", "unit", "figure",
  "certain", "field", "travel", "wood", "fire", "upon", "done", "English", "road", "half", "ten", "fly", "gave",
  "box", "finally", "wait", "correct", "oh", "quickly", "person", "became", "shown", "minutes", "strong", "verb",
  "stars", "front", "feel", "fact", "inches", "street", "decided", "contain", "course", "surface", "produce", "building",
  "ocean", "class", "note", "nothing", "rest", "carefully", "scientists", "inside", "wheels", "stay", "green", "known",
  "island", "week", "less", "machine", "base", "ago", "stood", "plane", "system", "behind", "ran", "round", "boat",
  "game", "force", "brought", "understand", "warm", "common", "bring", "explain", "dry", "though", "language", "shape",
  "deep", "thousands", "yes", "clear", "equation", "yet", "government", "filled", "heat", "full", "hot", "check",
  "object", "am", "rule", "among", "noun", "power", "cannot", "able", "six", "size", "dark", "ball", "material",
  "special", "heavy", "fine", "pair", "circle", "include", "built", "can't", "matter", "square", "syllables", "perhaps",
  "bill", "felt", "suddenly", "test", "direction", "center", "farmers", "ready", "anything", "divided", "general", "energy",
  "subject", "Europe", "moon", "region", "return", "believe", "dance", "members", "picked", "simple", "cells", "paint",
  "mind", "love", "cause", "rain", "exercise", "eggs", "train", "blue", "wish", "drop", "developed", "window",
  "difference", "distance", "heart", "sit", "sum", "summer", "wall", "forest", "probably", "legs", "sat", "main",
  "winter", "wide", "written", "length", "reason", "kept", "interest", "arms", "brother", "race", "present", "beautiful",
  "store", "job", "edge", "past", "sign", "record", "finished", "discovered", "wild", "happy", "beside", "gone",
  "sky", "grass", "million", "west", "lay", "weather", "root", "instruments", "meet", "third", "months", "paragraph",
  "raised", "represent", "soft", "whether", "clothes", "flowers", "shall", "teacher", "held", "describe", "drive", "cross",
  "speak", "solve", "appear", "metal", "son", "either", "ice", "sleep", "village", "factors", "result", "jumped",
  "snow", "ride", "care", "floor", "hill", "pushed", "baby", "buy", "century", "outside", "everything", "tall",
  "already", "instead", "phrase", "soil", "bed", "copy", "free", "hope", "spring", "case", "laughed", "nation",
  "quite", "type", "themselves", "temperature", "bright", "lead", "everyone", "method", "section", "lake", "consonant",
  "within", "dictionary", "hair", "age", "amount", "scale", "pounds", "although", "per", "broken", "moment", "tiny",
  "possible", "gold", "milk", "quiet", "natural", "lot", "stone", "act", "build", "middle", "speed", "count",
  "cat", "someone", "sail", "rolled", "bear", "wonder", "smiled", "angle", "fraction", "Africa", "killed", "melody",
  "bottom", "trip", "hole", "poor", "let's", "fight", "surprise", "French", "died", "beat", "exactly", "remain",
  "dress", "iron", "couldn't", "fingers", "row", "least", "catch", "climbed", "wrote", "shouted", "continued", "itself",
  "else", "plains", "gas", "England", "burning", "design", "joined", "foot", "law", "ears", "grass", "you're",
  "grew", "skin", "valley", "cents", "key", "president", "brown", "trouble", "cool", "cloud", "lost", "sent",
  "symbol", "wear", "bad", "save", "experiment", "engine", "alone", "drawing", "east", "pay", "single", "touch",
  "information", "express", "mouth", "yard", "equal", "decimal", "yourself", "control", "practice", "report", "straight",
  "rise", "statement", "stick", "party", "seeds", "suppose", "woman", "coast", "bank", "period", "wire", "choose",
  "clean", "visit", "bit", "whose", "received", "garden", "please", "strange", "caught", "fell", "team", "God",
  "captain", "direct", "ring", "serve", "child", "desert", "increase", "history", "cost", "maybe", "business", "separate",
  "break", "uncle", "hunting", "flow", "lady", "students", "human", "art", "feeling", "supply", "corner", "electric",
  "insects", "crops", "tone", "hit", "sand", "doctor", "provide", "thus", "won't", "cook", "bones", "tail",
  "board", "modern", "compound", "mine", "wasn't", "fit", "addition", "belong", "safe", "soldiers", "guess", "silent",
  "trade", "rather", "compare", "crowd", "poem", "enjoy", "elements", "indicate", "except", "expect", "flat", "seven",
  "interesting", "sense", "string", "blow", "famous", "value", "wings", "movement", "pole", "excited", "branches", "thick",
  "blood", "lie", "spot", "bell", "fun", "loud", "consider", "suggested", "thin", "position", "entered", "fruit",
  "tied", "rich", "dollars", "sent", "choose", "flat", "twenty", "nose", "track", "appeared", "alive", "steam",
  "arrow", "grew", "supply", "wash", "meat", "rub", "tube", "larger", "afraid", "scale", "lonely", "fear",
  "sight", "store", "stretched", "expect", "ancient", "hunt", "soldier", "captured", "dream", "flow", "shop", "match",
  "tide", "flew", "enter", "fear", "clothing", "wife", "sharp", "climb", "outer", "pitch", "sight", "soft",
  "though", "minute", "straight", "gentle", "women", "captain", "practice", "separate", "difficult", "doctor", "please",
  "protect", "noon", "whose", "locate", "ring", "character", "insect", "caught", "period", "radio", "spoke", "atom",
  "human", "history", "effect", "electric", "expect", "crop", "modern", "element", "hit", "student", "corner", "party",
  "supply", "bone", "rail", "imagine", "provide", "agree", "thus", "capital", "won't", "chair", "danger", "fruit",
  "rich", "thick", "troop", "neck", "nose", "track", "appear", "steam", "arrow", "grew", "wash", "meat",
  "rub", "tube", "larger", "afraid", "scale", "lonely", "fear", "sight", "store", "stretch", "expect", "ancient",
  "hunt", "soldier", "capture", "dream", "flow", "shop", "match", "tide", "flew", "enter", "fear", "clothing",
  "wife", "sharp", "climb", "outer", "pitch", "sight", "soft", "though", "minute", "straight", "gentle", "women"
];

const HARD_WORDS = [
  "philosophy", "extraordinary", "sophisticated", "phenomenon", "conscience", "rhythm", "psychology", "challenge",
  "technique", "characteristic", "environment", "responsibility", "opportunity", "independent", "development",
  "experience", "knowledge", "necessary", "especially", "different", "important", "beautiful", "wonderful",
  "interesting", "comfortable", "impossible", "incredible", "unbelievable", "extraordinary", "magnificent",
  "tremendous", "fantastic", "excellent", "brilliant", "wonderful", "marvelous", "spectacular", "remarkable",
  "exceptional", "outstanding", "impressive", "magnificent", "splendid", "gorgeous", "stunning", "breathtaking",
  "architecture", "mathematics", "philosophy", "psychology", "geography", "chemistry", "biology", "physics",
  "literature", "education", "government", "democracy", "republic", "constitution", "revolution", "evolution",
  "civilization", "technology", "innovation", "invention", "discovery", "exploration", "adventure", "journey",
  "destination", "transportation", "communication", "information", "transformation", "organization", "cooperation",
  "collaboration", "celebration", "preparation", "determination", "motivation", "inspiration", "imagination",
  "creativity", "originality", "personality", "individuality", "uniqueness", "difference", "similarity",
  "relationship", "friendship", "partnership", "leadership", "membership", "ownership", "citizenship",
  "scholarship", "fellowship", "sponsorship", "championship", "relationship", "friendship", "partnership"
];

const SENTENCES = [
  "The quick brown fox jumps over the lazy dog and runs through the forest.",
  "She walked along the beach collecting seashells while the sun set behind the mountains.",
  "Technology has transformed how we communicate and work in the modern world.",
  "Reading books opens doors to new worlds and expands our understanding of life.",
  "Music has the power to evoke emotions and bring people together from different cultures.",
  "The scientist conducted experiments to discover new ways to solve complex problems.",
  "Nature provides endless inspiration for artists and writers throughout history.",
  "Education empowers individuals to achieve their dreams and make positive changes.",
  "Friendship is built on trust, respect, and shared experiences over time.",
  "Cooking requires patience, creativity, and attention to detail for delicious results.",
  "Travel broadens perspectives and creates lasting memories of different places.",
  "Exercise improves physical health and mental well-being for a better life.",
  "Art expresses emotions and ideas that words alone cannot fully capture.",
  "History teaches valuable lessons about human nature and societal development.",
  "Innovation drives progress and shapes the future of human civilization.",
  "The library contains thousands of books covering every subject imaginable.",
  "Photography captures moments in time that tell stories without words.",
  "Mathematics helps us understand patterns and relationships in the universe.",
  "Writing allows us to share thoughts and connect with readers worldwide.",
  "Gardening teaches patience and provides fresh food for healthy living.",
  "Architecture combines art and science to create beautiful functional spaces.",
  "Medicine saves lives and improves quality of life for millions daily.",
  "Philosophy explores deep questions about existence, knowledge, and morality.",
  "Engineering solves practical problems using scientific principles and creativity.",
  "Literature reflects human experiences and emotions across different cultures.",
  "The ocean covers most of Earth and contains countless mysterious creatures.",
  "Mountains rise majestically toward the sky inspiring awe and adventure.",
  "Cities bring together diverse people creating vibrant cultural communities.",
  "Rivers flow from mountains to oceans connecting landscapes and ecosystems.",
  "Stars shine brightly in the night sky telling stories of distant worlds."
];

function shuffleArray<T>(array: T[]): T[] {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

function getRandomWords(count: number, difficulty: 'easy' | 'hard'): string[] {
  const wordPool = difficulty === 'hard' ? HARD_WORDS : COMMON_WORDS;
  const shuffled = shuffleArray(wordPool);
  return shuffled.slice(0, count);
}

function getRandomSentences(count: number): string {
  const shuffled = shuffleArray(SENTENCES);
  return shuffled.slice(0, count).join(' ');
}

export const generateTypingContent = async (
  mode: 'words' | 'sentences',
  difficulty: 'easy' | 'hard' = 'easy'
): Promise<string[]> => {
  // Simulate async but return immediately with local data
  return new Promise((resolve) => {
    setTimeout(() => {
      if (mode === 'words') {
        const wordCount = difficulty === 'hard' ? 50 : 40;
        resolve(getRandomWords(wordCount, difficulty));
      } else {
        const sentenceText = getRandomSentences(2);
        // Split into words for consistency
        resolve(sentenceText.split(' ').filter(word => word.length > 0));
      }
    }, 10); // Small delay to simulate async but instant loading
  });
};