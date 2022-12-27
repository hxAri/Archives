<?php

namespace hxAri\GGarden;

use Closure;

/*
 * Route
 * 
 * @package hxAri\GGarden
 */
abstract class Route
{
	
	/*
	 * Route collection.
	 * 
	 * @access Private Static
	 * 
	 * @values Array
	 */
	private static Array $routes = [];
	
	/*
	 * Get current server request method.
	 * 
	 * @access Public Static
	 * 
	 * @return String
	 */
	public static function getCurrentMethod(): String
	{
		return( $_SERVER['REQUEST_METHOD'] ??= "GET" );
	}

	/*
	 * Get current server request pathname.
	 * 
	 * @access Public Static
	 * 
	 * @return String
	 */
	public static function getCurrentPath(): String
	{
		return( $_SERVER['PATH_INFO'] ??= "/" );
	}
	
	/*
	 * Get current request route.
	 * 
	 * @access Public Static
	 * 
	 * @return hxAri\GGarden\RoutePath
	 */
	public static function getCurrentRoute(): RoutePath
	{
		foreach( self::$routes As $route )
		{
			// If route path is valid.
			if( RegExp::test( $route->getRegexp(), self::getCurrentPath() ) )
			{
				// If route method is valid.
				if( $route->getMethod() === "*" || RegExp::test( sprintf( "/^(?:(%s))$/i", $route->getMethod() ), Route::getCurrentMethod() ) )
				{
					return( $route );
				}
				
				// When the route request method is not allowed.
				return( new RoutePathError( ...[
					"path" => $route->getPath(),
					"method" => $route->getMethod(),
					"error" => RoutePathError::METHOD_ERROR,
					"handle" => function()
					{
						// Check if current request is api.
						if( self::isApi() )
						{
							return([
								"error" => True,
								"status" => "Failed",
								"message" => "Method Not Allowed"
							]);
						}
						view(
							title: "Method Not Allowed",
							error: [
								"status" => 403,
								"method" => self::getCurrentMethod(),
								"message" => "Method Not Allowed"
							]
						);
					}
				]));
			}
		}
		
		// When the route request page not found.
		return( new RoutePathError( ...[
			"path" => self::getCurrentPath(),
			"method" => self::getCurrentMethod(),
			"error" => RoutePathError::PATH_ERROR,
			"handle" => function()
			{
				// Check if current request is api.
				if( self::isApi() )
				{
					return([
						"error" => True,
						"status" => "Failed",
						"message" => "Not Found"
					]);
				}
				view(
					title: "Not Found",
					error: [
						"status" => 404,
						"method" => self::getCurrentMethod(),
						"message" => "Not found"
					]
				);
			}
		]));
	}
	
	/*
	 * Get query by name.
	 *
	 * @access Public Static
	 *
	 * @params String $name
	 *
	 * @return Array|String
	 */
	public static function getQuery( ? String $name = Null ): Array | Null | String
	{
		return( $name !== Null ? $_GET[$name] ?? Null : $_GET ??= [] );
	}
	
	/*
	 * Get query as string.
	 *
	 * @access Public Static
	 *
	 * @return String
	 */
	public static function getQueryString(): ? String
	{
		return( $_SERVER['QUERY_STRING'] );
	}
	
	/*
	 * Return if route path is any.
	 *
	 * @access Public Static
	 *
	 * @return Bool
	 */
	public static function isAny(): Bool
	{
		return(
			self::isApi() === False &&
			self::isDev() === False
		);
	}
	
	/*
	 * Return if route path is /api
	 *
	 * @access Public Static
	 *
	 * @return Bool
	 */
	public static function isApi(): Bool
	{
		return( RegExp::test( "/^\/api/", self::getCurrentPath() ) );
	}
	
	/*
	 * Return if route path is /dev
	 *
	 * @access Public Static
	 *
	 * @return Bool
	 */
	public static function isDev(): Bool
	{
		return( RegExp::test( "/^\/dev/", self::getCurrentPath() ) );
	}
	
	/*
	 * Register route.
	 *
	 * @access Public Static
	 *
	 * @params String $method
	 * @params String $path
	 * @params Closure $handler
	 *
	 * @return hxAri\GGarden\RoutePath
	 */
	public static function path( String $method, String $path, Closure $handler ): RoutePath
	{
		return( self::$routes[] = new RoutePath( $method, $path, $handler ) );
	}
	
}


?>