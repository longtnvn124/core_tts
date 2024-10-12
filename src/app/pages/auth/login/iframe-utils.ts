export class IframeUtils {
	private iframeId : string = 'io3-single-sign-in-iframe';

	private origin : string = '';

	constructor( src : string ) {
		const url : URL                  = new URL( src );
		this.origin                      = url.origin;
		const iframe : HTMLIFrameElement = Object.assign( document.createElement( 'iframe' ) , {
			src ,
			id     : this.iframeId ,
			width  : '1px' ,
			height : '1px'
		} );
		iframe.style.visibility          = 'hidden';
		iframe.style.position            = 'fixed';
		iframe.style.top                 = '-10000px';
		iframe.style.left                = '-10000px';
		document.body.appendChild( iframe );
	}

	/**
	 * Method that returns
	 */
	protected getIframe() : HTMLIFrameElement {
		return document.getElementById( this.iframeId ) as HTMLIFrameElement;
	}

	sendMessage( data : any ) {
		this.getIframe().contentWindow.postMessage( data , this.origin );
	}
}
