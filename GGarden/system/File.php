<?php

namespace hxAri\GGarden;

/*
 * File
 * 
 * @package hxAri\GGarden
 */
abstract class File
{


	/*
	 * Check if file exists.
	 * 
	 * @access Public Static
	 *
	 * @params String $file
	 *  
	 * @return Bool
	 */
	public static function exists( String $file ): Bool
	{
		return( file_exists( path( $file ) ) );
	}
	
	public static function json( String $file ): Array | Object
	{
		return( json_decode( self::read( $file ), True ) );
	}

	/*
	 * Read file.
	 * 
	 * @access Public Static
	 * 
	 * @params String $file
	 * 
	 * @return String
	 */
	public static function read( String $file ): ? String
	{
		// Check if file is exists.
		if( self::exists( $file ) )
		{
			// Safe open binary file.
			$open = fopen( path( $file ), "r" );
			
			// Get file size.
			$size = self::size( $file, True );
			
			// Reader stack.
			$read = "";
			
			// Binary-safe file read.
			while( feof( $open ) === False )
			{
				$read .= fread( $open, $size );
			}
			
			// Closes an open file pointer.
			fclose( $open );
			
			// Return readed data.
			return( $read );
		}
		return( Null );
	}

	/* Get file suzes.
	 *
	 * @access Public Static
	 * 
	 * @params String $file
	 * @params Bool $auto
	 * 
	 * @return Bool|Int
	 */
	public static function size( String $file, Bool $auto = False ): Bool | Int
	{
		// Check if file exists.
		if( self::exists( $file ) )
		{
			// Get file sizes.
			$size = filesize( path( $file ) );

			// Return file sizes.
			return( $size === 0 ? ( $auto ? 13421779 : $size ) : $size );
		}
		return( False );
	}
}

?>