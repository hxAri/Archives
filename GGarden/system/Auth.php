<?php

namespace hxAri\GGarden;

/*
 * Auth
 *
 * @extends hxAri\GGarden\Singleton
 *
 * @package hxAri\GGarden
 */
class Auth extends Singleton
{
	
	/*
	 * User is authenticated.
	 *
	 * @access Private
	 *
	 * @values Bool
	 */
	private ? Bool $auth = Null;
	
	/*
	 * Profile authenticated user.
	 * 
	 * @access Private
	 * 
	 * @value False|Object
	 */
	private False | Object $user = False;
	
	/*
	 * Set user authenticate.
	 *
	 * @access Public Static
	 *
	 * @params Object $user
	 *
	 * @return Void
	 */
	public static function auth( Object $user ): Void
	{
		//  Save user profile info.
		self::self()->user = $user;

		// Get user id and Unitoken.
		$id = $user->id;
		$unitoken = $user->unitoken;
		
		// Generate random csrftoken.
		$csrftoken = self::csrfTokenGenerator();
		
		// Create session id format.
		$sessionid = self::sessionIdFormater( $id );
		
		// Insert auth info into table.
		ModelAuth::insert([
			":csrftoken" => $csrftoken,
			":sessionid" => $sessionid,
			":unitoken" => $unitoken
		]);
		
		// Cookie options.
		$options = [
			"expires" => strtotime( "+30 days" ),
			"httponly" => True,
			"secure" => True,
			"samesite" => "Strict",
			"path" => "/"
		];
		
		// Set Csrftoken to cookie.
		setcookie( "csrftoken", $csrftoken, $options );
		
		// Set Sessionid to cookie.
		setcookie( "sessionid", $sessionid, $options );
		
		// Set authenticated.
		self::self()->auth = True;
	}
	
	/*
	 * Check if user has authenticated.
	 *
	 * @access Public Static
	 *
	 * @return Bool
	 */
	public static function authenticated(): Bool
	{
		// If authentication is checked.
		if( self::self()->auth !== Null )
		{
			// If user has authenticated but user data none.
			if( self::self()->user === False &&
				self::self()->auth )
			{
				self::retrieve();
			}
			return( self::self()->auth );
		}
		
		// Set as checked.
		// This is done so that an
		// Infinite loop does not occur.
		self::self()->auth = False;
		
		// Check if csrftoken and session id is exists.
		if( isset( $_COOKIE['csrftoken'] ) && 
			isset( $_COOKIE['sessionid'] ) )
		{
			// Retrieve user from database.
			self::retrieve();
			
			// Return as bool.
			return( self::self()->auth = self::self()->user ? True : False );
		}
		return( self::self()->auth = False );
	}
	
	/*
	 * Generate random CSRF Token.
	 *
	 * @access Public Static
	 *
	 * @return String(128)
	 */
	public static function csrfTokenGenerator(): String
	{
		// Random string stacks.
		$stack = [];
		
		// Looping by iteration.
		for( $i = 0; $i < 100; $i++ )
		{
			// Generate random crypt.
			$stack[] = Random::bin2hex( 128 );
			
			// Quakeable stacks.
			$stack = arrayQuake( $stack );
		}
		
		// Return sub string.
		return( substr( implode( "", arrayQuake( arrayQuake( $stack ) ) ), 0, 128 ) );
	}
	
	/*
	 * Get id from authenticated user.
	 *
	 * @access Public Static
	 *
	 * @return False|Int
	 */
	public static function getId(): False | Int
	{
		// Check if user has authenticated and data has saved.
		if( self::authenticated() && self::self()->user )
		{
			// Return user id.
			return( self::self() )->user->id;
		}
		return( False );
	}
	
	/*
	 * Get authenticated user info.
	 *
	 * @access Public Static
	 *
	 * @return False|Object
	 */
	public static function getUser(): False | Object
	{
		// Check if user has authenticated and data has saved.
		if( self::authenticated() && self::self()->user )
		{
			// Return user.
			return( self::self() )->user;
		}
		return( False );
	}
	
	/*
	 * Get unitoken from authenticated user.
	 *
	 * @access Public Static
	 *
	 * @return False|String
	 */
	public static function getUnitoken(): False | String
	{
		// Check if user has authenticated and data has saved.
		if( self::authenticated() && self::self()->user )
		{
			// Return user unitoken.
			return( self::self() )->user->unitoken;
		}
		return( False );
	}
	
	public static function isSuperAdmin(): Bool
	{
		// Check if user is authenticated.
		if( self::auth() )
		{
			return( RegExp::test( "/^(?:(Super[\s]+Admin))$/i", Serializer::unserialize( self::getUser()->account ) ) );
		}
		return( False );
	}
	
	public static function isAdmin(): Bool
	{
		// Check if user is authenticated.
		if( self::auth() )
		{
			return( RegExp::test( "/^(?:(Admin))$/i", Serializer::unserialize( self::getUser()->account ) ) );
		}
		return( False );
	}
	
	public static function isUser(): Bool
	{
		// Check if user is authenticated.
		if( self::auth() )
		{
			return( RegExp::test( "/^(?:(User))$/i", Serializer::unserialize( self::getUser()->account ) ) );
		}
		return( False );
	}
	
	public static function isGuest(): Bool
	{
		return( self::auth() === False );
	}
	
	/*
	 * User logout.
	 *
	 * @access Public Static
	 *
	 * @return Void
	 */
	public static function logout(): Void
	{
		// Check if csrftoken and session id is exists.
		if( isset( $_COOKIE['csrftoken'] ) && 
			isset( $_COOKIE['sessionid'] ) )
		{
			// Remove authenticated user.
			ModelAuth::delete([
				":csrftoken" => $_COOKIE['csrftoken'],
				":sessionid" => $_COOKIE['sessionid']
			]);
			
			// Remove cookies.
			setcookie( "csrftoken", "None", strtotime( "-30 days" ), "/" );
			setcookie( "sessionid", "None", strtotime( "-30 days" ), "/" );
		}
	}
	
	/*
	 * Create session id format.
	 *
	 * @access Public Static
	 *
	 * @params Int $id
	 *
	 * @return String(-+80)
	 */
	public static function sessionIdFormater( Int $id ): String
	{
		return( sprintf( "%d;%s", $id, Random::bin2hex( 32 ) ) );
	}
	
	/*
	 * Retrieve user authenticated from database table.
	 *
	 * @access Private Static
	 *
	 * @return Void
	 */
	private static function retrieve(): Void
	{
		// Set unitoken accessible.
		ModelAuth::setAccessible( True );
		ModelUser::setAccessible( True );
		
		// If record exists.
		if( $auth = ModelAuth::getByCsrftokenAndSessionid( "*", $_COOKIE['csrftoken'], $_COOKIE['sessionid'] ) )
		{
			// Check if datetime is expired.
			if( $auth->timestamp <= ( new DateTime )->getTimestamp() )
			{
				// Get user record by id and unitoken.
				$user = ModelUser::getByIdAndUnitoken( "id, node, verify, account, fullname, username, usermail, userpict, unitoken, bio, timestamp", explode( ";", $auth->sessionid )[0], $auth->unitoken );
			}
		}
		
		// Set unitoken accessible.
		ModelUser::setAccessible( False );
		
		// Set user authenticated.
		self::self()->user = $user ?? False;
	}
	
}

?>