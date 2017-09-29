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

  //Validations
  validateInputs(email, password){
    let pass = this.validateEmail(email);
    if(pass){
      if(!this.validatePassword(password)) {
        pass = false;
        /* TODO contraseña invalida */ console.log("contraseña debe tener al menos 6 caracteres")
      }
    }
    else /* TODO correo invalido */ console.log("correo debe ser de la unal");
    return pass;
  }

  validateEmail(email){
    let pass = false;
    let index = email.indexOf("@");
    email = email.replace(/ /g,'');
    email = email.trim();
    email = email.toLowerCase();
    if(email != "" && index != -1){
      if(email.substring(index, email.length) == "@unal.edu.co") pass = true;
    }
    return pass;
  }

  validatePassword(password){
    password = password.replace(/ /g,'');
    password = password.trim();
    if(password.length < 6) return false;
    return true;
  }

  //Authentication
  login(email, password){
    return new Promise((resolve,reject) => {
      this.fireAuth.auth.signInWithEmailAndPassword(email,password).then(
        (data) => {
          console.log(data);
          resolve(data);
        }
    ).catch(error => {
      console.log(error);
      reject("Correo y/o contraseña incorrectos");
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
