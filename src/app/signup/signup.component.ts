import { ApiManager } from './../Common/api-manager.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl ,FormGroup, Validators} from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MdDialog, MdDialogRef} from '@angular/material';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  constructor(private builder: FormBuilder,private router: Router ,private apiManger : ApiManager ,public dialog: MdDialog) {
    console.log("In the signup comoonent");
   }
  name = new FormControl('')
  password = new FormControl('')
  email = new FormControl('')
  phone = new FormControl('')

  signupForm: FormGroup = this.builder.group({
    name: this.name,
    password: this.password,
    email : this.email,
    phone : this.phone
  });
  ngOnInit() {
    console.log("In the signup component ");
  }
  signup(model){
    let userInfo : any = {};
    userInfo.email = model.value.email;
    userInfo.name = model.value.name;
    userInfo.phone = model.value.phone;
    userInfo.password = model.value.password;
    this.apiManger.fireSignupService('otp','generateOTP',userInfo).subscribe(res => {
      console.log(res);
      if(res.success){
          //this.openDialog();
          this.router.navigate(['otp']);
      }
    });;
    console.log(userInfo+"   "+userInfo.email);
  }
}
