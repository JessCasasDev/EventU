import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FirebaseProvider } from '../../providers/firebase/firebase'

@IonicPage()
@Component({
  selector: 'page-own-events',
  templateUrl: 'own-events.html',
})
export class OwnEventsPage {

  events: any;
  loadingEvents: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, public firePro:FirebaseProvider) {
    this.initialize();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OwnEventsPage');
    this.getOwnEvents();
  }
  initialize(){
    this.events = [];
    this.loadingEvents = true;
  }

  getOwnEvents(){
    this.firePro.getEvents().then( data => {
      console.log(data);
      this.events = data;
      this.loadingEvents = false;
    }).catch( error => {
      this.loadingEvents = false;
    });
  }

}
