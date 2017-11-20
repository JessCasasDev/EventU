import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, AlertController } from 'ionic-angular';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { ConfigProvider } from '../../providers/config/config';

@IonicPage()
@Component({
  selector: 'page-own-events',
  templateUrl: 'own-events.html',
})
export class OwnEventsPage {

  events: any;
  loadingEvents: boolean;
  today: Date;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public firePro: FirebaseProvider, public eventsPro: Events,
              public configPro:ConfigProvider, public alertCtrl: AlertController) {
    this.initialize();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OwnEventsPage');
    this.getOwnEvents();
  }
  initialize(){
    this.events = [];
    this.today = new Date();
    this.loadingEvents = true;
  }

  getOwnEvents(){
    this.firePro.getEventsById().then( data => {
      this.events = data;
      this.loadingEvents = false;
      this.validateEvents();
    }).catch( error => {
      this.loadingEvents = false;
    });
  }

  eventDetail(event){
    console.log(event);
    this.eventsPro.publish('event:detail', event);
  }

  eventDelete(event){
    let prompt = this.alertCtrl.create({
      title: 'Borrar Evento',
      message: "Estas seguro de borrar el evento " + event.name,
      buttons: [
        {
          text: 'Si',
          handler: data => {
            this.delete(event);
          }
        },
        {
          text: 'No',
          handler: data => {
            console.log('Cancel');
          }
        }
      ]
    });
    prompt.present();
  }

  delete(event){
    this.firePro.deleteEvent(event).then(data => {
      this.getOwnEvents();
    });
  }

  eventEdit(event){
    this.eventsPro.publish('event:edit', event);
  }


  validateEvents(){
    this.events.forEach(element => {
      element.editable = this.validateTime(element);
    });
    console.log(this.events)
  }

  validateTime(event){
    console.log(event);
    this.today = new Date();
    let todayDate = this.today.toLocaleDateString();
    let todayTime = this.today.toLocaleTimeString();
    if(new Date(event.date).toLocaleDateString().split("T")[0] > todayDate) return true;
    else if(new Date(event.date).toLocaleDateString().split("T")[0] == todayDate ) {
        if(event.begin_time > todayTime || event.end_time > todayTime) return true;
        else return false;
    } else return false;
  }
}
