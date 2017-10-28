import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { LoadingController, ToastController, AlertController } from 'ionic-angular';

@Injectable()
export class ConfigProvider {

  domain: string = "@unal.edu.co";
  loading: any;

  constructor(public http: Http, public toastCtrl: ToastController,
              public loadingCtrl: LoadingController, public alertCtrl: AlertController) {
    console.log('Hello ConfigProvider Provider');
  }


  //Validations
  validateInputs(email, password){
    let pass = this.validateEmail(email);
    if(pass){
      if(!this.validatePassword(password)) {
        pass = false;
        this.presentToast("La contraseña es muy corta o contiene caracteres especiales");
      }
    }
    else this.presentToast("Debe ser un correo @unal");
    return pass;
  }

  validateInputsLogin(email, password){
    let pass = this.validateEmailLogin(email);
    if(pass){
      if(!this.validatePassword(password)) {
        pass = false;
        this.presentToast("La contraseña es muy corta o contiene caracteres especiales");
      }
    }
    else this.presentToast("Debes ingresar un usuario valido");
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

  validateEmailLogin(email){
    let pass = false;
    email = email.replace(/ /g,'');
    email = email.trim();
    email = email.toLowerCase();
    if(email != "") pass = true;
    return pass;
  }

  validatePassword(password){
    let index = password.indexOf(" ");
    let pass = false;
    if(index == -1 && password.length > 5) pass = true;
    return pass;
  }

  validateNoEmpty(entry:string){
    entry = entry.trim();
    if(entry.length > 0) return true;
    else return false;
  }

  validatePhone(number: number){
    if(number == null) return true;
    let phone = number.toString();
    if(!( phone.length == 7 || phone.length == 10 ) ) return false;
    return true;
  }

  validateCoordinates(coordinates: {lat:number, lng:number}){
    if(coordinates.lat == null || coordinates.lng == null) return false;
    else return true;
  }

  validateTime(initTime: Date, endTime: Date) {
      if (endTime < initTime) return false;
      return true;
  }
    
  //Alerts
  presentToast(message){
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

  presentLoading(message){
    this.loading = this.loadingCtrl.create({
      spinner: 'dots',
      content:message
    });

    this.loading.present();
  }

  dismissLoading(){
    this.loading.dismiss();
  }

  presentAlert(message){
    let alert = this.alertCtrl.create({
      title: 'Hola',
      subTitle: message,
      buttons: ['Ok']
    });
    alert.present();
  }
    
}
