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
      // Ensure createdAt is a simpler format if serverTimestamp fails on some devices
      const docRef = await addDoc(ref, { 
        ...data, 
        createdAt: serverTimestamp() 
      });
      // toast is handled in the component usually, but keeping logic consistent
      return docRef;
    } catch (err) {
      console.error(err);
      setError(err.message);
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

  // --- BUG FIX IS HERE ---
  const getDocuments = useCallback(async (qParams = null) => {
    setLoading(true);
    try {
      let ref = collection(db, collectionName);
      let q;

      if (qParams) {
        // FIX: Agar hum specific cheez dhoondh rahe hain (Search/Filter), 
        // to 'orderBy' (Sorting) MAT lagao. Isse Index error nahi aayega.
        q = query(ref, where(qParams.field, qParams.op, qParams.val));
      } else {
        // Agar Home page par sab dikhana hai, tabhi Sorting lagao.
        q = query(ref, orderBy('createdAt', 'desc'));
      }

      const snapshot = await getDocs(q);
      const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      setLoading(false);
      return results;
    } catch (err) {
      console.error("Firestore Read Error:", err);
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
