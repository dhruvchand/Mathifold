<?php
//Saves state of editor into database.
header('X-XSS-Protection: 0');
header('Content-Type: text/html; charset=utf-8');
function unicode_escape_sequences($str) {
	$working = json_encode($str);
	$working = preg_replace('/\\\u([0-9a-z]{4})/', '&#x$1;', $working);
	return json_decode($working);
}

//State variables
$data = serialize(Array("equations" => stripslashes($_POST['Equations']), "references" => stripslashes(unicode_escape_sequences($_POST['References'])), "textreferences" => stripslashes(unicode_escape_sequences($_POST['TextReferences'])), "equationCount" => stripslashes($_POST['EquationCount']), "referencecount" => stripslashes($_POST['ReferenceCount']), "textreferencecount" => stripslashes($_POST['TextReferenceCount']), "html_code" => stripslashes($_POST['HTML']), "subequationcount" => stripslashes($_POST['subEquationCount'])));

$name = $_POST["Title"];
$key = $_POST["Key"];
//Check for user cookie and insert into database.

try {
	# MySQL with PDO_MYSQL
	$DBH = new PDO("mysql:host=localhost;dbname=Mathifold", "root", "panthera");
	// $DBH = new PDO("mysql:host=mysql4.000webhost.com;dbname=a9466681_math", "a9466681_math", "math1234");
	$DBH -> setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

	if ($_POST['Update'] == "0") {
		$STH = $DBH -> prepare("INSERT INTO Documents (Data, `Key`, DocName) values (?, ?, ?)");

		$STH -> bindParam(1, $data);
		$STH -> bindParam(2, $key);
		$STH -> bindParam(3, $name);

		$STH -> execute();
	} else {
		$STH = $DBH -> prepare("UPDATE Documents SET Data=? WHERE `Key`=? AND DocName = ?");

		$STH -> bindParam(1, $data);
		$STH -> bindParam(2, $key);
		$STH -> bindParam(3, $name);

		$STH -> execute();
	}

} catch(PDOException $e) {
	echo $e -> getMessage();
}

echo "Your document has been saved. Remember to note down its title and passkey for retrieving it later. <br/> Passkey: $key <br/> Title : $name";
?>