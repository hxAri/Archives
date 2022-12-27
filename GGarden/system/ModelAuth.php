<?php

namespace hxAri\GGarden;

use PDOStatement;

/*
 * ModelAuth
 *
 * @extends hxAri\GGarden\Model
 *
 * @package hxAri\GGarden
 */
class ModelAuth extends Model
{
	
	/*
	 * @inherit hxAri\GGarden\Model
	 *
	 */
	protected String $table = "auth";
	
	/*
	 * @inherit hxAri\GGarden\Model
	 *
	 */
	public static function getByUnitoken( Array | String $column, String $unitoken ): Array | False | Object
	{
		// Set unitoken accessible.
		ModelUser::setAccessible( True );
		
		// Create PDO Statement.
		$stmt = self::prepare( "SELECT %s FROM auth WHERE unitoken=:unitoken", $column );
		
		// Execute PDO Statement.
		$stmt->execute([
			":unitoken" => $unitoken
		]);
		
		// If user has authenticated exist.
		if( $auths = self::fetch( $stmt ) )
		{
			// Stack auths.
			$stack = [];
			
			// Looping authenticated users.
			foreach( $auths As $auth )
			{
				// Check if user exists.
				if( isset( $stack[$auth->unitoken] ) )
				{
					$stack[$auth->unitoken]->auths[] = $auth; continue;
				}
				
				// Get user by unitoken.
				$stack[$auth->unitoken] = ModelUser::getByUnitoken( "id, node, verify, account, fullname, username, usermail, userpict, unitoken, bio, timestamp", $auth->unitoken );
				$stack[$auth->unitoken]->auths = [
					$auth
				];
			}
			
			// Get array values only.
			$auths = array_values( $stack )[0];
		}
		return( $auths );
	}
	
	/*
	 * Get record by csrftoken.
	 *
	 * @access Publlic Static
	 *
	 * @params Array|String $column
	 * @params String $csrftoken
	 * @params String $sessionid
	 *
	 * @return Array|False|Object
	 */
	public static function getByCsrftokenAndSessionid( Array | String $column, String $csrftoken, String $sessionid ): Array | False | Object
	{
		// Create PDO Statement.
		$stmt = self::prepare( "SELECT %s FROM auth WHERE csrftoken=:csrftoken AND sessionid=:sessionid", $column );
		
		// Execute PDO Statement.
		$stmt->execute([
			":csrftoken" => $csrftoken,
			":sessionid" => $sessionid
		]);
		
		// If user authentcated exists.
		if( $auth = self::fetch( $stmt ) )
		{
			$auth = $auth[0];
		}
		return( $auth );
	}
	
	/*
	 * @inherit hxAri\GGarden\Model
	 *
	 */
	public static function fetch( Array | PDOStatement $stmt ): Array | Bool | Object
	{
		// Set unitoken accessible.
		self::setAccessible( True );
		
		// Only return form parent.
		return( parent::fetch( $stmt ) );
	}
	
}

?>