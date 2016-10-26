<?php
/* CORS HEADERS - like CROSSDOMAIN.XML
header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Accept, Authorization, X-Requested-With, X-Request');
*/
header('Content-type: application/json; charset=utf-8');

require_once("session.php");
require_once "../_WindowsAzure/WindowsAzure.php";

use WindowsAzure\Common\ServicesBuilder;
use WindowsAzure\Common\ServiceException;

if( isset( $_POST['id'] ))
{
    $id = $_POST['id'];
    
    $set = '';
    $uid = 1;

    if(isset($_FILES['file'])){
        $extension = strtolower(pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION));

        $connectionString = "DefaultEndpointsProtocol=https;AccountName=mpprj;AccountKey=rM5gWZkSvhQVI9JW9IZUPZy0kA6FiECK/BD+XP4qSVEM7AsvRV4GRY0T8SMoMApS+eoczaWctX8GYXttCauBSQ==";
        $blobRestProxy = ServicesBuilder::getInstance()->createBlobService($connectionString);
        $content_image = file_get_contents($_FILES['file']['tmp_name']);
        $blob = substr(str_shuffle("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"), 0, 50) . "." . $extension;
        $image = "https://mpprj.blob.core.windows.net/images/" . $blob;

        try {
            $blobRestProxy->createBlockBlob("images", $blob, $content_image);
        } catch(ServiceException $e){
            $code = $e->getCode();
            $error_message = $e->getMessage();
            echo $code.": ".$error_message."<br />";
        }
    }

    if( isset( $_POST['name']) )        $set .= "name='{$_POST['name']}',";
    if( isset( $_POST['description']) ) $set .= "description='{$_POST['description']}',";
    if( isset( $_POST['origin']) )      $set .= "origin='{$_POST['origin']}',";
    if( isset( $_POST['active']) )      $set .= "active='{$_POST['active']}',";
    if( isset( $_FILES['file']) )       $set .= "img='{$image}',";

    $time = time();
    
    if( db("SELECT id FROM $mysql_db.barcode WHERE id='$id'") )
    {
        //db("UPDATE $mysql_db.barcode SET $set updated_by=$uid, updated=$time WHERE unlocked_by=$uid AND id='$id'");
        db("UPDATE $mysql_db.barcode SET $set updated_by=$uid, updated=$time WHERE id='$id'");
    }
    else
    {
        $id = db("INSERT INTO $mysql_db.barcode SET $set id=$id, created_by=$uid, created=$time, unlocked_by=$uid, unlocked=$time");
    }

    //echo mysql_error();
    echo '{"done":"'.$id.'"}';
}
else
{
    echo '{"empty":1}';
}
exit(0);
?>