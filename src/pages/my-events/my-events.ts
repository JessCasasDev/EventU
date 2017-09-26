import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { OwnEventsPage } from '../own-events/own-events';
import { AssistedEventsPage } from '../assisted-events/assisted-events';

@IonicPage()
@Component({
  selector: 'page-my-events',
  templateUrl: 'my-events.html',
})
export class MyEventsPage {

  ownRoot = OwnEventsPage;
  assistedRoot = AssistedEventsPage;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyEventsPage');
  }

}
