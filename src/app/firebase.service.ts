import { Injectable, OnInit } from '@angular/core';

import {Firestore, collection, doc, getDoc, getDocs, query, where, updateDoc, deleteDoc, addDoc, CollectionReference } from '@angular/fire/firestore'

@Injectable({
  providedIn: 'root'
})
export class FirebaseService implements OnInit  {

  constructor(private firestore:Firestore) { }

  ngOnInit() {
  }

  async addDocument(collectionName:string):Promise<any> {
    const collectionRef = collection(this.firestore, collectionName);
    const docRef = await addDoc(collectionRef, {name: "Test Document"});
    return docRef;
  }
}
