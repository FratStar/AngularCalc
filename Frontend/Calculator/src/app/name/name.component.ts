import { Component, OnInit } from '@angular/core';
import { NameService } from '../services/name.service';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-name',
  templateUrl: './name.component.html',
  styleUrls: ['./name.component.scss']
})
export class NameComponent implements OnInit {

  constructor(private nameSer: NameService ) { }

  username: string;
  logonform: FormGroup;

  ngOnInit() {
    this.logonform = new FormGroup({
      username: new FormControl(''),
    });
  }

  onSubmit(){
    event.preventDefault();
    this.username = this.logonform.value.username;

    this.nameSer.sendName(this.username);

  }

}
