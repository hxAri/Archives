<?php

use hxAri\GGarden;

/*
 * Push array element any position.
 *
 * @params Array[Int|String:Int|String]|Int|String $position
 * @params Array $array
 * @params Mixed $replace
 *
 * @return Array
 */
function arrayPush( Array | Int | String $position, Array $array, Mixed $replace ): Array
{
	// Get array length.
	$length = count( $array );
	
	// If the array is empty with no contents.
	if( $length === 0 )
	{
		$array[] = $replace;
	}
	
	// If array length is smaller than position.
	else if( is_int( $position ) && $length -1 <= $position )
	{
		$array[] = $replace;
	}
	
	// If position string then this will overwrite the existing value.
	else if( is_string( $position ) )
	{
		$array[$position] = $replace;
	}
	else {
		
		// Looping iteration start.
		$i = 0;
		
		// Stack values.
		$stack = [];
		
		// To avoid stacking values, unset the array if it exists.
		if( is_array( $position ) )
		{
			unset( $array[$position[1]] );
		}
		
		// Mapping array.
		foreach( $array As $index => $value )
		{
			$i++;
			
			// If position is equal index iteration.
			if( is_int( $position ) && $i -1 === $position || is_array( $position ) && $i -1 === $position[0] )
			{
				// Set array element by position.
				$stack[( is_int( $position ) ? $i -1 : $position[1] )] = $replace;
				
				// Add next queue.
				foreach( $array As $k => $v )
				{
					$stack[( is_int( $k ) ? $k + 1 : $k )] = $v;
				}
				break;
			}
			
			// If position is more than number of array.
			else if( is_int( $position ) && $length < $position + 1 || is_array( $position ) && $length < $position[0] + 1 )
			{
				// Set array element by position.
				$stack[( is_int( $position ) ? $i -1 : $position[1] )] = $replace;
				
				// Add next queue.
				foreach( $array As $k => $v )
				{
					$stack[( is_int( $k ) ? $k + 1 : $k )] = $v;
				}
				break;
			}
			else {
				$stack[$index] = $value;
			}
			unset( $array[$index] );
		}
		return( $stack );
	}
	return( $array );
}

/*
 * Give an array good quake so every value will
 * endup with random given space. Keys, and
 * their order are preserved.
 *
 * @author xZero <xzero@elite7hackers.net>
 * @source https://www.php.net/manual/en/function.shuffle.php
 *
 * @params Array $array
 *
 * @return Array|False
 */
function arrayQuake( $array ): Array | False
{
	if( is_array( $array ) )
	{
		// We need this to preserve keys
		$keys = array_keys( $array );
		$temp = $array;
		$array = NULL;
		
		// Shuffling array.
		shuffle( $temp );
		
		foreach( $temp as $k => $item )
		{
			$array[$keys[$k]] = $item;
		}
		return( $array ?? False );
	}
	return( False );
}

/*
 * Add basepath into prefix path or remove all basepath from strings.
 * 
 * @params String $path
 * @params Bool $rm
 * 
 * @return String
 */
function path( String $path, Bool $rm = False ): String
{
	// Check if the path name has a prefix (e.g. php://).
	if( GGarden\RegExp::test( "/(?<name>^[a-zA-Z_\x80-\xff][a-zA-Z0-9_\x80-\xff]*)\:(?<separator>\/\/|\\\)/i", $path ) )
	{
		return( $path );
	}
	
	// Remove all basepath in string.
	if( $rm )
	{
		return( str_replace( [ GGarden\RegExp::replace( "/\//", BASE_PATH, DIRECTORY_SEPARATOR ), GGarden\RegExp::replace( "/\//", BASE_PATH, "\\" . DIRECTORY_SEPARATOR ) ], "", $path ) );
	}
	
	// Add basepath into prefix pathname.
	return( str_replace( str_repeat( DIRECTORY_SEPARATOR, 2 ), DIRECTORY_SEPARATOR, GGarden\RegExp::replace( "/\//", BASE_PATH . "/" . $path, DIRECTORY_SEPARATOR ) ) );
}

function shared(): Array
{
	// Get explore data.
	$data = [
		"search" => [],
		"onview" => [],
		"articels" => [],
		"timeline" => [],
		"suggests" => [],
		"signed" => False,
		"profile" => False,
		"explore" => False
	];
	
	// Check if user has authenticated.
	if( GGarden\Auth::authenticated() )
	{
		$data = [
			...$data,
			...[
				"signed" => True,
				"profile" => GGarden\Auth::getUser(),
				"timeline" => []
			]
		];
	}

	// Return data shared.
	return( $data );
}

/*
 * Find all occurrences of a substring in a string.
 *
 * @author Salman A
 * @source https://stackoverflow.com/questions/15737408/php-find-all-occurrences-of-a-substring-in-a-string/15737449#15737449
 *
 * @params String $hystack
 * @params String $needle
 *
 * @return Array
 */
function strposAll( String $haystack, String $needle ): Array
{
    $offset = 0;
    $allpos = array();
    
    while( ( $pos = strpos( $haystack, $needle, $offset ) ) !== FALSE )
    {
        $offset = $pos + 1;
        $allpos[] = $pos;
    }
    return $allpos;
}

/*
 * Print Exception Thrown.
 * 
 * @params Throwable
 * 
 * @return String
 */
function thrown( Throwable $e ): String
{
	return( path( sprintf( "%s: %s in file %s on line %d", $e::class, $e->getMessage(), $e->getFile(), $e->getLine(), json_encode( $e->getTrace(), JSON_PRETTY_PRINT ) ), True ) );
}

/*
 * Check if value is empty.
 *
 * @params Mixed $value
 *
 * @return Bool
 */
function valueIsEmpty( Mixed $value ): Bool
{
	switch( True )
	{
		// If `value` is Int type.
		case is_int( $value ):
			return( $value === 0 );
			
		// If `value` is Null type.
		case is_null( $value ): return( True );
		
		// If `value` is Bool type.
		case is_bool( $value ):
			return( $value === False );
		
		// If `value` is Array type.
		case is_array( $value ):
			return( count( $value ) === 0 );
			
		// If `value` is String type.
		case is_string( $value ):
			return( GGarden\RegExp::test( "/^([\s\t\n]*)$/", $value ) );
	}
	return( False );
}

/*
 * Check if value is not empty.
 *
 * @params Mixed $value
 *
 * @return Bool
 */
function valueIsNotEmpty( Mixed $value ): Bool
{
	return( valueIsEmpty( $value ) === False );
}

/*
 * Get all object properties.
 *
 * @params Object $object
 *
 * @return Array
 */
function vars( Object $object ): Array
{
	// Create new ReflectionClass instance.
	$ref = new ReflectionClass( $object );
	$vars = [];
	
	// Mapping properties.
	foreach( $ref->getProperties() As $prop )
	{
		// Push array elements.
		$vars[$prop->getName()] = $prop->getValue();
	}
	
	return( $vars );
}

/*
 * Display view.
 * 
 * @params Array|Bool $error
 * @params Array|Bool $shared
 * 
 * @return Void
 */
function view( Array | Bool $error = False, Array $shared = [], String $title = "GGarden" ): Void
{
	// Extract array as variable.
	extract([
		"data" => json_encode( flags: JSON_INVALID_UTF8_SUBSTITUTE | JSON_PRETTY_PRINT, value: [
			"error" => $error,
			"author" => [
				[
					"name" => "Ari Setiawan (hxAri)",
					"email" => "ari160824@gmail.com",
					"phone" => "+62 8583-9211-030"
				]
			],
			"shared" => isset( $shared['shared'] ) ? $shared['shared'] : $shared
		]),
		"title" => $title,
		"description" => $error['message'] ?? ""
	]);
	
	// Import view file.
	require( path( "assets/views/public.php" ) );
}

?>