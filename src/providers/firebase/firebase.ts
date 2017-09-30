import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { ToastController } from 'ionic-angular';

@Injectable()
export class FirebaseProvider {

  constructor(public http: Http, public fireDB: AngularFireDatabase, public fireAuth: AngularFireAuth,
              public toastCtrl: ToastController) {
    console.log('Hello FirebaseProvider Provider');
  }

  //Validations
  validateInputs(email, password){
    let pass = this.validateEmail(email);
    if(pass){
      if(!this.validatePassword(password)) {
        pass = false;
        this.presentToast("La contraseña es muy corta");
      }
    }
    else this.presentToast("Debe ser un correo @unal");
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
    let index = password.indexOf(" ");
    console.log(index);
    let pass = false;
    if(index == -1 && password.length > 5) pass = true;
    return pass;
  }

  //Authentication
  login(email, password){
    return new Promise((resolve,reject) => {
      this.fireAuth.auth.signInWithEmailAndPassword(email,password).then(
        (data) => {
          resolve(data);
        }
    ).catch(error => {
      this.presentToast("Correo y/o contraseña incorrectos");
      });
    });
  }

  singUp(email,password){
    return new Promise((resolve,reject) => {
      this.fireAuth.auth.createUserWithEmailAndPassword(email,password).then(
        (data) => {
          this.fireAuth.auth.onAuthStateChanged(user => {
            user.sendEmailVerification(); 
          })
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

  //Alerts
  presentToast(message){
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

}
