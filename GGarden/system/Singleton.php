<?php

namespace hxAri\GGarden;

use RuntimeException;

/*
 * Singleton
 *
 * @package hxAri\GGarden
 */
abstract class Singleton
{
	
	/*
	 * Singleton class instance stack.
	 *
	 * @access Static Private
	 *
	 * @values Array
	 */
	static private Array $instances = [];
	
	/*
	 * Construct method of class Singleton.
	 * Is not allowed to call from outside to
	 * prevent from creating multiple instances.
	 *
	 * @access Protected
	 *
	 * @return Void
	 */
	protected function __construct() {}
	
	/*
	 * Prevent the instance from being cloned.
	 *
	 * @access Protected
	 *
	 * @return Void
	 */
	final protected function __clone() {}
	
	/*
	 * Prevent from being unserialized.
	 * Or which would create a second instance of it.
	 *
	 * @access Public
	 *
	 * @return Void
	 *
	 * @throws RuntimeException
	 */
	final public function __wakeup()
	{
		throw new RuntimeException( sprintf( "Cannot unserialize class %s", $this::class ) );
	}
	
	/*
	 * Gets the instance via lazy initialization.
	 *
	 * @access Public Static
	 *
	 * @return Yume\Fure\Support\Design\Creational\Singleton
	 */
	final public static function self(): Singleton
	{
		return( static::$instances[Static::class] ??= new Static( ...func_get_args() ) );
	}
	
}

?>