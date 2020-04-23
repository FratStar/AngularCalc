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
  NameState: string;

  ngOnInit() {
    this.logonform = new FormGroup({
      username: new FormControl(''),
    });
    console.log(localStorage.getItem("access_token"));
    if (this.nameSer.isLoggedIn()){
      this.NameState = localStorage.getItem("user")
    }
  }

  onSubmit(){
    //event.preventDefault();
    this.username = this.logonform.value.username;


    if (this.nameSer.isLoggedIn() && this.username != this.NameState && this.username){
      console.log(this.nameSer.isLoggedIn())
      this.nameSer.logout();
      console.log(this.nameSer.isLoggedOut())
      localStorage.setItem("user", this.username)
      this.nameSer.sendName(this.username);
      console.log(localStorage.getItem("access_token"));
      this.NameState = localStorage.getItem("user");
      this.ImReady();


    }

    else if ( !this.username  && this.nameSer.isLoggedIn()){

     this.ImReady();

    }

    else if (this.nameSer.isLoggedOut()) {
      localStorage.setItem("user", this.username)
      this.nameSer.sendName(this.username);
      console.log(localStorage.getItem("access_token"));
      this.NameState = localStorage.getItem("user")
      this.ImReady()
    }
  }

  ImReady(){
    this.nameSer.fetchReady(this.NameState);
  }

}
