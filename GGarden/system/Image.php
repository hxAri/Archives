<?php

namespace hxAri\GGarden;

/*
 * Image
 *
 * @package hxAri\GGarden
 */
abstract class Image
{
	
	/*
	 * Default image path.
	 *
	 * @access Static Private
	 *
	 * @values String
	 */
	static private String $path = "me-5Yy1O.5LLcC6L3dZrVsFI1Mh0fwa-u8872JQk3n5cdIKeBn8c69YIWed07jSNcrpHZ7IjpMp72gd2SYxP91K37MYRlivoU2a-sMJc1yhVskQvEHWiUO1p6-T1w4.g";
	
	/*
	 * Default profile picture name.
	 *
	 * @access Static Private
	 *
	 * @values String
	 */
	static private String $file = "1669015855;d6NvV0.Geh.png";
	
	/*
	 * Get default user profile picture info.
	 *
	 * @access Public Static
	 *
	 * @return Array
	 */
	public static function defaultUserProfilePicture(): Array
	{
		// Get default path.
		$path = static::$path;
		
		// Get default filename.
		$file = static::$file;
		
		// Get name.
		$name = explode( ";", $file )[1];
		
		// Create new DateTime instance.
		$time = ( new DateTime )->setTimestamp( explode( ";", $file )[0] );
		
		return([
			"path" => $path,
			"file" => $file,
			"name" => $name,
			"time" => $time
		]);
	}
	
}

?>