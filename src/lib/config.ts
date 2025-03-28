import { indexedDBLocalPersistence } from 'firebase/auth';

export const COOKIE_NAME = '__session';
export const AUTH_PERSISTENCE = indexedDBLocalPersistence;

export const API_URL = 'https://6q9d6sl2jh.execute-api.ap-southeast-2.amazonaws.com/api';
export const API_KEY = import.meta.env.VITE_API_KEY;