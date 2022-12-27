<?php

namespace hxAri\GGarden;

/*
 * ...
 *
 * @return Array
 */
return([
	
	[
		"path" => "/api/test",
		"method" => "*",
		"handler" => fn() => [
			"data" => [
				"FILES" => $_FILES ?? [],
				"POST" => $_POST ?? [],
				"GET" => $_GET ?? []
			]
		]
	],
	
	[
		"path" => "/api/search",
		"method" => "GET",
		"handler" => fn() => [
			"error" => False,
			"data" => Search::search(
				Route::getQuery( "q" ) ?? "",
				Route::getQuery( "c" )
			),
			"status" => "Ok",
			"message" => "Success"
		]
	],
	
	/*
	 * API Explore page.
	 *
	 * @method GET
	 * @rctype application/json; charset=UTF-8
	 * @return Null
	 */
	[
		"path" => "/api/data/shared/explore",
		"method" => "GET",
		"handler" => fn() => [
			"error" => False,
			"data" => arrayQuake( ModelArticel::getAll( "*", 10 ) ),
			"status" => "Ok",
			"message" => "Success"
		]
	],
	
	/*
	 * API User sendmail contact.
	 *
	 * @method POST
	 * @rctype application/json; charset=UTF-8
	 * @return Array
	 */
	[
		"path" => "/api/user/sendmail/contact",
		"method" => "POST",
		"handler" => function()
		{
			// ...
		}
	],
	
	/*
	 * API User signin.
	 *
	 * @method POST
	 * @rctype application/json; charset=UTF-8
	 * @return Array
	 */
	[
		"path" => "/api/user/signin",
		"method" => "POST",
		"handler" => function(): Array
		{
			// Check if user is signed.
			if( Auth::authenticated() )
			{
				// Set HTTP status code.
				header( "HTTP/1.1 403 Forbiden." );
				
				return([
					"error" => True,
					"status" => "Fail",
					"message" => "Forbiden"
				]);
			}
			
			// Set column unitoken on table user to accessible.
			ModelUser::setAccessible( True );
			
			// If user is exists.
			if( $user = ModelUser::getByUsernameOrUsermail( "*", $_POST['username'] ) )
			{
				// Check if user password is valid.
				if( password_verify( $_POST['password'], $user->password ) )
				{
					// Unset column password.
					unset( $user->password );
					
					// Authenticate the logged in user.
					Auth::auth( $user );
					
					// Return user data.
					return([
						"error" => False,
						"data" => shared(),
						"status" => "Ok",
						"message" => "Success"
					]);
				}
				
				$message = "Invalid password";
			}
			
			return([
				"post" => $_POST,
				"error" => True,
				"status" => "Ok",
				"message" => $message ?? "User not found"
			]);
		}
	],
	
	/*
	 * API User signup.
	 *
	 * @method POST
	 * @rctype application/json; charset=UTF-8
	 * @return Array
	 */
	[
		"path" => "/api/user/signup",
		"method" => "POST",
		"handler" => function(): Array
		{
			// Check if user is signed.
			if( Auth::authenticated() )
			{
				// Set HTTP status code.
				header( "HTTP/1.1 403 Forbiden." );
				
				return([
					"error" => True,
					"status" => "Fail",
					"message" => "Forbiden"
				]);
			}
			
			// Set column unitoken on table user to accessible.
			ModelUser::setAccessible( True );
			
			// Default error message.
			$message = False;
			
			// Check if username is exists.
			if( ModelUser::getByUsername( "unitoken", $_POST['username'] ) )
			{
				return([
					"error" => True,
					"status" => "Fail",
					"message" => "Username is exists."
				]);
			}
			
			// Check if usermail is exists.
			if( ModelUser::getByUsermail( "unitoken", $_POST['usermail'] ) )
			{
				return([
					"error" => True,
					"status" => "Fail",
					"message" => "Usermail is exists."
				]);
			}
			
			// Insert user into database table.
			$insert = ModelUser::insert( $params = [
				
				":fullname" => $_POST['fullname'],
				":username" => $_POST['username'],
				":usermail" => $_POST['usermail'],
				":password" => $_POST['password'],
				
				/*
				 * Generate random unique tokens.
				 *
				 */
				":unitoken" => Random::unitoken()
			]);
			
			// Check if user has inserted.
			if( $insert )
			{
				// Authenticate the registered in user.
				Auth::auth( ModelUser::getByUnitoken( "id, node, account, fullname, username, usermail, userpict, unitoken, bio, timestamp", $params[':unitoken'] ) );
				
				// Return user data.
				return([
					"data" => shared()
				]);
			}
			
			return([
				"error" => True,
				"status" => "Fail",
				"message" => "Failed insert user."
			]);
		}
	],
	
	/*
	 * Api User suggest.
	 *
	 * @method GET
	 * @rctype application/json; charset=UTF-8
	 * @return Array
	 */
	[
		"path" => "/api/user/suggest",
		"method" => "GET",
		"handler" => function(): Array
		{
			// Check if user has authenticated.
			if( Auth::authenticated() )
			{
				// Create PDO Statement.
				$stmt = ModelUser::prepare( "SELECT %s FROM users ORDER BY rand() LIMIT 20", [
					"id",
					"node",
					"verify",
					"fullname",
					"username",
					"userpict",
					"unitoken"
				]);
				
				// Execute PDO Statement.
				$stmt->execute();
				
				return([
					"data" => ModelUser::fetch( $stmt )
				]);
			}
			return([
				"code" => 401
			]);
		}
	],
	
	/*
	 * API User info.
	 *
	 * @method GET
	 * @rctype application/json; charset=UTF-8
	 * @return Array
	 */
	[
		"path" => "/api/user/:username([a-zA-Z_\x80-\xff][a-zA-Z0-9_\.\x80-\xff]{0,}[a-zA-Z0-9_\x80-\xff]{1})",
		"method" => "GET",
		"handler" => function( $username )
		{
			// Check if user record is exists.
			if( $user = Profile::show( $username ) )
			{
				return([
					"data" => $user
				]);
			}
			return([
				"code" => 404
			]);
		}
	],
	
	/*
	 * API User edit profile.
	 *
	 * @method POST
	 * @rctype application/json; charset=UTF-8
	 * @return Array
	 */
	[
		"path" => "/api/user/:username([a-zA-Z_\x80-\xff][a-zA-Z0-9_\.\x80-\xff]{0,}[a-zA-Z0-9_\x80-\xff]{1})/edit",
		"method" => "POST",
		"handler" => function( $username )
		{
			// Check if user has authenticated.
			if( Auth::authenticated() )
			{
				$params = [
					"fullname",
					"username",
					"bio"
				];
				
				// Check if username is not equals.
				if( Auth::getUser()->username !== strtolower( $username ) )
				{
					return([
						"code" => 406,
						"message" => "Username Unequal"
					]);
				}
				
				// Mapping parameters.
				foreach( $params As $i => $param )
				{
					// Check if parameter is is exists.
					if( isset( $_POST[$param] ) )
					{
						$params[sprintf( ":%s", $param )] = $_POST[$param];
					}
					
					// Unset previous parameter.
					unset( $params[$i] );
				}
				
				// Check if params is empty.
				if( count( $params ) === 0 )
				{
					return([
						"code" => 400
					]);
				}
				ModelUser::update( $params, [
					":unitoken" => Auth::getUnitoken()
				]);
				return([
					"data" => $params
				]);
			}
			return([
				"code" => 401,
				"data" => False
			]);
		}
	],
	
	/*
	 * API User change profile picture and cover.
	 *
	 * @method POST
	 * @rctype application/json; charset=UTF-8
	 * @return Array
	 */
	[
		"path" => "/api/user/:username([a-zA-Z_\x80-\xff][a-zA-Z0-9_\.\x80-\xff]{0,}[a-zA-Z0-9_\x80-\xff]{1})/edit/picture",
		"method" => "POST",
		"handler" => function( $username )
		{
			return([
			]);
		}
	],
	
	/*
	 * Api plant post.
	 *
	 * @method POST
	 * @rctype application/json; charset=UTF-8
	 * @return Array
	 */
	[
		"path" => "/api/plant/post",
		"method" => "POST",
		"handler" => function(): Array
		{
			// Check if user has authenticated.
			if( Auth::authenticated() )
			{
				// 
				// Columns whose values must be serialized.
				$cols = [
					"common" => True,
					"latin" => Null,
					"type" => True,
					"description" => True,
					"original" => Null,
					"utility" => Null,
					"scientific" => function( ? String $sci )
					{
						// ...
						if( $sci !== Null )
						{
							// Stacks.
							$stc = [];
							
							// Split string scientific.
							$expl = explode( "\;\x20", $sci );
							
							// Mapping and validating.
							foreach( $expl As $key => $val )
							{
								// Check if value is not empty.
								if( valueIsNotEmpty( $val ) )
								{
									// Re explode values.
									$stc[$key] = explode( ",\x20", $val );
									
									// If value not more than one.
									if( count( $stc[$key] ) === 1 )
									{
										$stc[$key] = $stc[$key][0];
									}
								}
							}
							
							// Return scientific serialized.
							return( Serializer::serialize( $stc ) );
						}
						return( Null );
					}
				];
				
				// Create directori.
				Path::mkdir(
					sprintf( "/statics/bundles/images/%s", ...[
						
						// Generate random path.
						$path = Path::rand()
					])
				);
				
				// New Date Time.
				$date = new DateTime();
				
				// Generate random node.
				$node = Random::node();
				
				// Generate random unitoken.
				$uniq = [
					Random::unitoken(),
					Random::unitoken()
				];
				
				// Check if there are file uploaded.
				if( count( $_FILES ) > 0 )
				{
					// Mapping column required.
					foreach( $cols As $col => $val )
					{
						// If value is callable.
						if( is_callable( $val ) )
						{
							$cols[sprintf( ":%s", $col )] = call_user_func_array( $val, [ $_POST['scientific'] ?? Null ] );
						}
						else {
							
							// If column is type.
							if( $col === "type" )
							{
								$cols['type'] = $val;
							}
							else {
							$column = match( $col )
							{
								"latin" => "latinname",
								"common" => "commonname",
								"utility" => "utility_text",
								default => $col
							};
							
							// If column is exists.
							if( $_POST[$col] !== Null )
							{
								$cols[sprintf( ":%s", $column )] = explode( "\n", $_POST[$col] );
								$cols[sprintf( ":%s", $column )] = Serializer::serialize( $cols[sprintf( ":%s", $column )] );
							}
							else {
								$cols[sprintf( ":%s", $column )] = Null;
							}
							}
						}
						unset( $cols[$col] );
					}
					
					// Insert post.
					ModelArticel::insert([
						...$cols,
						...[
							":node" => $node,
							":author" => Auth::getUnitoken(),
							":images" => $uniq[0],
							":unitoken" => $uniq[1],
							":title" => $cols[':commonname']
						]
					]);
					
					// Mapping images.
					foreach( $_FILES As $i => $file )
					{
						// If the are image error.
						if( $file['error'] !== UPLOAD_ERR_OK )
						{
							return([
								"code" => 500
							]);
						}
						
						// Getting file extendsion.
						$ext = explode( ".", $file['name'] );
						$ext = strtolower( end( $ext ) );
						
						// Create file name.
						$name = sprintf( "%s.%s", Random::node(), $ext );
						
						// Move file.
						move_uploaded_file(
							$file['tmp_name'],
							path( sprintf( "/statics/bundles/images/%s/%d;%s", ...[
								$path,
								$date->getTimestamp(),
								$name
							]))
						);
						
						// Push new name.
						$images[] = $name;
					}
					
					// Join String to Array.
					$images = implode( ";\x20", $images );
					
					// Insert images.
					ModelImage::insert([
						":path" => $path,
						":model" => Serializer::serialize( ModelArticel::class, SerializeSeparator::BYTES ),
						":images" => $images,
						":unitoken" => $uniq[0],
						":timestamp" => $date->format( "Y-m-d H:i:s" )
					]);
					
					return([
						"data" => Articel::getInfo( $node )
					]);
				}
				return([
					"code" => 400
				]);
			}
			return([
				"code" => 401
			]);
		}
	],
	
	/*
	 * API plant sugestion.
	 *
	 * @method GET
	 * @rctype application/json; charset=UTF-8
	 * @return Array
	 */
	[
		"path" => "/api/plant/suggest",
		"method" => "GET",
		"handler" => function(): Array
		{
			// Check if user has authenticated.
			if( Auth::authenticated() )
			{
				// Get user unitoken.
				$user = Auth::getUnitoken();
				
				// Create PDO Statement.
				$stmt = ModelArticel::prepare( "SELECT %s FROM articel ORDER BY rand() LIMIT 20", "*" );
				
				// Execute PDO Statement.
				$stmt->execute();
				
				// Get posts.
				$posts = ModelArticel::fetch( $stmt );
				
				// Mapping posts.
				foreach( $posts As $index => $post )
				{
					// Get post stars and views.
					$post->stars = Articel::getStars( $post->unitoken );
					$post->views = Articel::getViews( $post->unitoken );
					
					// Get user if saved.
					$post->saved = ModelSave::getByArticelAndUser( "id, timestamp", $post->unitoken, $user );
					
					// If user has stared or viewed post.
					$post->stared = Articel::isTrue( $post->stars );
					$post->viewed = Articel::isTrue( $post->views );
					
					// Get post insights.
					$post->insights = Articel::getInsights( $post->unitoken );
				}
				return([
					"data" => $posts
				]);
			}
			return([
				"code" => 401
			]);
		}
	],
	
	/*
	 * API Plant info.
	 *
	 * @method GET
	 * @rctype application/json; charset=UTF-8
	 * @return Array
	 */
	[
		"path" => "/api/plant/:node([a-zA-Z0-9_\x80-\xff][a-zA-Z0-9_\-\.\x80-\xff]*)",
		"method" => "GET",
		"handler" => function( String $node )
		{
			// Check if is post record is exists.
			if( $post = Articel::getInfo( $node ) )
			{
				return([
					"data" => $post
				]);
			}
			return([
				"code" => 404
			]);
		}
	],
	
	/*
	 * API get plant insights.
	 *
	 * @method GET
	 * @rctype application/json; charset=UTF-8
	 * @return Array
	 */
	[
		"path" => "/api/plant/:node([a-zA-Z0-9_\x80-\xff][a-zA-Z0-9_\-\.\x80-\xff]*)/insight",
		"method" => "GET",
		"handler" => function( String $node )
		{
			// Check if user has authenticated.
			if( Auth::authenticated() )
			{
				// Check if post is exists.
				if( $post = ModelArticel::getByNode( "unitoken", $node ) )
				{
					return([
						"data" => Articel::getInsight( $post->unitoken )
					]);
				}
				return([
					"code" => 404
				]);
			}
			return([
				"code" => 401
			]);
		}
	],
	
	/*
	 * API insert star.
	 *
	 * @method POST
	 * @rctype application/json; charset=UTF-8
	 * @return Array
	 */
	[
		"path" => "/api/plant/:node([a-zA-Z0-9_\x80-\xff][a-zA-Z0-9_\-\.\x80-\xff]*)/onstar",
		"method" => "POST",
		"handler" => function( String $node )
		{
			// Check if user has authenticated.
			if( Auth::authenticated() )
			{
				// Check if post is exists.
				if( ModelArticel::getByNode( "id", $node ) )
				{
					// Delete saved post.
					ModelStar::insert([
						":articel" => $_POST['unitoken'],
						":unitoken" => Auth::getUnitoken()
					]);
					
					return([
						"code" => 200,
						"data" => Articel::getStars( $_POST['unitoken'] )
					]);
				}
				return([
					"code" => 404
				]);
			}
			return([
				"code" => 401
			]);
		}
	],
	
	/*
	 * API delete star.
	 *
	 * @method POST
	 * @rctype application/json; charset=UTF-8
	 * @return Array
	 */
	[
		"path" => "/api/plant/:node([a-zA-Z0-9_\x80-\xff][a-zA-Z0-9_\-\.\x80-\xff]*)/unstar",
		"method" => "POST",
		"handler" => function( String $node )
		{
			// Check if user has authenticated.
			if( Auth::authenticated() )
			{
				// Check if post is exists.
				if( ModelArticel::getByNode( "id", $node ) )
				{
					// Delete saved post.
					ModelStar::prepare( "DELETE FROM stars WHERE articel=:articel AND unitoken=:unitoken" )->execute([
						":articel" => $_POST['unitoken'],
						":unitoken" => Auth::getUnitoken()
					]);
					
					return([
						"code" => 200,
						"data" => Articel::getStars( $_POST['unitoken'] )
					]);
				}
				return([
					"code" => 404
				]);
			}
			return([
				"code" => 401
			]);
		}
	],
	
	/*
	 * API save bookmark.
	 *
	 * @method POST
	 * @rctype application/json; charset=UTF-8
	 * @return Array
	 */
	[
		"path" => "/api/plant/:node([a-zA-Z0-9_\x80-\xff][a-zA-Z0-9_\-\.\x80-\xff]*)/onsave",
		"method" => "POST",
		"handler" => function( String $node )
		{
			// Check if user has authenticated.
			if( Auth::authenticated() )
			{
				// Check if post is exists.
				if( ModelArticel::getByNode( "id", $node ) )
				{
					// Delete saved post.
					ModelSave::insert([
						":articel" => $_POST['unitoken'],
						":unitoken" => Auth::getUnitoken()
					]);
					
					return([
						"code" => 200,
						"data" => []
					]);
				}
				return([
					"code" => 404
				]);
			}
			return([
				"code" => 401
			]);
		}
	],
	
	/*
	 * API delete saved bookmark.
	 *
	 * @method POST
	 * @rctype application/json; charset=UTF-8
	 * @return Array
	 */
	[
		"path" => "/api/plant/:node([a-zA-Z0-9_\x80-\xff][a-zA-Z0-9_\-\.\x80-\xff]*)/unsave",
		"method" => "POST",
		"handler" => function( String $node )
		{
			// Check if user has authenticated.
			if( Auth::authenticated() )
			{
				// Check if post is exists.
				if( ModelArticel::getByNode( "id", $node ) )
				{
					// Delete saved post.
					ModelSave::prepare( "DELETE FROM saves WHERE articel=:articel AND unitoken=:unitoken" )->execute([
						":articel" => $_POST['unitoken'],
						":unitoken" => Auth::getUnitoken()
					]);
					
					return([
						"code" => 200,
						"data" => []
					]);
				}
				return([
					"code" => 404
				]);
			}
			return([
				"code" => 401
			]);
		}
	],
	
]);

?>