
/*
 * GGardenJS
 *
 * @author Ari Setiawan
 * @author Alvin Arif Pirmansyah
 * @auhtor Wahyu Fahreza
 * @auhtor Indri Rani Saputri
 * @author Rizki Solehah
 *
 * @helper Falsa Fadilah Nugraha
 * 
 * @create 22.10-2-2022
 * @update -
 * @finish -
 */

	
	/*
	 * Get value type or match value type.
	 *
	 * @params Mixed $passed
	 * @params Function|String $ntyped
	 * @params Function $handler
	 * @params Function $catcher
	 *
	 * @return Mixed
	 */
	const is = function( passed, ntyped, handler = true, catcher = false )
	{
		// If `ntyped` is Function type.
		if( typeof ntyped === "function" )
		{
			// If `passed` is equal Function name.
			return( Callable( is( passed ) === ntyped.name ? handler : catcher, passed ) );
		}
		
		// If `ntyped` is Object type.
		if( typeof ntyped === "object" )
		{
			// If Object is Array type.
			if( typeof ntyped[0] !== "undefined" )
			{
				for( let i in ntyped )
				{
					// If `passed` is equals `ntyped[i]`.
					if( is( passed, ntyped[i] ) )
					{
						return( Callable( handler, passed ) );
					}
					return( Callable( catcher, passed ) );
				}
			}
		}
		
		// If `ntyped` is String type.
		if( typeof ntyped === "string" )
		{
			// If `passed` is equal String value.
			return( Callable( is( passed ) === ntyped ? handler : catcher, passed ) );
		}
		
		// Only return Function or Object name.
		return( typeof passed === "function" ? passed.name : Object.prototype.toString.call( passed ).replace( /\[object\s*(.*?)\]/, `$1` ) );
	};
	
	/*
	 * Not is the negation of the function is.
	 *
	 * @params Mixed $passed
	 * @params Function|String $ntyped
	 * @params Function $handler
	 * @params Function $catcher
	 *
	 * @return Mixed
	 */
	const not = ( passed, ntyped, handler = true, catcher = false ) => is( passed, ntyped, catcher, handler );
	
	/*
	 * Check if user is authenticated.
	 *
	 * @return Boolean
	 */
	const $Authenticated = function()
	{
		return( is( $data.shared.profile, Object ) );
	};
	
	/*
	 * Callable is a function for callbacks so the program doesn't
	 * have to write code over and over just to check if it's a
	 * function and it also supports passed parameters.
	 *
	 * @params Mixed kwargs
	 *
	 * @return Mixed
	 */
	const Callable = function( ...kwargs )
	{
		// Check if function has argument passed.
		if( kwargs.length > 0 )
		{
			// Check if first argument passed is Function type.
			if( typeof kwargs[0] === "function" )
			{
				// Get function passed.
				var func = kwargs[0];
				
				// Unset function from argument passed.
				delete kwargs[0];
				
				// Return callback function.
				return( func( ...kwargs ) );
			}
			return( kwargs[0] );
		}
	};
	
	/*
	 * Choice
	 *
	 * Return a random pick from an Array or Object.
	 *
	 * @params Array|Object $values
	 *
	 * @throws TypeError
	 *
	 * @return Mixed
	 */
	const $Choice = function( values )
	{
		// Check if values is Object type.
		if( is( values, Object ) )
		{
			return( $Choice( Object.values( values ) ) );
		}
		
		// Check if array values is not empty.
		if( values.length > 0 )
		{
			return( values[Math.floor( Math.random() * values.length )] );
		}
		throw new TypeError( "Cannot return value from an empty array." );
	};
	
	/*
	 * Cookie utility
	 *
	 * A utility that provides various APIs for managing cookies.
	 *
	 * @params Array $set
	 * @params String $del
	 */
	const $Cookie = function( set, del )
	{
		// Clone self.
		var self = this;
		
		if( is( document, "Undefined" ) )
		{
			throw new TypeError( "Object Document is not defined." );
		}
		
		// Set cookies.
		if( is( set, Array ) )
		{
			self.set.apply( self, set );
		}
		
		// Delete cookies.
		if( is( del, Array ) )
		{
			del.forEach( cookie =>
			{
				self.del( cookie );
			});
		}
		
		// Load all available cookies.
		this.load();
	};
	
	/*
	 * Get cookie value.
	 *
	 * @params String $name
	 *
	 * @return String|False
	 */
	$Cookie.prototype.get = function( name )
	{
		if( is( name, String ) )
		{
			if( not( result = document.cookie.split( ";" ).find( r => r.replace( /\s/g, "" ).startsWith( encodeURIComponent( name ) + "=" ) ), "Undefined" ) )
			{
				return( decodeURIComponent( result.split( "=" )[1] ) );
			}
			return( false );
		}
		throw new TypeError( "Invalid cookie name." );
	};
	
	/*
	 * Load all the cookies that have been set.
	 *
	 * @return Object
	 */
	$Cookie.prototype.load = function()
	{
		// Clone self.
		var self = this;
			self.loaded = {};
		
		// Explode all cookies.
		document.cookie.split( ";" ).map( part =>
		{
			// Set cookie orders.
			self.loaded[decodeURIComponent( part.split( "=" )[0].replace( /\s/g, "" ) )] = decodeURIComponent( part.split( "=" )[1] );
		});
		
		return( self.loaded );
	};
	
	/*
	 * List of cookies that have been set.
	 *
	 * @values Object
	 */
	$Cookie.prototype.loaded = {};
	
	/*
	 * Set one or more than one cookie.
	 *
	 * @params String $name
	 * @params String $value
	 * @params Object $options
	 *
	 * @return String
	 */
	$Cookie.prototype.set = function( name, value, { comment, domain, expires, maxage, httponly, path = "/", samesite, secure, version = "4.1.6" } = {} )
	{
		// Clone self.
		var self = this;
		
		// If cookies are multiple, all
		// arguments will be ignored except name.
		if( is( name, Array ) )
		{
			
			// Set cookies by order.
			name.forEach( group =>
			{
				
				// If the group values do not match.
				if( is( group ) !== "Array" )
				{
					throw new TypeError( f( "Multiple cookie group value must be type Object, \"{}\" given.", is( group ) ) );
				}
				
				// Recall the cookie set function.
				self.set.apply( self, group );
			});
			
		} else {
			if( is( name, String ) )
			{
				// Raw Cookie Header.
				var header = "";
				
				// Check if the cookie name is valid.
				if( /^(?:([a-z\_])([a-z0-9\_]*))$/i.test( name ) )
				{
					if( is( value, String ) )
					{
						header = f( "{}={}", encodeURIComponent( name ), encodeURIComponent( value ) );
					} else {
						header = f( "{}=None", encodeURIComponent( name ) );
						expires = -1;
					}
				} else {
					throw new TypeError( "Invalid cookie name." );
				}
				
				// If the cookie has a comment.
				if( is( comment, String ) )
				{
					header += f( "; Comment=\"{}\"", comment );
				}
				
				// If the cookie has a domain name.
				if( is( domain, String ) )
				{
					header += f( "; Domain={}", domain );
				}
				
				// If the cookie has an expiration date.
				if( is( expires, Number ) )
				{
					// Parse date to UTCString.
					header += f( "; expires={}", new Date( Date.now() + expires * 864e5 ).toUTCString() );
				}
				
				// If the cookie is read only the server.
				if( is( httponly, Boolean ) )
				{
					header += httponly ? "; HttpOnly" : "";
				}
				
				// ....
				if( is( maxage, Number ) )
				{
					header += f( "; Max-Age={}", maxage );
				}
				
				// If cookies are only set in certain locations.
				if( is( path, String ) )
				{
					// If the location path name is valid.
					if( /(?:^(\/\w+){0,}\/?)$/g.test( path ) )
					{
						header += f( "; Path={}", path );;
					} else {
						throw new TypeError( "Invalid path name." );
					}
				}
				
				if( is( samesite, String ) )
				{
					switch( samesite )
					{
						case "Lax":
							header += "; SameSite=Lax"; break;
						case "None":
							header += "; SameSite=None"; break;
						case "Strict":
							header += "; SameSite=Strict"; break;
						default:
							throw new TypeError( "Invalid cookie SameSite." );
					}
				}
				
				// Otherwise the cookie is only sent
				// to the server when a request is made.
				if( is( secure, Boolean ) )
				{
					header += secure ? "; Secure" : "";
				}
				
				// If cookie has a version.
				if( is( version, String ) )
				{
					header += f( "; Version={}", version );
				}
				
				// Set cookie header.
				document.cookie = header;
				
				// Load all available cookies.
				this.load();
				
				// Returns the cookie's raw header value.
				return( header );
				
			} else {
				throw new TypeError( "Cookie name cannot be empty or null." );
			}
		}
	};
	
	/*
	 * String formatter.
	 *
	 * @params String $string
	 * @params String ...
	 *
	 * @return String
	 */
	const f = function()
	{
		var i = 1;
		var args = arguments;
		var regex = /(?:(?<format>(?<except>\\{0,})(\{[\s\t]*((?<key>[a-zA-Z_\x80-\xff]([a-zA-Z0-9_\x80-\xff]{0,}[a-zA-Z0-9_\x80-\xff]{1})*)|(?<index>[\d]+))*[\s\t]*\})))/igms;
		var match;
	
		if( is( args[0].replaceAll, "Undefined" ) )
		{
			// console.log( args );
		}
	
		// [0] => Matched.
		// [2] => Backslash<Exception>
		// [3] => Format<MatchedWithoutBackslash>
		// [4] => Index/Key<Matched>
		while( ( match = regex.exec( args[0] ) ) !== null )
		{
			// If backslash character exists.
			if( is( match[2], String ) && match[2] !== "" )
			{
				// Get backslash lenght.
				var length = match[2].length;
				
				// If the number of backslashes is one.
				if( length === 1 )
				{
					args[0].replaceAll( match[0], match[3] ); continue;
				}
				
				// If number of backslash is odd.
				if( length % 2 !== 0 )
				{
					args[0] = args[0].replaceAll( match[0], "\\".repeat( length -1 ) + match[3] ); continue;
				}
				
				// Make backslashes as much as the amount minus two.
				match[2] = "\\".repeat( length === 2 ? length -1 : length -2 );
			}
			
			// If element 4 on array match and element 1 on array args exists.
			if( typeof match[4] !== "undefined" &&
				typeof args[1] !== "undefined" )
			{
				// If value of element 1 on array args Object type.
				if( typeof args[1] === "object" )
				{
					// Check if value is only number.
					if( /^\d+$/.test( match[4] ) )
					{
						match[4] = parseInt( match[4] );
					}
					args[0] = args[0].replace( match[0], typeof args[1][match[4]] !== "undefined" ? match[2] + args[1][match[4]] : match[2] + "" ); continue;
				}
			}
			
			// Only replace by iteration.
			args[0] = args[0].replace( match[0], typeof args[i] !== "undefined" ? match[2] + args[i++] : match[2] + "" );
		}
		return( args[0] );
	};
	
	/*
	 * Level & Type Aliases.
	 *
	 */
	const $Levels = {
		superAdmin: "53-75-70-65-72-41-64-6d-69-6e",
		admin: "41-64-6d-69-6e",
		flower: "46-6c-6f-77-65-72",
		fruit: "46-72-75-69-74",
		plant: "50-6c-61-6e-74",
		root: "52-6f-6f-74",
		tree: "54-72-65-65",
		user: "55-73-65-72",
		vegetable: "56-65-67-65-74-61-62-6c-65"
	};
	
	/*
	 * Mixed is PHP's default data type but
	 * now I've created it in JavaScript Wkwkwk.
	 *
	 * @params Mixed $value
	 *
	 * @return Mixed
	 */
	const Mixed = function( value = false )
	{
		// If the function is called with a constructor.
		if( not( this, Window ) )
		{
			// Set value of given type.
			this.given = is( this.value = value );
		}
		return( value );
	};
	
	/*
	 * Match cases function.
	 *
	 * @params Mixed $match
	 * @params Array $cases
	 *
	 * @return Mixed
	 */
	const $Match = function( match, cases )
	{
		// If cases value is Array type.
		if( is( cases, Array ) )
		{
			// Get default case position.
			var post = $Match.isDefault( cases );
			
			// Finding.
			for( let i in cases )
			{
				if( i === post )
				{
					continue;
				}
				else if( is( cases[i].case, Array ) )
				{
					for( let u in cases[i].case )
					{
						if( is( match, cases[i].case[u] ) || match === cases[i].case[u] )
						{
							return( Callable( cases[i].call ) );
						}
					}
				}
				else if( is( match, cases[i] ) || match === cases[i] )
				{
					return( Callable( cases[i].call ) );
				}
			}
			if( not( post, Boolean ) )
			{
				return( Callable( cases[post].call ) );
			}
		}
	};
	
	/*
	 * Check if value is callable or function.
	 *
	 * @params Mixed $match
	 *
	 * @return Boolean
	 */
	$Match.isCall = match => typeof match === "function" || is( match, String ) && /^function/.test( match );
	
	/*
	 * Check if match case is default option.
	 *
	 * @params Array $cases
	 *
	 * @return Mixed
	 */
	$Match.isDefault = cases =>
	{
		for( let i in cases )
		{
			if( is( cases[i].none, Boolean ) && cases[i].none )
			{
				return( i );
			}
		}
		return( false );
	};
	
	/*
	 * Check if value is multiple match case.
	 *
	 * @params Mixed $match
	 *
	 * @return Boolean
	 */
	$Match.isMultiple = match => is( match, Object ) && is( match.case, Array ) && is( match.call ) !== "Undefined";
	
	/*
	 * Return match result.
	 *
	 * @params Mixed $match
	 * @params Mixed $value
	 *
	 * @return Mixed
	 */
	$Match.return = ( match, value ) => $Match.isCall( value ) ? value( match ) : value;
	
	/*
	 * Array, Object, and String Mapper.
	 *
	 * @params Array|Object|String $data
	 * @params Function $call
	 *
	 * @return Array|Object
	 */
	const $Mapper = function( data, call )
	{
		// Return value from match.
		return( this.results = $Match( data, [
			
			/*
			 * Array|String Mapper.
			 *
			 * @params Array|String $data
			 *
			 * @return Array
			 */
			{
				case: [ Array, String ],
				call: () =>
				{
					// Collected data.
					var stack = [];
					
					// For loop as much as the amount of data.
					for( let i = 0; i < data.length; i++ )
					{
						stack[i] = call( i, data[i], data.length );
					}
					
					// Return data stack.
					return( stack );
				}
			},
			
			/*
			 * Object Mapper.
			 *
			 * @params Object $data
			 *
			 * @return Object
			 */
			{
				case: Object,
				call: () =>
				{
					// Collected data.
					var stack = {};
					
					// Get object keys and values.
					var keys = Object.keys( data );
					var vals = Object.values( data );
					
					// Repeat data until it runs out.
					for( let i in keys )
					{
						stack[keys[i]] = call( i, keys[i], vals[i], vals.length );
					}
					
					// Return data stack.
					return( stack );
				}
			}
		]));
	};
	
	/*
	 * Request
	 *
	 * Send asynchronous requests using XMLHttpRequest.
	 *
	 * @params String $method
	 * @params String $url
	 * @params Object $options
	 *
	 * @return Promise
	 */
	const $Request = async function( method, url, options = {} )
	{
		return( new Promise( await function( resolve, reject )
		{
			// The constructor initializes.
			var xhr = new XMLHttpRequest();
			
			// Initializes a request.
			xhr.open( method, url );
			
			// If headers is Object type.
			if( is( options.headers, Object ) )
			{
				for( let header in options.headers )
				{
					// Sets the value of an HTTP request header.
					xhr.setRequestHeader( header, options.headers[header] );
				}
			}
			
			// If data is Object type.
			if( is( options.data, Object ) )
			{
				// Data pairs.
				var data = [];
				
				for( let key in options.data )
				{
					// Encode URI Commponent.
					data.push( encodeURIComponent( key ) + "=" + encodeURIComponent( options.data[key] ) );
				}
				
				// Sends the request with data.
				xhr.send( data.join( "&" ) );
			}
			
			// If data is FormData type.
			else if( is( options.data, FormData ) )
			{
				// Sends the request with FormData.
				xhr.send( options.data );
			}
			
			// Sends the request without data.
			else {
				xhr.send();
			}
			
			// If request has events.
			if( is( options.events, Object ) )
			{
				for( let i in options.events )
				{
					// Allow set events except loaded & error.
					if( i !== "loaded" && i !== "error" )
					{
						// Sets up a function that will be called whenever
						// The specified event is delivered to the target.
						xhr.addEventListener( i, ( e ) => Callable( options.events[i], e, xhr ) );
					}
				}
			}
			
			// Fired when an XMLHttpRequest transaction completes successfully.
			xhr.onload = evt => resolve( xhr );
			
			// Fired when the request encountered an error.
			xhr.onerror = evt => reject( xhr );
		}));
	};
	
	$Request.onError = ( self, error ) => is( error, XMLHttpRequest, 
		error => self.error = "No Internet Connection", 
		error => self.error = error
	);
	
	/*
	 * Header normalization.
	 *
	 * @params Array|String $raw
	 */
	$Request.Header = function( raw )
	{
		// Copy object instance.
		var self = this;
			self.name = [];
			self.value = null;
		
		// Check if the raw header has not been split.
		if( is( raw, String ) )
		{
			// Separate header name with value.
			raw = raw.split( ":\x20" );
		}
		
		// Normalization of header names.
		raw[0].split( "-" ).forEach( word => self.name.push( word.charAt( 0 ).toUpperCase() + word.slice( 1 ) ) );
		
		// Set header name.
		self.name = self.name.join( "" );
		
		// Set header value.
		self.value = decodeURIComponent( raw[1] );
	};
	
	/*
	 * Response Content Type.
	 *
	 * @params Array|String $content
	 */
	$Request.ContentType = function( content )
	{
		// Check if the raw is not undefined type.
		if( not( content, "Undefined" ) ) return;
		{
			// Check if the raw type has not been split.
			if( is( content, String ) )
			{
				// Separate content type with charset.
				content = content.split( "; " );
			}
			
			// If response content type has charset.
			if( is( content[1], String ) ) this.charset = content[1].split( "=" )[1];
			
			// Mapping content types.
			switch( content[0] )
			{
				case "application/json": this.type = "json"; break;
				case "application/xml": this.type = "xml"; break;
				case "text/javascript": this.type = "js"; break;
				case "text/html": this.type = "html"; break;
				case "text/css": this.type = "css"; break;
				
				default: this.type = content[0]; break;
			}
		}
	};
	
	/*
	 * Root Application Mount
	 *
	 * @default root
	 */
	const $Root = "#root";
	
	/*
	 * Change document title.
	 *
	 * @params String $title
	 *
	 * @return Void
	 */
	const $Title = function( title )
	{
		// If parameter title is undefined.
		if( is( title, "Undefined" ) )
		{
			document.title = $Title.default;
		}
		else {
			document.title = f( "\x7b\x7d\x20\xb7\x20\x7b\x7d", $Title.default, title );
		}
	};
	
	/*
	 * Default site title name.
	 *
	 * @values String
	 */
	$Title.default = "GGarden";
	
	/*
	 * Check if value given is empty.
	 *
	 * @params Mixed $value
	 *
	 * @return Boolean
	 */
	const valueIsEmpty = function( value )
	{
		if( not( value, "Undefined" ) &&
			not( value, "Boolean" ) &&
			not( value, "Null" ) )
		{
			if( is( value, Array ) )
			{
				return( value.length === 0 );
			}
			if( is( value, Object ) )
			{
				return( Object.keys( value ).length === 0 );
			}
			if( is( value, String ) )
			{
				return( value.length !== 0 ? ( value.match( /^([\s\t\n]*)$/ ) ? true : false ) : true );
			}
			return( false );
		}
		return( true );
	};
	
	/*
	 * Check if value given is not empty.
	 *
	 * @params Mixed $value
	 *
	 * @return Boolean
	 */
	const valueIsNotEmpty = value => valueIsEmpty( value ) !== true;
	
	/* ************************************
	 * ************ COMPONENTS ************
	 * ************************************
	 */
	
	/*	
	 * Avatar component.	
	 *	
	 * @options Object{
	 *	 inject: Object{
	 *		 wrapper: Array|String,
	 *		 avatar: Array|String,
	 *		 cover: Array|String,
	 *		 route: Array|String,
	 *		 link: Array|String,
	 *		 img: Array|String
	 *	 },
	 *	 slot: String|Function,
	 *	 route: String,
	 *	 title: String,
	 *	 link: String,
	 *	 alt: String,
	 *	 src: String
	 * }
	 */	
	const $AvatarComponent = {
		
		/*
		 * Component properties.
		 *
		 * @values Function
		 */
		data: () => ({
			class: {
				wrapper: [
					"avatar-wrapper",
					"flex",
					"flex-center"
				],
				avatar: [
					"avatar",
					"flex",
					"flex-center"
				],
				cover: [
					"avatar-cover"
				],
				image: [
					"avatar-image"
				],
				route: [
					"avatar-route"
				],
				link: [
					"avatar-link"
				]
			}
		}),
		
		/*
		 * Component props.
		 *
		 * @values Object
		 */
		props: {
			options: {
				type: Object,
				required: true
			}
		},
		
		/*
		 * Component computation.
		 *
		 * @values Object
		 */
		computed: {
			binding: function()
			{
				// Dynamic avatar component.
				var component = {};
				
				// Building avatar template.
				component.template = this.building(
					component
				);
				
				// Return component.
				return( component );
			}
		}, 
		
		/*
		 * Component methods.
		 *
		 * @values Object
		 */
		methods: {
			building: function( component )
			{
				// Copy object instance.
				var self = this;
				
				// Default format avatar stack.
				var stack = {
					string: [
						"<div class=\"{ avatar }\">",
						"</div>"
					],
					format: {
						avatar: self.class.avatar.join( "\x20" )
					}
				};
				
				// If the option value is of type Object.
				if( is( self.options, Object ) )
				{
					// If option has class injection.
					if( is( self.options.inject, Object ) )
					{
						// Mapping injection.
						$Mapper( self.options.inject, ( i, key, val ) =>
						{
							if( not( val, Array ) )
							{
								val = [ val ];
							}
							self.class[key].push( ...val );
						});
					}
					
					// Display format if the avatar has options.
					stack = {
						string: [
							"<div class=\"{ avatar }\">",
								"<div class=\"{ wrapper }\">",
									"<img class=\"{ image }\" title=\"{ title }\" alt=\"{ alt }\" src=\"{ src }\" />",
									"<div class=\"{ cover }\">",
										"{ slot }",
									"</div>",
								"</div>",
							"</div>",
						],
						format: {
							wrapper: self.class.wrapper.join( "\x20" ),
							avatar: self.class.avatar.join( "\x20" ),
							image: self.class.image.join( "\x20" ),
							cover: self.class.cover.join( "\x20" ),
							title: self.options.title,
							route: self.class.route.join( "\x20" ),
							path: self.options.route,
							link: self.class.link.join( "\x20" ),
							href: self.options.link,
							alt: self.options.alt,
							src: self.options.src
						}
					};
					
					// Get slot value for avatar cover (If available).
					var slot = stack.format.slot = Callable( self.options.slot ? self.options.slot : "" );
					
					// If slot return value is Object.
					if( is( slot, Object ) )
					{
						// Get slot template.
						stack.format.slot = slot.template ? slot.template : "";
						
						// Mapping component.
						$Mapper( slot, ( index, key, value, length ) =>
						{
							// If key name is not template.
							// Skip.
							if( key !== "template" ) component[key] = value;
						});
					}
					
					// If route option exists.
					if( is( this.options.route, String ) )
					{
						stack.string.unshift( "<router-link class=\"{ route }\" to=\"{ path }\">" );
						stack.string.push( "</router-link>" );
					}
					
					// If link option exists.
					if( is( this.options.link, String ) )
					{
						stack.string.unshift( "<a class=\"{ link }\" href=\"{ href }\">" );
						stack.string.push( "</a>" );
					}
				}
				
				// Return formatted components.
				return( f( stack.string.join( "\n" ), stack.format ) );
			}	
		},	
		
		/*
		 * Component template.
		 *
		 * @values String
		 */
		template: `<component v-bind:is="binding"></component>`	
	};
	
	/*
	 * Error component.
	 *
	 * @slot error-banner
	 * @slot default
	 */
	const $Error = {
		
		/*
		 * Component template.
		 *
		 * @values String
		 */
		template: `
			<div class="error flex flex-center">
				<div class="error-blockable">
					<div class="error-banner flex flex-center">
						<slot name="error-banner">
							<i class="error-icon bx bx-confused"></i>
						</slot>
					</div>
					<div class="error-slotable">
						<slot></slot>
					</div>
				</div>
			</div>
		`
	};
	
	/*
	 * Slide Component.
	 *
	 */
	const $SlideComponent = {
		
		/*
		 * Component template.
		 *
		 * @values String
		 */
		template: `
			<div class="slide flex flex-center">
				<slot name="default"></slot>
			</div>
		`
	};
	
	/*
	 * Slide Front Exit Component.
	 *
	 */
	const $SlideExitComponent = {
		
		/*
		 * Component template.
		 *
		 * @values String
		 */
		template: `
			<div class="slide-exit" @click="$emit( 'close' )"></div>
		`
	};
	
	/*
	 * Slide Front Main Component.
	 *
	 */
	const $SlideMainComponent = {
		
		/*
		 * Component template.
		 *
		 * @values String
		 */
		template: `
			<div class="slide-main">
				<slot name="header">
					<div class="slide-header flex flex-center">
						<hr class="slide-hr" />
					</div>
				</slot>
				<slot name="default"></slot>
			</div>
		`
	};
	
	/*
	 * Slide Front Header Component.
	 *
	 */
	const $SlideHeaderComponent = {
		
		/*
		 * Component template.
		 *
		 * @values String
		 */
		template: `
			<div class="slide-header">
				<slot name="default">
					<hr class="slide-header-hr" />
				</slot>
			</div>
		`
	};
	
	/*
	 * Slide Front Content Component.
	 *
	 */
	const $SlideContentComponent = {
		
		/*
		 * Component template.
		 *
		 * @values String
		 */
		template: `
			<div class="slide-content">
				<div class="slide-scroll">
					<div class="slide-block">
						<slot name="default"></slot>
					</div>
					<slot name="deepable"></slot>
				</div>
			</div>
		`
	};
	
	/*
	 * Slide Deep Component.
	 *
	 */
	const $SlideDeepComponent = {
		
		/*
		 * Component template.
		 *
		 * @values String
		 */
		template: `
			<div class="slide-deep">
				<div class="slide-deep-main">
					<div class="slide-deep-header flex flex-center">
						<button class="slide-deep-header-button button flex flex-center" @click="$emit( 'prev' )">
							<i class="bx bx-chevrons-left fs-24 fc-1"></i>
						</button>
						<slot name="header"></slot>
					</div>
					<div class="slide-deep-break"></div>
					<div class="slide-deep-content">
						<div class="slide-deep-scroll slide-scroll">
							<div class="slide-deep-block slide-block">
								<slot name="default"></slot>
							</div>
						</div>
					</div>
				</div>
			</div>
		`
	};
	
	/*
	 * Timeline Component.
	 *
	 * @options Object $shared
	 */
	const $TimelineComponent = {
		
		/*
		 * Component properties.
		 *
		 * @values Function
		 */
		data: () => ({
			data: {
				users: {
					fetch: "/api/user/suggest?token={}",
					lists: null,
					error: false,
					loading: true
				},
				posts: {
					fetch: "/api/plant/suggest?token={}",
					lists: null,
					error: false,
					scroll: 10,
					scrollLimit: 20,
					scrollNext: true,
					active: false,
					activeDeep: false,
					loading: true
				}
			},
			error: false,
			copied: [],
			loading: true,
			responses: []
		}),
		
		/*
		 * Component props.
		 *
		 * @values Object
		 */
		props: {
			shared: {
				type: Object,
				required: true
			}
		},
		
		/*
		 * Component mount.
		 *
		 * @return Void
		 */
		mounted: function()
		{
			this.fetchUsers();
			this.fetchPosts();
		},
		
		/*
		 * Component methods.
		 *
		 * @values Object
		 */
		methods: {
			
			/*
			 * Fetch user suggested.
			 *
			 * @return Promise
			 */
			fetchUsers: async function()
			{
				// Copy object instance.
				var self = this;
				
				// Page loading.
				self.data.users.loading = true;
				
				// Get User Sugestions.
				await $Request( "GET", f( this.data.users.fetch, encodeURIComponent( $data.shared.profile.unitoken ) ) )
					
					// Handle request onload.
					.then( res =>
					{
						// Parse json strings.
						var resp = JSON.parse( res.responseText );
						
						// Save response.
						self.responses.push( resp );
						
						// Check if request response on error.
						if( resp.error )
						{
							// Save error message.
							self.data.users.error = resp.message;
						}
						else {
							self.data.users.lists = resp.data;
						}
					})
					
					// Handle request onerror.
					.catch( err => self.data.users.error = $Request.onError( self, err ) );
					
				// Disable page loading.
				self.data.users.loading = false;
			},
			
			/*
			 * Fetch post suggested.
			 *
			 * @return Promise
			 */
			fetchPosts: async function()
			{
				// Copy object instance.
				var self = this;
				
				// Reset scroll options.
				self.data.posts.scroll = 1;
				self.data.posts.scrollNext = true;
				
				// Page loading.
				self.data.posts.loading = true;
				
				// Get Posts Sugestions.
				await $Request( "GET", f( this.data.posts.fetch, encodeURIComponent( $data.shared.profile.unitoken ) ) )
					
					// Handle request onload.
					.then( res =>
					{
						// Parse json strings.
						var resp = JSON.parse( res.responseText );
						
						// Save response.
						self.responses.push( resp );
						
						// Check if request response on error.
						if( resp.error )
						{
							// Save error message.
							self.data.posts.error = resp.message;
						}
						else {
							self.data.posts.lists = resp.data;
						}
					})
					
					// Handle request onerror.
					.catch( err => self.data.posts.error = $Request.onError( self, err ) );
					
				// Disable page loading.
				self.data.posts.loading = false;
			},
			
			linkGenerator: function( post )
			{
				return( f( "https://ggarden.com/p/{}?feature=share&from=copy", post.node ) );
			},
			
			/*
			 * Handle copy link post.
			 *
			 * @params Object $post
			 *
			 * @return Void
			 */
			onCopy: function( post )
			{
				// Copy link to cliboard.
				navigator.clipboard.writeText(
					this.linkGenerator( post )
				);
				
				// Set link as copied.
				post.copied = true;
			},
			
			/*
			 * Handle slide.
			 *
			 * @params Object $post
			 *
			 * @return Void
			 */
			onSlide: function( post )
			{
				// If post is Object type.
				if( is( post, Object ) )
				{
					this.data.posts.active = post;
				}
				else {
					this.data.posts.active = false;
				}
				this.data.posts.activeDeep = false;
			},
			
			/*
			 * Handle deep slide.
			 *
			 * @params Object $post
			 *
			 * @return Void
			 */
			onSlideDeep: function( index )
			{
				// Check if index is Number type.
				if( is( index, Number ) )
				{
					this.data.posts.activeDeep = index;
				}
				else {
					this.data.posts.activeDeep = false;
				}
			},
			
			/*
			 * User post avatar options.
			 *
			 * @params Object $user
			 *
			 * @return Object
			 */
			postAuthorNormalize: function( user )
			{
				return({
					inject: {
						route: "card-post-user-avatar-route",
						image: "card-post-user-avatar-image",
						avatar: [
							"card-post-user-avatar",
							"rd-circle"
						],
						wrapper: [
							"card-post-user-avatar-wrapper",
							"rd-circle"
						]
					},
					route: f( "/{}?feature=dashboard", user.username ),
					src: user.userpict.main
				});
			},
			
			/*
			 * Post galery avatar options.
			 *
			 * @params String $image
			 *
			 * @return Object
			 */
			postGaleryNormalize: function( image )
			{
				return({
					inject: {
						avatar: [
							"swiper-slide",
							"swiper-slide-avatar"
						],
						wrapper: "swiper-slide-avatar-wrapper",
						image: "swiper-slide-avatar-wrapper"
					},
					src: image
				});
			},
			
			/*
			 * Galery swiper options.
			 *
			 * @return Object
			 */
			postGalerySwiper: function()
			{
				return({
				});
			},
			
			/*
			 * Save post.
			 *
			 * @params Object $post
			 *
			 * @return Promise
			 */
			postOnSave: async function( post )
			{
				// On loading icon.
				post.onsave = true;
				
				// Check if post has saved.
				if( post.saved === true )
				{
					// Delete save.
					await $Request( "POST", f( "/api/plant/{}/unsave", post.node ), {
						data: {
							unitoken: post.unitoken
						},
						headers: {
							"Content-Type": "application/x-www-form-urlencoded"
						}
					})
					
					// Handle request onload.
					.then( res =>
					{
						// Parse json strings.
						var resp = JSON.parse( res.responseText );
						
						// Check if request response on error.
						if( resp.error )
						{
							// Send error to console.
							post.error = resp.message;
						}
						else {
							post.saved = false;
							post.error = false;
						}
					})
					
					// Handle request onerror.
					.catch( err => $Request.onError( post.error, err ) );
				}
				else {
					
					// Send save to server.
					await $Request( "POST", f( "/api/plant/{}/onsave", post.node ), {
						data: {
							unitoken: post.unitoken
						},
						headers: {
							"Content-Type": "application/x-www-form-urlencoded"
						}
					})
					
					// Handle request onload.
					.then( res =>
					{
						// Parse json strings.
						var resp = JSON.parse( res.responseText );
						
						// Check if request response on error.
						if( resp.error )
						{
							// Send error to console.
							post.error = resp.message;
						}
						else {
							post.saved = true;
							post.error = false;
						}
					})
					
					// Handle request onerror.
					.catch( err => $Request.onError( post.error, err ) );
				}
				
				// Disabled on loading icon.
				post.onsave = false;
			},
			
			/*
			 * Star post.
			 *
			 * @params Object $post
			 *
			 * @return Promise
			 */
			postOnStar: async function( post )
			{
				// On loading icon.
				post.onstar = true;
				
				// Check if post has stared.
				if( post.stared )
				{
					// Delete star.
					await $Request( "POST", f( "/api/plant/{}/unstar", post.node ), {
						data: {
							unitoken: post.unitoken
						},
						headers: {
							"Content-Type": "application/x-www-form-urlencoded"
						}
					})
					
					// Handle request onload.
					.then( res =>
					{
						// Parse json strings.
						var resp = JSON.parse( res.responseText );
						
						// Check if request response on error.
						if( resp.error )
						{
							// Send error to console.
							post.error = resp.message;
						}
						else {
							post.stared = false;
							post.stars = resp.data;
							post.error = false;
						}
					})
					
					// Handle request onerror.
					.catch( err => $Request.onError( post.error, err ) );
				}
				else {
					
					// Send star to server.
					await $Request( "POST", f( "/api/plant/{}/onstar", post.node ), {
						data: {
							unitoken: post.unitoken
						},
						headers: {
							"Content-Type": "application/x-www-form-urlencoded"
						}
					})
					
					// Handle request onload.
					.then( res =>
					{
						// Parse json strings.
						var resp = JSON.parse( res.responseText );
						
						// Check if request response on error.
						if( resp.error )
						{
							// Send error to console.
							post.error = resp.message;
						}
						else {
							post.error = false;
							post.stars = resp.data;
							post.stared = true;
						}
					})
					
					// Handle request onerror.
					.catch( err => $Request.onError( post.error, err ) );
				}
				
				// Disabled on loading icon.
				post.onstar = false;
			},
			
			/*
			 * Redirect to path /create
			 *
			 * @return Void
			 */
			toPathCreate: function()
			{
				$Router.push({ path: "/create", query: { feature: "admin" } });
			},
			
			/*
			 * User avatar options.
			 *
			 * @params Object $user
			 *
			 * @return Object
			 */
			userSuggestAvatar: function( user )
			{
				return({
					inject: {
						route: "card-user-avatar-route",
						image: "card-user-avatar-image",
						avatar: "card-user-avatar",
						wrapper: "card-user-avatar-wrapper"
					},
					route: f( "/{}?feature=dashboard", user.username ),
					src: user.userpict.main
				});
			},
			
			userListAvatar: function( user )
			{
				return({
					inject: {
						route: "slide-list-avatar-route",
						image: "slide-list-avatar-image",
						avatar: [
							"slide-list-avatar",
							"rd-circle"
						],
						wrapper: [
							"slide-list-avatar-wrapper",
							"rd-circle"
						]
					},
					route: f( "/{}?feature=dashboard", user.username ),
					src: user.userpict.main
				});
			}
		},
		
		/*
		 * Component requires.
		 *
		 * @values Object
		 */
		components: {
			Avatar: $AvatarComponent,
			Swiper: $SwiperComponent,
			Chart: $ChartComponent,
			Error: $Error,
			Slide: $SlideComponent,
			SlideExit: $SlideExitComponent,
			SlideMain: $SlideMainComponent,
			SlideHeader: $SlideHeaderComponent,
			SlideContent: $SlideContentComponent,
			SlideDeep: $SlideDeepComponent
		},
		
		/*
		 * Component template.
		 *
		 * @values String
		 */
		template: `
			<div class="timeline">
				<div class="timeline-navbar flex mg-bottom-14" @click="toPathCreate">
					<div class="timeline-navbar-single flex flex-center rd-square">
						<i class="bx bx-plus fc-pw-1 fs-20"></i>
					</div>
					<div class="timeline-navbar-single rd-square">
						<div class="timeline-navbar-block fc-1 pd-14">
							Create New Articel
						</div>
					</div>
				</div>
				<div class="timeline-users mg-bottom-14">
					<div class="timeline-user-loading flex flex-left" v-if="data.users.loading">
						Getting Users <i class="bx bx-group bx-flashing ic-3 mg-left-10"></i>
					</div>
					<div class="timeline-users-block pd-14" v-else>
						<p class="mg-bottom-14 fb-45 fc-1 fs-20">Suggested Users</p>
						<div class="timeline-user-scroll scroll-hidden">
							<div class="card-user" v-for="user in data.users.lists">
								<div class="card-user-content">
									<div class="card-user-picture">
										<Avatar :options="userSuggestAvatar( user )" />
									</div>
									<div class="card-user-label">
										<p class="card-user-title fullname fb-45 fc-1 mg-0">
											{{ user.fullname }}
										</p>
										<p class="card-user-title username fb-35 fc-2 mg-0">
											{{ user.username }} <i class="bx bx-check-double fc-kw-3" v-if="user.verify"></i>
										</p>
									</div>
								</div>
								<div class="card-user-footer pd-14">
									<router-link :to="{ path: user.username, query: { feature: 'suggestion' } }">
										<button class="card-user-button button pd-10">View Profile</button>
									</router-link>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="timeline-posts mg-bottom-14">
					<div class="timeline-post-loading animate-loading flex flex-center bg-1" v-if="data.posts.loading">
						<div class="animate">
							<div class="spinner"></div>
						</div>
					</div>
					<div class="timeline-post" v-for="( post, index ) in data.posts.lists" v-else>
						<div class="card-post" v-if="( data.posts.scroll >= index +1 )">
							<div class="card-post-header pd-14 flex flex-left">
								<Avatar :options="postAuthorNormalize( post.author )" />
								<router-link class="card-post-link-profile" :to="{ path: post.author.username, query: { feature: 'admin-timeline' } }">
									{{ post.author.username }} <i class="bx bx-check-double fc-kw-3" v-if="post.author.verify"></i>
								</router-link>
								<button class="card-post-header-button button flex flex-center" @click="onSlide( post, 'options' )">
									<i class="bx bx-dots-horizontal-rounded fs-20"></i>
								</button>
							</div>
							<div class="card-post-content">
								<swiper :options="postGalerySwiper()" @dblclick="postOnStar( post )">
									<Avatar :options="postGaleryNormalize( image )" v-for="image in post.images.common" />
								</swiper>
								<div class="card-post-label flex">
									<button class="card-post-label-button button star pd-10 fs-18 flex flex-center" @click="postOnStar( post )">
										<i :class="[ 'card-post-label-ic', 'bx', 'bxs-star', 'fs-20', post.stared ? 'active' : '', post.onstar ? 'bx-flashing' : '' ]"></i>
									</button>
									<button class="card-post-label-button button view pd-10 fs-18 flex flex-center">
										<i :class="[ 'card-post-label-ic', 'bx', 'bxs-show', 'fs-20', post.viewed ? 'active' : '', post.onview ? 'bx-flashing' : '' ]"></i>
									</button>
									<button class="card-post-label-button button insight pd-10 fs-18 flex flex-center">
										<i class="card-post-label-ic bx bx-bar-chart fs-20"></i>
									</button>
									<button class="card-post-label-button button save pd-10 fs-18 flex flex-center" @click="postOnSave( post )">
										<i :class="[ 'card-post-label-ic', 'bx', 'bxs-bookmark', 'fs-20', post.saved ? 'active' : '', post.onsave ? 'bx-flashing' : '' ]"></i>
									</button>
								</div>
							</div>
							<div class="card-post-footer pd-14">
								<p class="card-post-text onerror" v-if="post.error">{{ post.error }}</p>
								<p class="card-post-title mg-bottom-14">
									<router-link class="common-name fb-45" :to="{ path: '/p/' + post.node, query: { feature: 'dashboard' } }">
										{{ post.name.common }}
									</router-link>
									<br/>
									<router-link class="latin-name fb-35" :to="{ path: '/p/' + post.node, query: { feature: 'dashboard' } }">
										{{ post.name.latin }}
									</router-link>
								</p>
								<p class="card-post-description mg-bottom-14" v-for="description in post.description">
									{{ description }}
								</p>
								<div class="card-post-original mg-bottom-14" v-if="post.original">
									<p class="card-post-title fb-45 fc-1 fs-14">Original</p>
									<p class="card-post-text">
										{{ post.original }}
									</p>
								</div>
								<div class="card-post-utility mg-bottom-14" v-if="post.utility.list || post.utility.text">
									<p class="card-post-title fb-45 fc-1 fs-14">Utility</p>
									<p class="card-post-text" v-if="post.utility.text" v-for="text in post.utility.text">
										{{ text }}
									</p>
									<ol class="pd-14" v-if="post.utility.list">
										<li class="plant-utility-text plant-description mg-bottom-14 mg-lc-bottom" v-for="utility in post.utility.list">{{ utility }}</li>
									</ol>
								</div>
								<div class="card-post-scientific" v-if="( post.scientific )">
									<p class="card-post-title fb-45 fc-1 fs-14">Scientific of {{ post.name.common }}</p>
									<table class="table collapse" width="100%">
										<tr class="table-row" v-for="( value, name ) in post.scientific">
											<td class="table-data">{{ name }}</td>
											<td class="table-data" v-if="( name === 'clades' && value.length !== 0 )">
												<p class="data" v-for="clade in value">
													{{ clade }}
												</p>
											</td>
											<td class="table-data" v-else>{{ value ? value : "None" }}</td>
										</tr>
									</table>
								</div>
							</div>
						</div>
					</div>
				</div>
				<Slide :class="[ data.posts.active ? 'slide-active' : '' ]">
					<SlideExit @close="onSlide" />
					<SlideMain>
						<SlideContent v-if="data.posts.active">
							<template v-slot:default>
								<li class="slide-list flex flex-left" @click="onCopy( data.posts.active )">
									<i :class="[ 'bx', 'bx-link', data.posts.active.copied ? 'fc-an-2' : 'ic-3' ]"></i> Copy Link
								</li>
								<li class="slide-list flex flex-left" @click="onSlideDeep( 1 )">
									<i :class="[ 'bx', 'bx-star', data.posts.active.stared ? 'fc-pw-2' : 'ic-3' ]"></i> See Stars
								</li>
								<li class="slide-list flex flex-left" @click="onSlideDeep( 2 )">
									<i :class="[ 'bx', 'bx-show', data.posts.active.viewed ? 'fc-kw-2' : 'ic-3' ]"></i> See Viewers
								</li>
								<li class="slide-list flex flex-left" @click="onSlideDeep( 3 )">
									<i class="bx bx-bar-chart ic-3"></i> See Insights
								</li>
								<li class="slide-list flex flex-left">
									<i class="bx bx-user ic-3"></i>
									<router-link class="fc-3" :to="{ path: data.posts.active.author.username, query: { feature: 'post', post: data.posts.active.node } }">
										Visit Profile
									</router-link>
								</li>
								<li class="slide-list flex flex-left" @click="onSlideDeep( 4 )">
									<i class="bx bx-trash ic-3"></i> Delete Articel
								</li>
							</template>
							<template v-slot:deepable>
								<SlideDeep :class="[ data.posts.activeDeep === 1 ? 'slide-active' : '' ]" @prev="onSlideDeep">
									<template v-slot:header>
										{{ data.posts.active.stars.length }} Stars
									</template>
									<template v-slot:default>
										<li class="slide-list flex flex-left" v-for="star in data.posts.active.stars">
											<Avatar :options="userListAvatar( star.profile )" />
											<router-link class="fb-45 fc-1" :to="{ path: star.profile.username }">
												{{ star.profile.username }} <i class="bx bx-check-double fc-kw-3" v-if="star.profile.verify"></i>
											</router-link>
										</li>
									</template>
								</SlideDeep>
								<SlideDeep :class="[ data.posts.activeDeep === 2 ? 'slide-active' : '' ]" @prev="onSlideDeep">
									<template v-slot:header>
										{{ data.posts.active.views.length }} Views
									</template>
									<template v-slot:default>
										<li class="slide-list flex flex-left" v-for="view in data.posts.active.views">
											<Avatar :options="userListAvatar( view.profile )" />
											<router-link class="fb-45 fc-1" :to="{ path: view.profile.username }">
												{{ view.profile.username }} <i class="bx bx-check-double fc-kw-3" v-if="view.profile.verify"></i>
											</router-link>
										</li>
									</template>
								</SlideDeep>
								<SlideDeep :class="[ data.posts.activeDeep === 3 ? 'slide-active' : '' ]" @prev="onSlideDeep">
									<template v-slot:header>
										Insights
									</template>
									<template v-slot:default>
										<h6 class="slide-title">Current Month</h6>
										<Chart type="bar"
											:labels="[ 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun' ]"
											:datasets="[{ label: 'Stars', data: data.posts.active.insights.star[0], backgroundColor: true },{ label: 'Views', data: data.posts.active.insights.view[0], backgroundColor: true }]" />
										<h6 class="slide-title mg-top-14">Previous Month</h6>
										<Chart type="bar"
											:labels="[ 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun' ]"
											:datasets="[{ label: 'Stars', data: data.posts.active.insights.star[1] },{ label: 'Views', data: data.posts.active.insights.view[1] }]" />
									</template>
								</SlideDeep>
							</template>
						</SlideContent>
					</SlideMain>
				</Slide>
				<button class="timeline-more button flex flex-center pd-14" @click="() => data.posts.scroll += 10" v-if="data.posts.scroll < data.posts.scrollLimit">
					<i class="bx bx-plus ic-3"></i>
				</button>
				<button class="timeline-refresh button flex flex-center pd-14" @click="fetchPosts" v-else>
					<i class="bx bx-refresh ic-3"></i>
				</button>
			</div>
		`
	};
	
	/*
	 * Admin Home Component.
	 *
	 * @options Object $shared
	 */
	const $AdminHomeComponent = {
		
		/*
		 * Component properties.
		 *
		 * @values Function
		 */
		data: () => ({
			display: {
				tabs: {
					dashboard: [
						"bx-home",
						"bxs-home"
					],
					insights: [
						"bx-pie-chart-alt-2",
						"bxs-pie-chart-alt-2"
					],
					activity: [
						"bx-time",
						"bxs-time"
					],
					messages: [
						"bx-message-rounded-dots",
						"bxs-message-rounded-dots"
					],
					reports: [
						"bx-error-alt",
						"bxs-error-alt"
					],
					users: [
						"bx-group",
						"bxs-group"
					]
				},
				tab: "dashboard"
			}
		}),
		
		/*
		 * Component props.
		 *
		 * @values Object
		 */
		props: {
			shared: {
				type: Object,
				required: true
			}
		},
		
		/*
		 * Component computation.
		 *
		 * @values Object
		 */
		computed: {
		},
		
		/*
		 * Component watcher.
		 *
		 * @values Object
		 */
		watch: {
			
			/*
			 * Watch route query.
			 *
			 * @values Object
			 */
			"$route.query": {
				handler: function( query )
				{
					// Check if route path is /search.
					if( this.$route.path.match( /^\/$/ ) )
					{
						// Default tab is dashboard.
						var tab = "dashboard";
						
						// Check if query `tab` is String type.
						if( is( query.tab, String ) )
						{
							// Get tab.
							tab = query.tab.toLowerCase();
							
							// Check if tab is exists.
							if( is( this.display.tabs[tab], Object ) )
							{
								// Default tab is dashboard.
								tab = "dashboard";
							}
						}
						
						// Change current tab.
						this.display.tab = tab;
					}
				},
				deep: true,
				immediate: true
			}
		},
		
		/*
		 * Component mount.
		 *
		 * @return Void
		 */
		mounted: function()
		{},
		
		/*
		 * Component methods.
		 *
		 * @values Object
		 */
		methods: {
		},
		
		/*
		 * Component requires.
		 *
		 * @values Object
		 */
		components: {
			Timeline: $TimelineComponent,
			Avatar: $AvatarComponent,
			Chart: $ChartComponent
		},
		
		/*
		 * Component template.
		 *
		 * @values String
		 */
		template: `
			<div class="super flex">
				<div class="super-navbar">
					<div class="super-navbar-tabs scroll-hidden">
						<router-link class="super-navbar-link dp-block" :data-active="tab === display.tab" :to="{ query: { tab: tab } }" v-for="( icon, tab ) in display.tabs">
							<button :class="[ 'super-navbar-button', 'button', 'flex', 'flex-left', 'pd-14', tab === display.tab ? 'active' : '' ]">
								<i :class="[ 'super-navbar-icon', 'bx', icon[( tab === display.tab ? 1 : 0 )] ]"></i>
								<span class="super-navbar-text">{{ tab }}</span>
							</button>
						</router-link>
					</div>
					<hr class="super-navbar-hr" />
				</div>
				<div class="super-dashboard" v-if="( display.tab === 'dashboard' )">
					<timeline :shared="shared" />
				</div>
				<div class="super-insights" v-if="( display.tab === 'insights' )">
					Insights
				</div>
				<div class="super-insights" v-if="( display.tab === 'activity' )">
					Activity
				</div>
				<div class="super-insights" v-if="( display.tab === 'messages' )">
					Messages
				</div>
				<div class="super-insights" v-if="( display.tab === 'reports' )">
					Reports
				</div>
				<div class="super-insights" v-if="( display.tab === 'users' )">
					Users
				</div>
			</div>
		`
	};
	
	/*
	 * Home Component.
	 *
	 */
	
	/*
	 * Signin Component.
	 *
	 */
	const $SigninComponent = {
		
		/*
		 * Component properties.
		 *
		 * @values Function
		 */
		data: () => ({
			avatar: {
				inject: {
					avatar: [
						"signin-avatar"
					],
					wrapper: "signin-avatar-wrapper"
				},
				title: "Singin Avatar",
				alt: "Signin Avatar",
				src: "/assets/images/banner/banner-NRQV-hBF10M.jpg"
			},
			error: false,
			signed: false,
			models: {
				username: null,
				password: null
			},
			type: "password"
		}),
	
		/*
		 * Component mount.
		 *
		 * @return Void
		 */
		mounted: function()
		{
			// Check if user is signed.
			if( $Authenticated() )
			{
				this.signed = true;
				
				// Set error title.
				$Title( "Forbiden" );
			}
			else {
				$Title( "Signin" );
			}
		},
		
		/*
		 * Component methods.
		 *
		 * @values Object
		 */
		methods: {
	
			/*
			 * Set input type for password/ show hidden password.
			 *
			 * @return Void
			 */
			show: function()
			{
				this.$refs.password.type = this.type = this.type !== "password" ? "password" : "text";
			},
	
			/*
			 * Handle user signin.
			 *
			 * @params Event $e
			 * 
			 * @return Promise
			 */
			submit: async function( e )
			{
				// Disable form action.
				e.preventDefault();
				
				// Copy object instance.
				var self = this;
				
				// Get model names.
				var models = Object.keys( self.models );
				
				// Validate models.
				for( let i in models )
				{
					// Check if model value is empty.
					if( valueIsEmpty( self.models[models[i]] ) )
					{
						this.error = f( "Form input {} can't be empty.", models[i] ); return;
					}
				}
				
				// Remove error message.
				self.error = false;
				
				// Send request to server.
				await $Request( "POST", "/api/user/signin", {
					data: {
						username: self.models.username,
						password: self.models.password
					},
					headers: {
						"Content-Type": "application/x-www-form-urlencoded"
					}
				})
				
				// Handle request.
				.then( res => {
					
					// Parse json strings.
					var resp = JSON.parse( res.responseText );
					
					// Save response.
					self.response = resp;
					
					// Check if request response on error.
					if( resp.error )
					{
						// Save error message.
						self.error = resp.message;
					}
					else {
						window.location = "/";
					}
				})
				
				// Handle request error.
				.catch( err => $Request.onError( self, err ) );
			}
		},
		
		/*
		 * Component requires.
		 *
		 * @values Object
		 */
		components: {
			Avatar: $AvatarComponent,
			Error: $Error
		},
		
		/*
		 * Component template.
		 *
		 * @values String
		 */
		template: `
			<div class="signin flex flex-center">
				<div class="signin-error flex flex-center" v-if="signed">
					<Error>
						You are signed!
					</Error>
				</div>
				<div class="signin-wrapper flex flex-center rd-square" v-else>
					<div class="signin-banner">
						<Avatar :options="avatar" />
					</div>
					<div class="signin-form form" @submit="submit">
						<div class="signin-icon-box flex flex-center">
							<i class="signin-icon bx bx-user fc-pw-2 fs-42"></i>
						</div>
						<div class="signin-form-groups form-groups pd-14">
							<div class="signin-form-group form-group">
								<label class="form-label fc-1" for="username">Username</label>
								<input class="form-input input pd-10" type="text" v-model="models.username" required />
							</div>
							<div class="signin-form-group form-group">
								<label class="form-label fc-1" for="password">Password</label>
								<input class="form-input input pd-10" type="password" v-model="models.password" ref="password" required />
								<button class="form-button-show button" @click="show">
									<i :class="[ '', 'bx', type === 'password' ? 'bx-show' : 'bx-hide' ]"></i>
								</button>
							</div>
							<button class="form-submit button button-cc mg-bottom-14" @click="submit">Signin</button>
							<router-link to="/signin/forgot/password">
								Forgot password ??
							</router-link>
							<div class="signin-response-error rd-square mg-top-14 pd-14" v-if="error">
								<div class="signin-response-error-slot">
									{{ error }}
								</div>
								<div class="signin-response-error-close" @click="error = false">
									<i class="bx bx-x"></i>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		`
	};
	
	/*
	 * Session Component.
	 *
	 */
	
	/*
	 * Forgot Password Component.
	 *
	 */
	
	/*
	 * Reset Password Component.
	 *
	 */
	
	/*
	 * Signup Component.
	 *
	 */
	const $SignupComponent = {
		
		/*
		 * Component properties.
		 *
		 * @values Function
		 */
		data: () => ({
			avatar: {
				inject: {
					avatar: [
						"signin-avatar",
						"signup-avatar"
					],
					wrapper: [
						"signin-avatar-wrapper",
						"signup-avatar-wrapper"
					]
				},
				title: "Singup Avatar",
				alt: "Signup Avatar",
				src: "/assets/images/banner/banner-heLWtuAN3c.jpg"
			},
			error: false,
			signed: false,
			models: {
				fullname: null,
				username: null,
				usermail: null,
				password: null
			},
			type: "password"
		}),
	
		/*
		 * Component mount.
		 *
		 * @return Void
		 */
		mounted: function()
		{
			// Check if user is signed.
			if( $Authenticated() )
			{
				this.signed = true;
				
				// Set error title.
				$Title( "Forbiden" );
			}
			else {
				$Title( "Signup" );
			}
		},
		
		/*
		 * Component methods.
		 *
		 * @values Object
		 */
		methods: {
			
			/*
			 * Set input type for password/ show hidden password.
			 *
			 * @return Void
			 */
			show: function()
			{
				this.$refs.password.type = this.type = this.type !== "password" ? "password" : "text";
			},
	
			/*
			 * Handle user signin.
			 *
			 * @params Event $e
			 * 
			 * @return Promise
			 */
			submit: async function( e )
			{
				// Disable form action.
				e.preventDefault();
				
				// Copy object instance.
				var self = this;
				
				// Get model names.
				var models = Object.keys( self.models );
				
				// Validate models.
				for( let i in models )
				{
					// Check if model value is empty.
					if( valueIsEmpty( self.models[models[i]] ) )
					{
						this.error = f( "Form input {} can't be empty.", models[i] ); return;
					}
				}
				
				// Remove error message.
				self.error = false;
				
				// Send request to server.
				await $Request( "POST", "/api/user/signup", {
					data: self.models,
					headers: {
						"Content-Type": "application/x-www-form-urlencoded"
					}
				})
				
				// Handle request.
				.then( res => {
					
					// Parse json strings.
					var resp = JSON.parse( res.responseText );
					
					// Save response.
					self.response = resp;
					
					// Check if request response on error.
					if( resp.error )
					{
						// Save error message.
						self.error = resp.message;
					}
					else {
						window.location = "/";
					}
				})
				
				// Handle request error.
				.catch( err => $Request.onError( self, err ) );
			}
		},
		
		/*
		 * Component requires.
		 *
		 * @values Object
		 */
		components: {
			Avatar: $AvatarComponent,
			Error: $Error
		},
		
		/*
		 * Component template.
		 *
		 * @values String
		 */
		template: `
			<div class="signup signin flex flex-center">
				<div class="signup signin-error flex flex-center" v-if="signed">
					<Error>
						You are signed!
					</Error>
				</div>
				<div class="signup-wrapper signin-wrapper flex flex-center rd-square" v-else>
					<div class="signin-banner">
						<Avatar :options="avatar" />
					</div>
					<div class="signup-form signin-form form" @submit="submit">
						<div class="signup-icon-box signin-icon-box flex flex-center">
							<i class="signup-icon signin-icon bx bx-user fc-pw-2 fs-42"></i>
						</div>
						<div class="signup-form-groups signin-form-groups form-groups pd-14">
							<div class="signup-form-group signin-form-group form-group">
								<label class="form-label fc-1" for="fullname">Fullname</label>
								<input class="form-input input pd-10" type="text" v-model="models.fullname" required />
							</div>
							<div class="signup-form-group signin-form-group form-group">
								<label class="form-label fc-1" for="username">Username</label>
								<input class="form-input input pd-10" type="text" v-model="models.username" required />
							</div>
							<div class="signup-form-group signin-form-group form-group">
								<label class="form-label fc-1" for="usermail">Usermail</label>
								<input class="form-input input pd-10" type="email" v-model="models.usermail" required />
							</div>
							<div class="signup-form-group signin-form-group form-group">
								<label class="form-label fc-1" for="password">Password</label>
								<input class="form-input input pd-10" type="password" v-model="models.password" ref="password" required />
								<button class="form-button-show button" @click="show">
									<i :class="[ '', 'bx', type === 'password' ? 'bx-show' : 'bx-hide' ]"></i>
								</button>
							</div>
							<button class="form-submit button button-cc mg-bottom-14" @click="submit">Signup</button>
							<router-link to="/signin">
								Already have an account ??
							</router-link>
							<div class="signup-response-error signin-response-error rd-square mg-top-14 pd-14" v-if="error">
								<div class="signup--response-error-slot signin-response-error-slot">
									{{ error }}
								</div>
								<div class="signup--response-error-close signin-response-error-close" @click="error = false">
									<i class="bx bx-x"></i>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		`
	};
	
	/*
	 * Explore Component.
	 *
	 */
	const $ExploreComponent = {
		
		/*
		 * Component properties.
		 *
		 * @values Function
		 */
		data: () => ({
			error: false,
			explore: null,
			loading: true,
			response: null
		}),
	
		/*
		 * Component mount.
		 *
		 * @return Promise
		 */
		mounted: async function()
		{
			// Copy object instance.
			var self = this;
			
			// Get all resources required.
			await $Request( "GET", "/api/data/shared/explore" )
				
				// Handle request onload.
				.then( res =>
				{
					// Parse json strings.
					var resp = JSON.parse( res.responseText );
					
					// Save response.
					self.response = resp;
					
					// Check if request response on error.
					if( resp.error )
					{
						// Save error message.
						self.error = resp.message;
					}
					else {
						self.explore = resp.data;
					}
				})
				
				// Handle request error.
				.catch( err => $Request.onError( self, err ) );
			
			// Disable loading animation.
			this.loading = false;
		},
		
		/*
		 * Component methods.
		 *
		 * @values Object
		 */
		methods: {
			
			/*
			 * Avatar normalizer.
			 *
			 * @params Object $Plant
			 * 
			 * @return Object
			 */
			avatarNormalizer: plant => ({
				inject: {
					avatar: [
						"explore-avatar",
						"flex",
						"flex-center"
					],
					wrapper: [
						"explore-avatar-wrapper"
					]
				},
				route: f( "/p/{}?feature=explore", plant.node ),
				title: plant.name.common,
				alt: plant.name.latin,
				src: plant.images.banner	
			})
		},
		
		/*
		 * Component requires.
		 *
		 * @values Object
		 */
		components: {
			Avatar: $AvatarComponent,
			Error: $Error
		},
		
		/*
		 * Component template.
		 *
		 * @values String
		 */
		template: `
			<div class="explore">
				<div class="explore-loading animate-loading flex flex-center pd-24" v-if="( loading )">
					<div class="animate">
						<div class="spinner"></div>
					</div>
				</div>
				<div class="explore-response" v-else>
					<div class="explore-error flex flex-center" v-if="( error || explore && explore.length === 0 )">
						<Error>
							<b>$Request</b> {{ explore && explore.length === 0 ? "No plant explore" : error }}
						</Error>
					</div>
					<div class="explore-success flex flex-wrap pd-14" v-else>
						<div class="explore-card card rd-square" v-for="plant in explore">
							<div class="explore-card-body card-body">
								<Avatar :options="avatarNormalizer( plant )" />
								<div class="explore-label pd-10">
									<p class="explore-label-common mg-0">
										<router-link class="fc-1" :to="{ path: '/p/' + plant.node }">
											{{ plant.name.common }}
										</router-link>
									</p>
									<p class="explore-label-latin fs-14 mg-0">
										<router-link class="fc-1" :to="{ path: '/p/' + plant.node }">
											{{ plant.name.latin }}
										</router-link>
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		`
	};
	
	/*
	 * Search Component.
	 *
	 */
	const $SearchComponent = {
		
		/*
		 * Component properties.
		 *
		 * @values Function
		 */
		data: () => ({
			model: null,
			error: false,
			loading: false,
			response: null,
			results: [],
			articel: null,
			users: null,
			tabs: [
				"All",
				"Flower",
				"Fruit",
				"Plant",
				"Root",
				"Tree",
				"User",
				"Vegetable"
			],
			tab: 0
		}),
		
		/*
		 * Component watcher.
		 *
		 * @values Object
		 */
		watch: {
			
			/*
			 * Watch route query.
			 *
			 * @values Object
			 */
			"$route.query": {
				handler: function( query )
				{
					// If query `q` is String type.
					if( is( query.q, String ) )
					{
						// If query `q` is not equals current model values.
						if( query.q !== this.model )
						{
							this.model = query.q;
							this.submit();
						}
					}
					else {
						
						// Check if route path is /search.
						if( this.$route.path.match( /^\/search/i ) )
						{
							// Reset properties value.
							this.resets();
						}
					}
					
					// If query `t` is exists.
					if( not( query.t, "Undefined" ) )
					{
						// If tab is int.
						if( query.t.match( /^\d+$/ ) )
						{
							// Parse tab to Int.
							var tab = parseInt( query.t );
							
							// If current tab is not equal with query `t`.
							if( this.tab !== tab )
							{
								this.select( tab );
							}
						}
					}
				},
				deep: true,
				immediate: true
			}
		},
		
		/*
		 * Component computation.
		 *
		 * @values Object
		 */
		computed: {},
		
		/*
		 * Component mount.
		 *
		 * @return Void
		 */
		mounted: function()
		{
			// Check if url has query `q`.
			if( this.$route.query.q )
			{
				// Set model value.
				this.model = this.$route.query.q;
				
				// Set tab value.
				this.tab = this.$route.query.t ? this.$route.query.t : 0;
				
				// Articel and User result has exists.
				if( not( this.articel = $data.shared.search.articel, "Undefined" ) &&
					not( this.users = $data.shared.search.users, "Undefined" ) )
				{
					// Manipulate response.
					this.response = {
						error: false,
						status: "Ok",
						data: $data.shared.search,
						message: "Success"
					};
					
					this.results = [
						...$data.shared.search.articel,
						...$data.shared.search.users
					];
					
					// Empty search result from shared.
					$data.shared.search.articel = false;
					$data.shared.search.users = false;
					
					// Only display by tab selection.
					this.select( this.tab );
				}
				else {
					this.submit();
				}
			}
		},
		
		/*
		 * Component methods.
		 *
		 * @values Object
		 */
		methods: {
			
			/*
			 * Avatar normalizer.
			 *
			 * @params Object $args
			 * @params String $type
			 * 
			 * @return Object
			 */
			avatar: function( args, type = "plant" )
			{
				return({
					inject: {
						avatar: [
							is( args.account, String ) ? "user" : "",
							"search-avatar",
							"mg-right-14"
						],
						image: [
							"search-avatar-image",
						],
						wrapper: [
							"search-avatar-wrapper"
						]
					},
					title: is( args.username, String ) ? args.username : args.name.common,
					alt: is( args.username, String ) ? args.fullame : args.name.latin,
					src: is( args.username, String ) ? args.userpict.main : args.images.banner
				});
			},
			
			/*
			 * Focusable input.
			 *
			 * @params Event $e
			 * 
			 * @return Void
			 */
			focus: function( e )
			{
				e.target.focus();
			},
	
			/*
			 * Input Key Press handler.
			 *
			 * @params Event $e
			 * 
			 * @return Void
			 */
			keypress: function( e )
			{
				// Check if on key press is enter key.
				if( e.keyCode === 13 )
				{
					this.submit( e );
				}
			},
	
			/*
			 * Reset property values.
			 *
			 * @return Void
			 */
			resets: function()
			{
				this.model = null;
				this.error = false;
				this.loading = false;
				this.response = null;
				this.results = null;
				
				// Push route query.
				$Router.push({ path: "/search", query: {} });
			},
			
			/*
			 * Select search type.
			 *
			 * @params Number $tab
			 *
			 * @return Void
			 */
			select: function( tab )
			{
				// Copy object instance.
				var self = this;
				
				// Check if tab is all.
				if( this.tabs[tab] === "All" )
				{
					this.results = [
						...this.articel,
						...this.users
					];
				}
				
				// Check if tab is users.
				else if( this.tabs[tab] === "User" )
				{
					this.results = this.users;
				}
				
				// Plant type.
				else {
					
					// Set as articels.
					self.results = [];
					
					// Mapping all results.
					$Mapper( self.articel, function( i, articel, length )
					{
						// Check if articel type is in valid.
						if( $Levels[self.tabs[tab].toLowerCase()] === articel.type )
						{
							// Push articel.
							self.results.push( articel );
						}
					});
				}
				
				// Push route query.
				$Router.push({ path: "/search", query: { q: self.$route.query.q, t: tab } });
				
				// Change tab.
				this.tab = tab;
			},
			
			/*
			 * Convert longtext to shorttext.
			 *
			 * @params String $text
			 * @params Number #min
			 * 
			 * @return String
			 */
			short: function( text, min = 70 )
			{
				if( not( text, "Null" ) )
				{
					// Regular expression collections.
					var result = null;
					var regexp = [
						{
							pattern: /(?:(\@\[(?<color>[0-9a-fA-F]+)\:(?<username>[a-zA-Z_\x80-\xff]([a-zA-Z0-9_\.\x80-\xff]{1,}[a-zA-Z0-9_\x80-\xff]{1})*)\]\;*))/gms,
							handler: result => f( "@{}", result[3] )
						},
						{
							pattern: /(?:(\@\[(?<style>bx|bxl|bxs)(\:(?<color>[0-9a-fA-F]+))*\:(?<icon>[a-zA-Z\x80-\xff]([a-zA-Z0-9\-\x80-\xff]{0,}[a-zA-Z0-9\x80-\xff]{1})*)\]\;*))/gms,
							handler: result => "\xb7"
						}
					];
					
					// Mapping patterns.
					$Mapper( regexp, ( index, regexp ) =>
					{
						do
						{
							// Checks if the regex captures the result.
							if( result = regexp.pattern.exec( text ) )
							{
								// Replace caught character.
								text = text.replace( result[0], regexp.handler( result ) ); continue;
							}
							break;
						}
						while( result );
					});
					
					// Shorting text values.
					text = text.length > min ? text.slice( 0, min ) + "..." : text;
				}
				return( text );
			},
	
			/*
			 * Handle searching.
			 *
			 * @params Event $e
			 * 
			 * @return Promise
			 */
			submit: async function( e )
			{
				// If parameter is Object Event.
				if( is( e ).match( /Event/i ) )
				{
					// Disable form action.
					e.preventDefault();
				}
				
				// Copy object instance.
				var self = this;
					
					// Allow loading animation.
					self.loading = true;
				
				if( self.model !== null &&
					self.model !== "" )
				{
					// Normalize model.
					var model = self.model.replace( /\s/g, "+" );
					
					// Push route query.
					$Router.push({ path: "/search", query: { q: model, t: self.tab } });
					
					// Search resources.
					await $Request( "GET", f( "/api/search?q={}", self.tab === self.tabs.indexOf( "Users" ) ? f( "{}&c={}", model, $Levels.user ) : model ) )
						
						// Handle request.
						.then( res => {
						
							// Parse json strings.
							var resp = JSON.parse( res.responseText );
							
							// Save response.
							self.response = resp;
							
							// Check if request response on error.
							if( resp.error )
							{
								// Save error message.
								self.error = resp.message;
							}
							else {
								self.users = resp.data.users;
								self.articel = resp.data.articel;
								self.results = [
									...resp.data.articel,
									...resp.data.users
								];
							}
						})
						
						// Handle request error.
						.catch( err => $Request.onError( self, err ) );
				}
				
				// Only display by tab selection.
				self.select( self.tab );
				
				// Disable loading animation.
				self.loading = false;
			}
		},
		
		/*
		 * Component requires.
		 *
		 * @values Object
		 */
		components: {
			Avatar: $AvatarComponent,
			Error: $Error
		},
		
		/*
		 * Component template.
		 *
		 * @values String
		 */
		template: `
			<div class="search">
				<div class="search-response flex" v-if="( response )">
					<div class="search-navbar">
						<ul class="search-navbar-ul ul">
							<li :class="[ 'search-navbar-li', 'li', 'li-type-none', 'pd-14', tab === i ? 'active' : '' ]" v-for="( t, i ) in tabs" @click="select( i )">
								{{ t }}
							</li>
						</ul>
						<hr class="search-navbar-hr dp-none" />
					</div>
					<div class="search-results">
						<div class="search-result-match bg-1 fc-1 pd-14">
							<span class="fb-45">{{ model }}</span> Searched.
							<button class="search-result-clear button" @click="resets">
								<i class="bx bx-x fs-22"></i>
							</button>
						</div>
						<div class="search-result-match bg-1 fc-1 pd-14">
							<span class="fb-45">{{ results.length }}</span> Search results.
						</div>
						<div class="search-result" v-for="result in results">
							<Avatar :options="avatar( result )" />
							<div class="search-info">
								<h5 class="search-info-title mg-0">
									<router-link class="fc-1" :to="{ path: '/' + result.username }" v-if="result.account">
										{{ result.fullname }} <i class="bx bx-check-double fc-kw-3" v-if="result.verify"></i>
									</router-link>
									<router-link class="fc-1" :to="{ path: '/p/' + result.node }" v-else>
										{{ result.name.common }}
									</router-link>
								</h5>
								<p class="search-info-subtitle fb-35 fc-2 mg-0">
									<router-link class="fc-3" :to="{ path: '/' + result.username }" v-if="result.account">
										{{ result.username }}
									</router-link>
									<router-link class="fc-3" :to="{ path: '/p/' + result.node }" v-else>
										{{ result.name.latin }}
									</router-link>
								</p>
								<p class="search-info-author mg-0" v-if="result.author">
									Articel created by
									<router-link class="fb-45 fc-3" :to="{ path: '/' + result.author.username }">
										{{ result.author.fullname }}
									</router-link>
								</p>
								<p class="search-info-text mg-top-2">
									{{ this.short( result.account ? result.bio : result.description[0] ) }}
								</p>
							</div>
						</div>
					</div>
				</div>
				<div class="search-error" v-else-if="( error )">
					<Error>
						{{ error }}
					</Error>
				</div>
				<div class="search-loading" v-else-if="( loading )">
					<div class="animate-loading flex flex-center pd-24">
						<div class="animate">
							<div class="spinner"></div>
						</div>
					</div>
				</div>
				<div class="search-center flex flex-center" v-else>
					<div class="search-blockable dp-block">
						<form class="search-form flex flex-center rd-square" @submit="submit">
							<input class="search-form-input input pd-14" type="text" v-model="model" @input="focus" />
							<button class="search-form-button button button-cc rd-none flex flex-center pd-8">
								<i class="search-form-icon bx bx-search-alt"></i>
							</button>
						</form>
						<p class="ta-center pd-14">Look for Flower, Fruit, Plant, Root, Tree, User or whatever suits you!</p>
					</div>
				</div>
			</div>
		`
	};
	
	/*
	 * About Component.
	 *
	 */
	
	/*
	 * Contact Component.
	 *
	 */
	const $ContactComponent = {
		
		/*
		 * Component properties.
		 *
		 * @values Function
		 */
		data: () => ({
			authors: [
				{
					name: "Ari Setiawan",
					email: "ari160824@gmail.com",
					phone: "+62 858-3921-1030",
					github: "hxAri",
					linkedin: "hxari"
				},
				{
					name: "Alvin Arif Pirmansyah",
					email: null,
					phone: "+62 857-6709-4722",
					github: null,
					linkedin: null
				},
				{
					name: "Wahyu Fahreza",
					email: null,
					phone: "+62 856-4136-3864",
					github: null,
					linkedin: null
				},
				{
					name: "Rizki Solehah",
					email: null,
					phone: "+62 812-7248-9485",
					github: null,
					linkedin: null
				},
				{
					name: "Indri Rani Saputri",
					email: null,
					phone: "+62 831-4403-7640",
					github: null,
					linkedin: null
				}
			],
			avatar: {
				inject: {
					wrapper: "contact-avatar-wrapper",
					avatar: "contact-avatar",
					image: "contact-avatar-image",
					cover: [
						"contact-avatar-cover",
						"flex",
						"flex-center"
					]
				},
				slot: {
					template: `
						<div class="contact-avatar-cblock">
							<h1 class="fc-cc-4 mg-bottom-10">Page Information</h1>
							<p class="fc-cc-3">Overall details of my contact information.</p>
							<table class="table">
								<tr class="table-row">
									<td class="table-data">
										<i class="table-icon fs-28 fc-kw-2 bx bxs-map-alt"></i>
									</td>
									<td class="table-data fc-cc-2">Indonesia, Lampung Province, Pringsewu Regency, Sukoharjo District, 35674</td>
								</tr>
								<tr class="table-row">
									<td class="table-data">
										<i class="table-icon fs-28 fc-kw-2 bx bxs-navigation"></i>
									</td>
									<td class="table-data">
										<a class="table-link fc-cc-2" href="">support@ggarden.com</a>
									</td>
								</tr>
								<tr class="table-row">
									<td class="table-data">
										<i class="table-icon fs-28 fc-kw-2 bx bxs-phone"></i>
									</td>
									<td class="table-data">
										<a class="table-link fc-cc-2" href="">+62 858-3921-1030</a>
									</td>
								</tr>
							</table>
						</div>
					`
				},
				title: "Contact Banner",
				alt: "Contact Banner",
				src: "/assets/images/banner/banner-GQVc6LKAzzQ.jpg"
			}
		}),
		
		/*
		 * Component methods.
		 *
		 * @values Object
		 */
		methods: {
		},
		
		/*
		 * Component requires.
		 *
		 * @values Object
		 */
		components: {
			Avatar: $AvatarComponent
		},
		
		/*
		 * Component template.
		 *
		 * @values String
		 */
		template: `
			<div class="contact">
				<div class="contact-cover flex">
					<div class="contact-banner flex flex-center">
						<h1 class="contact-title title mg-0">Contact</h1>
					</div>
					<div class="contact-banner">
						<div class="contact-block pd-22">
							<p class="mg-bottom-22">Below is the developer's contact from the Garden site, please contact if you have an important need or offer a new project request.</p>
							<div class="contact-scrollable">
								<table class="table">
									<tr class="table-row">
										<th class="table-head">Index</th>
										<th class="table-head">FName</th>
										<th class="table-head">Email</th>
										<th class="table-head">Phone</th>
										<th class="table-head">Github</th>
										<th class="table-head">Linkedin</th>
									</tr>
									<tr class="table-row" v-for="( author, index ) in authors">
										<td class="table-data">{{ index +1 }}</td>
										<td class="table-data">{{ author.name }}</td>
										<td class="table-data">{{ author.email }}</td>
										<td class="table-data">{{ author.phone }}</td>
										<td class="table-data">{{ author.github }}</td>
										<td class="table-data">{{ author.linkedin }}</td>
									</tr>
								</table>
							</div>
						</div>
					</div>
				</div>
				<div class="contact-container flex">
					<div class="contact-section">
						<Avatar :options="avatar" />
					</div>
					<div class="contact-section">
						<div class="contact-block">
							<div class="contact-box flex flex-center">
								<i class="bx bxs-phone fc-pw-3"></i>
							</div>
							<p class="pd-left-22 pd-right-22">Report any bugs you find, new feature requests or send us any suggestions or questions.</p>
							<div class="contact-form form pd-22">
								<div class="form-group">
									<label class="form-label" for="subject">Subject</label>
									<input class="form-input pd-10" type="" />
								</div>
								<div class="form-group">
									<label class="form-label" for="fullname">Fullname</label>
									<input class="form-input pd-10" type="" />
								</div>
								<div class="form-group">
									<label class="form-label" for="email">Email Address</label>
									<input class="form-input pd-10" type="" />
								</div>
								<div class="form-group">
									<label class="form-label" for="message">Message</label>
									<textarea class="form-input pd-10"></textarea>
								</div>
								<button class="form-submit button button-kw">Send Message</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		`
	};
	
	/*
	 * Privacy Component.
	 *
	 */
	const $PrivacyComponent = {
		
		/*
		 * Component properties.
		 *
		 * @values Function
		 */
		data: () => ({
		}),
		
		/*
		 * Component template.
		 *
		 * @values String
		 */
		template: `
			<div class="privacy bg-1">
				<div class="privacy-banner">
					<h1 class="privacy-title title mg-0">Privacy</h1>
				</div>
				<div class="privacy-descriptions pd-14">
					<h1 class="privacy-title title">Privacy Policy for Green Garden</h1>
					<p class="privacy-text mg-bottom-14">At Green Garden, accessible from ggarden.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Green Garden and how we use it.</p>
					<p class="privacy-text mg-bottom-14">If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.</p>
					
					<h2 class="privacy-title title">Log Files</h2>
					<p class="privacy-text mg-bottom-14">Green Garden follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information. Our Privacy Policy was created with the help of the Privacy Policy Generator.</p>
					
					<h2 class="privacy-title title">Cookies and Web Beacons</h2>
					<p class="privacy-text mg-bottom-14">Like any other website, Green Garden uses 'cookies'. These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.</p>
					<p class="privacy-text mg-bottom-14">For more general information on cookies, please read the "Cookies" article from the Privacy Policy Generator.</p>
					
					<h2 class="privacy-title title">Privacy Policies</h2>
					<p class="privacy-text mg-bottom-14">You may consult this list to find the Privacy Policy for each of the advertising partners of Green Garden.</p>
					<p class="privacy-text mg-bottom-14">Third-party ad servers or ad networks uses technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on Green Garden, which are sent directly to users' browser. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.</p>
					<p class="privacy-text mg-bottom-14">Note that Green Garden has no access to or control over these cookies that are used by third-party advertisers.</p>
					
					<h2 class="privacy-title title">Third Party Privacy Policies</h2>
					<p class="privacy-text mg-bottom-14">Green Garden's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.</p>
					<p class="privacy-text mg-bottom-14">You can choose to disable cookies through your individual browser options. To know more detailed information about cookie management with specific web browsers, it can be found at the browsers' respective websites.</p>
					
					<h2 class="privacy-title title">Children's Information</h2>
					<p class="privacy-text mg-bottom-14">Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.</p>
					<p class="privacy-text mg-bottom-14">Green Garden does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.</p>
					
					<h2 class="privacy-title title">Online Privacy Policy Only</h2>
					<p class="privacy-text mg-bottom-14">This Privacy Policy applies only to our online activities and is valid for visitors to our website with regards to the information that they shared and/or collect in Green Garden. This policy is not applicable to any information collected offline or via channels other than this website.</p>
					
					<h2 class="privacy-title title">Consent</h2>
					<p class="privacy-text">By using our website, you hereby consent to our Privacy Policy and agree to its Terms and Conditions.</p>
				</div>
			</div>
		`
	};
	
	/*
	 * Sitemap Component.
	 *
	 */
	const $SitemapComponent = {
		
		/*
		 * Component computation.
		 *
		 * @values Object
		 */
		computed: {
			map: function()
			{
				return({
					template: f( "<div class=\"sitemap-block pd-22\"><p class=\"fc-2 mg-bottom-22\">List of all front end routing paths accessible by anyone</p>{}</div>", this.mapBuilder( $Routes ).join( "<br/>" ) )
				});
			}
		},
		
		/*
		 * Component methods.
		 *
		 * @values Object
		 */
		methods: {
			
			/*
			 * Sitemap builder.
			 *
			 * @params Array $routes
			 * @params String $parent
			 *
			 * @return String
			 */
			mapBuilder: function( routes, parent )
			{
				// Link stack.
				var stack = [];
				
				// Mapping routes.
				for( let i in routes )
				{
					// Get route path.
					var path = {
						ori: routes[i].path.replaceAll( /^\/|\([^\)]+\)/g, "" ),
						rep: routes[i].path.replaceAll( /^\/|\:|\([^\)]+\)/g, "" )
					};
					
					// If route has parent.
					if( is( parent, String ) )
					{
						// Recreate route path.
						path = {
							ori: f( "{}/{}", parent.replaceAll( /^\/|\([^\)]+\)/g, "" ), path.ori ),
							rep: f( "{}/{}", parent.replaceAll( /^\/|\:|\([^\)]+\)/g, "" ), path.rep )
						};
					}
					
					// Push stack.
					stack.push( 
						f( "<router-link class=\"sitemap-route fc-3\" to=\"/{}?feature=sitemap\">/{}</router-link>", ...[
							path.rep, 
							path.ori 
						])
					);
					
					// Check if route has children.
					if( is( routes[i].children, Array ) )
					{
						// Rebuild children routes.
						stack.push( ...this.mapBuilder( routes[i].children, path.ori ) );
					}
				}
				
				// Return stacks.
				return( stack );
			}
		},
		
		/*
		 * Component template.
		 *
		 * @values String
		 */
		template: `
			<div class="sitemap">
				<div class="sitemap-banner flex flex-center">
					<div class="sitemap-section flex flex-center">
						<h1 class="sitemap-title title">Sitemap</h1>
					</div>
					<div class="sitemap-section">
						<component v-bind:is="map"></component>
					</div>
				</div>
			</div>
		`
	};
	
	/*
	 * Profile Component.
	 *
	 */
	const $ProfileComponent = {
		
		/*
		 * Component properties.
		 *
		 * @values Function
		 */
		data: () => ({
			error: false,
			models: {
				common: {
					fullname: {
						error: false,
						value: null
					},
					username: {
						error: false,
						value: null
					},
					bio: {
						error: false,
						value: null
					}
				},
				userpict: {
					main: null,
					cover: null
				}
			},
			tab: "posts",
			tabs: [
				"posts",
				"saveds",
				"edits",
				"settings",
				"report"
			],
			loading: false,
			profile: false,
			response: false
		}),
		
		/*
		 * Component computation.
		 *
		 * @values Object
		 */
		computed: {
			bio: function()
			{
				return({
					template: this.bioBuilder()
				});
			}
		},
		
		/*
		 * Component watcher.
		 *
		 * @values Object
		 */
		watch: {
			
			/*
			 * Watch route parameter.
			 *
			 * @values Object
			 */
			"$route.params.username": {
				handler: async function( username )
				{
					// Remove error messages.
					this.error = false;
					
					// If the router does not have a name,
					// or if it has a name starting with ^profile.
					if( not( this.$route.name, String ) || is( this.$route.name, String ) && this.$route.name.match( /^profile/ ) === null ) return;
					
					// If onview has defined as Object.
					if( is( $data.shared.onview, Object ) )
					{
						// If current profile has Object type.
						if( is( this.profile, Object ) )
						{
							// If current username equals with username parameter.
							if( this.profile.username === username.toLowerCase() )
							{
								return;
							}
						}
						
						/*
						// If user has authenticated and current
						// Username equal with username parameter.
						if( this.auth() && $data.shared.profile.username === username.toLowerCase() )
						{
							// Copy user profile from data shared.
							this.profile = $data.shared.profile;
							
							// Copy user common info e.g fullname, username, and bio.
							this.models.common = {
								fullname: {
									error: false,
									value: this.profile.fullname
								},
								username: {
									error: false,
									value: this.profile.username
								},
								bio: {
									error: false,
									value: this.profile.bio
								}
							};
							
							// Count user post, star, and view.
							this.count();
							
							// Set profile title.
							return( this.title() );
						}
						*/
					}
					else {
						
						// Define onview as Object.
						$data.shared.onview = {};
					}
					
					// Get profile info.
					await this.request();
					
					// Set profile title.
					this.title();
				},
				deep: true,
				immediate: true
			},
			
			/*
			 * Watch route query.
			 *
			 * @values Object
			 */
			"$route.query": {
				handler: function( query )
				{
					// Default tab is posts.
					var tab = "posts";
					
					// Remove error messages.
					this.error = false;
					
					// If the router does not have a name,
					// or if it has a name starting with ^profile.
					if( not( this.$route.name, String ) || is( this.$route.name, String ) && this.$route.name.match( /^profile/ ) === null ) return;
					
					// Check if query `tab` is exists.
					if( is( query.tab, String ) )
					{
						// Check if tab is exists.
						if( this.tabs.indexOf( query.tab.toLowerCase() ) >= 0 )
						{
							switch( query.tab.toLowerCase() )
							{
								// Handle edits, saveds, settings tab.
								case "edits":
								case "saveds":
								case "settings": tab = this.self() ? tab = query.tab.toLowerCase() : "posts"; break;
								
								// Handle report tab.
								case "report": tab = this.auth && this.self() === false ? "report" : "posts"; break;
								
								// Handle posts tab.
								default: tab = "posts"; break;
							}
						}
					}
					this.tab = tab;
				},
				deep: true,
				immediate: true
			}
		},
		
		/*
		 * Component created.
		 *
		 * @return Void
		 */
		created: function()
		{},
		
		
		/*
		 * Component methods.
		 *
		 * @values Object
		 */
		methods: {
			
			/*
			 * Check if user is authenticated.
			 *
			 * @return Boolean
			 */
			auth: () => $Authenticated(),
			
			/*
			 * Picture normalizer.
			 *
			 * @params String $picture
			 *
			 * @return Object
			 */
			avatar: function( picture = "main" )
			{
				var self = this;
				
				return({
					inject: {
						avatar: f( "profile-{}-avatar", picture ),
						image: f( "profile-{}-avatar-image", picture ),
						cover: f( "profile-{}-avatar-cover", picture ),
						wrapper: f( "profile-{}-avatar-wrapper", picture ),
					},
					title: f( "{} ({})", this.profile.fullname, this.profile.username ),
					alt: f( "{} {} Picture", this.profile.fullname, picture === "main" ? "Profile" : "Cover" ),
					src: this.profile.userpict[picture]
				});
			},
			
			/*
			 * User biography builder.
			 *
			 * @return Component.
			 */
			bioBuilder: function()
			{
				// Flanking elements.
				var div = "<div class=\"profile-info-bio\">{}</div>";
				
				// If user has biography.
				if( is( this.profile.bio, String ) )
				{
					// Copy object instance.
					var self = this;
					
					// Copy user biography.
					var bio = this.profile.bio.replaceAll( "\n", "<br>" );
					
					// Regular expression collections.
					var result = null;
					var regexp = [
						{
							pattern: /(?:(\@(?<username>[a-zA-Z_\x80-\xff]([a-zA-Z0-9_\.\x80-\xff]{1,}[a-zA-Z0-9_\x80-\xff]{1})*)\;*))/gms,
							handler: result => f( "<router-link class=\"profile-bio-mention fc-an-3\" to=\"/{}?feature=mention&from={}\">&commat;{}</router-link>", result[2], self.profile.username, result[2] )
						},
						{
							pattern: /(?:(\@\[(?<color>[0-9a-fA-F]+)\:(?<username>[a-zA-Z_\x80-\xff]([a-zA-Z0-9_\.\x80-\xff]{1,}[a-zA-Z0-9_\x80-\xff]{1})*)\]\;*))/gms,
							handler: result => f( "<router-link class=\"profile-bio-mention\" :style=\"{ color: '#{}' }\" to=\"/{}?feature=mention&from={}\">&commat;{}</router-link>", result[2], result[3], self.profile.username, result[3] )
						},
						{
							pattern: /(?:(\@\[(?<style>bx|bxl|bxs)(\:(?<color>[0-9a-fA-F]+))*\:(?<icon>[a-zA-Z\x80-\xff]([a-zA-Z0-9\-\x80-\xff]{0,}[a-zA-Z0-9\x80-\xff]{1})*)\]\;*))/gms,
							handler: result => f( "<i class=\"profile-bio-icon bx {}-{} fs-12\" :style=\"{ color: '#{}' }\"></i>", result[2], result[5], result[4] ? result[4] : "32325d" )
						}
					];
					
					// Mapping patterns.
					$Mapper( regexp, ( index, regexp ) =>
					{
						do
						{
							// Checks if the regex captures the result.
							if( result = regexp.pattern.exec( bio ) )
							{
								// Replace caught character.
								bio = bio.replace( result[0], regexp.handler( result ) ); continue;
							}
							break;
						}
						while( result );
					});
				}
				else {
					var bio = "";
				}
				
				// Return element.
				return( f( div, bio ) );
			},
			
			/*
			 * Count user posts, stars, and views.
			 *
			 * @return Void
			 */
			count: function()
			{
				// Copy object instance.
				var self = this;
				
				// Check if user has posts.
				if( is( self.profile.posts, Array ) )
				{
					// Default value.
					self.profile.starCount = 0;
					self.profile.viewCount = 0;
					
					// Mapping user posts.
					$Mapper( self.profile.posts, ( index, post ) =>
					{
						// Check if post has stars.
						if( is( post.stars, Array ) )
						{
							self.profile.starCount = self.profile.starCount + post.stars.length;
						}
						
						// Check if post has views.
						if( is( post.views, Array ) )
						{
							self.profile.viewCount = self.profile.viewCount + post.views.length;
						}
					});
				}
			},
			
			/*
			 * Return if user is Super Admin.
			 *
			 * @return Boolean
			 */
			isSuperAdmin: function()
			{},
			
			/*
			 * Return if user is Admin.
			 *
			 * @return Boolean
			 */
			isAdmin: function()
			{},
			
			/*
			 * Return if user is User.
			 *
			 * @return Boolean
			 */
			isUser: function()
			{},
			
			/*
			 * Change user profile picture (Preview).
			 *
			 * @params Event $e
			 *
			 * @return Void
			 */
			onChangeMainPicture: function( e )
			{
				// Check if file is not Undefined.
				if( not( e.target.files[0], "Undefined" ) )
				{
					this.models.userpict.main = URL.createObjectURL( e.target.files[0] );
				}
			},
			
			/*
			 * Save user profile picture.
			 *
			 * @return Promise
			 */
			onChangeMainPictureSave: async function()
			{},
			
			/*
			 * Change user profile cover (Preview).
			 *
			 * @params Event $e
			 *
			 * @return Void
			 */
			onChangeCoverPicture: function( e )
			{
				// Check if file is not Undefined.
				if( not( e.target.files[0], "Undefined" ) )
				{
					this.models.userpict.cover = URL.createObjectURL( e.target.files[0] );
				}
			},
			
			/*
			 * Save user profile cover.
			 *
			 * @return Promise
			 */
			onChangeCoverPictureSave: async function()
			{},
			
			/*
			 * Handle bio input.
			 *
			 * @params Event $e
			 *
			 * @return Void
			 */
			onInputBio: function( e )
			{
				// Check if bio value is not empty.
				if( valueIsNotEmpty( e.target.value ) )
				{
					// Check if bio value is over limit.
					if( e.target.value.length > 240 )
					{
						this.models.common.bio.error = "Biography length is over limit."; return;
					}
				}
				
				// Remove error message.
				this.models.common.bio.error = false;
			},
			
			/*
			 * Handle fullname input.
			 *
			 * @params Event $e
			 *
			 * @return Void
			 */
			onInputFullname: function( e )
			{
				// Check if fullname value is empty.
				if( valueIsEmpty( e.target.value ) )
				{
					this.models.common.fullname.error = "Fullname can't be empty value."; return;
				}
				
				// Check if fullname value is over limit.
				if( e.target.value.length > 40 )
				{
					this.models.common.fullname.error = "Fullname length is over limit."; return;
				}
				
				// Remove error message.
				this.models.common.fullname.error = false;
			},
			
			/*
			 * Handle username input.
			 *
			 * @params Event $e
			 *
			 * @return Void
			 */
			onInputUsername: function( e )
			{
				// Check if username value is empty.
				if( valueIsEmpty( e.target.value ) )
				{
					this.models.common.username.error = "Username can't be empty value."; return;
				}
				
				// Check if username value is invalid.
				if( not( e.target.value.match( /^(?:([a-zA-Z_\x80-\xff]([a-zA-Z0-9_\.\x80-\xff]{0,}[a-zA-Z0-9_\x80-\xff]{1})*))$/ ), Array ) )
				{
					this.models.common.username.error = "Username value is invalid."; return;
				}
				
				// Check if username value is over limit.
				if( e.target.value.length > 30 )
				{
					this.models.common.username.error = "Username length is over limit."; return;
				}
				
				// Check if username value is under min.
				if( e.target.value.length < 3 )
				{
					this.models.common.username.error = "Username length is under min."; return;
				}
				
				// Remove error message.
				this.models.common.username.error = false;
			},
			
			/*
			 * Save user info e.g fullname, username & bio.
			 *
			 * @return Promise
			 */
			onSaveEdit: async function()
			{
				// Copy object instance.
				var self = this;
				
				// Data payloads.
				var payload = {
					fullname: self.models.common.fullname.value,
					username: self.models.common.username.value,
					bio: self.models.common.bio.value
				};
				
				// Check if there is a request that is running.
				if( self.loading )
				{
					return;
				}
				
				// Check if something wrong.
				if( self.models.common.fullname.error ||
					self.models.common.username.error ||
					self.models.common.bio.error )
				{
					return;
				}
				
				// Set page as loading.
				self.loading = true;
				
				// Save profile info.
				await $Request( "POST", f( "/api/user/{}/edit", this.$route.params.username ), {
					data: payload,
					headers: {
						"Content-Type": "application/x-www-form-urlencoded"
					}
				})
				
				// Handle request onload.
				.then( res =>
				{
					// Parse json strings.
					var resp = JSON.parse( res.responseText );
					
					// Save response.
					self.response = resp;
					
					// Check if request response on error.
					if( resp.error )
					{
						// Save error message.
						self.error = resp.message;
					}
					else {
						window.location.href = f( "/{}/{}", payload.username, self.profile.node );
					}
				})
				
				// Handle request onerror.
				.catch( err => $Request.onError( self, err ) );
				
				// Disable page as loading.
				self.loading = false;
				
			},
			
			/*
			 * Change tab.
			 *
			 * @params Number $index
			 *
			 * @return Void
			 */
			onTab: function( index )
			{
				// Push route query tab.
				$Router.push({ query: { tab: this.tab = this.tabs[index] } });
			},
			
			/*
			 * Avatar post normalizer.
			 *
			 * @params Object $post
			 *
			 * @return Object
			 */
			post: post => ({
				inject: {
					avatar: "profile-post-avatar",
					wrapper: "profile-post-avatar-wrapper",
					route: "profile-post-avatar-route",
					image: "profile-post-avatar-image",
				},
				route: f( "/p/{}?f=profile", post.node ),
				title: post.name.common,
				alt: post.name.latin,
				src: post.images.banner
			}),
			
			/*
			 * Get profile info.
			 *
			 * @return Promise
			 */
			request: async function()
			{
				// Copy object instance.
				var self = this;
				
				// Set page as loading.
				self.loading = true;
				
				// Get user profile info.
				await $Request( "GET", f( "/api/user/{}", this.$route.params.username ) )
					
					// Handle request onload.
					.then( res =>
					{
						// Parse json strings.
						var resp = JSON.parse( res.responseText );
						
						// Save response.
						self.response = resp;
						
						// Check if request response on error.
						if( resp.error )
						{
							// Save error message.
							self.error = resp.message;
						}
						else {
							
							// Copy user data.
							self.profile = $data.shared.onview[this.$route.params.username.toLowerCase()] = resp.data;
							
							// Copy user common info e.g fullname, username, and bio.
							self.models.common = {
								fullname: {
									error: false,
									value: resp.data.fullname
								},
								username: {
									error: false,
									value: resp.data.username
								},
								bio: {
									error: false,
									value: resp.data.bio
								}
							};
							
							// Count user post, star, and view.
							this.count();
						}
					})
					
					// Handle request onerror.
					.catch( err => $Request.onError( self, err ) );
				
				// Disable page loading.
				self.loading = false;
			},
			
			/*
			 * Check if current profile is user self.
			 *
			 * @return Boolean
			 */
			self: function()
			{
				return( this.auth() && this.profile.unitoken === $data.shared.profile.unitoken );
			},
			
			/*
			 * Set profile title.
			 *
			 * @return Void
			 */
			title: function()
			{
				// Check if something error.
				if( this.error )
				{
					$Title( this.error );
				}
				else {
					$Title( f( "{} ({})", this.profile.fullname, this.profile.username ) );
				}
			}
		},
		
		/*
		 * Component requires.
		 *
		 * @values Object
		 */
		components: {
			Avatar: $AvatarComponent,
			Error: $Error
		},
		
		/*
		 * Component template.
		 *
		 * @values String
		 */
		template: `
			<div class="profile">
				<div class="profile-error" v-if="error"></div>
				<div class="profile-loading" v-else-if="loading">
					<div class="animate-loading flex flex-center pd-24">
						<div class="animate">
							<div class="spinner"></div>
						</div>
					</div>
				</div>
				<div class="profile-display" v-else-if="( self() && tab === 'edits' )">
					<div class="profile-edits flex">
						<div class="profile-edits-section flex flex-center">
							<div class="profile-edits-block">
								<div class="profile-ecover-avatar avatar">
									<div class="profile-ecover-avatar-wrapper avatar-wrapper">
										<img class="profile-ecover-avatar-image avatar-image" :src="( models.userpict.cover ? models.userpict.cover : profile.userpict.cover )" alt="" title="" />
										<div class="profile-ecover-avatar-cover avatar-cover flex">
											<div class="profile-ecover-form flex flex-center">
												<i class="profile-ecover-icon bx bx-camera"></i>
												<i class="profile-ecover-icon bx bx-cloud-upload" v-if="models.userpict.cover" @click="onChangeCoverPictureSave"></i>
												<i class="profile-ecover-icon bx bx-refresh" @click="onChangeCoverPictureSave"></i>
												<i class="profile-ecover-icon bx bx-x" v-if="models.userpict.cover" @click="models.userpict.cover = null"></i>
												<input class="profile-ecover-input" type="file" accept="image/png, image/jpeg" @change="onChangeCoverPicture" ref="profileCoverPicture" />
											</div>
										</div>
									</div>
								</div>
								<div class="profile-emain-avatar avatar rd-circle">
									<div class="profile-emain-avatar-wrapper avatar-wrapper rd-circle">
										<img class="profile-emain-avatar-image avatar-image" :src="( models.userpict.main ? models.userpict.main : profile.userpict.main )" alt="" title="" />
										<div class="profile-emain-avatar-cover avatar-cover flex flex-center">
											<div class="profile-emain-form flex flex-center">
												<i class="profile-emain-icon bx bx-camera"></i>
												<i class="profile-emain-icon bx bx-cloud-upload" v-if="models.userpict.main" @click="onChangeMainPictureSave"></i>
												<i class="profile-emain-icon bx bx-refresh" @click="onChangeMainPictureSave"></i>
												<i class="profile-emain-icon bx bx-x" v-if="models.userpict.main" @click="models.userpict.main = null"></i>
												<input class="profile-emain-input" type="file" accept="image/png, image/jpeg" @change="onChangeMainPicture" ref="profileMainPicture" />
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="profile-edits-section">
							<div class="profile-edits-form form">
								<div class="form-wrapper">
									<h5 class="form-title mg-bottom-12">Edit Profile Info</h5>
									<p class="form-description mg-bottom-20 pd-14 rd-square bg-kw-4 fc-2 fs-14">
										User's full name and biographies are allowed to use various characters with a maximum length of 40 characters for full name and 240 characters for biographies, for usernames are only allowed to use characters a-z0-9 underscores and periods with a minimum length of 3 and a maximum length limit of 30 characters.
									</p>
									<div :class="[ 'form-group', models.common.fullname.error ? 'form-error' : '' ]">
										<label class="form-label" for="fullname">Fullname</label>
										<input class="form-input" type="text" v-model="models.common.fullname.value" @input="onInputFullname" />
									</div>
									<div :class="[ 'form-group', models.common.username.error ? 'form-error' : '' ]">
										<label class="form-label" for="username">Username</label>
										<input class="form-input" type="text" v-model="models.common.username.value" @input="onInputUsername" />
									</div>
									<div :class="[ 'form-group', models.common.bio.error ? 'form-error' : '' ]">
										<label class="form-label" for="bio">Bio</label>
										<textarea class="form-input" type="text" v-model="models.common.bio.value" @input="onInputBio"></textarea>
									</div>
									<button class="form-submit button button-pw" @click="onSaveEdit">Save Profile</button>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="profile-display" v-else-if="( self() && tab === 'settings' )">
					On Setting
				</div>
				<div class="profile-display" v-else-if="( self() === false && auth() && tab === 'report' )">
					On Report
				</div>
				<div class="profile-display" v-else>
					<div class="profile-cover flex flex-center">
						<Avatar :options="avatar( 'cover' )" />
					</div>
					<div class="profile-banner flex">
						<div class="profile-section flex flex-center">
							<Avatar :options="avatar( 'main' )" />
						</div>
						<div class="profile-section">
							<div class="profile-section-block pd-20">
								<div class="profile-info mg-bottom-12">
									<h1 class="profile-info-title mg-0">
										{{ profile.fullname }} <i class="bx bx-check-double fc-kw-3" v-if="profile.verify"></i>
									</h1>
									<h5 class="profile-info-subtitle fb-35">
										{{ profile.username }}
									</h5>
									<component v-bind:is="bio" v-if="profile.bio"></component>
								</div>
								<div class="profile-group flex mg-bottom-14">
									<div class="profile-single">
										<span class="fb-55 fc-2 mg-right-6">{{ profile.posts ? profile.posts.length : 0 }}</span>
										<span class="fc-3">Posts</span>
									</div>
									<div class="profile-single">
										<span class="fb-55 fc-2 mg-right-6">{{ profile.starCount }}</span>
										<span class="fc-3">Stars</span>
									</div>
									<div class="profile-single">
										<span class="fb-55 fc-2 mg-right-6">{{ profile.viewCount }}</span>
										<span class="fc-3">Views</span>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="profile-onauth" v-if="auth()">
						<div class="profile-tab">
							<div class="profile-tab-group flex flex-center">
								<button :class="[ 'profile-tab-single', 'button', 'flex', 'flex-center', 'rd-none', 'pd-12', tab === 'posts' ? 'active' : '' ]" @click="onTab( 0 )">
									<i class="bx bx-grid-alt"></i> Posts
								</button>
								<button :class="[ 'profile-tab-single', 'button', 'flex', 'flex-center', 'rd-none', 'pd-12', tab === 'saveds' ? 'active' : '' ]" v-if="self()" @click="onTab( 1 )">
									<i class="bx bx-bookmark"></i> Saveds
								</button>
								<button :class="[ 'profile-tab-single', 'button', 'flex', 'flex-center', 'rd-none', 'pd-12', tab === 'edits' ? 'active' : '' ]" v-if="self()" @click="onTab( 2 )">
									<i class="bx bx-edit-alt"></i> Edits
								</button>
								<button :class="[ 'profile-tab-single', 'button', 'flex', 'flex-center', 'rd-none', 'pd-12', tab === 'settings' ? 'active' : '' ]" v-if="self()" @click="onTab( 3 )">
									<i class="bx bx-cog"></i> Settings
								</button>
								<button :class="[ 'profile-tab-single', 'button', 'flex', 'flex-center', 'rd-none', 'pd-12', tab === 'report' ? 'active' : '' ]" v-if="self() === false && auth()" @click="onTab( 4 )">
									<i class="bx bx-error-alt"></i> Report
								</button>
							</div>
							<hr class="profile-tab-hr" />
						</div>
						<div class="profile-content">
							<div class="profile-posts" v-if="( tab === 'posts' )">
								<div class="profile-post-data dp-grid" v-if="( profile.posts && profile.posts.length > 0 )">
									<Avatar :options="post( upost )" v-for="upost in profile.posts" />
								</div>
								<div class="profile-nodata flex" v-else>
									<div class="profile-nodata-block">
										<div class="profile-nodata-icon flex flex-center">
											<i class="bx bx-camera"></i>
										</div>
										{{ self() ? "You don't have any posts" : "This user doesn't have any posts" }}
									</div>
								</div>
							</div>
							<div class="profile-saveds" v-else-if="( tab === 'saveds' )">
								<div class="profile-save-data dp-grid" v-if="( profile.saveds && profile.saveds.length > 0 )">
									// ...
								</div>
								<div class="profile-nodata flex" v-else>
									<div class="profile-nodata-block">
										<div class="profile-nodata-icon flex flex-center">
											<i class="bx bx-bookmark"></i>
										</div>
										You have no saved posts
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="profile-noauth" v-else>
					</div>
				</div>
			</div>
		`
	};
	
	/*
	 * Plant Component.
	 *
	 */
	const $PlantComponent = {
		
		/*
		 * Component properties.
		 *
		 * @values Function
		 */
		data: () => ({
			author: false,
			error: false,
			plant: null,
			loading: true,
			response: null
		}),
		
		/*
		 * Component props.
		 *
		 * @values Object
		 */
		props: {
			passed: Object
		},
		
		/*
		 * Component mount.
		 *
		 * @return Promise
		 */
		mounted: async function()
		{
			// Copy object instance.
			var self = this;
				
				// Allow loading animation.
				self.loading = true;
			
			// Check if component has props.
			if( is( self.passed, Object ) )
			{
				self.plant = self.passed;
			}
			
			// Check if articel is not Object type.
			else if( not( self.plant = $data.shared.articels, Object ) )
			{
				// Get resources.
				await $Request( "GET", f( "/api/plant/{}", self.$route.params.node ) )
					
					// Handle request onload.
					.then( res =>
					{
						// Parse json strings.
						var resp = JSON.parse( res.responseText );
						
						// Save response.
						self.response = resp;
						
						// Check if request response on error.
						if( resp.error )
						{
							// Save error message.
							self.error = resp.message;
						}
						else {
							self.plant = resp.data;
						}
					})
					
					// Handle request error.
					.catch( err => $Request.onError( self, err ) );
			}
			
			// Check if no error.
			if( self.error === false )
			{
				// Create plant avatar.
				self.plant.avatar = {
					inject: {
						avatar: [
							"plant-avatar",
							"rd-square"
						],
						wrapper: [
							"plant-avatar-wrapper"
						]
					},
					route: f( "/p/{}?feature=plant", self.plant.node ),
					title: self.plant.name.common,
					alt: self.plant.name.latin,
					src: self.plant.images.banner
				};
			}
			
			// Disable loading animation.
			self.loading = false;
		},
		
		/*
		 * Component methods.
		 *
		 * @values Object
		 */
		methods: {
			
			/*
			 * Avatar normalizer.
			 *
			 * @params Object $image
			 * 
			 * @return Object
			 */
			galery: function( image )
			{
				return({
					inject: {
						avatar: [
							"plant-galery-avatar",
							"flex",
							"flex-center"
						],
						wrapper: [
							"plant-galery-avatar-wrapper"
						]
					},
					title: this.plant.name.common,
					alt: this.plant.name.latin,
					src: image
				});
			}
		},
		
		/*
		 * Component requires.
		 *
		 * @values Object
		 */
		components: {
			Avatar: $AvatarComponent,
			Error: $Error
		},
		
		/*
		 * Component template.
		 *
		 * @values String
		 */
		template: `
			<div class="plant">
				<div class="plant-loading" v-if="( loading )">
					<div class="animate-loading flex flex-center pd-24">
						<div class="animate">
							<div class="spinner"></div>
						</div>
					</div>
				</div>
				<div class="plant-error" v-else-if="( error )">
					<Error>
						{{ error }}
					</Error>
				</div>
				<div class="plant-result flex flex-center" v-else>
					<div class="plant-found rd-square" v-if="( plant )">
						<div class="plant-header pd-14 flex flex-left">
							<i class="bx bx-dots-horizontal-rounded fs-26"></i>
						</div>
						<div class="plant-content flex flex-left rd-square">
							<div class="plant-banner scroll-hidden">
								<div class="plant-galery flex flex-center scroll-hidden">
									<div class="plant-galery-scroll scroll-hidden">
										<Avatar :options="galery( plant.images.banner )" />
										<Avatar :options="galery( image )" v-for="image in plant.images.common" />
									</div>
								</div>
								<div class="plant-view">
									<div class="plant-view-rel flex">
										<button class="plant-view-button button star pd-10 fs-18 flex flex-center">
											<i class="plant-view-button-ic bx bxs-star mg-right-6 fs-20"></i>
											<span class="plant-view-button-tt">1k</span>
										</button>
										<button class="plant-view-button button show pd-10 fs-18 flex flex-center">
											<i class="plant-view-button-ic bx bxs-show mg-right-6 fs-20"></i>
											<span class="plant-view-button-tt">75.2k</span>
										</button>
										<button class="plant-view-button button bookmark pd-10 fs-18 flex flex-center">
											<i class="plant-view-button-ic bx bxs-bookmark fs-20"></i>
										</button>
									</div>
								</div>
							</div>
							<div class="plant-info scroll-hidden">
								<div class="pd-14">
									<h5 class="plant-name-common fb-45 fc-1 mg-0">{{ plant.name.common }}</h5>
									<p class="plant-name-latin fb-35 fs-16 mg-bottom-10">
										<router-link class="fc-2" :to="{ path: '/p/' + plant.node }">
											{{ plant.name.latin }}
										</router-link>
									</p>
									<div class="mg-bottom-14">
										<li class="plant-description mg-bottom-14 mg-lc-bottom li-type-none" v-for="description in plant.description">
											{{ description }}
										</li>
									</div>
									<h5 class="plant- fb-45">Origin of {{ plant.name.common }}</h5>
									<p class="plant-description mg-bottom-14 li-type-none">
										{{ plant.original }}
									</p>
									<div class="plant-utility mg-bottom-14" v-if="( plant.utility )">
										<h5 class="plant-">Utility of {{ plant.name.common }}</h5>
										<li class="plant-utility-text plant-description mg-bottom-14 mg-lc-bottom li-type-none" v-if="( plant.utility.text )" v-for="text in plant.utility.text">{{ text }}</li>
										<li class="plant-utility-text plant-description mg-bottom-14 mg-lc-bottom" v-if="( plant.utility.list )" v-for="util in plant.utility.list">{{ util }}</li>
									</div>
									<div class="plant-scientific" v-if="( plant.scientific )">
										<h5 class="plant-">Scientific of {{ plant.name.common }}</h5>
										<table class="table collapse">
											<tr class="table-row" v-for="( value, name ) in plant.scientific">
												<td class="table-data">{{ name }}</td>
												<td class="table-data" v-if="( name === 'clades' && value.length !== 0 )">
													<p class="data" v-for="clade in value">
														{{ clade }}
													</p>
												</td>
												<td class="table-data" v-else>{{ value ? value : "None" }}</td>
											</tr>
										</table>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="plant-none" v-else>
						Page Not Found!
					</div>
				</div>
			</div>
		`
	};
	