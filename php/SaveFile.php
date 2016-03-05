<?php
require_once "jQuery.php";

$myfile = fopen("../../AiResults-". $_POST["megaTurn"] .".csv", "a") or die("Unable to open file!");

//$txt = $_POST["minTurn"] . "," . $_POST["maxTurn"] . "," . $_POST["avgTurn"] . "," . $_POST["totalRounds"] . "\n";

$txt = $_POST["turn"];
foreach ($_POST["nutrients"] as $nutrient ) 
{
	$txt .=  "," . $nutrient;
}
$txt .= "\n";

fwrite($myfile, $txt);
fclose($myfile);

$myfile2 = fopen("../../AiStatsResults-". $_POST["megaTurn"] .".csv", "a") or die("Unable to open file!");

$txt2 = $_POST["turn"] . "," . $_POST["minTurn"] . "," . $_POST["maxTurn"] . "," . $_POST["avgTurn"] . "," . $_POST["totalRounds"] . "\n";

fwrite($myfile2, $txt2);
fclose($myfile2);

jQuery::getResponse();

?>