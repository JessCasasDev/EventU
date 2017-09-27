import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as Leaflet from 'leaflet';


@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {

    mymap: any;
    lat = 4.6381938; //Position Example 
    lng = -74.0862351; //Geoposition of the University

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
      console.log('ionViewDidLoad MapPage');
      this.loadMap();
  }

  loadMap() {
      this.mymap = Leaflet.map('mapEvent').setView([this.lat, this.lng], 16);
      Leaflet.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.mymap);
  }

}
