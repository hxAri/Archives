<?php

namespace hxAri\GGarden;

/*
 * Profile
 *
 * @package hxAri\GGarden
 */
final class Profile
{
	
	public static function show( ? String $username = Null ): False | Object
	{
		// Default user is False.
		$user = False;
		
		// Check if username given is not empty.
		if( valueIsNotEmpty( $username ) )
		{
			// Set user unitoken to accessible.
			ModelUser::setAccessible( True );
			
			// Get user record is exists.
			$user = ModelUser::getByUsername( "id, node, verify, account, fullname, username, usermail, userpict, unitoken, bio, timestamp", $username );
		}
		else {
			
			// Get authenticated user.
			$user = Auth::getUser();
		}
		return( self::data( $user ) );
	}
	
	private static function data( False | Object $user ): False | Object
	{
		// If user exists.
		if( $user !== False )
		{
			// Check if user has Authenticated.
			if( Auth::authenticated() )
			{
				// Get user saveds.
				$user->saveds = ModelSave::getByUnitoken( "*", $user->unitoken );
				
				// If user articels.
				if( $user->posts = ModelArticel::getByAuthor( "id, node, type, title, images, unitoken, description, commonname, latinname, original, scientific, utility_list, utility_text, timestamp", $user->unitoken ) )
				{
					// Mapping user articels.
					foreach( $user->posts As $post )
					{
						// Get post stars.
						$post->stars = ModelStar::getByArticel( "*", $post->unitoken );
						
						// Get post views.
						$post->views = ModelView::getByArticel( "*", $post->unitoken );
					}
				}
			}
		}
		return( $user );
	}
	
}

?>