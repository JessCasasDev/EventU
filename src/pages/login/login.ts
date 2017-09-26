import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SignupPage } from "../signup/signup"
import { NearEventsPage } from "../near-events/near-events"

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  email:String;
  password:String;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
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
    if(this.email == "") return;
    if(this.password == "") return;
    if(this.authUser()) this.navCtrl.setRoot(NearEventsPage);
  }

  authUser(){
    /* TO - DO */
    return true;
  }
}
