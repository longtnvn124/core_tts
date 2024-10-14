import { CommonModule, DOCUMENT } from "@angular/common";
import { Component, Inject, NgZone, OnInit, Renderer2 } from "@angular/core";
import {AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators} from "@angular/forms";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { SharedModule } from "@module/shared/shared.module";
import {BehaviorSubject, switchMap} from "rxjs";
import { IframeUtils } from "../login/iframe-utils";
import { Title } from "@angular/platform-browser";
import { environment } from "@env";
import { GoogleSignIn, ConstructUser, UserSignIn } from "@model/user";
import { AuthService } from "@service/core/auth.service";
import { UserService } from "@service/core/user.service";
import {NotificationService} from "@appNotification";
import {EmailValidator, PasswordValidator, PhoneNumberValidator} from "@utilities/validators";
import {RegisterAccountService} from "@service/thuctapsinh/register-account.service";
import {TooltipModule} from "primeng/tooltip";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";

export function customInputValidator(): ValidatorFn {
	return (control: AbstractControl): { [key: string]: any } | null => {
		const inputValue: string = control.value;
		const errors: { [key: string]: any } = {};
		if (!/[A-Za-z]/.test(inputValue) || !/\d/.test(inputValue)) {
			errors['noAlphaNumeric'] = true;
		}
		if (inputValue.length < 8) {
			errors['minLength'] = true;
		}
		if (!/[^A-Za-z0-9]/.test(inputValue)) {
			errors['noSpecialCharacter'] = true;
		}
		if (!/[A-Z]/.test(inputValue)) {
			errors['noUpperCase'] = true;
		}
		return Object.keys(errors).length !== 0 ? errors : null;
	};
}

@Component({
  selector: 'app-register-account',
  templateUrl: './register-account.component.html',
  styleUrls: ['./register-account.component.css', '../authentication.scss'],
  standalone: true,
	imports: [CommonModule, SharedModule, RouterModule, TooltipModule, ButtonModule, RippleModule],
})

export default class RegisterAccountComponent implements OnInit {


	changPassState: boolean = true;
	type_password: 'password' | 'text' = "password";
	formSave: FormGroup;
	active_regiter :0|1 = 0;// fomr thường// fomr checkoke
	type_check_valid: 1 | 2 | 3 = 1;//1 chưa gửi //2:gửi thành công //3:gửi thất bai

	constructor(
		private fb: FormBuilder,
		private auth: AuthService,
		private registerAccountService: RegisterAccountService,
		private router: Router,
		private notification: NotificationService
	) {
		this.formSave = this.fb.group({
			username: ['' ,[Validators.required, PhoneNumberValidator]],
			email: ['', [Validators.required, EmailValidator]],
			password: ['', [Validators.required,PasswordValidator,customInputValidator()]],
			display_name: ['', Validators.required],
			phone: [null, [Validators.required, PhoneNumberValidator, Validators.maxLength(12), Validators.minLength(6)]],
		});
	}


	resetForm() {
		this.formSave.reset({
			username: '',
			email: '',
			password: '',
			display_name: '',
			phone: ''
		})
	}

	ngOnInit(): void {
	}

	get f(): { [key: string]: AbstractControl<any> } {
		return this.formSave.controls;
	}

	btnShowPassWord() {
		this.type_password = this.type_password === "password" ? "text" : "password";
	}

	btnRegisterForm() {

		if (this.formSave.valid) {
			this.type_check_valid = 2;
			let username = this.f['username'].value?.trim();
			let display_name = this.f['display_name'].value?.trim();
			this.f['username'].setValue(username);
			this.f['display_name'].setValue(display_name);
			const dataParram: {} = {
				url: `${location.origin}${this.router.serializeUrl(this.router.createUrlTree(['verification/']))}`
			}

			this.registerAccountService.registerAccount(this.formSave.value).pipe(switchMap(prj => {
				return this.registerAccountService.VerifiCationAccount(prj, dataParram)
			})).subscribe({
				next: (data) => {
					this.type_check_valid = 3;
					this.active_regiter =1;
					this.resetForm();
				}, error: (e) => {
					this.active_regiter =0;

					this.type_check_valid = 1;
					const message = e.error.message;
					let errorMessage = "";
					for (let key in message) {
						if (message[key]) {
							errorMessage += message[key] + ", ";
						}
					}
					errorMessage = errorMessage.slice(0, -2);
					this.notification.toastError(errorMessage);
				}
			})
		} else {
			this.notification.toastWarning('Vui lòng nhập đủ thông tin');
		}

	}
	btnLogin() {
		this.router.navigate(['login']);
	}

	exitForm(){
		this.active_regiter = 0;
		this.type_check_valid = 1;
		this.resetForm();
	}
}
