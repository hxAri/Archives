<?php

namespace hxAri\GGarden;

/*
 * ModelStar
 *
 * @extends hxAri\GGarden\Model
 *
 * @package hxAri\GGarden
 */
class ModelStar extends Model
{
	
	/*
	 * @inherit hxAri\GGarden\Model
	 *
	 */
	protected String $table = "stars";
	
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
	 * Get star by articel unitoken.
	 *
	 * @access Public Static
	 *
	 * @params Array|String $column
	 * @params String $articel
	 *
	 * @return Array|False|Object
	 */
	public static function getByArticel( Array | String $column, String $articel ): Array | False | Object
	{
		return( self::select( $column, [ ":articel" => $articel ] ) );
	}
	
	/*
	 * Get all liked articles by author.
	 *
	 * @access Public Static
	 *
	 * @params Array|String $column
	 * @params String $unitoken
	 *
	 * @return Array|False|Object
	 */
	public static function getByAuthor( Array | String $column, String $author ): Array | False | Object
	{
		// Get all articels.
		$posts = ModelArticel::getByAuthor( "id, node, images, commonname, latinname, unitoken", $author );
		
		// Mapping articels.
		foreach( $posts ?: [] As $post )
		{
			// Get stars.
			$post->stars = self::getByArticel( "*", $post->unitoken );
		}
		
		return( $posts );
	}
	
	/*
	 * Get star by articel and author unitoken.
	 *
	 * @access Public Static
	 *
	 * @params Array|String $column
	 * @params String $articel
	 * @params String $author
	 *
	 * @return Array|False|Object
	 */
	public static function getByArticelAndUser( Array | String $column, String $articel, String $author ): Array | False | Object
	{
		// Check if user has stared.
		if( $stars = self::select( $column, [ ":articel" => $articel, ":unitoken" => $author ], "\x20AND\x20" ) )
		{
			return( $stars[0] );
		}
		return( False );
	}
	
}

?>