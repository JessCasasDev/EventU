import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { FirebaseProvider } from '../../providers/firebase/firebase';

@IonicPage()
@Component({
  selector: 'page-own-events',
  templateUrl: 'own-events.html',
})
export class OwnEventsPage {

  events: any;
  loadingEvents: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public firePro:FirebaseProvider, public eventsPro: Events) {
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
    this.firePro.getEventsById().then( data => {
      this.events = data;
      this.loadingEvents = false;
    }).catch( error => {
      this.loadingEvents = false;
    });
  }

  eventDetail(event){
    console.log(event);
    this.eventsPro.publish('event:detail', event);
  }

}
