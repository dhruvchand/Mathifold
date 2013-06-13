<?php
//Saves state of editor into database.
header('X-XSS-Protection: 0');
header('Content-Type: text/html; charset=utf-8');
function unicode_escape_sequences($str){
	$working = json_encode($str);
	$working = preg_replace('/\\\u([0-9a-z]{4})/', '&#x$1;', $working);
	return json_decode($working);
}



//State variables
$equations = json_decode(stripslashes($_POST['Equations']));
$references = json_decode(stripslashes(unicode_escape_sequences($_POST['References'])));
$textreferences = json_decode(stripslashes(unicode_escape_sequences($_POST['TextReferences'])));
$folds = json_decode(stripslashes($_POST['Folds']));
$equationCount=  json_decode(stripslashes($_POST['EquationCount']));
$referencecount=  json_decode(stripslashes($_POST['ReferenceCount']));
$textreferencecount=  json_decode(stripslashes($_POST['TextReferenceCount']));
$html_code = stripslashes($_POST['HTML']);
$subequationcount = json_decode(stripslashes($_POST['subEquationCount']));

//Check for user cookie and insert into database.

?>