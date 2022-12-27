<?php

/*
 * GGarden Index
 *
 * @author Ari Setiawan
 * @author Alvin Ariv Pirmansyah
 * @author Wahyu Fahreza
 * @author Indri Rani Saputri
 * @author Rizki Solehah
 *
 * @helper Falsa Fadilah Nugraha
 *
 * @create 08.11-2022
 * @update - 
 * @finish - 
 */
use hxAri\GGarden;
use hxAri\GGarden\Error;

/*
 * Application Start.
 *
 */
define( "APP_START", microtime( True ) );

/*
 * Application environment modes.
 *
 */
define( "DEVELOPMENT", 160824 );
define( "PRODUCTION", 201204 );

/*
 * Application environment.
 *
 * @default DEVELOPMENT
 * @values DEVELOPMENT|PRODUCTION
 */
define( "ENVIRONMENT", DEVELOPMENT );

/*
 * Register Auto Load.
 *
 * Automatic loading of files required for a project or application.
 * This includes the files required for the application without
 * explicitly including them with the include or require functions.
 */
require( "vendor/autoload.php" );

/*
 * Run application.
 *
 * Enjoy your live.
 */
GGarden\App::self()->run();

?>