import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginPage } from "../login/login"
import { FirebaseProvider } from './../../providers/firebase/firebase';
import { ConfigProvider } from './../../providers/config/config';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  phone: number;
  fullname: string;
  email:string;
  password: string;
  password_repeat:string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public firePro: FirebaseProvider, public configPro: ConfigProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  login(){
    this.navCtrl.setRoot(LoginPage);
  }

  signUp(){
    if(this.userProfile()){
      if(this.configPro.validateInputs(this.email, this.password)){
        this.configPro.presentLoading("Registrando en EventU");
        this.firePro.singUp(this.email, this.password).then(
          data => {
            this.firePro.addUser(this.fullname,this.phone, this.email);
            console.log(data);
            this.login();
            this.configPro.dismissLoading();
          }
        ).catch( data => {
          this.configPro.dismissLoading();
        });
      }
    }
  }

  repeatPassword(): boolean{
    if(this.password == this.password_repeat) return true;
    return false;
  }

  userProfile(): boolean{
    if(this.repeatPassword()){
      if(this.fullname != ""){
        return true;
      } else {
        this.configPro.presentToast("Agrega tu nombre");
        return false;
      }
    } else {
      this.configPro.presentToast("Las contraseñas no coinciden");
      return false;
    }
  }
}
