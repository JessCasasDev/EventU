import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateEventsPage } from './create-events';

@NgModule({
  declarations: [
    CreateEventsPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateEventsPage),
  ],
})
export class CreateEventsPageModule {}
