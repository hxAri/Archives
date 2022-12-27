<?php

namespace hxAri\GGarden;

use TypeError;
use ValueError;

/*
 * Path
 *
 * @package hxAri\GGarden
 */
abstract class Path
{
	
	/*
	 * Tells whether the filename is a directory.
	 *
	 * @access Public Static
	 *
	 * @params String $dir
	 *
	 * @return Bool
	 */
	public static function exists( String $dir ): Bool
	{
		return( is_dir( path( $dir ) ) );
	}
	
	/*
	 * List directory contents.
	 *
	 * @access Public Static
	 *
	 * @params String $dir
	 *
	 * @return Array|Bool
	 *
	 * @throws TypeError
	 */
	public static function ls( String $path ): Array | Bool
	{
		if( self::exists( $path ) )
		{
			// Scanning directory.
			$scan = scandir( path( $path ) );
			
			// Computes the difference of arrays.
			$scan = array_diff( $scan, [ ".", ".." ] );
			
			// Sort an array by key in ascending order.
			ksort( $scan );
			
			return( $scan );
		}
		throw new TypeError( sprintf( "No such directory %s", $path ) );
	}
	
	/*
	 * Create new directory.
	 *
	 * @access Public Static
	 *
	 * @params String $path
	 *
	 * @return Void
	 */
	public static function mkdir( String $path ): Void
	{
		// Directory stack.
		$stack = "";
		
		// Mapping dir.
		array_map( array: explode( "/", $path ), callback: function( $dir ) use( &$stack )
		{
			// Check if directory is exists.
			if( self::exists( $stack = sprintf( "%s%s/", $stack, $dir ) ) === False )
			{
				// Create new directory.
				mkdir( path( $stack ) );
			}
		});
	}
	
	/*
	 * Rename directory.
	 *
	 * @access Public Static
	 *
	 * @params String $from
	 * @params String $to
	 *
	 * @return
	 */
	public static function rename( String $from, String $to )
	{
		rename( path( $from ), path( $to ) );
	}
	
	/*
	 * Remove directory.
	 *
	 * @access Public Static
	 *
	 * @params String $path
	 * @params Resource $context
	 *
	 * @return Bool
	 */
	public static function rmdir( String $path, $context = Null ): Bool
	{
		
	}
	
	
	/*
	/*
	 * Create tree directory structure.
	 *
	 * @access Public Static
	 *
	 * @params String $path
	 * @params String $parent
	 *
	 * @return Array|False
	 *
	 * @throws TypeError
	 */
	public static function tree( String $path, String $parent = "" ): Array | False
	{
		if( self::exists( $path ) )
		{
			$tree = [];
			$scan = self::ls( $path );
			
			foreach( $scan As $i => $file )
			{
				if( $file === "vendor" || $file === ".git" )
				{
					continue;
				}
				if( self::exists( sprintf( "%s/%s", $path, $file ) ) && $rscan = self::tree( sprintf( "%s/%s", $path, $file ) ) )
				{
					$tree[$file] = $rscan;
				} else {
					$tree[] = $file;
				}
			}
			return( $tree );
		}
		throw new TypeError( sprintf( "No such directory %s", $path ) );
	}
	
	/*
	 * Image path generator.
	 *
	 * @access Public Static
	 *
	 * @return String
	 */
	public static function rand(): String
	{
		// Random string stacks.
		$stack = [];
		
		// Looping by iteration.
		for( $i = 0; $i < 100; $i++ )
		{
			$stack[] = Random::crypt(
				Random::bin2hex( 68 )
			);
		}
		
		// Return sub string.
		return( substr( implode( "", arrayQuake( $stack ) ), 0, 128 ) );
	}
	
}

?>