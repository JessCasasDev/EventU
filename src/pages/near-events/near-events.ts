import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GeolocationProvider } from '../../providers/geolocation/geolocation';
import { ConfigProvider } from '../../providers/config/config';
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

  constructor(public navCtrl: NavController, public navParams: NavParams, public configProvider: ConfigProvider,
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
      this.date.setHours(0,0,0,0); //It is going to show all the events by date, no matter hours
      let futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7) // 7 Days more
      console.log(this.date, futureDate);
      this.firePro.getEventsByDates(this.date, futureDate).then( (result : any) => {
          console.log(result);
          if (result.length !== 0) {
              this.events = result;
              //Inside the method in order to get the list full before the loadIcons call
              this.loadIcons();
          }
          else {
              this.configProvider.presentToast("No se encontraron Eventos, por favor revisa tu conexión a internet");
          }
          
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
          let marker = L.marker(event.coordinates).on('click', (e) => {
              marker.bindPopup(popup);
              popup.setContent(
                  "<p class='event-title'>" + event.name + "</p><p class='event-date'> " +
                  moment(event.date).locale('es').format("dddd, DD MMMM, YYYY") +
                  "</p><p class='time-date'>Hora: " + event.begin_time + "-" + event.end_time + "</p>" +
                  "<p class='event-description'> " +
                  (event.description.lenght > 6 ? event.description.substring(6) + "..." : event.description)
                  + "</p>" +
                  "<ion-row justify-content-center><button class='button button-md button-default button-default-md btnAccept' onClick=\"" +
                  "document.getElementById('eventId1').value='" + event.id + "'; " +
                  "document.getElementById('eventId1').click();" +
                  "\">Ver Detalle</button></ion-row>");
              
          });
          this.markers.addLayer(marker);
      }    
      this.mymap.addLayer(this.markers);
  }

  open(event) {
      event.target.marker.openPopup();
  }

  goToEventDetail(event) {
      this.firePro.getEventByName(event).then(result => {
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
