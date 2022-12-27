<?php

namespace hxAri\GGarden;

/*
 * ...
 *
 * @return Array
 */
return([
	
	/*
	 * Only development mode e.g Testing.
	 *
	 * @method *
	 * @rctype application/json; charset=UTF-8
	 * @return Unexpected
	 */
	[
		"path" => "/dev",
		"method" => "*",
		"handler" => function()
		{
			// Todo code here!
			return([
				"data" => "*"
			]);
		}
	],
	
	/*
	 * Convertion binary to hexadecimal.
	 *
	 * @method GET
	 * @rctype application/json; charset=UTF-8
	 * @return Array
	 */
	[
		"path" => "/dev/convert/bin2hex",
		"method" => "GET",
		"handler" => function(): Array
		{
			// Get text.
			$text = $_GET['text'] ?? "";
			
			// Serialize text.
			$hexa = Serializer::serialize( $text );
			
			// Lengths.
			$length = [
				"text" => strlen( $text ),
				"symbol" => strlen( $text ) *2 /2 -1,
				"hexadec" => count( explode( "-", $hexa ) ) *2,
				"convert" => strlen( $hexa )
			];
			
			// Return result.
			return([
				"data" => [
					"text" => $text,
					"length" => $length,
					"bin2hex" => $hexa
				]
			]);
		}
	],
	
	/*
	 * Random generator Crypt and BASE64 Mime.
	 *
	 * @method GET
	 * @rctype application/json; charset=UTF-8
	 * @return Array
	 */
	[
		"path" => "/dev/randoms/:algo",
		"method" => "GET",
		"handler" => function( String $algo ): Array
		{
			// Data stack.
			$randoms = [];
	
			// Looping randoms.
			for( $i = 0; $i < 100; $i++ )
			{
				// If algoritme is BASE64 Mime Type.
				$random = match( $algo )
				{
					"base64" => Random::base64( $_GET['length'] ?? 186 ),
					"crypt" => Random::crypt(
						Random::bin2hex(  64 )
					),
					"path" => sprintf( "%s\n", Path::rand() )
				};
				
				// Push randoms.
				$randoms[] = [
					"length" => strlen( $random ),
					"values" => $random
				];
			}
			
			// Return randoms.
			return([
				"data" => $randoms
			]);
		}
	],
	
	/*
	 * Automatically insert articel.
	 *
	 * @method *
	 * @rctype application/json; charset=UTF-8
	 * @return Array
	 */
	[
		"path" => "/dev/post/auto",
		"method" => "*",
		"handler" => function(): Array
		{
			// Disabled.
			return([ "code" => 406 ]);
			
			// Read json file.
			$json = File::json( "ggarden.json" );
			
			// Mapping json.
			foreach( $json As $index => $post )
			{
				// Check if articel is exists.
				if( ModelArticel::select( "id", [ ":commonname" => Serializer::serialize( $post['name']['common'] ) ]) )
				{
					continue;
				}
				
				// Generate random unitoken.
				$unitoken = [
					"image" => Random::unitoken(),
					"post" => Random::unitoken()
				];
				
				// Get user unitoken.
				$user = ModelUser::getByUsername( "username, unitoken", $post['author'] );
				
				// Generate random path.
				$path = Path::rand();
				
				// Generate random node.
				$node = Random::node();
				
				// Rename path.
				Path::rename(
					from: sprintf( "/statics/bundles/images/%s", $post['images'] ),
					to: sprintf( "/statics/bundles/images/%s", $path )
				);
				
				// Create DateTime instance.
				$date = new DateTime;
				
				// Scanning directory.
				$scan = Path::ls( sprintf( "/statics/bundles/images/%s", $path ) );
				
				// Mapping files.
				foreach( $scan As $i => $file )
				{
					// Get file info.
					$info = pathinfo( path( sprintf( "/statics/bundles/images/%s/%s", $path, $file ) ) );
					
					// Generate filename.
					$name = sprintf( "%s.%s", Random::node(), $info['extension'] );
					
					// Rename filename.
					Path::rename(
						from: sprintf( "/statics/bundles/images/%s/%s", $path, $file ),
						to: sprintf( "/statics/bundles/images/%s/%d;%s", ...[
							$path, 
							$date->getTimestamp(), 
							$name,
						])
					);
					
					// Change file order value.
					$scan[$i] = $name;
				}
				
				// Serialize file.
				$images = implode( ";\x20", $scan );
				
				// Serialize model name.
				$model = Serializer::serialize( ModelArticel::class, SerializeSeparator::BYTES );
				
				// Serialize type.
				$post['type'] = Serializer::serialize( $post['type'] );
				
				// Serialize name.
				$post['name'] = [
					"common" => Serializer::serialize( $post['name']['common'] ),
					"latin" => Serializer::serialize( $post['name']['latin'] )
				];
				
				// Serialize utility.
				$post['utility'] = [
					"list" => Serializer::serialize( $post['utility']['list'] ),
					"text" => Serializer::serialize( $post['utility']['text'] )
				];
				
				// Serialize all.
				$post['original'] = Serializer::serialize( $post['original'] );
				$post['scientific'] = Serializer::serialize( $post['scientific'] );
				$post['description'] = Serializer::serialize( $post['description'] );
				
				// Insert images.
				ModelImage::insert([
					":path" => $path,
					":model" => $model,
					":images" => $images,
					":unitoken" => $unitoken['image'],
					":timestamp" => $format = $date->format( "Y-m-d H:i:s" )
				]);
				
				// Insert Articel.
				ModelArticel::insert([
					":node" => $node,
					":type" => $post['type'],
					":title" => $post['name']['common'],
					":author" => $user->unitoken,
					":images" => $unitoken['image'],
					":unitoken" => $unitoken['post'],
					":description" => $post['description'],
					":commonname" => $post['name']['common'],
					":latinname" => $post['name']['latin'],
					":original" => $post['original'],
					":scientific" => $post['scientific'],
					":utility_list" => $post['utility']['list'],
					":utility_text" => $post['utility']['text'],
					":timestamp" => $format
				]);
				
				echo json_encode( $post, JSON_INVALID_UTF8_SUBSTITUTE | JSON_PRETTY_PRINT );
			}
			
			return([
				"code" => 200,
				"data" => Auth::getUser()->username
			]);
		}
	],
	
	/*
	 * Automatically insert articel star and view.
	 *
	 * @method *
	 * @rctype application/json; chartset=UTF-8
	 * @return Array
	 */
	[
		"path" => "/dev/post/auto/value",
		"method" => "*",
		"handler" => function(): Array
		{
			// Get all users.
			$users = ModelUser::getAll( "unitoken", 100 );
			
			// Get all posts.
			$posts = ModelArticel::getAll( "unitoken", 100 );
			
			// Mapping users.
			array_map( array: $users, callback: function( $user ) use( $posts )
			{
				// Mapping posts.
				array_map( array: $posts, callback: function( $post ) use( $user )
				{
					// Check if the user has not liked the article.
					if( ModelStar::getByArticelAndUser( "*", $post->unitoken, $user->unitoken ) === False )
					{
						ModelStar::insert([
							":articel" => $post->unitoken,
							":unitoken" => $user->unitoken
						]);
					}
					
					// Check if the user has not viewed the article.
					if( ModelView::getByArticelAndUser( "*", $post->unitoken, $user->unitoken ) === False )
					{
						ModelView::insert([
							":articel" => $post->unitoken,
							":unitoken" => $user->unitoken
						]);
					}
				});
			});
			
			return([
				"code" => 200
			]);
		}
	],
	
	/*
	 * Automatically authenticated as user without login.
	 *
	 * @method *
	 * @rctype application/json; charset=UTF-8
	 * @return Unexpected
	 */
	[
		"path" => "/dev/user/:username/onauth",
		"method" => "*",
		"handler" => function( String $username ): Array
		{
			// Set unitoken column accessible.
			ModelUser::setAccessible( True );
			
			// Check if user record is exists.
			if( $user = ModelUser::getByUsername( "fullname, username, usermail, unitoken", $username ) )
			{
				// Get auth record.
				$user = ModelAuth::getByUnitoken( "csrftoken, sessionid, unitoken", $user->unitoken );
				
				// Cookie options.
				$options = [
					"expires" => strtotime( "+30 days" ),
					"httponly" => True,
					"secure" => True,
					"samesite" => "Strict",
					"path" => "/"
				];
				
				// Set cookies.
				setcookie( "csrftoken", $user->auths[0]->csrftoken, strtotime( "+30 days" ), "/" );
				setcookie( "sessionid", $user->auths[0]->sessionid, strtotime( "+30 days" ), "/" );
				
				return([
					"data" => [
						"fullname" => $user->fullname,
						"username" => $user->username,
						"usermail" => $user->usermail,
						"onauth" => [
							"csrftoken" => $user->auths[0]->csrftoken,
							"sessionid" => $user->auths[0]->sessionid,
						]
					]
				]);
			}
			return([
				"code" => 404
			]);
		}
	]
	
]);

?>