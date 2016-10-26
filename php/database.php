<?php

function db($query)
{
	$action = strtolower(substr( $query, 0, 6 ));
	if( $action == 'insert' || $action == 'create' || $action == 'alter ' )
	{
		mysql_query( $query );
		unset( $action );
		return mysql_insert_id();
	}
	elseif($action == 'delete' || $action == 'update')
	{
		unset($action);		
		return mysql_query($query);
	}
	else
	{
		$result = mysql_query( $query );
		unset( $action );	
		if( !$result ) return FALSE;
		$num = mysql_num_rows( $result );
		if( $num == 1 )
		{
			$array[0] = mysql_fetch_assoc( $result );
			mysql_free_result( $result );
			return $array;
		}
		elseif( $num > 1)
		{
			$i = 0;
			$array = array();
			while($row = mysql_fetch_assoc( $result ))
			{
				$array[$i] = $row;
				$i++;
			}
			unset($row);		
			mysql_free_result($result);
			return $array;
		}
		else
		{
			mysql_free_result($result);
			return NULL;
		}
	}
}
?>