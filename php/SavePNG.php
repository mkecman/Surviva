<?php
require_once "jQuery.php";

$myfile = fopen("../../resultImages/megaTurn-". $_POST["megaTurn"]. "-". $_POST["rounds"] .".png", "w") or die("Unable to open file!");

$data = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $_POST[ "image" ]));

fwrite( $myfile, $data );
fclose( $myfile );

jQuery::getResponse();

?>