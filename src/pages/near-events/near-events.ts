import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GeolocationProvider } from '../../providers/geolocation/geolocation';
import { DatePickerDirective } from 'ion-datepicker';
import { FirebaseProvider } from './../../providers/firebase/firebase';
import * as Leaflet from 'leaflet';

@IonicPage()
@Component({
        selector: 'page-near-events',
        providers: [DatePickerDirective],
  templateUrl: 'near-events.html',
})
export class NearEventsPage {
    @ViewChild(DatePickerDirective) private datePicker: DatePickerDirective;

  mymap: any;
  lat: number;
  lng: number;
  date: Date;
  localeString = {
      monday: true,
      weekdays: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
      months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  };

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public geoLoc: GeolocationProvider, public firePro: FirebaseProvider) {
      this.initialize();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NearEventsPage');
    this.loadMap();
  }

  initialize(){
    this.lat = this.geoLoc.lat;
    this.lng = this.geoLoc.lng;
    this.date = new Date();
  }

  loadMap() {
    this.mymap = Leaflet.map('mapEvent').setView([this.lat, this.lng], 16);
    Leaflet.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.mymap);
  }

  showCalendar() {
      this.datePicker.open();
  }

  changeDate(event) {
      this.date = event;
  }

  getEvent(){
      this.firePro.getEvents();
  }
}
