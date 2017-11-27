import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FirebaseProvider } from './../../providers/firebase/firebase';
import { ConfigProvider } from '../../providers/config/config';
import * as Leaflet from 'leaflet';

@IonicPage()
@Component({
  selector: 'page-events-detail',
  templateUrl: 'events-detail.html',
})
export class EventsDetailPage {

  event: any;
  mymap: any;
  is_assisted = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public configPro: ConfigProvider,
      public firePro: FirebaseProvider) {
    this.event = this.navParams.get('event');
    console.log(event);
    this.isAssisted();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventsDetailPage');
    this.loadMap();
  }

  ionViewCanLeave() {
      document.getElementById("mapDetail").outerHTML = "";
  }

  loadMap() {
    this.mymap = Leaflet.map('mapDetail').setView([this.event.coordinates.lat, this.event.coordinates.lng], 16);
    Leaflet.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.mymap);
    Leaflet.marker([this.event.coordinates.lat, this.event.coordinates.lng]).addTo(this.mymap);
  }

  attend_event() {
      this.firePro.attend_event(this.event.id).then(res => {
          console.log(res);
          if (res) {
              this.configPro.presentToast("Irás al evento " + this.event.name);
          }
          else {
              console.log(res)
          }
      }).catch(err => {
          console.log(err)
          this.configPro.presentToast("El evento " + this.event.name + " ya esta en tu lista");
      });
  }

  isAssisted() {
      this.firePro.isAssisted(this.event).then( (result : any) => {
          this.is_assisted = result;
      }).catch(err => console.log(err));
  }

  goToExternalMap(){
      //just work on Android
    let label = encodeURI('Eventu');
    window.open('geo:0,0?q=' + 
    this.event.coordinates.lat + "," + 
    this.event.coordinates.lng + '(' + label + ')', '_system');
  }


}
