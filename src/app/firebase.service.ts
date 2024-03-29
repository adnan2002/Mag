import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import {onSnapshot,Firestore, collection, doc, getDoc, getDocs, query, where, updateDoc, deleteDoc, addDoc, CollectionReference, setDoc, docData } from '@angular/fire/firestore'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, sendPasswordResetEmail, sendEmailVerification, User, onAuthStateChanged, user } from '@angular/fire/auth';
import { AlertController } from '@ionic/angular';
import { BehaviorSubject, from, map, catchError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class FirebaseService implements OnInit  {

  private authState = new BehaviorSubject(null);

  constructor(private alertController:AlertController,private firestore:Firestore) {
    const auth = getAuth();
    onAuthStateChanged(auth, (user:any) => {
      this.authState.next(user);
    });
   }

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

  async getDeliveryCharge(): Promise<any> {
    const deliveryChargeCollection = collection(this.firestore, 'deliveryCharge');
    const deliveryChargeSnapshot = await getDocs(deliveryChargeCollection);
  
    // Check if the collection is not empty
    if (!deliveryChargeSnapshot.empty) {
      // Get the first document
      const firstDoc = deliveryChargeSnapshot.docs[0];
  
      // Return the 'charge' value
      return {charge: firstDoc.data()['charge'], threshold: firstDoc.data()['threshold']};
    } else {
      throw new Error('The deliveryCharge collection is empty.');
    }
  }


  async signUp(data:any){
   const  {email, password, firstName, lastName} =data ;
    const auth = getAuth();
   try{
    const result = await createUserWithEmailAndPassword(auth, email, password);
    

    await setDoc(doc(this.firestore, 'users', result.user.uid), {
      uid: result.user.uid,
      firstName,
      lastName,
      email,
    });

    // await sendEmailVerification(result.user);

    return true;

   }catch(error:any){
    console.error('Error signing up:', error);

    let message = 'Error signing up';
    if (error['code'] === 'auth/email-already-in-use') {
      message = 'The email is already taken';
    }

    // Display an error message using an alert controller
    const alert = await this.alertController.create({
      header: 'Error',
      message,
      buttons: ['OK']
    });

    await alert.present();
    return false;
   }




  }

  async signOut() {
    const auth = getAuth();
    try {
      await signOut(auth);
      console.log('User signed out');
      return true;
    } catch (error) {
      console.error('Error signing out:', error);
      return false;
    }
  }

  async signIn(data:any) {
    const { email, password } = data;
    const auth = getAuth();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('User signed in');
      return true;
    } catch (error:any) {
      console.error('Error signing in:', error);
      return error.code; // return the error code
    }
  }

  async forgotPassword(email: string) {
    const auth = getAuth();
    try {
      await sendPasswordResetEmail(auth, email);
      console.log('Password reset email sent');
      return true;
    } catch (error) {
      console.error('Error sending password reset email:', error);
      return false
    }
  }

  async  getUserByUid(uid:string) {
    const userRef = doc(this.firestore, 'users', uid);
    const userSnap = await getDoc(userRef);
  
    if (userSnap.exists()) {
      return userSnap.data();
    } else {
      return null;
    }
  }
  getUserByUidObservable(uid: string): Observable<any> {
    return new Observable((observer) => {
      const unsubscribe = onSnapshot(doc(this.firestore, 'users', uid), (doc) => {
        if (doc.exists()) {
          observer.next(doc.data());
        } else {
          observer.next(null);
        }
      });
  
      // Return the unsubscribe function to be called when the Observable is unsubscribed
      return unsubscribe;
    });
  }

  async getUserByEmail(email:string){
    const userCollection = collection(this.firestore, 'users');
    const q = query(userCollection, where('email','==',email));
    const querySnapshot = await getDocs(q);

    let user = null;
    querySnapshot.forEach((doc:any)=>{
      user = doc.data();
    });

    return user;

  }

  async isEmailFound(email: string): Promise<boolean> {
    const usersRef = collection(this.firestore, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  }
  

  getAuthState() {
    return this.authState.asObservable();
  }

  async getAddressById(id:string) {
    try {
      const auth = getAuth();
      const uid = auth.currentUser?.uid;
      if (uid) {
        const docRef = doc(this.firestore, "users", uid);
        const docSnap = await getDoc(docRef);
  
        if (docSnap.exists()) {
          const userAddresses = docSnap.data()['addresses'];
          const address = userAddresses.find((address:any) => address.id === id);
          return Promise.resolve(address);
        } else {
         return null;
        }
      } else {
        console.log("User is not authenticated!");
      }
    } catch (error) {
      console.error("Error getting document:", error);
      return null;
    }
}


getUserAddresses(): Observable<any> {
  const auth:any = getAuth();
  const uid = auth.currentUser.uid;
  const userRef = doc(this.firestore, 'users', uid);

  return new Observable(observer => {
    onSnapshot(userRef, docSnapshot => {
      if (docSnapshot.exists()) {
        const userData = docSnapshot.data();
        const addresses = userData ? userData['addresses'] : [];
        observer.next(addresses);
      } else {
        observer.error('No such user!');
      }
    }, error => {
      observer.error(error);
    });
  });
}




  


  
  
  
}

