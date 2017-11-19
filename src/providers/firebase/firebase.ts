import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AngularFireDatabase  } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { ConfigProvider } from '../config/config'

@Injectable()
export class FirebaseProvider {

  user: any = [];
  emailshort: string;
  inscribed_events = [];
  assisted_events = [];

  constructor(public http: Http, public fireDB: AngularFireDatabase,
              public fireAuth: AngularFireAuth, public configPro: ConfigProvider) {
    console.log('Hello FirebaseProvider Provider');
  }

  //Validate Session
  validateSession(){

    return new Promise( (resolve,reject) =>{
      this.fireAuth.authState.subscribe( user =>{
        if(user){
          this.user = user;
          this.getUserProfile(this.user.email);
          resolve(user);
        }
        else reject(user);
      })
    })
  }

  //Authentication
  login(email, password){
    return new Promise((resolve,reject) => {
      this.fireAuth.auth.signInWithEmailAndPassword(email,password).then(
        (data) => {
          this.user = data;
          if(this.user.emailVerified){
            this.getUserProfile(email);
            resolve(data);
          }
          else this.configPro.presentToast("Debes Validar tu correo primero");
        }
    ).catch((error) => {
      console.log(error);
      if(error.code == "auth/network-request-failed"){
        this.configPro.presentToast("Verifica tu conexión a internet");
      }
      else this.configPro.presentToast("Correo y/o contraseña incorrectos");
      reject(error);
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
        let err: any = [];
        err = error;
        console.log(error);
        if(err.code == "auth/email-already-in-use")
          this.configPro.presentToast("El correo ya se encuentra registrado, por favor valida tu correo")
      });
    });
  }

  logout(){
    return new Promise((resolve,reject) => {
      this.fireAuth.auth.signOut().then( data => {
        this.configPro.dismissLoading()
        resolve(data)
      })
      .catch( error => {
        console.log(error);
        this.configPro.presentToast("No se ha podido cerrar sesión")
      });
    })
  }

  resetPassword(email){
    return new Promise( (resolve,reject) => {
      this.fireAuth.auth.sendPasswordResetEmail(email).then( data => {
        console.log(data);
        resolve();
      }).catch( error => {
        console.log(error);
        if(error.code == "auth/user-not-found"){
          this.configPro.presentToast("El correo no existe en eventu");
        }
      })
    })
  }
  
  //Events
  getEvents() {
    return new Promise((resolve, reject) => {
      this.fireDB.list('/events/').valueChanges().subscribe( data =>{
        console.log(data);
        if(data) resolve(data);
        else console.log(data);
      })
    });
  }

  getEventsByType( type : string) {
      return new Promise((resolve, reject) => {
          let events = [];
          var ref = this.fireDB.database.ref('events').orderByChild("type");
          ref.equalTo(type).once("value", data => {
              data.forEach(a => {
                  let event = a.val();
                  event.id = a.key;
                  events.push(event);
                  return false;
              });
          }).then(data => resolve(events))
      })
  }
    //get events by user
  getEventsById() {
    return new Promise((resolve,reject) =>{
      let events = [];
      var ref = this.fireDB.database.ref('events').orderByChild("user");
      ref.equalTo(this.user.uid).once("value", data => {
        data.forEach( a => {
          let event = a.val();
          event.id = a.key;
          events.push(event);
          return false;
        });
      }).then( data => resolve(events))
    })

  }
 
  addEvent(event) {
    event.user = this.user.uid;
    return new Promise( (resolve, reject) => {
      this.fireDB.list('/events/').push(event).then(
        (data) => {
          this.configPro.presentToast("El evento se ha creado con exito");
          resolve(data);
        }
      )
    });
  }
 
  deleteEvent(event) {
    return new Promise((resolve,reject) => {
      this.fireDB.list('/events/').remove(event.id).then( (data : any) => {
        this.configPro.presentToast("Evento borrado con exito");
        resolve(data);
      }).catch( error => {
        this.configPro.presentToast("No se ha podido borrar el evento");
        reject(error);
      });
    })

  }

  updateEvent(event){
    return new Promise((resolve,reject) => {
      this.fireDB.list('/events/').update(event.id,event).then( data => {
        console.log(data);
        resolve();
      }).catch( error => {
        reject(error);
      });
    })
  }

  getEventByName(event) {
    let events = [];
    return new Promise((resolve, reject) => {
      var ref = this.fireDB.database.ref('events').orderByKey();
      ref.equalTo(event).once("value", data => {
        data.forEach(a => {
          let event = a.val();
          event.id = a.key;
          events.push(event);
          return false;
        });
      }).then(data => resolve(events))
    });
  }

  getEventsByDates(startDate: Date, endDate: Date) {
    console.log(startDate.toISOString(), endDate.toISOString());
    return new Promise((resolve, reject) => {
      let events = [];
      var ref = this.fireDB.database.ref('events').orderByChild("date");
      ref.startAt(startDate.toISOString()).endAt(endDate.toISOString()).once("value", data => {
        console.log(data);
        data.forEach(a => {
          let event = a.val();
          event.id = a.key;
          events.push(event);
          return false;
        });
      }).then(data => resolve(events))
    });
  }

  getEventsByDate(date: Date) {
    return new Promise((resolve, reject) => {
      let events = [];
      var ref = this.fireDB.database.ref('events').orderByChild("date");
      ref.startAt(date.toISOString()).once("value", data => {
        console.log(data);
        data.forEach(a => {
          let event = a.val();
          event.id = a.key;
          events.push(event);
          return false;
        });
      }).then(data => resolve(events))
    });
  }

  attend_event(event) {
      let events = [];
      return new Promise((resolve, reject) => {
        var ref = this.fireDB.database.ref('events_users');
        ref.child(this.emailshort).once("value",data => {
          data.forEach(a => {
            events.push(a.key);
            return false;
          });
        }).then(data => {
          console.log(events);
            if (events.filter(item => item === event)[0] !== undefined) {
                reject("user has already attend event");
            } else {
                //if it doesn't exist, create a ref'
                this.fireDB.list('/events_users/'+this.emailshort).set(event, "i").then(
                  (data) => {
                      resolve();
                  }
                )
            }
        })
      });
  }

  getInscribedEventsById() {
      return new Promise((resolve, reject) => {
          let events = [];
          this.inscribed_events = [];
          var ref = this.fireDB.database.ref('events_users');
          ref.child(this.emailshort).once("value",data => {
            data.forEach(a => {
              events.push(a.key);
              return false;
            });
          }).then(data => {
            if(events.length > 0){
              console.log(events);
              let current_date = new Date();
              var ref = this.fireDB.database.ref('events').orderByKey();
              events.forEach(item => {
                  console.log(item);
                  ref.equalTo(item).once("value", data => {
                      data.forEach(a => {
                          let event = a.val();
                          event.id = a.key;
                          let event_date = new Date(event.date);
                          console.log(event_date, current_date);
                          if (event_date.getTime() > current_date.getTime() &&
                              this.inscribed_events.filter(item => item.id === event.id).length === 0)
                              this.inscribed_events.push(event);
                          return false;
                      });
                  }).then(data => {
                      console.log(this.inscribed_events);
                      resolve(this.inscribed_events);
                  })
              });
            } else reject();
          });
      });      
  }

  getAsistedEventsById() {
      return new Promise((resolve, reject) => {
          let events = [];
          this.assisted_events = [];
          var ref = this.fireDB.database.ref('events_users');
          ref.child(this.emailshort).once("value",data => {
            data.forEach(a => {
              events.push(a.key);
              return false;
            });
          }).then(data => {
            if(events.length > 0){
              let current_date = new Date();
              var ref = this.fireDB.database.ref('events').orderByKey();
              events.forEach(item => {
                  console.log(item);
                  ref.equalTo(item).once("value", data => {
                      data.forEach(a => {
                          let event = a.val();
                          event.id = a.key;
                          let event_date = new Date(event.date);
                          console.log(event_date, current_date);
                          if (event_date.getTime() <= current_date.getTime() &&
                              this.assisted_events.filter(item => item.id === event.id).length === 0)
                              this.assisted_events.push(event);
                          console.log("events filtered", this.assisted_events);
                          return false;
                      });
                  }).then(data => {
                      console.log(this.assisted_events);
                      resolve(this.assisted_events);
                  })
              });
            }
            else {
              reject();
            } 
          })
      });  
  }

  isAssisted(event) {
      console.log(event, this.assisted_events, this.inscribed_events);
      return new Promise((resolve, reject) => {
          if (this.assisted_events.filter(item => item.id === event.id).length > 0 ||
              this.inscribed_events.filter(item => item.id === event.id).length > 0)
              resolve(true);
          else
              resolve(false);
      })
  }

  //Users
  addUser(fullname:string, phone:number, email:string){
    let user = {"username":fullname,"phone":phone};
    return new Promise( (resolve, reject) => {
      this.fireDB.list('/users/').set(this.emailshort,user).then( data =>{
        console.log(data);
        resolve();
      }).catch( error => {
        console.log(error);
        reject(error);
      });
    });
  }

  updateUser(user:any){
    this.configPro.presentLoading("Actualizando Datos...");
    return new Promise( (resolve, reject) => {
      this.fireDB.list('/users/').set(this.emailshort,user).then( data =>{
        console.log(data);
        this.configPro.dismissLoading();
        this.configPro.presentToast("Datos Actualizados Con Exito");
        resolve();
      }).catch( error => {
        console.log(error);
        this.configPro.dismissLoading();
        this.configPro.presentToast("Error al actualizar datos");
        reject(error);
      });
    });
  }

  uploadImage(){
    //TODO Update Image
  }

  getUserProfile(email:string){
    this.cutEmail(email);
    return new Promise((resolve, reject) => {
      this.fireDB.list('/users/'+this.emailshort).valueChanges().subscribe( data =>{
        this.user.name = data[1];
        this.user.phone = data[0];
        if(data) resolve(data);
        else console.log(data);
      })
    });
  }

  getUser(){
    return this.user;
  }

  cutEmail(email: string){
    this.emailshort = email.split("@")[0];
  }

}
