<?php

namespace hxAri\GGarden;

use PDOStatement;

/*
 * Model
 *
 * @extends hxAri\GGarden\Singleton
 *
 * @package hxAri\GGarden
 */
abstract class Model extends Singleton
{
	
	/*
	 * Database Connection.
	 *
	 * @access Private
	 *
	 * @values hxAri\GGarden\Database
	 */
	private Readonly Database $connection;
	
	/*
	 * Control each table that has a `uni token` column whether they are visible without authentication.
	 *
	 * @access Private
	 *
	 * @values Bool
	 */
	private Bool $accessible = False;
	
	/*
	 * The column value that must be filtered
	 * after successfully fetching records from
	 * the database table.
	 *
	 * @access Protected
	 *
	 * @values Array
	 */
	protected Array $filter = [
		"timestamp"
	];
	
	/*
	 * Model table name.
	 * 
	 * @access Protected
	 * 
	 * @values String
	 */
	protected String $table;
	
	/*
	 * @inherit hxAri\GGarden\Singleton
	 *
	 */
	protected function __construct()
	{
		$this->connection = Database::self();
	}
	
	/*
	 * Create column.
	 * 
	 * @access Public Static
	 * 
	 * @params Array|False $column
	 * @params Bool $onlyColumn
	 * 
	 * @return False|String
	 */
	public static function column( Array | False $column, Bool $onlyColumn = False ): String | False
	{
		// If column is Array type.
		if( is_array( $column ) )
		{
			// If array is Array List.
			if( array_is_list( $column ) )
			{
				return( implode( ",\x20", $column ) );
			}
			
			// Check if only column name.
			if( $onlyColumn )
			{
				return( implode( ",\x20", array_keys( $column ) ) );
			}
			return( implode( ",\x20", array_map( array: array_keys( $column ), callback: fn( String $key ) => sprintf( "%s=%s", substr( $key, 1 ), $key ) ) ) );
		}
		return( False );
	}
	
	/*
	 * Delete record from database table.
	 *
	 * @access Public Static
	 *
	 * @params Array|False $params
	 *
	 * @return Bool
	 */
	public static function delete( Array | False $params = False ): Bool
	{
		return( 
			self::prepare( 
				sprintf( 
					$params ? "DELETE FROM %s WHERE %s" : "DELETE FROM %s", 
					static::self()->table, 
						implode( ",\20", 
						call_user_func( fn() => array_map( fn( String $column ) => sprintf( "%s=%s", RegExp::replace( "/^\:/", $column, "" ), $column ), 
							array_keys( $params ) ) ) ), implode( ",\x20", array_keys( $params ) 
						) 
				) 
			) 
		)
		->execute( $params ?: [] );
	}
	
	/*
	 * Fetch normalization.
	 * 
	 * @access Protected Static
	 * 
	 * @params Array|PDOStatement $stmt
	 * 
	 * @return Array|Bool|Object
	 */
	public static function fetch( Array | PDOStatement $stmt ): Array | Bool | Object
	{
		// If user is authenticated.
		$auth = Auth::authenticated();
		
		// Record stack.
		$records = [];
		
		// If fetch has records.
		if( $stmt Instanceof PDOStatement && $record = $stmt->fetchObject() )
		{
			// Getting records.
			do
			{
				// Push filtered record values.
				$records[] = static::filter( $record );
			}
			while( $record = $stmt->fetchObject() );
		}
	
		// Return records.
		return( $records );
	}
	
	public static function filter( Array | False | Object $record ): Array | False | Object
	{
		// Mapping column must be filtered.
		foreach( self::self()->filter As $column )
		{
			// Check if column is exists.
			if( isset( $record->{ $column } ) )
			{
				// If column name is timestamp.
				if( $column === "timestamp" )
				{
					$record->datetime = new DateTime( $record->timestamp );
					$record->timestamp = $record->datetime->getTimestamp();
				}
			}
		}
		return( $record );
	}
	
	/*
	 * Get all record on database table.
	 *
	 * @access Public Static
	 *
	 * @params Array|String $column
	 * @params Int $limit
	 *
	 * @return Array|False|Object
	 */
	public static function getAll( Array | String $column = "*", Int $limit = 100 ): Array | Bool | Object
	{
		// Create PDO Statement.
		$stmt = self::prepare( sprintf( "SELECT %s FROM %s LIMIT %d", is_array( $column ) ? implode( ",\x20", $column ) : $column, static::self()->table, $limit ) );
		
		// Execute PDO Statement.
		$stmt->execute();
		
		// Return all records.
		return( static::fetch( $stmt ) );
	}
	
	/*
	 * Get record by id.
	 *
	 * @access Public Static
	 *
	 * @params Array|String $column
	 * @params Int $id
	 *
	 * @return Array|False|Object
	 */
	public static function getById( Array | String $column, Int $id ): Array | False | Object
	{
		// Create PDO Statement.
		$stmt = self::prepare( sprintf( "SELECT %s FROM %s WHERE id=:id", is_array( $column ) ? implode( ",\x20", $column ) : $column, static::self()->table ), );
		
		// Execute PDO Statement.
		$stmt->execute([
			":id" => $id
		]);
		
		// If record exists.
		if( $records = static::fetch( $stmt ) )
		{
			return( $records[0] );
		}
		return( False );
	}
	
	/*
	 * Get record by like.
	 *
	 * @access Public Static
	 *
	 * @params Array $params
	 *
	 * @
	
	/*
	 * Get record by Node.
	 *
	 * @access Public Static
	 *
	 * @params Array|String $column
	 * @params String $node
	 *
	 * @return Array|False|Object
	 */
	public static function getByNode( Array | String $column, String $node ): Array | False | Object
	{
		// Create PDO Statement.
		$stmt = self::prepare( sprintf( "SELECT %s FROM %s WHERE node=:node", is_array( $column ) ? implode( ",\x20", $column ) : $column, static::self()->table ) );
		
		// Execute PDO Statement.
		$stmt->execute([
			":node" => $node
		]);
		
		// If record exists.
		if( $records = static::fetch( $stmt ) )
		{
			return( $records[0] );
		}
		return( False );
	}
	
	/*
	 * Get record by Unitoken.
	 *
	 * @access Public Static
	 *
	 * @params Array|String $column
	 * @params String $unitoken
	 *
	 * @return Array|False|Object
	 */
	public static function getByUnitoken( Array | String $column, String $unitoken ): Array | False | Object
	{
		// Create PDO Statement.
		$stmt = self::prepare( sprintf( "SELECT %s FROM %s WHERE unitoken=:unitoken", is_array( $column ) ? implode( ",\x20", $column ) : $column, static::self()->table ) );
		
		// Execute PDO Statement.
		$stmt->execute([
			":unitoken" => $unitoken
		]);
		
		// If record exists.
		if( $records = static::fetch( $stmt ) )
		{
			return( $records[0] );
		}
		return( False );
	}
	
	/*
	 * Get database connection.
	 * 
	 * @access Public Static
	 * 
	 * @return hxAri\GGarden\Database
	 */
	final public static function getConnection(): Database
	{
		return( static::self() )->connection;
	}

	/*
	 * Insert new data record on database table.
	 *
	 * @access Public Static
	 *
	 * @params Array $column
	 *
	 * @return Bool
	 */
	public static function insert( Array $column ): Bool
	{
		return( 
			self::prepare( 
				sprintf( 
					"INSERT INTO %s( %s ) VALUES( %s )", 
					static::self()->table, 
					self::column( array_map( fn( String $col ) => RegExp::replace( "/^\:/", $col, "" ), array_keys( $column ) ) ),
					self::column( $column, True )
				) 
			) 
		)->execute( $column );
	}
	
	/*
	 * Get unitoken column accessible.
	 *
	 * @access Public Static
	 *
	 * @return Bool
	 */
	public static function isAccessible(): Bool
	{
		return( self::self() )->accessible;
	}
	
	/*
	 * Create PDO Statement.
	 *
	 * @access Public Static
	 *
	 * @params String $query
	 * @params Array|String $column
	 *
	 * @return PDOStatement
	 */
	public static function prepare( String $query, Array | String $column = "*" ): PDOStatement
	{
		return( self::getConnection() )->prepare( sprintf( $query, is_array( $column ) ? implode( ",\x20", $column ) : $column ) );
	}
	
	public static function select( Array | String $column, Array | False $params = False, String $join = ",\x20" ): Array | False | Object
	{
		// If `column` value is Array type.
		if( is_array( $column ) )
		{
			// Join string into array elements.
			$column = implode( ",\x20", $column );
		}
		
		// If `params` is not False value.
		if( $params !== False )
		{
			// Create statement.
			$query = "SELECT %s FROM %s WHERE %s";
			
			// Create where syntax.
			$where = call_user_func(
				
				/*
				 * Function for building where syntax.
				 *
				 * @passed $params
				 * @passed $join
				 *
				 * @return String
				 */
				function() use( &$params, $join )
				{
					// Where syntax.
					$where = [];
					
					foreach( $params As $column => $values )
					{
						// If values is Array type.
						if( is_array( $values ) )
						{
							// If Array values is two.
							if( count( $values ) === 2 )
							{
								// If where column specification by LIKE.
								if( $values['like'] ?? False )
								{
									// Push where column specification.
									$where[] = sprintf( "%s LIKE %s", substr( $column, 1 ), $column );
									
									// Change params values.
									$params[$column] = "%{$values['value']}%";
									
									// Skip iteration.
									continue;
								}
								else {
									
									// Change params values.
									$params[$column] = $values['value'];
								}
							}
						}
						
						// Push where column specification.
						$where[] = sprintf( "%s=%s", substr( $column, 1 ), $column );
					}
					
					// Join string to array elements.
					return( implode( $join, $where ) );
				}
			);
		}
		
		// Create PDO Statement.
		$stmt = self::prepare( sprintf( $query ?? "SELECT %s FROM %s", $column, static::self()->table, $where ?? Null ) );
		
		// Execute PDO Statement.
		$stmt->execute( $params ?: Null );
		
		// Return record results.
		return( static::fetch( $stmt ) );
	}
	
	/*
	 * Set unitoken column accessible.
	 *
	 * @access Public Static
	 *
	 * @params Bool $allowed
	 *
	 * @return Void
	 */
	public static function setAccessible( Bool $allowed ): Void
	{
		self::self()->accessible = $allowed;
	}
	
	/*
	 * Update record on database table.
	 *
	 * @access Public Static
	 *
	 * @params  $
	 *
	 * @return Bool
	 */
	public static function update( Array $column, Array | False $where = False ): Bool
	{
		return(
			self::prepare(
				sprintf(
					$where ? 
						"UPDATE %s SET %s WHERE %s" :
						"UPDATE %s SET %s",
					static::self()->table,
					self::column( $column ),
					self::column( $where )
				)
			)
		)->execute( $where ? [ ...$column, ...$where ] : $column );
	}
	
}

?>