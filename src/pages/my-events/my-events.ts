import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { OwnEventsPage } from '../own-events/own-events';
import { AssistedEventsPage } from '../assisted-events/assisted-events';
import { EventsDetailPage } from '../events-detail/events-detail';

@IonicPage()
@Component({
  selector: 'page-my-events',
  templateUrl: 'my-events.html',
})
export class MyEventsPage {

  ownRoot = OwnEventsPage;
  assistedRoot = AssistedEventsPage;

  constructor(public navCtrl: NavController, public navParams: NavParams, public eventsPro:Events) {
    this.eventsPro.subscribe("event:detail", event => {
      this.goToEventDetail(event);
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyEventsPage');
  }

  goToEventDetail(event){
    this.navCtrl.push(EventsDetailPage, {'event':event});
  }

}
