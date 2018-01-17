import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { fadeInAnimation } from '../animations/fade-in.animation';
import { LoginService } from '../login.service';
import { NgForm} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [fadeInAnimation]
})
export class LoginComponent implements OnInit {

  loginForm: NgForm;
  successMessage: string;
  errorMessage: string;

  @Output() loginRequestSubmitted = new EventEmitter();

  constructor(
    private loginService: LoginService
  ) { }

  loginUser(loginForm: NgForm) {
    this.loginService.loginUser('login', loginForm.value)
      .subscribe(
        result =>
        this.loginRequestSubmitted.emit(result),
        error => this.errorMessage = <any>error
      );
        this.loginForm.form.reset();
  }

  ngOnInit() {
  }

}
