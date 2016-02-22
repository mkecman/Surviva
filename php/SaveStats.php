<?php
require_once "jQuery.php";

//jQuery::addData('hello', $_REQUEST['testParam']);

$myfile = fopen("../../AiStatsResults-". $_POST["megaTurn"] .".csv", "a") or die("Unable to open file!");

$txt = $_POST["minTurn"] . "," . $_POST["maxTurn"] . "," . $_POST["avgTurn"] . "," . $_POST["totalRounds"] . "\n";

fwrite($myfile, $txt);
fclose($myfile);

?>