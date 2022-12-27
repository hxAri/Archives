<?php

namespace hxAri\GGarden;

/*
 * Search
 *
 * @package hxAri\GGarden
 */
abstract class Search
{
	
	/*
	 * Search any data.
	 *
	 * @access Public Static
	 *
	 * @params String $query
	 * @params String $category
	 *
	 * @return Array
	 */
	public static function search( String $query, ? String $category = Null ): Array
	{
		// If search by category is not empty.
		if( $category !== Null )
		{
			// Check if category is user.
			if( $category === Token::USER->value )
			{
				// Get the users.
				$users = ModelUser::getByLike( "id, node, verify, account, fullname, username, usermail, userpict, unitoken, bio, timestamp", $query );
			}
			else {
				
				// Get articels.
				$articel = ModelArticel::getByLike( "*", $query );
			}
			
			return([
				"articel" => $articel ?? [] ?: [],
				"users" => $users ?? [] ?: []
			]);
		}
		else {
			return([
				"articel" => ModelArticel::getByLike( "*", $query ),
				"users" => ModelUser::getByLike( "id, node, verify, account, fullname, username, usermail, userpict, unitoken, bio, timestamp", $query )
			]);
		}
	}
	
}

?>