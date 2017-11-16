import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { ConfigProvider } from '../../providers/config/config';

@IonicPage()
@Component({
  selector: 'page-assisted-events',
  templateUrl: 'assisted-events.html',
})
export class AssistedEventsPage {
    events: any;
    loadingEvents: boolean;
    constructor(public navCtrl: NavController, public navParams: NavParams, public firePro: FirebaseProvider, public eventsPro: Events, ) {
        this.initialize();
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad OwnEventsPage');
        this.getAsistedEvents();
    }

    getAsistedEvents() {
        this.firePro.getAsistedEventsById().then(data => {
            this.events = data;
            this.loadingEvents = false;
        }).catch(error => {
            this.loadingEvents = false;
        });
    }

    initialize() {
        this.events = [];
        this.loadingEvents = true;
    }

    eventDetail(event) {
        console.log(event);
        this.eventsPro.publish("event:detail", event);
    }
  
}
