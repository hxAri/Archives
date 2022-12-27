<?php

namespace hxAri\GGarden\Error;

use Throwable;
use TypeError;

/*
 * TriggerError
 * 
 * @extends TypeError
 * 
 * @package hxAri\GGarden\Error
 */
final class TriggerError extends TypeError
{

	/*
	 * @inherit TypeError
	 * 
	 */
	public function __construct( String $message, String $level, String $file, Int $line, Int $code, ? Throwable $previous = Null )
	{
		// Set error information.
		$this->line = $line;
		$this->code = $code;
		$this->file = $file;
		$this->type = $level;
		$this->message = $message;
		
		// Call parent constructor.
		parent::__construct( $message, $code, $previous );
	}

}