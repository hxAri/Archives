<?php

namespace hxAri\GGarden;

use Closure;

/*
 * RoutePathError
 * 
 * @extends hxari\GGarden\RoutePath
 * 
 * @package hxAri\GGarden
 */
class RoutePathError extends RoutePath
{

	public const METHOD_ERROR = 405;
	public const PATH_ERROR = 404;

	/*
	 * @inherit hxAri\GGarden\RoutePath
	 * 
	 */
	public function __construct( String $method, String $path, protected Int $error, Closure $handle )
	{
		parent::__construct( ...[
			$path,
			$method,
			$handle
		]);
	}

	/*
	 * Get route Error Code.
	 * 
	 * @access Public
	 * 
	 * @return Int
	 */
	public function getError(): Int
	{
		return( $this->error );
	}

}

?>