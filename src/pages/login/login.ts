import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, AlertController} from 'ionic-angular';
import { SignupPage } from "../signup/signup"
import { NearEventsPage } from "../near-events/near-events"
import { FirebaseProvider } from './../../providers/firebase/firebase';
import { ConfigProvider } from './../../providers/config/config';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  email:String;
  password:String;
  user: any = [];
  validationTime: Date;
  countClock: boolean;
  count: number;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public eventsPro: Events, public firePro: FirebaseProvider,
              public configPro: ConfigProvider, public alertCtrl: AlertController) {
    this.initialize();
    //this.firePro.setTimeValidation();
    //this.firePro.resetTimeValidation();
  }

  initialize(){
    this.email = "";
    this.password = "";
    this.countClock = false;
    this.firePro.getTimeValidation().then( data => {
      let date: any;
      date = data;
      console.log(date);
      if(!data) this.validateSession();
      else this.lockLogin(date);
    });
  }

  lockLogin(date){
    this.countClock = true;
    this.count = 0;
    this.validationTime = new Date(date);
    this.validateTime();
  }

  validateTime(){
    this.firePro.getTimes().then( data => {
      let times:any;
      times = data;
      let limit = 60 * times;
      let i = 0;
      let inter = setInterval( todo => {
        i = (new Date().getTime() - this.validationTime.getTime())/1000;
        this.count = Math.round(limit - i);
        if( this.count <= 0){
          this.countClock = false;
          clearInterval(inter);
        } 
      }, 1000);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  validateSession(){
    this.configPro.presentLoading("validando credenciales");
    this.firePro.validateSession().then(
      (data) => {
        console.log(data);
        this.user = data;
        if(this.user.emailVerified){
          this.firePro.getUserProfile(this.user.email).then( user => {
            this.firePro.resetTimeValidation().then( data =>{
              this.eventsPro.publish('user:login',this.user.uid, user[1],"url imagen");
              this.navCtrl.setRoot(NearEventsPage);
            });
          });
        } else {
          this.configPro.presentToast("Debes Validar tu correo primero");
          this.configPro.dismissLoading();
        }
      }
    ).catch( error => {
      console.log("No se ha podido obtener credenciales");
      this.configPro.dismissLoading();
    });
  }

  signup(){
    this.navCtrl.setRoot(SignupPage);
  }

  login(){
    this.configPro.presentLoading("Validando Credenciales");
    if(this.configPro.validateInputsLogin(this.email, this.password)) this.authUser();
    else this.configPro.dismissLoading();
  }

  authUser(){
    this.firePro.login(this.email + this.configPro.domain, this.password).then(
      (data) => {
        console.log(data);
        this.user = data;
        this.firePro.resetTimeValidation().then( data =>{
          this.eventsPro.publish('user:login',this.user.uid,this.user.email,"url imagen");
          this.navCtrl.setRoot(NearEventsPage);
        });
      }
    ).catch( error => {
      console.log(error);
      if(error == "auth/too-many-requests"){
        this.firePro.setTimeValidation().then( data => {
          let t: any;
          t = data;
          this.lockLogin(t.time);
        })
      }
      this.configPro.dismissLoading();
    });
  }

  passwordReset(){
    let prompt = this.alertCtrl.create({
      title: 'Recuperar Contraseña',
      message: "Confirma tu correo para enviar la contraseña",
      inputs: [
        {
          name: 'email',
          placeholder: 'Correo'
        },
      ],
      buttons: [
        {
          text: 'Enviar',
          handler: data => {
            if(!this.configPro.validateEmail(data.email)){
              this.configPro.presentToast("Correo incorrecto");
            }else{
              this.firePro.resetPassword(data.email).then(data => {
                this.configPro.presentToast("Se ha enviado un correo para recperar tu contraseña");
              }).catch( error => {
                this.configPro.presentToast("")
              });
            }
            console.log(data);
          }
        },
        {
          text: 'Cancelar',
          handler: data => {
            console.log('Cancel');
          }
        }
      ]
    });
    prompt.present();
  }
}
