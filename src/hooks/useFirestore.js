import { useState, useCallback } from 'react';
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  getDocs, 
  orderBy,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import toast from 'react-hot-toast';

export function useFirestore(collectionName) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Add a document
  const addDocument = async (data) => {
    setLoading(true);
    try {
      const ref = collection(db, collectionName);
      const docRef = await addDoc(ref, { 
        ...data, 
        createdAt: serverTimestamp() 
      });
      toast.success('Saved successfully!');
      return docRef;
    } catch (err) {
      console.error(err);
      setError(err.message);
      toast.error('Failed to save data');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a document
  const deleteDocument = async (id) => {
    setLoading(true);
    try {
      await deleteDoc(doc(db, collectionName, id));
      toast.success('Deleted successfully');
    } catch (err) {
      console.error(err);
      setError(err.message);
      toast.error('Failed to delete');
    } finally {
      setLoading(false);
    }
  };

  // Update a document
  const updateDocument = async (id, data) => {
    setLoading(true);
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, data);
      toast.success('Updated successfully');
    } catch (err) {
      console.error(err);
      setError(err.message);
      toast.error('Failed to update');
    } finally {
      setLoading(false);
    }
  };

  // Get specific documents (Query)
  // useFilters is an array of where() clauses
  // e.g. ["userId", "==", "123"]
  const getDocuments = useCallback(async (qParams = null) => {
    setLoading(true);
    try {
      let ref = collection(db, collectionName);
      let q = query(ref, orderBy('createdAt', 'desc'));

      if (qParams) {
        // Simple implementation for single where clause
        // Usage: getDocuments({ field: 'userId', op: '==', val: '123' })
        q = query(ref, where(qParams.field, qParams.op, qParams.val));
      }

      const snapshot = await getDocs(q);
      const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLoading(false);
      return results;
    } catch (err) {
      console.error(err);
      setError(err.message);
      setLoading(false);
      return [];
    }
  }, [collectionName]);

  return { 
    addDocument, 
    deleteDocument, 
    updateDocument, 
    getDocuments, 
    loading, 
    error 
  };
}
