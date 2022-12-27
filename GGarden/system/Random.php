<?php

namespace hxAri\GGarden;

use UnexpectedValueException;

/*
 * Random
 * 
 * @package hxAri\GGarden
 */
abstract class Random
{
	
	/*
	 * Generate random string Base64 Mime.
	 * 
	 * @access Public Static
	 * 
	 * @params Int $length 
	 * 
	 * @return String
	 */
	public static function base64( Int $length = 16 ): String
	{
		return( base64_encode( self::bytes( $length ) ) );
	}

	/*
	 * Generate random Float by bytes length.
	 * 
	 * @access Public Static
	 * 
	 * @params Int $length
	 * 
	 * @return Float
	 */
	public static function bindec( Int $length ): Float
	{
		return( str_replace( "\x3d", "", bindec( self::bytes( $length ) ) ) );
	}

	/*
	 * Generate random string Hexa Decimal.
	 * 
	 * @access Public Static
	 * 
	 * @params Int $length
	 * 
	 * @return String
	 */
	public static function bin2hex( Int $length = 16 ): String
	{
		return( bin2hex( self::bytes( $length ) ) );
	}

	/*
	 * Generate random pseudo bytes.
	 * 
	 * @access Public Static
	 * 
	 * @params Int $length
	 * 
	 * @return String
	 */
	public static function bytes( Int $length = 16 ): String
	{
		// Check if length is equal zero or samller than zero.
		if( $length <= 0 )
		{
			throw new UnexpectedValueException( "Length of random string can't be zero or smaller than zero" );
		}
		return( random_bytes( $length ) );
	}

	/*
	 * Generate random sorted strings.
	 * 
	 * @access Public Static
	 * 
	 * @params String $string
	 * 
	 * @return String
	 */
	public static function crypt( String $string ): String
	{
		// Generate strings.
		$result = RegExp::replace( 

			// Character must be replace.
			"/(?:(?<match>((?<fdot>^\.)|(?<ldot>\.$)|(?<mdot>\.)|(?<fslash>^\/)|(?<lslash>\/$)|(?<mslash>\/)){1,}))/",

			// Encrypt string with random salt.
			crypt( $string, self::base64( 64 ) ),
			
			// Callback handler function.
			fn( Array $match ) => match( True )
			{
				// Dot Symbol.
				isset( $match['fdot'] ) && valueIsNotEmpty( $match['fdot'] ) => "\x41",
				isset( $match['mdot'] ) && valueIsNotEmpty( $match['mdot'] ) => "\x2d",
				isset( $match['ldot'] ) && valueIsNotEmpty( $match['ldot'] ) => "\x43",
				
				// Slash symbol.
				isset( $match['fslash'] ) && valueIsNotEmpty( $match['fslash'] ) => "\x31",
				isset( $match['mslash'] ) && valueIsNotEmpty( $match['mslash'] ) => "\x2d",
				isset( $match['lslash'] ) && valueIsNotEmpty( $match['lslash'] ) => "\x34",
			}
		);
		
		// Return generated strings
		return( strlen( $result ) <= 2 ? self::crypt( $string ) : $result );
	}
	
	/*
	 * Generate random node token.
	 *
	 * @access Public Static
	 *
	 * @return String(14)
	 */
	public static function node(): String
	{
		// Random string stacks.
		$stack = [];
		
		// Looping by iteration.
		for( $i = 0; $i < 100; $i++ )
		{
			$stack = arrayQuake([ ...$stack, Random::crypt( Random::bin2hex( 64 ) ) ]);
		}
		
		// Get sub string.
		$substr = substr( implode( "", arrayQuake( $stack ) ), 0, 14 );
		
		// If last char is minus (-) symbol.
		if( $substr[13] === "-" )
		{
			$substr = self::node();
		}
		return( $substr );
	}
	
	/*
	 * Generate random unique token.
	 * 
	 * @access Public Static
	 * 
	 * @return String(248)
	 */
	public static function unitoken(): String
	{
		// Random string stacks.
		$stack = [];

		// Looping by iteration.
		for( $i = 0; $i < 100; $i++ )
		{
			$stack = arrayQuake([ ...$stack, Random::base64( 64 ) ]);
		}
		
		// Return sub string.
		return( substr( implode( "", arrayQuake( $stack ) ), 0, 248 ) );
	}

}

?>