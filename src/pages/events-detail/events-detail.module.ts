import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventsDetailPage } from './events-detail';

@NgModule({
  declarations: [
    EventsDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(EventsDetailPage),
  ],
})
export class EventsDetailPageModule {}
