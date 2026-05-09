import { createContext, useContext, useReducer } from 'react';

const AdvisorContext = createContext(null);

const STORAGE_KEY = 'cloudadvisor_session';

function loadSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveSession(answers, results) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, results }));
  } catch {
    // storage blocked or full — silently ignore
  }
}

function clearSession() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

function getTheme() {
  try {
    return localStorage.getItem('theme') || 'light';
  } catch {
    return 'light';
  }
}

const saved = loadSession();

const initialState = {
  answers: saved?.answers ?? {
    useCase: null,
    profile: null,
    budget: null,
    priorities: [],
    geography: null,
    services: [],
  },
  results: saved?.results ?? null,
  isLoading: false,
  error: null,
  theme: getTheme(),
};

function advisorReducer(state, action) {
  switch (action.type) {
    case 'SET_ANSWER': {
      const answers = { ...state.answers, [action.field]: action.value };
      saveSession(answers, state.results);
      return { ...state, answers };
    }
    case 'SET_ANSWERS': {
      const answers = { ...state.answers, ...action.answers };
      saveSession(answers, state.results);
      return { ...state, answers };
    }
    case 'SET_RESULTS': {
      saveSession(state.answers, action.results);
      return { ...state, results: action.results, isLoading: false, error: null };
    }
    case 'SET_LOADING':
      return { ...state, isLoading: action.isLoading };
    case 'SET_ERROR':
      return { ...state, error: action.error, isLoading: false };
    case 'RESET':
      clearSession();
      return {
        ...initialState,
        answers: {
          useCase: null,
          profile: null,
          budget: null,
          priorities: [],
          geography: null,
          services: [],
        },
        results: null,
        theme: state.theme,
      };
    case 'TOGGLE_THEME': {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      try {
        localStorage.setItem('theme', newTheme);
      } catch { /* ignore */ }
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return { ...state, theme: newTheme };
    }
    default:
      return state;
  }
}

export function AdvisorProvider({ children }) {
  const [state, dispatch] = useReducer(advisorReducer, initialState);

  const setAnswer = (field, value) => dispatch({ type: 'SET_ANSWER', field, value });
  const setAnswers = (answers) => dispatch({ type: 'SET_ANSWERS', answers });
  const setResults = (results) => dispatch({ type: 'SET_RESULTS', results });
  const setLoading = (isLoading) => dispatch({ type: 'SET_LOADING', isLoading });
  const setError = (error) => dispatch({ type: 'SET_ERROR', error });
  const reset = () => dispatch({ type: 'RESET' });
  const toggleTheme = () => dispatch({ type: 'TOGGLE_THEME' });

  return (
    <AdvisorContext.Provider value={{ state, setAnswer, setAnswers, setResults, setLoading, setError, reset, toggleTheme }}>
      {children}
    </AdvisorContext.Provider>
  );
}

export function useAdvisor() {
  const ctx = useContext(AdvisorContext);
  if (!ctx) throw new Error('useAdvisor must be used inside AdvisorProvider');
  return ctx;
}
