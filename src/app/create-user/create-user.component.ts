import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { fadeInAnimation } from '../animations/fade-in.animation';
import { UserService } from '../user.service';
import { NgForm } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css'],
  animations: [fadeInAnimation]
})
export class CreateUserComponent implements OnInit {

  userForm: NgForm;
  successMessage: string;
  errorMessage: string;
  user: any;

  @Output() loginRequestSubmitted = new EventEmitter();

  constructor(
    private userService: UserService,
    public dialogRef: MatDialogRef<CreateUserComponent>
  ) { }

  createUser(userForm: NgForm) {
    this.errorMessage = '';
    this.userService.createUser('create', userForm.value)
      .subscribe(
      user => {
        this.dialogRef.close();
        localStorage.setItem('user', JSON.stringify(user));
      },
      error => this.errorMessage = <any>error);
    this.dialogRef.afterClosed()
      .subscribe(
      result => {
        location.reload();
      });
  }

  afterClosed() {
    this.ngOnInit();
  }

  ngOnInit() {
  }

}
