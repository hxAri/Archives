<?php

namespace hxAri\GGarden;

use DateTimeZone;

/*
 * DateTime
 *
 * @extends DateTime
 *
 * @package hxAri\GGarden
 */
class DateTime extends \DateTime
{
	/*
	 * @inherit DateTime
	 *
	 */
	final public function __construct( String $datetime = "now", ? DateTimeZone $timezone = Null )
	{
		parent::__construct(
			$datetime,
			$timezone ?? new DateTimeZone( "Asia/Jakarta" )
		);
	}
}

?>