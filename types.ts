export enum GameMode {
  ZEN = 'ZEN',
  TIME = 'TIME',
  RACE = 'RACE',
  RAIN = 'RAIN'
}

export enum GameState {
  IDLE = 'IDLE',
  PLAYING = 'PLAYING',
  FINISHED = 'FINISHED',
  LOADING = 'LOADING'
}

export interface TypingResult {
  wpm: number;
  accuracy: number;
  rawWpm: number;
  correctChars: number;
  incorrectChars: number;
  missedChars: number;
  timeElapsed: number;
}

export interface WordRainItem {
  id: string;
  text: string;
  x: number; // percentage 0-100
  y: number; // pixels from top
  speed: number;
}

export interface RaceProgress {
  userProgress: number; // 0-100
  botProgress: number; // 0-100
}