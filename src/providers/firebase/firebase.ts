import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { ConfigProvider } from '../config/config'

@Injectable()
export class FirebaseProvider {

  user: any = [];

  constructor(public http: Http, public fireDB: AngularFireDatabase,
              public fireAuth: AngularFireAuth, public configPro: ConfigProvider) {
    console.log('Hello FirebaseProvider Provider');
  }


  //Authentication
  login(email, password){
    return new Promise((resolve,reject) => {
      this.fireAuth.auth.signInWithEmailAndPassword(email,password).then(
        (data) => {
          this.user = data;
          if(this.user.emailVerified) resolve(data);
          else this.configPro.presentToast("Debes Validar tu correo primero");
        }
    ).catch((error) => {
      console.log(error);
      this.configPro.presentToast("Correo y/o contraseña incorrectos");
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
 
  addEvent(event) {
    event.user = this.user.uid;
    console.log(event);
    return new Promise( (resolve, reject) => {
      this.fireDB.list('/events/').push(event).then(
        (data) => {
          this.configPro.presentToast("El evento se ha creado con exito");
          resolve(data);
        }
      ).catch( (error) => {
        console.log(error);
        this.configPro.presentToast("No se ha podido crear el evento");
      });
    });
  }
 
  removeEvent(id) {
    this.fireDB.list('/events/').remove(id);
  }



}
