import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events} from 'ionic-angular';
import { SignupPage } from "../signup/signup"
import { NearEventsPage } from "../near-events/near-events"
import { FirebaseProvider } from './../../providers/firebase/firebase';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  email:String;
  password:String;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public events: Events, public firePro: FirebaseProvider) {
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
    if(!this.validateInputs()) return;
    if(this.authUser()) this.navCtrl.setRoot(NearEventsPage);
  }

  validateInputs(){
    let pass = false;
    let index = this.email.indexOf("@");
    this.email = this.email.replace(/ /g,'');
    this.email = this.email.trim();
    this.email = this.email.toLowerCase();

    this.password = this.password.replace(/ /g,'');
    this.password = this.password.trim();

    if(this.email != "" && this.password != "" && index != -1){
      if(this.email.substring(index, this.email.length) == "@unal.edu.co") pass = true;
      else /* todo*/ pass = false;
    }
    return pass;
  }

  authUser(){
    /*this.firePro.login(this.email, this.password).then(
      data => {console.log(data)}
    );*/
    this.events.publish('user:login',"Nombre Apellido","url imagen");
    return true;
  }
}
