<?php

namespace hxAri\GGarden;

use Throwable;

use hxAri\GGarden\Error;

/*
 * App
 *
 * @extends hxAri\GGarden\Singleton
 *
 * @package hxAri\GGarden
 */
final class App extends Singleton
{
	
	/*
	 * @inherit hxAri\GGarden\Singleton
	 *
	 */
	protected function __construct()
	{
		// Start output buffering.
		ob_start( "ob_gzhandler" );
		
		// Check if basepath is undefined.
		if( defined( "BASE_PATH" ) === False )
		{
			// Define base path application.
			define( "BASE_PATH", str_replace( "/", DIRECTORY_SEPARATOR, $_SERVER['DOCUMENT_ROOT'] !== "" ? $_SERVER['DOCUMENT_ROOT'] : substr( __DIR__, 0, - strlen( "/system/buffer" ) ) ) );
		}

		// Set user Error handler.
		set_error_handler( function( Int $code, String $message, String $file, Int $line ): Void
		{
			//Get Error Level.
			$level = match( $code )
			{
				E_ALL => "E_ALL",
				E_COMPILE_ERROR => "E_COMPILE_ERROR",
				E_COMPILE_WARNING => "E_COMPILE_WARNING",
				E_CORE_ERROR => "E_CORE_ERROR",
				E_CORE_WARNING => "E_CORE_WARNING",
				E_DEPRECATED => "E_DEPRECATED",
				E_ERROR => "E_ERROR",
				E_NOTICE => "E_NOTICE",
				E_PARSE => "E_PARSE",
				E_RECOVERABLE_ERROR => "",
				E_STRICT => "E_STRICT",
				E_USER_DEPRECATED => "E_USER_DEPRECATED",
				E_USER_ERROR => "E_USER_ERROR",
				E_USER_NOTICE => "E_USER_NOTICE",
				E_USER_WARNING => "E_USER_WARNING",
				E_WARNING => "E_WARNING"
			};
		
			// Throw error as error Thrown.
			throw new Error\TriggerError(
				$message,
				$level,
				$file,
				$line,
				$code
			);
		});
		
		// Set user exception handler.
		set_exception_handler( function( Throwable $thrown ): Void
		{
			// Copy exception thrown instance.
			$ggGaming = $thrown;
			
			// Check if exception thown has previous exceptions.
			if( $thrown->getPrevious() )
			{
				// Message stack.
				$message = [];
				
				do
				{
					$message[] = thrown( $thrown );
				}
				while( $thrown = $thrown->getPrevious() );
			}
			else {
				$message = thrown( $thrown );
			}
			
			// Set Response HTTP Status code.
			Response::http( 500 );
			
			// If request prefix path is /api
			if( Route::isApi() )
			{
				// Clean output buffering.
				ob_clean();
				
				// Set Response ContentType.
				Response::type( "json" );
				
				// Display output content as json encode.
				echo( path( rm: True, path: json_encode(
					flags: JSON_PRETTY_PRINT,
					value: [
						"code" => 500,
						"error" => True,
						"status" => Response::status( 500 ),
						"method" => Route::getCurrentMethod(),
						"message" => $message,
						"cookies" => $_COOKIE,
						"traces" => $ggGaming->getTrace()
					]
				)));
			}
			else {
				echo json_encode([
					"title" => $ggGaming::class,
					"error" => [
						"code" => 500,
						"status" => Response::status( 500 ),
						"method" => Route::getCurrentMethod(),
						"message" => $message
					]
				]);
			}
		});
	}
	
	/*
	 * Run application.
	 *
	 * @access Public
	 *
	 * @return Void
	 */
	public function run(): Void
	{
		// Register routes Web & API.
		require( path( "system/routes.php" ) );
		
		// Get current route.
		$this->renderRoute( Route::getCurrentRoute() );
	}

	/*
	 * Render route.
	 * 
	 * @access Protected
	 * 
	 * @params hxAri\GGarden\RoutePath $route
	 * 
	 * @return Void
	 */
	protected function renderRoute( RoutePath $route ): Void
	{
		// Get handler parameters by segmentation definen on the route path.
		$params = RegExp::match( $route->getRegExp(), Route::getCurrentPath() );
		
		// Mapping route segmentations.
		$passed = array_map( array: $route->getSegments(), callback: fn( String $segment ) => $params[$segment] ?? False );
		
		// If route is instanceof RoutePathError class.
		if( $route Instanceof RoutePathError )
		{
			// Set HTTP status code.
			Response::http( $route->getError() );
		}
		
		switch( True )
		{
			/*
			 * If the path prefix is /api.
			 *
			 * @prefix /api
			 */
			case Route::isApi():
				
				// Set Response ContentType.
				Response::type( "json" );
				
				// If route handler has return Array type.
				if( is_array( $return = call_user_func( $route->getHandler(), ...$passed ) ) )
				{
					// If element code is exists.
					if( isset( $return['code'] ) )
					{
						// Set Response HTTP Status code.
						Response::http( $return['code'] );
						
						// Change return error, status, and message.
						$return = [
							...$return,
							...[
								"error" => $return['error'] ?? $return['code'] >= 300,
								"message" => $return['message'] ?? $return['code'] >= 300 ? "Fail" : "Ok",
								"status" => $return['status'] ?? Response::status( $return['code'] )
							]
						];
					}
					
					// Extract array as variables.
					extract( $return );
					
					// Print json outputs.
					echo json_encode( flags: JSON_INVALID_UTF8_SUBSTITUTE | JSON_PRETTY_PRINT, value: [
						"code" => $code ?? 200,
						"data" => $data ?? Null,
						"error" => $error ?? False,
						"status" => $status ?? "Success",
						"message" => $message ?? "Ok"
					]);
				}
				break;
			
			/*
			 * If the path prefix is /dev.
			 *
			 * @prefix /dev
			 */
			case Route::isDev():
				
				// Check if current appliaction under development.
				if( ENVIRONMENT === DEVELOPMENT )
				{
					// If route handler has return Array type.
					if( is_array( $return = call_user_func( $route->getHandler(), ...$passed ) ) )
					{
						// If element code is exists.
						if( isset( $return['code'] ) )
						{
							// Set Response HTTP Status code.
							Response::http( $return['code'] );
							
							// Change return error, status, and message.
							$return = [
								...$return,
								...[
									"error" => $return['error'] ?? $return['code'] >= 300,
									"message" => $return['message'] ?? $return['code'] >= 300 ? "Fail" : "Ok",
									"status" => $return['status'] ?? Response::status( $return['code'] )
								]
							];
						}
						
						// Set Response ContentType.
						Response::type( "json" );
						
						// Create json outputs.
						echo json_encode( $return, JSON_INVALID_UTF8_SUBSTITUTE | JSON_PRETTY_PRINT );
					}
				}
				else {
					
					// Set Response HTTP Status code.
					Response::http( 503 );
					
					// Set Response ContentType.
					Response::type( "json" );
					
					// Print json outputs.
					echo json_encode( flags: JSON_PRETTY_PRINT, value: [
						"code" => 503,
						"error" => True,
						"status" => "Service Unavaible",
						"message" => "Something Wrong"
					]);
				}
				break;
			
			/*
			 * If the path prefix is free, neither /api nor /dev.
			 *
			 * @prefix /*
			 */
			case Route::isAny():
				
				// If route handler has return Array type.
				if( is_array( $return = call_user_func( $route->getHandler(), ...$passed ) ) )
				{
					// If return has http.
					if( isset( $return['http'] ) )
					{
						// If return http has code.
						if( isset( $return['http']['code'] ) )
						{
							// Set Response HTTP Status code.
							Response::http( $return['http']['code'] );
						}
					}
					
					// If return has view.
					if( isset( $return['view'] ) )
					{
						// If element title is not exists.
						if( isset( $return['view']['title'] ) === False )
						{
							$return['view']['title'] = "GGarden";
						}
						
						// If view has data shared.
						if( isset( $return['view']['shared'] ) )
						{
							// Unpack data shared.
							$return['view']['shared'] = [
								...shared(),
								...$return['view']['shared']
							];
						}
						else {
							
							// Get data shared.
							$return['view']['shared'] = shared();
						}
						
						// Convert data view to json strings.
						$data = str_replace( "\n", "\n\t\t\t", json_encode( $return['view'], JSON_INVALID_UTF8_SUBSTITUTE | JSON_PRETTY_PRINT ) );
						
						// Get view values.
						$return = $return['view'];
					}
					
					// Extract array as variables.
					extract( $return );
					
					// Import view file.
					require( path( "/system/public.php" ) );
				}
				break;
		}
	}
	
}

?>