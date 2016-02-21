<?php
require_once "jQuery.php";

//jQuery::addData('hello', $_REQUEST['testParam']);

$myfile = fopen("AiResults.csv", "a") or die("Unable to open file!");

$txt = $_POST["turn"];
foreach ($_POST["nutrients"] as $nutrient ) 
{
	$txt .=  "," . $nutrient;
}
$txt .= "\n";

fwrite($myfile, $txt);
fclose($myfile);

?>