import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GeolocationProvider } from '../../providers/geolocation/geolocation';
import { DatePickerDirective } from 'ion-datepicker';
import { FirebaseProvider } from './../../providers/firebase/firebase';
import { EventsDetailPage } from '../events-detail/events-detail';
import 'leaflet';
import 'leaflet.markercluster';
import * as moment from 'moment';

declare let L: any;

@IonicPage()
@Component({
        selector: 'page-near-events',
        providers: [DatePickerDirective],
  templateUrl: 'near-events.html',
})
export class NearEventsPage {
    @ViewChild(DatePickerDirective) private datePicker: DatePickerDirective;
    events: any;
  mymap: any;
  lat: number;
  lng: number;
  date: Date;
  markers: any;

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
    this.showEvents();
  }

  initialize(){
    this.lat = this.geoLoc.lat;
    this.lng = this.geoLoc.lng;
    this.date = new Date();
  }

  showEvents() {
      this.date.setHours(0,0,0,0); //Change if we are going to set the hpurs
      let futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 5) // 5 Days more
      console.log(this.date, futureDate);
      this.firePro.getEventsByDates(this.date, futureDate).then(result => {
          this.events = result;
          console.log(result);
          //Inside the method in order to get the list full before the loadIcons call
          this.loadIcons();
      }).catch(err => { console.log(err) })
  }

  loadMap() {
    this.mymap = L.map('mapEvent').setView([this.lat, this.lng], 16);
    L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.mymap);
  }

  loadIcons() {
      this.markers = L.markerClusterGroup();
      let popup = L.popup();
       
      for (let event of this.events) {
          console.log(event.id);
          let marker = L.marker(event.coordinates).on('click', (e) => {
              marker.bindPopup(popup);
              popup.setContent(
                  "<p class='event-title'>" + event.name + "</p><p class='event-date'> " +
                  moment(event.date).locale('es').format("dddd, DD MMMM, YYYY, h:mm a") +
                  "</p><p class='event-description'>" +
                  (event.description.lenght > 6 ? event.description.substring(6) + "..." : event.description)
                  + "</p>" +
                  "<button class='button button-md button-default button-default-md btnAccept' onClick=\"" +
                  "document.getElementById('eventId1').value='" + event.name + "'; " +
                  "document.getElementById('eventId1').click();" +
                  "\">Ver Detalle</button>");
              marker.openPopup();
              
          });
          this.markers.addLayer(marker);
      }    
      this.mymap.addLayer(this.markers);
  }

  goToEventDetail(event) {
      this.firePro.getEventByName(event).then(result => {
          console.log(result);
          if (result[0]) {
              this.navCtrl.push(EventsDetailPage, { 'event': result[0] });
          }
      }).catch(err => { console.log(err)})
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
