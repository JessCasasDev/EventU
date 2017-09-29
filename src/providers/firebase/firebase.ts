import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth'

@Injectable()
export class FirebaseProvider {

  constructor(public http: Http, public fireDB: AngularFireDatabase, public fireAuth: AngularFireAuth) {
    console.log('Hello FirebaseProvider Provider');
  }

  //Authentication
  login(email, password){
    return new Promise((resolve,reject) => {
      this.fireAuth.auth.signInWithEmailAndPassword(email,password).then(
        (data) => {
          console.log(data);
          resolve(data);
        }
    ).catch((error) => {
        console.log(error);
        reject(error);
      });
    });
  }

  singUp(email,password){
    return new Promise((resolve,reject) => {
      this.fireAuth.auth.createUserWithEmailAndPassword(email,password).then(
        (data) => {
          resolve(data);
        }
    ).catch((error) => {
        console.log(error);
        reject(error);
      });
    });
  }

  //Events
  getEvents() {
    return this.fireDB.list('/events/');
  }
 
  addEvent(name) {
    this.fireDB.list('/events/').push(name);
  }
 
  removeEvent(id) {
    this.fireDB.list('/events/').remove(id);
  }

}
