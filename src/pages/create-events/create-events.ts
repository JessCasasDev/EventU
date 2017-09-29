import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatePickerDirective } from 'ion-datepicker';
import { MapEventsPage } from '../map-events/map-events'

@IonicPage()
@Component({
        selector: 'page-create-events',
        providers: [DatePickerDirective],
  templateUrl: 'create-events.html',
})
export class CreateEventsPage {
    @ViewChild(DatePickerDirective) private datePicker: DatePickerDirective;

    description: string;
    date: Date;
    localeString = {
        monday: true,
        weekdays: ['Lun', 'Mar', 'Miér', 'Jue', 'Vier', 'Sáb', 'Dom'],
        months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
    };

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.initialize();

    this.test();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateEventsPage');
  }

  initialize(){
      this.description = "";
      this.date = new Date();
  }

  test(){
    this.description = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
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
}
