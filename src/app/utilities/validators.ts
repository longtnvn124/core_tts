import { AbstractControl , ValidationErrors } from '@angular/forms';
import moment from 'moment';

const PASSWORD_REGEX : RegExp = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?!.*?\s)(?=.*?[#?!@$%^&*-]).{8,30}$/;

export const USER_NAME_REGEX : RegExp = /^[a-z0-9]+(?:(?:-|_)[a-z0-9]+)*$/gm;

export const PHONE_REGEX : RegExp = /^[+]*[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;

export const EMAIL_REGEX : RegExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const DDMMYYYYDateFormatValidator = ( control : AbstractControl ) : ValidationErrors | null => ( !control.value || moment( control.value , 'DD/MM/YYYY' , true ).isValid() ) ? null : { theDateDoesNotExist : true };

export const PhoneNumberValidator = ( control : AbstractControl ) : ValidationErrors | null => control.value ? PHONE_REGEX.test( control.value ) ? null : { invalidPhoneNumberStructure : true } : null;

export const EmailValidator = ( control : AbstractControl ) : ValidationErrors | null => !control.value || EMAIL_REGEX.test( control.value ) ? null : { invalidEmail : true };

export const UserNameValidator = ( control : AbstractControl ) : ValidationErrors | null => !control.value || USER_NAME_REGEX.test( control.value ) ? null : { invalidUserName : true };

export const PasswordValidator = ( control : AbstractControl ) : ValidationErrors | null => !control.value || ( PASSWORD_REGEX.test( control.value ) && control.value.length >= 8 && control.value.length <= 30 ) ? null : { invalidPassword : true };

export const ReactivePasswordValidator = ( control : AbstractControl ) : ValidationErrors | null => {
	if ( !control.value ) {
		return null;
	}
	const _checker : PasswordCriteriaCheck = {
		length           : ( str : string ) : boolean => /.{8,200}/.test( str ) ,
		uppercase        : ( str : string ) : boolean => /[A-Z]/.test( str ) ,
		lowercase        : ( str : string ) : boolean => /[a-z]/.test( str ) ,
		number           : ( str : string ) : boolean => /\d/.test( str ) ,
		whitespace       : ( str : string ) : boolean => !/\s/.test( str ) ,
		specialCharacter : ( str : string ) : boolean => /[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/.test( str )
	};

	const invalidPassword : PasswordGuide | null = Object.keys( _checker ).reduce( ( reducer , criteria ) => {
		if ( !_checker[ criteria ]( control.value ) ) {
			reducer[ criteria ] = true;
		}
		return reducer;
	} , {} );

	return Object.keys( invalidPassword ).length ? { invalidPassword } : null;
};

type PasswordCriteria = 'length' | 'uppercase' | 'lowercase' | 'number' | 'specialCharacter' | 'whitespace'

type PasswordGuide = {
	[T in PasswordCriteria]? : boolean
};

type PasswordCriteriaCheck = Record<PasswordCriteria , ( input : string ) => boolean>;