import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as fbSignOut, onAuthStateChanged, User } from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  getDocFromServer,
  setDoc, 
  collection, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  onSnapshot 
} from 'firebase/firestore';

interface FirebaseRawConfig {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
  firestoreDatabaseId?: string;
}

// Safely probe for local firebase-applet-config.json if present without failing builds when omitted
const localConfigFiles = import.meta.glob<{ default?: FirebaseRawConfig } & FirebaseRawConfig>(
  '../../firebase-applet-config.json',
  { eager: true }
);
const localConfigEntry = localConfigFiles['../../firebase-applet-config.json'];
const fallbackConfig: FirebaseRawConfig = (localConfigEntry?.default || localConfigEntry || {}) as FirebaseRawConfig;

const env = import.meta.env;

export const firestoreDatabaseId: string =
  (env.VITE_FIREBASE_DATABASE_ID as string) ||
  fallbackConfig.firestoreDatabaseId ||
  'ai-studio-devfoliocmsmoder-47d70254-aaa8-4310-81a4-0bda8cc11f91';

export const firebaseConfig = {
  apiKey: (env.VITE_FIREBASE_API_KEY as string) || fallbackConfig.apiKey || '',
  authDomain: (env.VITE_FIREBASE_AUTH_DOMAIN as string) || fallbackConfig.authDomain || '',
  projectId: (env.VITE_FIREBASE_PROJECT_ID as string) || fallbackConfig.projectId || '',
  storageBucket: (env.VITE_FIREBASE_STORAGE_BUCKET as string) || fallbackConfig.storageBucket || '',
  messagingSenderId: (env.VITE_FIREBASE_MESSAGING_SENDER_ID as string) || fallbackConfig.messagingSenderId || '',
  appId: (env.VITE_FIREBASE_APP_ID as string) || fallbackConfig.appId || '',
  firestoreDatabaseId,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app, firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Connection test as mandated by Firebase skill
export async function testFirebaseConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'portfolio', 'main'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline or initializing.');
    }
    return false;
  }
}
