import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NearEventsPage } from './near-events';

@NgModule({
  declarations: [
    NearEventsPage,
  ],
  imports: [
    IonicPageModule.forChild(NearEventsPage),
  ],
})
export class NearEventsPageModule {}
