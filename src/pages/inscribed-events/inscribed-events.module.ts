import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InscribedEventsPage } from './inscribed-events';

@NgModule({
  declarations: [
    InscribedEventsPage,
  ],
  imports: [
    IonicPageModule.forChild(InscribedEventsPage),
  ],
})
export class InscribedEventsPageModule {}
