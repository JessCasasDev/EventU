import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { OwnEventsPage } from '../own-events/own-events';
import { AssistedEventsPage } from '../assisted-events/assisted-events';
import { EventsDetailPage } from '../events-detail/events-detail';
import { CreateEventsPage } from '../create-events/create-events';
import { InscribedEventsPage } from '../inscribed-events/inscribed-events';

@IonicPage()
@Component({
  selector: 'page-my-events',
  templateUrl: 'my-events.html',
})
export class MyEventsPage {

    ownRoot = OwnEventsPage;
    inscribedRoot = InscribedEventsPage;
    assistedRoot = AssistedEventsPage;

  constructor(public navCtrl: NavController, public navParams: NavParams, public eventsPro:Events) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyEventsPage');
    this.eventsPro.subscribe("event:detail", event => {
      this.goToEventDetail(event);
    });
    this.eventsPro.subscribe("event:edit", event => {
      this.eventEdit(event);
    });
  }

  ionViewWillUnload(){
   // this.eventsPro.unsubscribe("event:detail");
   // this.eventsPro.unsubscribe("event:edit");
    console.log("unsubscribe");
  }

  goToEventDetail(event){
    this.navCtrl.push(EventsDetailPage, {'event':event});
  }
  
  eventEdit(event){
    this.navCtrl.push(CreateEventsPage,{"event": event});    
  }
}
