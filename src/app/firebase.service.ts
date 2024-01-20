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

  async getUniqueCategories(): Promise<any[]> {
    const productCollection = collection(this.firestore, 'products');
    const productSnapshot = await getDocs(productCollection);
    const categoriesMap = new Map<string, string[]>();
  
    productSnapshot.docs.forEach(doc => {
      const data = doc.data();
      data['categories'].forEach((category:any) => {
        if (categoriesMap.has(category)) {
          categoriesMap.get(category)?.push(data['title']);
        } else {
          categoriesMap.set(category, [data['title']]);
        }
      });
    });
  
    return Array.from(categoriesMap, ([name, titles]) => ({name, titles}));
  }
  
  async getUniqueCollections(): Promise<any[]> {
    const productCollection = collection(this.firestore, 'products');
    const productSnapshot = await getDocs(productCollection);
    const collectionsMap = new Map<string, string[]>();
  
    productSnapshot.docs.forEach(doc => {
      const data = doc.data();
      data['collections'].forEach((collection:any) => {
        if (collectionsMap.has(collection)) {
          collectionsMap.get(collection)?.push(data['title']);
        } else {
          collectionsMap.set(collection, [data['title']]);
        }
      });
    });
  
    return Array.from(collectionsMap, ([name, titles]) => ({name}));
  }

  async isTitleUnique(title: string): Promise<boolean> {
    const productCollection = collection(this.firestore, 'products');
    const productQuery = query(productCollection, where('title', '==', title));
    const productSnapshot = await getDocs(productQuery);
  
    // If the snapshot is empty, the title is unique
    return productSnapshot.empty;
  }

  async getProductById(id: string): Promise<any> {
    const productDoc = doc(this.firestore, 'products', id);
    const productSnapshot = await getDoc(productDoc);
  
    return productSnapshot.data();
  }
  
  
  
}
