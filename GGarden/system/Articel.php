<?php

namespace hxAri\GGarden;

/*
 * Articel
 *
 * @package hxAri\GGarden
 */
class Articel
{
	
	public static function getInfo( String $node ): False | Object
	{
		// Set untoken column for accessible.
		ModelArticel::setAccessible( True );
		ModelStar::setAccessible( True );
		ModelView::setAccessible( True );
		
		// If articel is exists.
		if( $articel = ModelArticel::getByNode( "*", $node ) )
		{
			// Get articel stars.
			$articel->stars = self::getStars( $articel->unitoken );
			
			// Get articel views.
			$articel->views = self::getViews( $articel->unitoken );
			
			// Check if user has Authenticated.
			if( Auth::authenticated() )
			{
				$articel->stared = self::isTrue( $articel->stars );
				$articel->viewes = self::isTrue( $articel->views );
			}
			
			// Get articel insights
			$articel->insights = self::getInsights( $articel->unitoken );
			
			// Return Articel
			return( $articel );
		}
		return( False );
	}
	
	public static function getInsights( String $articel ): Array | False
	{
		// Check if post is exists.
		if( ModelArticel::getByUnitoken( "id", $articel ) )
		{
			// Create PDO Statement.
			$states = [
				
				// Data Current and Previous Stars.
				"star" => [
					ModelStar::self()->getConnection()->prepare( "SELECT timestamp FROM stars WHERE articel=:articel AND MONTH(timestamp)=MONTH(now()) AND YEAR(timestamp)=YEAR(now())" ),
					ModelStar::self()->getConnection()->prepare( "SELECT timestamp FROM stars WHERE articel=:articel AND MONTH(timestamp)=MONTH(CURRENT_DATE - INTERVAL 1 MONTH) AND YEAR(timestamp)=YEAR(CURRENT_DATE - INTERVAL 1 MONTH)" ),
				],
				
				// Data Current and Previous Views
				"view" => [
					ModelView::self()->getConnection()->prepare( "SELECT timestamp FROM views WHERE articel=:articel AND MONTH(timestamp)=MONTH(now()) AND YEAR(timestamp)=YEAR(now())" ),
					ModelView::self()->getConnection()->prepare( "SELECT timestamp FROM views WHERE articel=:articel AND MONTH(timestamp)=MONTH(CURRENT_DATE - INTERVAL 1 MONTH) AND YEAR(timestamp)=YEAR(CURRENT_DATE - INTERVAL 1 MONTH)" )
				]
			];
			
			// Mapping PDO Statements.
			foreach( $states As $key => $state )
			{
				foreach( $state As $idx => $stmt )
				{
					// Execute PDO Statement.
					$stmt->execute([
						":articel" => $articel
					]);
					
					// Data group by day.
					$data = [
						"Mon" => 0,
						"Tue" => 0,
						"Wed" => 0,
						"Thu" => 0,
						"Fri" => 0,
						"Sat" => 0,
						"Sun" => 0
					];
					
					// Fetch records.
					foreach( ModelStar::fetch( $stmt ) As $col )
					{
						$data[$col->datetime->format( "D" )] += 1;
					}
					
					// Get only values.
					$states[$key][$idx] = array_values( $data );
				}
			}
			return( $states );
		}
		return( False );
	}
	
	public static function getStars( String $articel ): Array | False
	{
		return( self::getProfile( ModelStar::getByArticel( "*", $articel ) ) );
	}
	
	public static function getViews( String $articel ): Array | False
	{
		return( self::getProfile( ModelView::getByArticel( "*", $articel ) ) );
	}
	
	public static function getProfile( Array | False $data ): Array | False
	{
		// If data is not False type.
		if( $data !== False )
		{
			// Mapping for get user profile info.
			foreach( $data As $value )
			{
				// Get user profile info.
				$value->profile = ModelUser::getByUnitoken( "verify, fullname, username, userpict, bio ", $value->unitoken );
			}
		}
		return( $data );
	}
	
	public static function isTrue( Array $data ): False | Object
	{
		// Mapping for get if user is true.
		foreach( $data As $value )
		{
			// If unitoken is equals.
			if( $value->unitoken === Auth::getUnitoken() )
			{
				return( $value );
			}
		}
		return( False );
	}
	
}

?>