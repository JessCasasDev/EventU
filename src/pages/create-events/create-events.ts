import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatePickerDirective } from 'ion-datepicker';
import { MapEventsPage } from '../map-events/map-events'
import { FirebaseProvider } from '../../providers/firebase/firebase'
import { ConfigProvider } from '../../providers/config/config'

import { MyEventsPage } from '../my-events/my-events'

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

    localeString = {
        monday: true,
        weekdays: ['Lun', 'Mar', 'Miér', 'Jue', 'Vier', 'Sáb', 'Dom'],
        months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
    };

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public firePro: FirebaseProvider, public configPro: ConfigProvider) {
    this.initialize();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateEventsPage');
  }

  initialize(){
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
      this.firePro.addEvent(this.newEvent).then( (data) =>
        this.navCtrl.setRoot(MyEventsPage)
      );
    }
  }

  validateFields(){
    if(!this.configPro.validateNoEmpty(this.newEvent.name)){
      this.configPro.presentToast("Dale un nombre a tu evento no puede ir vacia");
      return false;
    };
    if(!this.configPro.validateNoEmpty(this.newEvent.description)){
      this.configPro.presentToast("La descripcion no puede ir vacia");
      return false;
    };
    if(!this.configPro.validatePhone(this.newEvent.phone)){
      this.configPro.presentToast("El numero telefonico no es valido");
      return false;
    };
    if(!this.configPro.validateCoordinates(this.newEvent.coordinates)){
      this.configPro.presentToast("Dale una ubicacion a tu evento");
      return false;
    };
    return true;
  }
}
