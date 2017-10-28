import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { DatePickerDirective } from 'ion-datepicker';
import { FirebaseProvider } from '../../providers/firebase/firebase'
import { ConfigProvider } from '../../providers/config/config'
import { GeolocationProvider } from '../../providers/geolocation/geolocation';
import { MyEventsPage } from '../my-events/my-events'
import 'leaflet';

declare let L: any;

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
    begin_time: Date;
    end_time: Date;
    limit = 20;
    newEvent: {
        name: string, description: string, phone: number, date: string, begin_time: string,
        end_time: string, coordinates: { lat: number, lng: number },  type: any
    };
    mymap: any;
    lat: number;
    lng: number;
    marker = [];
    updating: boolean;


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
      if(this.updating) this.setMarker(this.newEvent.coordinates.lat,this.newEvent.coordinates.lng);
  }

  ionViewCanLeave() {
      console.log("ionViewCanLeave")
      document.getElementById("mapCreateEvent").outerHTML = "";
  }

  initialize() {
    this.lat = this.geoLoc.lat;
    this.lng = this.geoLoc.lng;
    this.date = new Date();
    if(this.navParams.data.event != null){
        this.newEvent = this.navParams.data.event;
        this.updating = true;
        console.log(this.newEvent);
        this.lat = this.newEvent.coordinates.lat;
        this.lng = this.newEvent.coordinates.lng;
    }
    else {
        this.updating = false;
        this.newEvent = {
            name: "", description: "", phone: null, date: "", begin_time: "", end_time: "", coordinates: { lat: null, lng: null },
            type: [ { name: "Deportivo", value: false }, { name: "Academico", value: false },
                    { name: "Cultural", value: false }, { name: "Ocio", value: false }, { name: "Informativo", value: false }
                ]
        };
    }
  }
    
  showCalendar() {
      this.datePicker.open();
  }

  changeDate(event) {
      this.date = event;
  }

  createEvent(){
      if (this.validateFields()) {
        this.newEvent.date = this.date.toISOString();
        let alert = this.alertCtrl.create({
            title: "Confirmar",
            message: "¿Desea crear el evento " + this.newEvent.name + "?",
            buttons: [
                {
                    text: "No",
                    handler: () => {
                        //do nothing
                    }
                }, {
                    text: "Si",
                    handler: () => {
                        if (this.validateFields()) {
                            console.log(this.newEvent);
                            this.firePro.addEvent(this.newEvent).then((data) =>{
                                this.navCtrl.setRoot(MyEventsPage)
                            }
                            );
                        }
                          
                    }
                }]
        });
        alert.present();
    }
  }

  updateEvent(){
    if (this.validateFields()) {
      this.newEvent.date = this.date.toISOString();
      let alert = this.alertCtrl.create({
          title: "Confirmar",
          message: "¿Deseeas actualizar el evento " + this.newEvent.name + "?",
          buttons: [
              {
                  text: "No",
                  handler: () => {
                      //do nothing
                  }
              }, {
                  text: "Si",
                  handler: () => {
                      if (this.validateFields()) {
                          console.log(this.newEvent);
                          this.firePro.updateEvent(this.newEvent).then((data) =>{
                              this.configPro.presentToast("Evento actualizado con exito");
                              this.navCtrl.pop();
                          }
                          );
                      }
                  }
              }]
      });
      alert.present();
  }
}
    
  validateFields() {
    if(!this.configPro.validateNoEmpty(this.newEvent.name)){
      this.configPro.presentToast("Dale un nombre a tu evento, no puede ir vacio");
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
    if (!this.configPro.validateTime(this.begin_time, this.end_time)) {
        this.configPro.presentToast("La hora final debe ser mayor a la actual");
        return false;
    }
    return true;
  }


  loadMap() {
      this.mymap = L.map('mapCreateEvent').setView([this.lat, this.lng], 16);
      L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.mymap);
  }
   

  setEventPosition() {
      this.mymap.on('click', (e) => {
          console.log(this.marker)
          if (this.marker !== undefined || this.marker === null) {
              this.removeMarker();
          }
          this.setMarker(e.latlng.lat, e.latlng.lng);
      });
  }

  setMarker(lat: number, lng: number) {
      console.log(lat,lng);
      this.marker.push(L.marker([lat, lng]).addTo(this.mymap));
      this.newEvent.coordinates.lat = lat;
      this.newEvent.coordinates.lng = lng;
  }
    
  removeMarker() {
      this.newEvent.coordinates.lat = null;
      this.newEvent.coordinates.lng = null;
      this.marker.forEach(item => this.mymap.removeLayer(item));
      if (this.marker.length > 0)
        this.marker.pop();
  }
}
