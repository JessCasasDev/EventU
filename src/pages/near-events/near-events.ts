import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GeolocationProvider } from '../../providers/geolocation/geolocation';
import { ConfigProvider } from '../../providers/config/config';
import { DatePickerDirective } from 'ion-datepicker';
import { FirebaseProvider } from './../../providers/firebase/firebase';
import { EventsDetailPage } from '../events-detail/events-detail';
import 'leaflet';
import 'leaflet.markercluster';
import 'leaflet.featuregroup.subgroup';
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
  control: any;

  sport_layers: any;
  academic_layers: any;
  ocio_layers: any;
  cultural_layers: any;
  informative_layers: any;
  all_markers_layer: any;


  localeString = {
      monday: true,
      weekdays: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
      months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, public configPro: ConfigProvider,
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
    this.configPro.dismissLoading();
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
              this.configPro.presentToast("No se encontraron Eventos en la semana");
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
      if (this.control) {
          this.mymap.removeControl(this.control);
          this.control = L.control.layers(null, null);
      }
      
      this.markers.addTo(this.mymap);

      this.academic_layers = L.featureGroup.subGroup(this.markers);
      this.sport_layers = L.featureGroup.subGroup(this.markers);
      this.cultural_layers = L.featureGroup.subGroup(this.markers);
      this.ocio_layers = L.featureGroup.subGroup(this.markers);
      this.informative_layers = L.featureGroup.subGroup(this.markers);
      this.all_markers_layer = L.featureGroup.subGroup(this.markers);

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
                  "<ion-row justify-content-center><ion-col col-6>"+
                  "<button class='button button-md button-default button-default-md btnAccept' onClick=\"" +
                  "document.getElementById('eventId1').value='" + event.id + "'; " +
                  "document.getElementById('eventId1').click();" +
                  "\">Ver Detalle</button></ion-col>" +
                  "<ion-col col-6><button class='button button-md button-default button-default-md btnPlus' onClick=\"" +
                  "document.getElementById('eventId2').value='" + event.id + "'; " +
                  "document.getElementById('eventId2').click();" +
                  "\">Asistir</button></ion-col>"+
                  "</ion-row>");

          });
          for (let i of event.type) {
              if (i.name === "Deportivo" && i.value) {
                  marker.addTo(this.sport_layers);
              }
              if (i.name === "Academico" && i.value) {
                  marker.addTo(this.academic_layers);
              }
              if (i.name === "Cultural" && i.value) {
                  marker.addTo(this.cultural_layers);
              }
              if (i.name === "Ocio" && i.value) {
                  marker.addTo(this.ocio_layers);
              }
              if (i.name === "Informativo" && i.value) {
                  marker.addTo(this.informative_layers);
              }
          }
          marker.addTo(this.all_markers_layer);

          var overlayMaps = {
              "Deportivo": this.sport_layers,
              "Academico": this.academic_layers,
              "Cultural": this.cultural_layers,
              "Ocio": this.ocio_layers,
              "Informativo": this.informative_layers,
              "Todos": this.all_markers_layer
          };

      }
      /*let control = L.control.layers(null, null, { collapsed: true });
      
      control.addOverlay(this.sport_layers, 'Deportivo');
      control.addOverlay(this.academic_layers, 'Academico');
      control.addOverlay(this.cultural_layers, 'Cultural');
      control.addOverlay(this.ocio_layers, 'Ocio');
      control.addOverlay(this.informative_layers, 'Informativo');
      control.addTo(this.mymap);*/

      L.control.layers(overlayMaps).addTo(this.mymap);

      this.academic_layers.addTo(this.mymap);
      this.sport_layers.addTo(this.mymap);
      this.cultural_layers.addTo(this.mymap);
      this.ocio_layers.addTo(this.mymap);
      this.informative_layers.addTo(this.mymap);
      this.all_markers_layer.addTo(this.mymap);
     
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
      this.removeIcons();
      this.date.setHours(0, 0, 0, 0); //It is going to show all the events by date, no matter hours
      let futureDate = new Date();
      futureDate.setDate(event.getDate() );
      futureDate.setMonth(event.getMonth());
      futureDate.setFullYear(event.getFullYear());
      futureDate.setHours(23);
      this.firePro.getEventsByDates(this.date, futureDate).then((result: any) => {
          console.log(result);
          if (result.length !== 0) {
              this.events = result;
              //Inside the method in order to get the list full before the loadIcons call
              this.loadIcons();
          }
          else {
              this.configPro.presentToast("No se encontraron Eventos en este día");
          }

      }).catch(err => { console.log(err) })
  }

  getEvent(){
      this.firePro.getEvents();
  }

  removeIcons() {
      this.mymap.removeLayer(this.markers);
  }

  attend_event(event) {
      this.firePro.attend_event(event).then(res => {
          this.configPro.presentToast("Irás al evento " + this.events.filter(item => item.id === event)[0].name);
      }).catch(err => {
          console.log(err)
          this.configPro.presentToast("El evento " + this.events.filter(item => item.id === event)[0].name + " ya esta en tu lista");
      });
  }
}
