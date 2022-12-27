<?php

namespace hxAri\GGarden;

use PDO;
use RuntimeException;

/*
 * Database
 *
 * @extends PDO
 *
 * @package hxAri\GGarden
 */
class Database extends PDO
{
	
	/*
	 * PHP Data Source Name.
	 *
	 * @access Private
	 *
	 * @values String
	 */
	private String $dsn = "mysql:host=127.0.0.1;port=3306;dbname=ggarden";
	
	/*
	 * Database username.
	 *
	 * @access Private
	 *
	 * @values String
	 */
	private String $user = "root";
	
	/*
	 * Database password.
	 *
	 * @access Private
	 *
	 * @values String
	 */
	private String $pasw = "";
	
	/*
	 * Singleton class instance stack.
	 *
	 * @access Static Private
	 *
	 * @values hxAri\GGarden\Database
	 */
	static private ? Database $self = Null;
	
	/*
	 * @inherit PDO
	 * 
	 */
	protected function __construct()
	{
		parent::__construct(
			$this->dsn,
			$this->user,
			$this->pasw
		);
	}
	
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
	 * @return hxAri\GGarden\Database
	 */
	final public static function self(): Database
	{
		if( static::$self Instanceof Database === False )
		{
			static::$self = new Static();
		}
		return( static::$self );
	}
	
}

?>