<?php

namespace hxAri\GGarden;

use PDOStatement;

/*
 * ModelImage
 *
 * @extends hxAri\GGarden\Model
 *
 * @package hxAri\GGarden
 */
class ModelImage extends Model
{
	
	/*
	 * @inherit hxAri\GGarden\Model
	 * 
	 */
	protected String $table = "images";
	
	/*
	 * @inherit hxAri\GGarden\Model
	 *
	 */
	public static function delete( Array | False $params = False ): Bool
	{
		// If params is not False.
		if( $params !== False )
		{
			// If column path is exists.
			if( isset( $params[':path'] ) )
			{
				// Check if path is not default user profile picture path.
				if( Image::defaultUserProfilePicture()['path'] !== $params[':path'] )
				{
					// Delete image path.
					Path::rmdir( sprintf( "static/bundles/images/%s", $params[':path'] ) );
				}
			}
			
			// If column path not found.
			else
			{
				// Mapping images.
				array_map(
					
					// Get image records.
					array: self::select( "path", $params ) ?: [],
					
					// Handle delete image.
					callback: function( Object $image )
					{
						// Check if path is not default user profile picture path.
						if( Image::defaultUserProfilePicture()['path'] !== $image->path )
						{
							// Delete image path.
							Path::rmdir( sprintf( "static/bundles/images/%s", $image->path ) );
						}
					}
				);
			}
		}
		
		// Deleting image.
		return( parent::delete( $params ) );
	}
	
	/*
	 * @inherit hxAri\GGarden\Model
	 *
	 */
	public static function fetch( Array | PDOStatement $stmt ): Array | False | Object
	{
		// If user is authenticated.
		$auth = Auth::authenticated();
		
		// Check if any records are retrieved.
		if( $records = parent::fetch( $stmt ) )
		{
			foreach( $records As $i => $record )
			{
				// Checks whether the retrieved record
				// has Path, Images, and Created columns.
				if( isset( $record->path ) &&
					isset( $record->images ) &&
					isset( $record->timestamp ) )
				{
					// Mapping and Explode all image names
					$record->images = array_map( fn( String $name ) => sprintf( "/statics/bundles/images/%s/%d;%s", $record->path, $record->timestamp, $name ), explode( ";\x20", $record->images ) );
					
					// Check if model property is exists.
					if( isset( $record->model ) )
					{
						// Unserialize model name.
						$record->model = Serializer::unserialize( $record->model, SerializeSeparator::BYTES );
						
						// Matching model.
						switch( $record->model )
						{
							case ModelUser::class:
								$record->main = $record->images[0] ?? Null;
								$record->cover = $record->images[1] ?? Null; break;
							
							case ModelArticel::class:
								$record->banner = $record->images[0] ?? Null;
								$record->common = $record->images; break;
						}
						
						// Unset images column.
						unset( $record->images );
					}
				}
				
				// Check if user is not authenticated,
				// And column unitoken is not accessible.
				if( $auth === False && self::isAccessible() === False )
				{
					unset( $record->unitoken );
				}
				
				// Push records.
				$records[$i] = $record;
			}
		}
		return( $records );
	}
	
}

?>