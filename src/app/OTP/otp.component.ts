import { ApiManager } from './../Common/api-manager.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl ,FormGroup, Validators} from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.css']
})
export class OTPComponent implements OnInit {
  constructor(private builder: FormBuilder,private router: Router ,private apiManger : ApiManager) {
    console.log("In the otp comoonent");
   }
  otp = new FormControl('')


  otpForm: FormGroup = this.builder.group({
    otp: this.otp,
  });
  ngOnInit() {
    console.log("In the otp component ");
  }
  submitotp(model){
    let userotp : any = {};
    userotp.otp = model.value.otp;
 
    this.apiManger.fireSignupService('otp','verifyOTP',userotp).subscribe(res => {
      console.log(res);
      if(res.success){
          //this.openDialog();
      }
    });;
  }
}
