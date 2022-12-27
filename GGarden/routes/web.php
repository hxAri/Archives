<?php

namespace hxAri\GGarden;

/*
 * ...
 *
 * @return Array
 */
return([
	
	/*
	 * Home page
	 *
	 * @method GET
	 * @rctype text/html; charset=UTF-8
	 * @return Null
	 */
	[
		"path" => "/",
		"method" => "GET",
		"handler" => fn() => [
			"view" => [
				"title" => "Home"
			]
		]
	],
	
	/*
	 * Signin & Signup page.
	 *
	 * @method GET
	 * @rctype text/html; charset=UTF-8
	 * @return Void
	 */
	[
		"path" => "/:auth(signin|signup)",
		"method" => "GET",
		"handler" => function( String $auth )
		{
			// Check if user has authenticated.
			if( Auth::authenticated() )
			{
				return([
					"http" => [
						"code" => 403
					],
					"view" => [
						"title" => "Forbidden",
						"error" => [
							"code" => 403,
							"method" => "GET",
							"status" => "Fail",
							"message" => "Fornidden"
						]
					]
				]);
			}
			return([
				"title" => ucfirst( $auth )
			]);
		}
	],
	
	/*
	 * Search page.
	 *
	 * @method GET
	 * @rctype text/html; charset=UTF-8
	 * @return Null
	 */
	[
		"path" => "/search",
		"method" => "GET",
		"handler" => function()
		{
			// Check if query `q` is exists.
			if( $q = Route::getQuery( "q" ) )
			{
				// Add search result.
				$search = Search::search( 
					
					// Data will be search.
					$q,
					
					// If search by category is exists.
					Route::getQuery( "c" )
				);
			}
			return([
				"view" => [
					"title" => "Search",
					"shared" => [
						"search" => $search ?? []
					]
				]
			]);
		}
	],
	
	/*
	 * Plant page.
	 *
	 * @method GET
	 * @rctype text/html; charset=UTF-8
	 * @return Null
	 */
	[
		"path" => "/p/:node([a-zA-Z0-9_\x80-\xff][a-zA-Z0-9_\-\.\x80-\xff]*)",
		"method" => "GET",
		"handler" => function( String $node )
		{
			// Check if articel record is exists.
			if( $articel = ModelArticel::getByNode( "*", $node ) )
			{
				return([
					"view" => [
						"title" => sprintf( "%s (%s)", $articel->name['common'], $articel->name['latin'] ),
						"shared" => [
							"articel" => $articel
						]
					]
				]);
			}
			
			return([
				"http" => [
					"code" => 404
				],
				"view" => [
					"title" => "Not Found",
					"error" => [
						"code" => 404,
						"method" => "GET",
						"status" => "Fail",
						"message" => "Page Not Found"
					]
				]
			]);
		}
	],
	
	/*
	 * Global page.
	 *
	 * @method GET
	 * @rctype text/html; charset=UTF-8
	 * @return Null
	 */
	[
		"path" => "/:global(explore|about|contact|privacy|sitemap|create)",
		"method" => "GET",
		"handler" => fn( String $global ) => [
			"view" => [
				"title" => ucfirst( $global )
			]
		]
	],
	
	/*
	 * Profile page.
	 *
	 * @method GET
	 * @rctype text/html; charset=UTF-8
	 * @return Null
	 */
	[
		"path" => "/:username([a-zA-Z_\x80-\xff][a-zA-Z0-9_\.\x80-\xff]{0,}[a-zA-Z0-9_\x80-\xff]{0,1})",
		"method" => "GET",
		"handler" => function( String $username )
		{
			// Convert username to lower case.
			$username = strtolower( $username );
			
			// Check if user record is exists.
			if( $user = Profile::show( $username ) )
			{
				return([
					"view" => [
						"title" => sprintf( "%s (%s)", $user->fullname, $user->username ),
						"shared" => [
							"onview" => [
								$username => $user
							]
						]
					]
				]);
			}
			
			return([
				"http" => [
					"code" => 404
				],
				"view" => [
					"title" => "Not Found",
					"error" => [
						"code" => 404,
						"method" => "GET",
						"status" => "Fail",
						"message" => "Page Not Found"
					]
				]
			]);
		}
	]
	
]);

?>