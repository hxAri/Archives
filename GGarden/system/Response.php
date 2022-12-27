<?php

namespace hxAri\GGarden;

/*
 * Response
 *
 * @package hxAri\GGarden
 */
abstract class Response
{
	
	protected static String $protocol = "HTTP";
	protected static String $protocolVersion = "1.1";
	
	protected static Array $status = [
		
		/*
		 * Informational response
		 *
		 * the request was received, continuing process.
		 */
		100 => [
			100 => "Continue",
			101 => "Switching Protocols",
			102 => "Processing",
			103 => "Early Hints"
		],
		
		/*
		 * Successfull
		 *
		 * the request was successfully received,
		 * understood, and accepted.
		 */
		200 => [
			200 => "OK",
			201 => "Created",
			202 => "Accepted",
			203 => "Non-Authoritative Information",
			204 => "No Content",
			205 => "Reset Content",
			206 => "Partial Content",
			207 => "Multi-Status",
			208 => "Already Reported",
			226 => "IM Used"
		],
		
		/*
		 * Redirection
		 *
		 * Further action needs to be taken in
		 * order to complete the request.
		 */
		300 => [
			300 => "Multiple Choices",
			301 => "Moved Permanently",
			302 => "Found",
			303 => "See Other",
			304 => "Not Modified",
			305 => "Use Proxy",
			306 => "Switch Proxy",
			307 => "Temporary Redirect",
			308 => "Permanent Redirect"
		],
		
		/*
		 * Client Error
		 *
		 * The request contains bad syntax or
		 * cannot be fulfilled.
		 */
		400 => [
			400 => "Bad Request",
			401 => "Unauthorized",
			402 => "Payment Required",
			403 => "Forbidden",
			404 => "Not Found",
			405 => "Method Not Allowed",
			406 => "Not Acceptable",
			407 => "Proxy Authentication Required",
			408 => "Request Timeout",
			409 => "Conflict",
			410 => "Gone",
			411 => "Length Required",
			412 => "Precondition Failed",
			413 => "Payload Too Large",
			414 => "URI Too Long",
			415 => "Unsupported Media Type",
			416 => "Range Not Satisfiable",
			417 => "Expectation Failed",
			418 => "Im A Teapot",
			421 => "Misdirected Request",
			422 => "Unprocessable Entity",
			423 => "Locked",
			424 => "Failed Dependency",
			425 => "Too Early",
			426 => "Upgrade Required",
			428 => "Precondition Required",
			429 => "Too Many Requests",
			431 => "Request Header Fields Too Large",
			451 => "Unavailable For Legal Reasons"
		],
		
		/*
		 * Server Error
		 *
		 * The server failed to fulfil an
		 * apparently valid request.
		 */
		500 => [
			500 => "Internal Server Error",
			501 => "Not Implemented",
			502 => "Bad Gateway",
			503 => "Service Unavailable",
			504 => "Gateway Timeout",
			505 => "HTTP Version Not Supported",
			506 => "Variant Also Negotiates",
			507 => "Insufficient Storage",
			508 => "Loop Detected",
			510 => "Not Extended",
			511 => "Network Authentication Required"
		]
	];
	
	public static function http( Int $code, ? String $status = Null ): Void
	{
		header( 
			sprintf( 
				
				// Header format.
				"%s/%s %d %s",
				
				// Protocol name.
				self::$protocol,
				
				// Protocol version.
				self::$protocolVersion,
				
				// Response code.
				$code,
				
				// Response status.
				$status ?? self::status( $code )
			)
		);
	}
	
	public static function status( Int $code ): String
	{
		return( match( True )
		{
			$code < 200 && $code >= 100 => self::$status[100][$code],
			$code < 300 && $code >= 200 => self::$status[200][$code],
			$code < 400 && $code >= 300 => self::$status[300][$code],
			$code < 500 && $code >= 400 => self::$status[400][$code],
			$code < 600 && $code >= 500 => self::$status[500][$code]
		});
	}
	
	public static function type( String $type ): Void
	{
		header(
			sprintf( 
				
				// Header format.
				"Content-Type: %s; charset=UTF-8",
				
				// Content Type.
				match( $type )
				{
					"css" => "text/css",
					"html" => "text/html",
					"js" => "text/javascript",
					"json" => "application/json",
					"text" => "text"
				}
			)
		);
	}
	
}

?>