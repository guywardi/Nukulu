<?php
/* CORS HEADERS - like CROSSDOMAIN.XML
header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Accept, Authorization, X-Requested-With, X-Request');
*/
header('Content-type: application/json; charset=utf-8');

require_once('session.php');

if( isset( $_GET['id'] ))
{
    $id = $_GET['id'];

    $row = db("SELECT * FROM $mysql_db.barcode WHERE id=$id");
}    


if( isset( $row ) && $row )
{
    $row = array_map( 'array_filter', $row );
    //$row = $row[0];
    echo json_encode( $row, JSON_NUMERIC_CHECK );
    unset( $row );
}
else
{
    echo '{"empty":1}';
}
exit(0);
?>