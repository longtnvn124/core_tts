export interface Environment {
	appVersion : string,
	production : Boolean,
	deploy : {
		title : string,
		googleClientId : string,
		domain : string,
		url : string,
		api : string,
		fileDir : string,
		media : string,
		driverFile : string,
		aws : string,
		X_APP_ID : string
	}
}
