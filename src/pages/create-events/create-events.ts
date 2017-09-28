import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MapEventsPage } from '../map-events/map-events'

@IonicPage()
@Component({
  selector: 'page-create-events',
  templateUrl: 'create-events.html',
})
export class CreateEventsPage {
  description:string;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.initialize();

    this.test();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateEventsPage');
  }

  initialize(){
    this.description = "";
  }

  test(){
    this.description = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
  }

  mapEvent(){
    this.navCtrl.push(MapEventsPage)
  }
}
