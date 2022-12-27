<?php

namespace hxAri\GGarden;

use PDOException;
use PDOStatement;
use ValueError;

/*
 * ModelUser
 *
 * @package hxAri\GGarden
 */
final class ModelUser extends Model
{
	
	/*
	 * Columns to be filled in automatically if not exist.
	 *
	 * @access Protected
	 *
	 * @values Array
	 */
	protected Array $auto = [
		"node" => 0,
		"userpict" => 5,
		"unitoken" => 6
	];
	
	/*
	 * @inherit hxAri\GGarden\Model
	 */
	protected Array $filter = [
		"verify",
		"fullname",
		"username",
		"userpict",
		"bio",
		"timestamp"
	];
	
	/*
	 * Required fields when adding a new user.
	 *
	 * @access Protected
	 *
	 * @values Array
	 */
	protected Array $required = [
		"fullname",
		"username",
		"usermail",
		"password"
	];
	
	/*
	 * @inherit hxAri\GGarden\Model
	 *
	 */
	protected String $table = "users";
	
	/*
	 * @inherit hxAri\GGarden\Model
	 *
	 */
	public static function delete( Array | False $params = False ): Bool
	{
		// If params is not False.
		if( $params !== False )
		{
			// Set unitoken column for accessible.
			self::setAccessible( True );
			
			// Mapping users.
			array_map(
				
				// Get users.
				array: self::select( "userpict, unitoken", $params, "\x20OR\x20" ) ?: [],
				
				// Callback handler.
				callback: function( Object $user )
				{
					// Delete user articels.
					ModelArticel::delete([ ":author" => $user->unitoken ]);
					
					// Delete user authenticated.
					ModelAuth::delete([ ":unitoken" => $user->unitoken ]);
					
					// Delete user profile and cover images.
					ModelImage::delete([ ":path" => $user->userpict->path ]);
					
					// Delete user report records.
					ModelReport::delete([ ":reporter" => $user->unitoken ]);
					
					// Delete user activity.
					ModelSave::delete([ ":unitoken" => $user->unitoken ]);
					ModelStar::delete([ ":unitoken" => $user->unitoken ]);
					ModelView::delete([ ":unitoken" => $user->unitoken ]);
				}
			);
			
			// Set unitoken column for inaccessible.
			self::setAccessible( False );
		}
		
		// Deleting user.
		return( parent::delete( $params ) );
	}
	
	/*
	 * Get user record by Account Level.
	 *
	 * @access Public Static
	 *
	 * @params Array|String $column
	 * @params String $account
	 *
	 * @return Array|False|Object
	 */
	public static function getByAccount( Array | String $column, String $account ): Array | False | Object
	{
		// Create PDO Statement.
		$stmt = parent::prepare( "SELECT %s FROM users WHERE account=:account", $column );
		
		// Execute PDO Statement.
		$stmt->execute([
			":account" => $account
		]);
		
		// Return users.
		return( self::fetch( $stmt ) );
	}
	
	/*
	 * Get plants based on keyword similarity.
	 *
	 * @access Public Static
	 *
	 * @params Array|String $column
	 * @params String $value
	 *
	 * @return Array|False|Object
	 */
	public static function getByLike( Array | String $column, String $value ): Array | False | Object
	{
		// Serialize value given.
		$value = Serializer::serialize( $value );
		
		// Return record results.
		return( self::select( $column, join: "\x20OR\x20", params: [
			":fullname" => [
				"like" => True,
				"value" => $value
			],
			":username" => [
				"like" => True,
				"value" => $value
			]
		]));
	}
	
	/*
	 * Ger user record by Username.
	 *
	 * @access Public Static
	 *
	 * @params Array|String $column
	 * @params String $username
	 *
	 * @return Array|False|Object
	 */
	public static function getByUsername( Array | String $column, String $username ): Array | False | Object
	{
		// Create PDO Statement.
		$stmt = parent::prepare( "SELECT %s FROM users WHERE username=:username", $column );
		
		// Execute PDO Statement.
		$stmt->execute([
			":username" => Serializer::serialize( strtolower( $username ) )
		]);
		
		// If user is exists.
		if( $user = self::fetch( $stmt ) )
		{
			$user = $user[0];
		}
		else {
			$user = False;
		}
		return( $user );
	}
	
	/*
	 * Get user record by Email Address.
	 *
	 * @access Public Static
	 *
	 * @params Array|String $column
	 * @params String $usermail
	 *
	 * @return Array|False|Object
	 */
	public static function getByUsermail( Array | String $column, String $usermail ): Array | False | Object
	{
		// Create PDO Statement.
		$stmt = parent::prepare( "SELECT %s FROM users WHERE usermail=:usermail", $column );
		
		// Execute PDO Statement.
		$stmt->execute([
			":usermail" => strtolower( $usermail )
		]);
		
		// If user is exists.
		if( $user = self::fetch( $stmt ) )
		{
			$user = $user[0];
		}
		else {
			$user = False;
		}
		return( $user );
	}
	
	/*
	 * Get user record by Id and Untoken.
	 *
	 * @access Public Static
	 *
	 * @params Array|String $column
	 * @params Int $id
	 * @params String $unitoken
	 *
	 * @return Array|False|Object
	 */
	public static function getByIdAndUnitoken( Array | String $column, Int $id, String $unitoken ): Array | False | Object
	{
		// Create PDO Statement.
		$stmt = self::prepare( "SELECT %s FROM users WHERE id=:id AND unitoken=:unitoken", $column );
		
		// Execute PDO Statement.
		$stmt->execute([
			":id" => $id,
			":unitoken" => $unitoken
		]);
		
		// If user is exists.
		if( $user = self::fetch( $stmt ) )
		{
			$user = $user[0];
		}
		else {
			$user = False;
		}
		return( $user );
	}
	
	/*
	 * Get user record by Username or Email Address.
	 *
	 * @access Public Static
	 *
	 * @params Array|String $column
	 * @params String $username
	 *
	 * @return Array|False|Object
	 */
	public static function getByUsernameOrUsermail( Array | String $column, String $username ): Array | False | Object
	{
		// Create PDO Statement.
		$stmt = parent::prepare( "SELECT %s FROM users WHERE username=:username OR usermail=:usermail", $column );
		
		// Execute PDO Statement.
		$stmt->execute([
			":username" => Serializer::serialize( $username = strtolower( $username ) ),
			":usermail" => $username
		]);
		
		// If user is exists.
		if( $user = self::fetch( $stmt ) )
		{
			$user = $user[0];
		}
		else {
			$user = False;
		}
		return( $user );
	}
	
	/*
	 * @inherit hxAri\GGarden\Model
	 *
	 */
	public static function insert( Array $column ): Bool
	{
		// Mapping required column.
		foreach( self::self()->required As $require )
		{
			// Check if column is not exists on params.
			if( isset( $column[sprintf( ":%s", $require )] ) === False )
			{
				throw new ValueError( sprintf( "Unable to add user, %s column does not exist in the given parameter", $require ) );
			}
			else {
				
				// Normalize param value.
				$column[sprintf( ":%s", $require )] = match( $require )
				{
					/*
					 * Serialize user fullname and username.
					 * 
					 */
					"fullname",
					"username" => Serializer::serialize( $column[sprintf( ":%s", $require )] ),
					
					/*
					 * Encrypt password with password hash DEFAULT MODE
					 *
					 */
					"password" => password_hash( $column[':password'], PASSWORD_DEFAULT ),
					
					// Usermail never normalize.
					"usermail" => $column[':usermail'],
				};
			}
		}
		
		// Mapping columns to be filled in automatically if not exist.
		foreach( self::self()->auto As $col => $pos )
		{
			// If param doest not exists.
			if( isset( $column[sprintf( ":%s", $col )] ) == False )
			{
				// Set column name by position.
				$column = arrayPush( 
					
					// Normalize position value.
					position: [
						
						// Matching position param.
						match( $col )
						{
							"node" => isset( $column[':id'] ) ? $pos +1 : $pos,
							"userpict" => isset( $column[':id'] ) ? ( isset( $column[':account'] ) ? $pos +2 : $pos +1 ) : ( isset( $params[':account'] ) ? $pos +1 : $pos ),
							"unitoken" => isset( $column[':id'] ) ? ( isset( $column[':account'] ) ? $pos +2 : $pos +1 ) : ( isset( $params[':account'] ) ? $pos +1 : $pos )
						},
						
						// Param name.
						sprintf( ":%s", $col )
					],
					
					// Param values.
					replace: match( $col )
					{
						// Generate user random node.
						"node" => Random::crypt( Random::base64( 64 ) ),
						
						// Generate user random unitoken.
						"userpict" => Random::unitoken(),
						"unitoken" => Random::unitoken()
					},
					
					// Params given.
					array: $column
				);
			}
		}
		
		//var_dump([ $column, array_keys( $column ) ]); exit;
		
		// Get default user profile picture info.
		$image = Image::defaultUserProfilePicture();
		
		/*
		 * Before adding users we will add one
		 * record to the images table, because
		 * each user will have a profile photo.
		 *
		 */
		$image = ModelImage::insert([
			
			// Get path name.
			":path" => $image['path'],
			
			// Model name is current model name.
			":model" => Serializer::serialize( ModelUser::class, SerializeSeparator::BYTES ),
			
			// Get image name not filename.
			":images" => $image['name'],
			
			/*
			 * This unitoken value will also be stored
			 * together with the user which will be stored later.
			 *
			 */
			":unitoken" => $column[':userpict'],
			
			/*
			 * The timestamp must be converted to string.
			 * The format value must be Y-m-d H:i:s e.g 2022-11-21 15:32:00
			 *
			 */
			":timestamp" => $image['time']->format( "Y-m-d H:i:s" )
		]);
		
		// Check if image has inserted.
		if( $image )
		{
			try
			{
				// Insert new user.
				return( parent::insert( $column ) );
			}
			catch( PDOException $e )
			{
				// Delete inserted image.
				ModelImage::delete([ ":unitoken" => $column[':userpict'] ]);
				
				// Throw back exception.
				throw $e;
			}
		}
		return( False );
	}
	
	/*
	 * @inherit hxAri\GGrden\Model
	 *
	 */
	public static function filter( Array | False | Object $record ): Array | False | Object
	{
		// If record is not False value.
		if( $record )
		{
			// Record must be filtered from parent before fiteration.
			$record = parent::filter( $record );
			
			// Mapping column must be filtered.
			foreach( self::self()->filter As $column )
			{
				// Check if column is exists.
				if( isset( $record->{ $column } ) )
				{
					// Handle column values.
					$record->{ $column } = match( $column )
					{
						// Parse to Bool type.
						"verify" => $record->verify === "True",
						
						// Only unserialize column value.
						"fullname",
						"username",
						"bio" => Serializer::unserialize( $record->{ $column } ),
						
						// Get profile and cover image.
						"userpict" => ModelImage::getByUnitoken( "*", $record->userpict ),
						
						// Unexecute.
						default => $record->{ $column }
					};
				}
			}
			
			// Check if user is not authenticated,
			// And column unitoken is not accessible.
			if( Auth::authenticated() === False && self::isAccessible() === False )
			{
				unset( $record->unitoken );
			}
		}
		
		return( $record );
	}
	
	/*
	 * @inherit hxAri\GGarden\Model
	 *
	 */
	public static function update( Array $column, Array | False $where = False ): Bool
	{
		// Mapping all column will update.
		foreach( $column As $col => $val )
		{
			// If column name is fullname, username, and bio.
			if( $col === ":fullname" ||
				$col === ":username" ||
				$col === ":bio" )
			{
				$column[$col] = Serializer::serialize( htmlspecialchars( $val ) );
			}
		}
		
		// Update column.
		return( parent::update( $column, $where ) );
	}
	
}

?>