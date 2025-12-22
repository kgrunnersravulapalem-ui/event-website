import { collection, addDoc, updateDoc, doc, getDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import type { Registration, Transaction } from './types/payment';

/**
 * Create a new registration in Firestore
 */
export async function createRegistration(registrationData: Omit<Registration, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    if (!db) {
        throw new Error('Firestore is not initialized');
    }

    try {
        const registrationsRef = collection(db, 'registrations');
        const docRef = await addDoc(registrationsRef, {
            ...registrationData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
        
        return docRef.id;
    } catch (error) {
        console.error('Error creating registration:', error);
        throw error;
    }
}

/**
 * Update registration status
 */
export async function updateRegistrationStatus(
    registrationId: string,
    status: 'pending' | 'completed' | 'failed'
): Promise<void> {
    if (!db) {
        throw new Error('Firestore is not initialized');
    }

    try {
        const registrationRef = doc(db, 'registrations', registrationId);
        await updateDoc(registrationRef, {
            status,
            updatedAt: serverTimestamp(),
        });
    } catch (error) {
        console.error('Error updating registration status:', error);
        throw error;
    }
}

/**
 * Get registration by ID
 */
export async function getRegistration(registrationId: string): Promise<Registration | null> {
    if (!db) {
        throw new Error('Firestore is not initialized');
    }

    try {
        const registrationRef = doc(db, 'registrations', registrationId);
        const registrationSnap = await getDoc(registrationRef);
        
        if (registrationSnap.exists()) {
            return { id: registrationSnap.id, ...registrationSnap.data() } as Registration;
        }
        
        return null;
    } catch (error) {
        console.error('Error getting registration:', error);
        throw error;
    }
}

/**
 * Get registration by merchant order ID
 */
export async function getRegistrationByOrderId(merchantOrderId: string): Promise<Registration | null> {
    if (!db) {
        throw new Error('Firestore is not initialized');
    }

    try {
        const registrationsRef = collection(db, 'registrations');
        const q = query(registrationsRef, where('merchantOrderId', '==', merchantOrderId));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            return { id: doc.id, ...doc.data() } as Registration;
        }
        
        return null;
    } catch (error) {
        console.error('Error getting registration by order ID:', error);
        throw error;
    }
}

/**
 * Create a new transaction record
 */
export async function createTransaction(transactionData: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    if (!db) {
        throw new Error('Firestore is not initialized');
    }

    try {
        const transactionsRef = collection(db, 'transactions');
        const docRef = await addDoc(transactionsRef, {
            ...transactionData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
        
        return docRef.id;
    } catch (error) {
        console.error('Error creating transaction:', error);
        throw error;
    }
}

/**
 * Update transaction with payment details
 */
export async function updateTransaction(
    transactionId: string,
    updateData: Partial<Transaction>
): Promise<void> {
    if (!db) {
        throw new Error('Firestore is not initialized');
    }

    try {
        const transactionRef = doc(db, 'transactions', transactionId);
        await updateDoc(transactionRef, {
            ...updateData,
            updatedAt: serverTimestamp(),
        });
    } catch (error) {
        console.error('Error updating transaction:', error);
        throw error;
    }
}

/**
 * Get transaction by merchant order ID
 */
export async function getTransactionByOrderId(merchantOrderId: string): Promise<Transaction | null> {
    if (!db) {
        throw new Error('Firestore is not initialized');
    }

    try {
        const transactionsRef = collection(db, 'transactions');
        const q = query(transactionsRef, where('merchantOrderId', '==', merchantOrderId));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            return { id: doc.id, ...doc.data() } as Transaction;
        }
        
        return null;
    } catch (error) {
        console.error('Error getting transaction by order ID:', error);
        throw error;
    }
}

/**
 * Get all transactions for a registration
 */
export async function getTransactionsByRegistrationId(registrationId: string): Promise<Transaction[]> {
    if (!db) {
        throw new Error('Firestore is not initialized');
    }

    try {
        const transactionsRef = collection(db, 'transactions');
        const q = query(transactionsRef, where('registrationId', '==', registrationId));
        const querySnapshot = await getDocs(q);
        
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Transaction));
    } catch (error) {
        console.error('Error getting transactions by registration ID:', error);
        throw error;
    }
}
