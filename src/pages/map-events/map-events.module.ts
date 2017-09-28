import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MapEventsPage } from './map-events';

@NgModule({
  declarations: [
    MapEventsPage,
  ],
  imports: [
    IonicPageModule.forChild(MapEventsPage),
  ],
})
export class MapEventsPageModule {}
