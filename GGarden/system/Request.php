<?php

namespace hxAri\GGarden;

/*
 * Request
 *
 * @extends hxAri\GGarden\Singleton
 *
 * @package hxAri\GGarden
 */
class Request extends Singleton
{
	
	/*
	 * Request body
	 *
	 * @access Private Readonly
	 *
	 * @values Array
	 */
	private Readonly Array $body;
	
	/*
	 * @inherit hxAri\GGarden\Singleton
	 *
	 */
	protected function __construct()
	{
		$this->body = match( Route::getCurrentMethod() )
		{
			"GET" => $_GET,
			"POST" => $_POST,
			
			default => $this->parse()
		};
	}
	
	/*
	 * Get data body
	 *
	 * @params String $key
	 *
	 * @return Mixed
	 */
	public function body( ? String $key = Null ): Mixed
	{
		if( $key !== Null )
		{
			return( $this->body[$key] ?? Null );
		}
		return( $this->body );
	}
	
	private function parse(): Array
	{
		// If php has input.
		if( $data = file_get_contents( "php://input" ) )
		{
			// Parse strings.
			parse_str( $data, $vars );
		}
		return( $vars ?? [] );
	}
	
}

?>