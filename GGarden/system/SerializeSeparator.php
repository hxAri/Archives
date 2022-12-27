<?php

namespace hxAri\GGarden;

/*
 * SerializeSeparator
 *
 * @package hxAri\GGarden
 */
enum SerializeSeparator: String
{
	
	/*
	 * Separate hexadecimal string with bytes symbol.
	 *
	 * @values String
	 */
	case BYTES = "\x5c\x78";
	
	/*
	 * Separate hexadecimal string with minus symbol.
	 *
	 * @values String
	 */
	case MINUS = "\x2d";
	
}

?>