<?php

namespace hxAri\GGarden;

use PDOStatement;

/*
 * ModelArticel
 * 
 * @extends hxAri\GGarden\Model
 * 
 * @package hxAri\GGarden
 */
class ModelArticel extends Model
{
	
	/*
	 * @inherit hxAri\GGarden\Model
	 * 
	 */
	protected Array $filter = [
		"title",
		"author",
		"images",
		"description",
		"commonname",
		"latinname",
		"original",
		"scientific",
		"utility_list",
		"utility_text",
		"timestamp"
	];
	
	/*
	 * @inherit hxAri\GGarden\Model
	 * 
	 */
	protected String $table = "articel";
	
	/*
	 * @inherit hxAri\GGarden\Model
	 *
	 */
	public static function delete( Array | False $params = False ): Bool
	{
		// If params is not False.
		if( $params !== False )
		{
			// If column images is exists.
			if( isset( $params[':images'] ) )
			{
				// Delete articel image by images column value.
				ModelImage::delete([ ":images" => $params[':images'] ]);
			}
			
			// If column images not found.
			else
			{
				// Mapping images.
				array_map( fn( Object $image ) => ModelImage::delete([ ":path" => $image->path ]), self::select( "images", $params ) ?: [] );
			}
		}
		
		// Deleting user.
		return( parent::delete( $params ) );
	}
	
	/*
	 * Get plants by author unitoken.
	 *
	 * @access Public Static
	 *
	 * @params Array|String $column
	 * @params String $author
	 *
	 * @return Array|False|Object
	 */
	public static function getByAuthor( Array | String $column, String $author ): Array | False | Object
	{
		return( self::select( $column, [ ":author" => $author ], "\x20OR\x20" ) );
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
			":type" => [
				"like" => True,
				"value" => $value
			],
			":title" => [
				"like" => True,
				"value" => $value
			],
			":commonname" => [
				"like" => True,
				"value" => $value
			],
			":latinname" => [
				"like" => True,
				"value" => $value
			],
			":scientific" => [
				"like" => True,
				"value" => $value
			]
		]));
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
						// On unserialize column values.
						"title",
						"description",
						"commonname",
						"latinname",
						"original",
						"scientific",
						"utility_list",
						"utility_text" => Serializer::unserialize( $record->{ $column } ),
						
						// Get articel like, view, and saved.
						"unitoken" => "*",
						
						// Get author info.
						"author" => ModelUser::getByUnitoken( "id, node, verify, account, fullname, username, usermail, userpict, unitoken, bio, timestamp", $record->author ),
						
						// Get images info.
						"images" => ModelImage::getByUnitoken( "*", $record->images, ModelArticel::class ),
						
						// Unexecute.
						default => $record->{ $column }
					};
				}
			}
			
			// Auto added.
			$record->name = [
				"common" => $record->commonname ?? Null,
				"latin" => $record->latinname ?? Null
			];
			
			// Auto added.
			$record->utility = [
				"list" => $record->utility_list ?? Null,
				"text" => $record->utility_text ?? Null
			];
			
			// Check if column description is exists.
			if( isset( $record->description ) )
			{
				// Normalize description value.
				$record->description = is_string( $record->description ) ? [ $record->description ] : $record->description;
			}
			
			// Normalize utility value.
			$record->utility['list'] = is_string( $record->utility['list'] ) ? [ $record->utility['list'] ] : $record->utility['list'];
			$record->utility['text'] = is_string( $record->utility['text'] ) ? [ $record->utility['text'] ] : $record->utility['text'];
			
			// Unsetables.
			unset(
				$record->commonname,
				$record->latinname,
				$record->utility_text,
				$record->utility_list
			);
			
			// Check if user is not authenticated,
			// And column unitoken is not accessible.
			if( Auth::authenticated() === False && self::isAccessible() === False )
			{
				unset( $record->unitoken );
			}
		}
		
		return( $record );
	}
	
}

?>