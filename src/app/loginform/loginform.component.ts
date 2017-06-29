import { Router } from "@angular/router";
import { routing } from './../app.routes';
import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl ,FormGroup, Validators} from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-loginform',
  templateUrl: './loginform.component.html',
  styleUrls: ['./loginform.component.css']
})
export class LoginformComponent implements OnInit {
  username = new FormControl('')
  password = new FormControl('')
  private spinner_value:Number; 

  value = 50;
  bufferValue = 75;
  
  loginForm: FormGroup = this.builder.group({
    username: this.username,
    password: this.password
  });

  constructor (private builder: FormBuilder,private router: Router) { }

  login() {
    console.log(this.loginForm.value);
    // Attempt Logging in...
  }
  doSignUp(){
    this.router.navigate(['/signup']);;
  }
  ngOnInit() {
  }
 }
