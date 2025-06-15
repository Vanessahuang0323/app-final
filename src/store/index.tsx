import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface AnalysisPreview {
  coreSkills: string[];
  experience: string[];
  education: string[];
  matchingJobs: {
    id: string;
    title: string;
    company: string;
    location: string;
  }[];
}

interface AppState {
  isLoading: boolean;
  user: {
    id: string | null;
    role: 'student' | 'company' | null;
    name: string | null;
  } | null;
  language: 'zh' | 'en';
  analysis: AnalysisPreview | null;
}

type Action =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: AppState['user'] }
  | { type: 'SET_LANGUAGE'; payload: 'zh' | 'en' }
  | { type: 'SET_ANALYSIS'; payload: AnalysisPreview }
  | { type: 'LOGOUT' };

const initialState: AppState = {
  isLoading: false,
  user: null,
  language: (localStorage.getItem('language') as 'zh' | 'en') || 'zh',
  analysis: null
};

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_LANGUAGE':
      localStorage.setItem('language', action.payload);
      return { ...state, language: action.payload };
    case 'SET_ANALYSIS':
      return { ...state, analysis: action.payload };
    case 'LOGOUT':
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      return { ...state, user: null };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
} 