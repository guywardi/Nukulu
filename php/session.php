<?php
require_once("config.php");
require_once("database.php");

ini_set('session.gc_maxlifetime', 1380 );
ini_set('session.gc_probability', 10 );
ini_set('session.gc_divisor', 100) ; 
ini_set('session.use_trans_sid', 0 );
//ini_set('session.cookie_domain', '/' );
ini_set('session.use_only_cookies', 0 );
ini_set('session.use_cookies', 1 );

session_set_save_handler('my_session_open', 'my_session_close', 'my_session_read', 'my_session_write', 'my_session_destroy', 'my_session_garbage');

if( isset( $_COOKIE['PHPSESSID'] ))
{  
    session_id( $_COOKIE['PHPSESSID'] );
	session_start();
}
else if( session_id() == "" )
{
	session_start();
}

function my_session_open( $path, $name )
{
    return true;
}

function my_session_close()
{
    return true;
}

function my_session_read( $sid )
{
	global $mysql_db;
	$row = db("SELECT data FROM $mysql_db.session WHERE id='$sid'" );
	if( $row )
	{
		$time = time();	
		db("UPDATE $mysql_db.session SET updated=$time WHERE id='$sid'");
		return $row[0]['data'];
    }
	else
	{
        return '';
	}
}

function my_session_write( $sid, $data )
{
	global $mysql_db;
	if( isset( $data ) && $data )
	{
		$time = time();
		if( db("SELECT data FROM $mysql_db.session WHERE id='$sid'" ))
		{
			mysql_query("UPDATE $mysql_db.session SET data='$data', updated=$time WHERE id='$sid'");
		}
		else
		{
			$array = my_session_data_to_array( $data );
			// remember this error, user vs uid
			mysql_query("INSERT INTO $mysql_db.session SET data='$data', created=$time, id='$sid', user_id='{$array['uid']}'");
		}
	}
    return true;
}


function my_session_destroy( $sid )
{
	global $mysql_db;
    mysql_query("DELETE FROM $mysql_db.session WHERE id='$sid'");
    return true;
}


function my_session_garbage( $life )
{
	global $mysql_db;
    $time = time() - $life;
    $row = db("SELECT uid, id FROM $mysql_db.session WHERE updated < $time");
	if( $row )
	{
		$i = 0;
		$time = time();
		$count = count( $row );
		while( $i < $count )
		{
		    mysql_query("UPDATE $mysql_db.user SET last_logout=$time WHERE id='{$row[$i]['uid']}'");
		    mysql_query("DELETE FROM $mysql_db.session WHERE id='{$row[$i]['id']}'");
			$i++;
		}
		unset( $row );
	}
    return true;
}


function my_session_data_to_array( $serialized_string )
{
    $variables = array();
    $a = preg_split( "/(\w+)\|/", $serialized_string, -1, PREG_SPLIT_NO_EMPTY | PREG_SPLIT_DELIM_CAPTURE );

    for( $i = 0; $i<count($a); $i = $i+2 )
	{
        if(isset($a[$i+1]))
		{
            $variables[$a[$i]] = unserialize( $a[$i+1] );
        }
    }
    return( $variables );
}
?>