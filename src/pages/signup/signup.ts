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

  email:string;
  password: string;

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
    if(this.configPro.validateInputs(this.email, this.password)){
      this.configPro.presentLoading("Registrando en EventU");
      this.firePro.singUp(this.email, this.password).then(
        data => {
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
