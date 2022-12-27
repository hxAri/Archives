<?php

namespace hxAri\GGarden;

// The entire list of routes
// to be registered.
$routes = [
	
	/*
	 * Import the entire routing.
	 *
	 * @source /routes
	 */
	...require( path( "routes/api.php" ) ),
	...require( path( "routes/dev.php" ) ),
	...require( path( "routes/res.php" ) ),
	...require( path( "routes/web.php" ) ),
	
	/*
	 * NOT FOUND.
	 *
	 * @method *
	 * @rctype application/json; charset=UTF-8
	 * @return Array|Null
	 */
	[
		"path" => "/:error([^\n]*)",
		"method" => "*",
		"handler" => function(): ? Array
		{
			return([
				"code" => 404,
				"http" => [
					"code" => 404
				],
				"view" => []
			]);
		}
	]
];

// Registering routes.
array_map( fn( Array $route ) => Route::path( ...$route ), $routes );

?>