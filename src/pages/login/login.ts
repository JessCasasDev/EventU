import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events} from 'ionic-angular';
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
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public events: Events, public firePro: FirebaseProvider,
              public configPro: ConfigProvider) {
    this.initialize();
  }

  initialize(){
    this.email = "";
    this.password = "";
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  signup(){
    this.navCtrl.setRoot(SignupPage);
  }

  login(){
    if(this.configPro.validateInputs(this.email, this.password)) this.authUser();
  }


  authUser(){
    this.firePro.login(this.email, this.password).then(
      (data) => {
        this.user = data;
        this.events.publish('user:login',this.user.uid,this.user.email,"url imagen");
        this.navCtrl.setRoot(NearEventsPage);
      }
    );
  }
}
