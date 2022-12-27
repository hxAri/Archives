<?php

namespace hxAri\GGarden;

/*
 * Serializer
 *
 * @package hxAri\GGarden
 */
abstract class Serializer
{
	
	public static function serialize( Array | Bool | Null | String $data, String | SerializeSeparator $separator = SerializeSeparator::MINUS ): False | Null | String
	{
		// Check if value given is not empty.
		if( valueIsNotEmpty( $data ) )
		{
			// If value is Bool type.
			if( is_bool( $data ) )
			{
				$data = "True";
			}
			
			// If value is Array type.
			if( is_array( $data ) )
			{
				// If value is Array List type.
				if( array_is_list( $data ) )
				{
					// Mapping array list.
					$data = array_map( fn( Array | Bool | Null | String $value ) => self::serialize( $value, $separator ), $data );
				}
				else {
					
					// Mapping array with key name.
					foreach( $data As $key => $val )
					{
						// If is value is Array type and Array is List.
						if( is_array( $val ) && array_is_list( $val ) )
						{
							$data[] = sprintf( "%s=%s", $key, implode( "\x2c\x20", array_map( fn( Array | Bool | Null | String $value ) => self::serialize( $value, $separator ), $val ) ) );
						}
						else {
							$data[] = sprintf( "%s=%s", $key, self::serialize( $val, $separator ) );
						}
						
						// Unset array by key name.
						unset( $data[$key] );
					}
				}
				
				// Join separator to array.
				$data = implode( "\x3b\x20", $data );
			}
			else {
				
				// If separator is Enum.
				if( $separator Instanceof SerializeSeparator )
				{
					$separator = $separator->value;
				}
				
				// Serialize string with separator.
				$data = implode( $separator, str_split( bin2hex( $data ), 2 ) );
			}
		}
		return( $data );
	}
	
	public static function unserialize( Array | Bool | Null | String $data, String | SerializeSeparator $separator = SerializeSeparator::MINUS ): Array | Bool | Null | String
	{
		// Check if value given is not empty.
		if( valueIsNotEmpty( $data ) )
		{
			// If value is Bool type.
			if( is_bool( $data ) )
			{
				return( "True" );
			}
			
			// If value is Array type.
			if( is_array( $data ) )
			{
				// Mapping data.
				foreach( $data As $key => $val )
				{
					$data[$key] = self::unserialize( $val, $separator );
				}
			}
			else {
				
				// Split serialized string with separator.
				$data = explode( "\x3b\x20", $data );
				
				// Mapping splited serialized strings.
				foreach( $data As $i => $value )
				{
					// If serialized string has key.
					if( count( $assoc = explode( "\x3d", $value ) ) === 2 )
					{
						// Check if serialized value is list type.
						if( count( $list = explode( "\x2c\x20", $assoc[1] ) ) > 1 )
						{
							$assoc[1] = array_map( fn( String $val ) => $val === "None" ? "None" : self::unserialize( $val, $separator ), $list );
						}
						else {
							$assoc[1] = $assoc[1] === "None" ? "None" : self::unserialize( $assoc[1], $separator );
						}
						
						// Push data.
						$data[$assoc[0]] = $assoc[1];
						
						// Unset serialized data by index.
						unset( $data[$i] );
					}
					else {
						
						// If separator is Enum.
						if( $separator Instanceof SerializeSeparator )
						{
							$separator = $separator->value;
						}
						
						// Check if serialized value is list type.
						if( count( $list = explode( "\x2c\x20", $value ) ) > 1 )
						{
							$data[$i] = array_map( fn( String $val ) => $val === "None" ? "None" : hex2bin( str_replace( $separator, "", $val ) ), $list );
						}
						else {
							$data[$i] = $data[$i] === "None" ? "None" :  hex2bin( str_replace( $separator, "", $value ) );
						}
					}
				}
			}
			
			// Normalize unserialized data.
			$data = count( $data ) === 1 ? $data[0] : $data;
		}
		return( $data );
	}
	
}

?>