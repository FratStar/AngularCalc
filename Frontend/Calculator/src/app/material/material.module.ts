import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule}  from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

const modules = [
  MatButtonModule,
  MatInputModule,
  MatFormFieldModule
]


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    modules
  ],
  exports: [modules]
})
export class MaterialModule { }
