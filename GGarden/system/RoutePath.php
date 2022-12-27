<?php

namespace hxAri\GGarden;

use Closure;

/*
 * RoutePath
 *
 * @package hxAri\GGarden
 */
class RoutePath
{
	
	protected Readonly String $regexp;

	protected Array $segments;

	/*
	 * Construct method of class RoutePath.
	 *
	 * @access Public Instance
	 *
	 * @params String $method
	 * @params String $path
	 * @params Array|Closure|String $handle
	 *
	 * @return Void
	 */
	public function __construct(
		
		/*
		 * Request method name.
		 *
		 * @access Protected
		 *
		 * @values String
		 */
		protected Readonly String $method,
		
		/*
		 * Route pathname.
		 *
		 * @access Protected
		 *
		 * @values String
		 */
		protected Readonly String $path,
		
		/*
		 * Route handler callback.
		 *
		 * @access Protected
		 *
		 * @values Array|Closure|String
		 */
		protected Readonly Array | Closure | String $handle )
	{
		$this->segments = [];
		$this->regexp = sprintf( "/^(?:(?<path>%s))\/*$/iU", RegExp::replace( "/\//", RegExp::replace( "/(?:(?<path>(\:(?<named>[a-zA-Z0-9\-\_]+)(\((?<regexp>[^\)]+)\))*)|(?<params>\*)))/i", $path, fn( Array $match ) => $this->rematch( $match ) ), "\\/" ) );
	}

	/*
	 * Get route callback handler.
	 * 
	 * @access Public
	 * 
	 * @return Clsoure
	 */
	public function getHandler(): Closure
	{
		return( $this->handle );
	}

	/*
	 * Get route method.
	 * 
	 * @access Public
	 * 
	 * @return String
	 */
	public function getMethod(): String
	{
		return( $this->method );
	}

	/*
	 * Get route path.
	 * 
	 * @access Public
	 * 
	 * @return String
	 */
	public function getPath(): String
	{
		return( $this->path );
	}

	/*
	 * Get route REgular Expression.
	 * 
	 * @access Public
	 * 
	 * @return String
	 */
	public function getRegExp(): String
	{
		return( $this->regexp );
	}

	/*
	 * Get route segments.
	 * 
	 * @access Public
	 * 
	 * @return Array
	 */
	public function getSegments(): Array
	{
		return( $this->segments );
	}

	/*
	 * Replace route segment as Regular Expression.
	 * 
	 * @access Private
	 * 
	 * @params Array $match
	 * 
	 * @return String
	 */
	private function rematch( Array $match ): String
	{
		if( isset( $match['params'] ) )
		{
			return( "(?<params>[^\n]*)" );
		}
		return( sprintf( "(?<%s>%s)", $this->segments[] = $match['named'], $match['regexp'] ?? "[a-zA-Z0-9\-\_]+" ) );
	}
	
}

?>