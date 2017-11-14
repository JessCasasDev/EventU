import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { FirebaseProvider } from './../../providers/firebase/firebase';
import { ConfigProvider } from './../../providers/config/config';

@IonicPage()
@Component({
  selector: 'page-update-profile',
  templateUrl: 'update-profile.html',
})
export class UpdateProfilePage {

  user: {name:string, phone:Number,email:string, avatar: String};
  change: boolean;
  changeName: boolean;
  changePhone: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public firePro:FirebaseProvider, public eventsPro: Events) {
    this.user = {name:"", phone:null, email:"", avatar:"assets/img/profiletest.png"};
    this.initializeBooleans();
    this.setUser();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UpdateProfilePage');
  }

  initializeBooleans(){
    this.change = false;
    this.changeName = false;
    this.changePhone = false;
  }

  setUser(){
    let user = this.firePro.getUser();
    this.user.name = user.name;
    this.user.phone = user.phone;
    this.user.email = user.email;
    console.log(this.firePro.getUser());
  }

  updateProfile(){
    let userUpdate = {"username":this.user.name, "phone":this.user.phone};
    this.firePro.updateUser(userUpdate).then( data => {
      this.initializeBooleans();
      this.eventsPro.publish('user:updateProfile',this.user.name);
    });
    console.log(this.user);
  }

  updateName(){
    this.change = true;
    this.changeName = !this.changeName;
  }

  updatePhone(){
    this.change = true;
    this.changePhone = !this.changePhone;
  }

}
