import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import {onSnapshot,Firestore, collection, doc, getDoc, getDocs, query, where, updateDoc, deleteDoc, addDoc, CollectionReference } from '@angular/fire/firestore'

@Injectable({
  providedIn: 'root'
})
export class FirebaseService implements OnInit  {

  constructor(private firestore:Firestore) { }

  ngOnInit() {
  }

  async addDocument(collectionName:string, data:any):Promise<any> {
    const collectionRef = collection(this.firestore, collectionName);
    const docRef = await addDoc(collectionRef, data);
    updateDoc(docRef, {id: docRef.id});
    return docRef;
  }

  getProducts(): Observable<any[]> {
    return new Observable((observer) => {
      const productCollection = collection(this.firestore, 'products');
      const productQuery = query(productCollection);

      const unsubscribe = onSnapshot(productQuery, (snapshot) => {
        const products = snapshot.docs.map(doc => doc.data());
        observer.next(products);
      });

      // Cleanup subscription on unsubscription
      return () => unsubscribe();
    });
  }
}
