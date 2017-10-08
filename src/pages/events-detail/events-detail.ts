import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as Leaflet from 'leaflet';

@IonicPage()
@Component({
  selector: 'page-events-detail',
  templateUrl: 'events-detail.html',
})
export class EventsDetailPage {

  event: any;
  mymap: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.event = this.navParams.get('event');
    console.log(event);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventsDetailPage');
    this.loadMap();
  }

  loadMap() {
    this.mymap = Leaflet.map('mapDetail').setView([this.event.coordinates.lat, this.event.coordinates.lng], 16);
    Leaflet.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.mymap);
    Leaflet.marker([this.event.coordinates.lat, this.event.coordinates.lng]).addTo(this.mymap);
  }

}
