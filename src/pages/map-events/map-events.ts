import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GeolocationProvider } from '../../providers/geolocation/geolocation';
import * as Leaflet from 'leaflet';

@IonicPage()
@Component({
        selector: 'page-map-events',
  templateUrl: 'map-events.html',
})
export class MapEventsPage {

  mymap: any;
  lat: number;
  lng: number;

  constructor(public navCtrl: NavController, public navParams: NavParams, public geoLoc: GeolocationProvider) {
      this.initialize();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapEventsPage');
    this.loadMap();
  }

  initialize(){
    this.lat = this.geoLoc.lat;
    this.lng = this.geoLoc.lng;
  }

  loadMap() {
    this.mymap = Leaflet.map('mapEvent').setView([this.lat, this.lng], 16);
    Leaflet.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.mymap);
  }
}
