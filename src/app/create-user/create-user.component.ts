import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { fadeInAnimation } from '../animations/fade-in.animation';
import { UserService } from '../user.service';
import { LoginService } from '../login.service';
import { NgForm } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css'],
  animations: [fadeInAnimation]
})
export class CreateUserComponent implements OnInit {

  successMessage: string;
  errorMessage: string;
  user: any;
  loginInfo: any;

  userForm: NgForm;
  @ViewChild('userForm')
  currentForm: NgForm;

  @Output() loginRequestSubmitted = new EventEmitter();

  constructor(
    private userService: UserService,
    private loginService: LoginService,
    public dialogRef: MatDialogRef<CreateUserComponent>
  ) { }

  createUser(userForm: NgForm) {
    this.errorMessage = '';
    if (userForm.value.password !== userForm.value.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
    } else {
      this.userService.createUser('create', userForm.value)
        .subscribe(
        user => {
          // tslint:disable-next-line:max-line-length
          this.successMessage = `Created your account. Login to get started!`;
        },
        error => this.errorMessage = 'User Already Exists');
      this.dialogRef.afterClosed()
        .subscribe(
        result => {
          location.reload();
        });
    }
  }

  afterClosed() {
    this.ngOnInit();
  }

  ngOnInit() {
  }


  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewChecked() {
    this.formChanged();
  }

  formChanged() {
    this.loginInfo = this.currentForm;
    this.loginInfo.valueChanges
      .subscribe(
        data => this.onValueChanged()
      );
  }

  onValueChanged() {
    const form = this.loginInfo.form;

    // tslint:disable-next-line:forin
    for (const field in this.formErrors) {
      this.formErrors[field] = '';
      const control = form.get(field);

      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        // tslint:disable-next-line:forin
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

  // tslint:disable-next-line:member-ordering
  formErrors = {
    'firstName': '',
    'lastName': '',
    'username': '',
    'password': ''
  };

  // tslint:disable-next-line:member-ordering
  validationMessages = {
    'firstName': {
      'required': 'First Name is required',
    },
    'lastName': {
      'required': 'Last Name is required',
    },
    'username': {
      'required': 'Username is required',
    },
    'password': {
      'required': 'Password is required',
    }

  };

}
