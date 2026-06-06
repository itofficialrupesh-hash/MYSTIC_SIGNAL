import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit, deleteDoc, doc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAPtLodRSN6DaIx89QANo346mM3E6xC6uo",
  authDomain: "mystic-signal-9a89b.firebaseapp.com",
  projectId: "mystic-signal-9a89b",
  storageBucket: "mystic-signal-9a89b.firebasestorage.app",
  messagingSenderId: "107555864452",
  appId: "1:107555864452:web:303f5aca46ea8b536527d1",
  measurementId: "G-TBEQGR9RV7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: null,
      email: null,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Saves a lock screen unlock attempt to the Firebase Firestore database.
 * @param value The value entered by the visitor
 * @param isCorrect Whether the passcode/token was verified correctly
 */
export async function saveUnlockAttempt(value: string, isCorrect: boolean) {
  const collectionPath = "unlock_attempts";
  try {
    await addDoc(collection(db, collectionPath), {
      value: value,
      isCorrect: isCorrect,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, collectionPath);
  }
}

/**
 * Fetches the list of unlock attempts from Firestore, ordered by most recent first.
 */
export async function getUnlockAttempts() {
  const collectionPath = "unlock_attempts";
  try {
    const q = query(
      collection(db, collectionPath),
      orderBy("timestamp", "desc"),
      limit(100)
    );
    const querySnapshot = await getDocs(q);
    const attempts: { id: string; value: string; isCorrect: boolean; timestamp: string }[] = [];
    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      attempts.push({
        id: docSnapshot.id,
        value: data.value || "",
        isCorrect: !!data.isCorrect,
        timestamp: data.timestamp || ""
      });
    });
    return attempts;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, collectionPath);
    return [];
  }
}

/**
 * Deletes a single unlock attempt log entry from Firestore.
 */
export async function deleteUnlockAttempt(id: string) {
  const collectionPath = "unlock_attempts";
  try {
    await deleteDoc(doc(db, collectionPath, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${collectionPath}/${id}`);
  }
}
