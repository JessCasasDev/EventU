import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { DatePickerDirective } from 'ion-datepicker';
import { MapEventsPage } from '../map-events/map-events'
import { FirebaseProvider } from '../../providers/firebase/firebase'
import { ConfigProvider } from '../../providers/config/config'
import { GeolocationProvider } from '../../providers/geolocation/geolocation';
import { MyEventsPage } from '../my-events/my-events'
import * as Leaflet from 'leaflet';

@IonicPage()
@Component({
        selector: 'page-create-events',
        providers: [DatePickerDirective],
  templateUrl: 'create-events.html',
})
export class CreateEventsPage {
    @ViewChild(DatePickerDirective) private datePicker: DatePickerDirective;

    name: string;
    description: string;
    date: Date;
    limit = 20;
    newEvent: {name: string, description: string, phone: number, date: string, coordinates: { lat: number, lng:number }};
    mymap: any;
    lat: number;
    lng: number;
    setPosition = true;
    marker = [];

    localeString = {
        monday: true,
        weekdays: ['Lun', 'Mar', 'Miér', 'Jue', 'Vier', 'Sáb', 'Dom'],
        months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
    };

  constructor(public navCtrl: NavController, public navParams: NavParams,
      public firePro: FirebaseProvider, public configPro: ConfigProvider,
      public geoLoc: GeolocationProvider, public alertCtrl: AlertController) {
    this.initialize();
  }

  ionViewDidLoad() {
      console.log('ionViewDidLoad CreateEventsPage');
      this.loadMap();
  }

  initialize() {
      this.lat = this.geoLoc.lat;
      this.lng = this.geoLoc.lng;
    this.date = new Date();
    this.newEvent = {name: "", description: "", phone: null,date: "", coordinates:{lat:null, lng:null}};
  }

  mapEvent(){
    this.navCtrl.push(MapEventsPage)
  }

  showCalendar() {
      this.datePicker.open();
  }

  changeDate(event) {
      this.date = event;
  }

  createEvent(){
    if(this.validateFields()){
        this.newEvent.date = this.date.toISOString();
        let alert = this.alertCtrl.create({
            title: "Confirmar",
            message: "¿Desea crear el evento " + this.newEvent.name + "?",
            buttons: [
                {
                    text: "No",
                    handler: () => {
                        this.setPosition = true;
                        this.removeMarker();
                    }
                }, {
                    text: "Si",
                    handler: () => {
                        if (this.validateFields()) {
                            this.firePro.addEvent(this.newEvent).then((data) =>
                                this.navCtrl.setRoot(MyEventsPage)
                            );
                        }
                          
                    }
                }]
        });
        alert.present();
    }
  }
    
  validateFields(){
    if(!this.configPro.validateNoEmpty(this.newEvent.name)){
      this.configPro.presentToast("Dale un nombre a tu evento no puede ir vacia");
      return false;
    };
    if(!this.configPro.validateNoEmpty(this.newEvent.description)){
      this.configPro.presentToast("La descripción no puede ir vacia");
      return false;
    };
    if(!this.configPro.validatePhone(this.newEvent.phone)){
      this.configPro.presentToast("El número telefonico no es válido");
      return false;
    };
    if(!this.configPro.validateCoordinates(this.newEvent.coordinates)){
      this.configPro.presentToast("Dale una ubicación a tu evento");
      return false;
    };
    return true;
  }

  loadMap() {
      this.mymap = Leaflet.map('mapCreateEvent').setView([this.lat, this.lng], 16);
      Leaflet.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.mymap);
  }

  setEventPosition() {
      this.mymap.on('click', (e) => {
          if (this.setPosition) {
              this.setMarker(e.latlng.lat, e.latlng.lng);
              this.setPosition = false;
          }
              
      });
  }

  setMarker(lat: number, lng: number) {
      this.marker.push(Leaflet.marker([lat, lng]).addTo(this.mymap));
      this.newEvent.coordinates.lat = lat;
      this.newEvent.coordinates.lng = lng;
  }
    
  removeMarker() {
      this.newEvent.coordinates.lat = null;
      this.newEvent.coordinates.lng = null;
      this.marker.forEach(item => this.mymap.removeLayer(item));        
  }
}
