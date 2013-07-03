<?php
if($_POST["Key"]!=null){
	try {  
  # MySQL with PDO_MYSQL  
  $key = $_POST["Key"];
  $name = $_POST["Title"];

  //$DBH = new PDO("mysql:host=mysql4.000webhost.com;dbname=a9466681_math", "a9466681_math", "math1234");  
   $DBH = new PDO("mysql:host=localhost;dbname=Mathifold", "root", "panthera");  
    $DBH->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );  
	
	$STH = $DBH->prepare("SELECT * FROM Documents WHERE `Key` = :k AND DocName = :n"); 
	$STH->execute(array("k"=>$key,"n" => $name));  
	$result = $STH->fetch(PDO::FETCH_OBJ);
	$data = unserialize($result->Data);
	
	
$equations = $data["equations"];
$references = $data["references"] ;
$textreferences = $data["textreferences"] ;
$equationCount=  $data["equationCount"];
$referencecount= $data["referencecount"];
$textreferencecount=  $data["textreferencecount"]; 
$html_code = $data["html_code"];

	
}  
catch(PDOException $e) {  
    echo $e->getMessage();  
} 
}
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Mathifold Home</title>
<link rel="stylesheet" href="css/style.css" />
<link rel="stylesheet" href="css/960.css" />
<link rel="stylesheet" href="css/texteditor.css" />
<link href='http://fonts.googleapis.com/css?family=Raleway:200' rel='stylesheet' type='text/css'>


<?php 
echo '<script type="text/javascript">
 var storename ;
      var storekey ;
</script>'; 

if($_POST["Key"]!=null){
echo "
<script type='text/javascript'>
	//Environment Variables
	var Equations = JSON.parse('$equations');
      var References = JSON.parse('$references');
      	var TextReferences = JSON.parse('$textreferences');
       var globalEquationCount =  $equationCount ;
        var referenceCount =  $referencecount;
		var TextreferenceCount =  $textreferencecount;
	
       storename = '$name';
       storekey = '$key';
	
</script>
";
}

else {
	echo '<script src="js/data.js"></script>'; 
}
?>
<script src="js/texteditor.js"></script>
<script src="js/jscolor/jscolor.js"></script>
<script src="js/jquery-1.8.3.min.js"></script>
<script src="js/main.js"></script>
<script src="js/jquery.selection.js"></script>
  <script src="js/jquery.at.caret.min.js"></script>
<script type="text/javascript" src="./mathjax/MathJax.js?config=TeX-MML-AM_HTMLorMML "></script> 

<!--<script type="text/javascript" src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-MML-AM_HTMLorMML "></script>-->
</head>

<body onload="body_load()">
<div class="container_12" id="main-container">
  <div class="grid_12" id="title"> Mathifold <br/> <div id="loading"> loading</div></div>
  <div class="grid_12" id="space"> </div>
  <div id="wrapper">
    <div class="grid_3" id="sidebar">
      <div id="main-menu">
        <div id="standard"> <button onclick="loadEditor();">+equation</button> 
        	<button onclick="newReference()">+reference</button> 
        	<button onclick="rerender()">+rerender</button> 
        	<button onclick="newTextReference()">+teference</button>
        	 <button onclick="Export();">-export</button>
        	  <button onclick="Open();">-open</button>
        	  <button onclick="Save();">-save</button>
        	
        </div>
        <div id="reference-tools"> <span onclick="addReference()"> -Done </span> </div>
      </div>
      <div id="symbol-palette">
        <table width="98%" border="0" cellpadding="0" id="symbols">
          <tr>
            <td onclick="appendFromPaletteToEditor(this)" data-value="x" >`x`</td>
            <td onclick="appendFromPalette(this)" data-value="y">`y`</td>
            <td onclick="appendFromPalette(this)" data-value="z">`z`</td>
            <td onclick="appendFromPalette(this)" data-value="alpha">`alpha`</td>
          </tr>
        </table>
      </div>
    </div>
    <br />
    <div class="grid_9" id="editor-container">
      <div id="toolbar">
        <button id="toolbar_button" onclick="Bold();" title="Bold"><b>B</b></button>
        <button id="toolbar_button" onclick="Italic();" title="Italic"><em>I</em></button>
        <button id="toolbar_button" onclick="Underline();" title="Underline"><ins>U</ins></button>
        <button id="toolbar_button" onclick="Center();" title="Align Center"><img src="images/Align_center_button.gif" /></button>
        <button id="toolbar_button" onclick="Justify();" title="Justify"><img src="images/Align_force_button.png" /></button>
        <button id="toolbar_button" onclick="Left();" title="Align Left"><img src="images/Align_left_button.gif" /></button>
        <button id="toolbar_button" onclick="Right();" title="Align Right"><img src="images/Align_right_button.gif" /></button>
        <button id="toolbar_button" onclick="Link();" title="Add Hyperlink"><ins style="color:blue">Add Link</ins></button>
        <button id="toolbar_button" onclick="UnLink();" title="Remove Hyperlink">UnLink</button>
        <button id="toolbar_button" onclick="Sub();" title="Subscript"><img src="images/subscript.png" /></button>
        <button id="toolbar_button" onclick="Sup();" title="Superscript"><img src="images/superscript.png" /></button>
        <script>
  document.write('<select id="toolbar_button" title="FontSize" ');
  if(window.chrome)
   document.write('onclick="this.options[this.selectedIndex].onclick()" ');// onclick event for chrome 
  document.write('><option selected="selected">FontSize</option>');
  
   var i=10;
   for(i=10;i<=70;i+=10)
    document.write('<option onclick="Size('+i+');">'+i+'</option>');
  
  document.write('</select>');
 </script>
        <button id="toolbar_button" onclick="showColor();" title="FontColor">FontColor >></button>
        <div id="font_color" onclick="showColor();"> <img src="images/color.png" border="0" usemap="#Map" />
          <map name="Map" id="Map">
            <area shape="circle" coords="28,25,19" onmousedown="Color('yellow');" title="Yellow" />
            <area shape="circle" coords="74,23,20" onmousedown="Color('red');" title="Red" />
            <area shape="circle" coords="120,25,20" onmousedown="Color('black');" title="Black" />
            <area shape="circle" coords="28,78,19" onmousedown="Color('green');" title="Green" />
            <area shape="circle" coords="73,79,20" onmousedown="Color('blue');" title="Blue" />
            <area shape="circle" coords="120,79,20" onmousedown="Color('brown');" title="Brown" />
          </map>
        </div>
      </div>
      <!--end of div#toolbar-->
      <div name="editor" id="editor" contenteditable="true" onmouseout="getSelectionHtml()" > 
      	<?php
      	if($html_code!=null){
      	echo $html_code;
		}
		      	?>
		      	
		
      	</div>
      	<div id='statusbox'>	</div>
      <!--end of div#editor--> 
    </div>
    <!--end of div#editor-container--> 
    
  </div>
  <!--end of div#wrapper--> 
</div>
<!--end of div#main-container--> 

<!--Equation Editor -->

<div id="overlay"></div>
<div  id="equation-container">
  <div  class="palette">palette
    <div id = "palette-symbols">
      <table width="98%" border="0" cellpadding="0" id="symbols">
        <tr>
          <td onclick="appendFromPalette(this)" data-value="x" >`x`</td>
          <td onclick="appendFromPalette(this)" data-value="y">`y`</td>
          <td onclick="appendFromPalette(this)" data-value="z">`z`</td>
          <td onclick="appendFromPalette(this)" data-value="alpha">`alpha`</td>
        </tr>
        
          <td onclick="appendFromPalette(this)" data-value="=">`=`</td>
          <td onclick="appendFromPalette(this)" data-value="<">`<`</td>
          <td onclick="appendFromPalette(this)" data-value=">">`>`;</td>
          <td onclick="appendFromPalette(this)" data-value="~~">`~~`</td>
        </tr>
        <tr>
          <td onclick="appendFromPalette(this)" data-value="beta">`beta`</td>
          <td onclick="appendFromPalette(this)" data-value="gamma">`gamma`</td>
          <td onclick="appendFromPalette(this)" data-value="rho">`rho`</td>
          <td onclick="appendFromPalette(this)" data-value="psi">`psi`</td>
        </tr>
        <tr>
          <td onclick="fraction()">`x/y`</td>
          <td onclick="summation()">`sum _(x=1) ^(oo)`</td>
          <td onclick="integration()">`int _a ^b dx`;</td>
          <td onclick="appendFromPalette(this)" data-value="psi">`psi`</td>
        </tr>
        <tr>
      </table>
    </div>
    <span onclick="addStep();" style="cursor:pointer;">+step</span> </div>
  <div   id="equation-preview"> </div>
  <div id="lhs">
    <p> Enter the LHS</p>
    <input type="text"  onkeypress="updatelhs()" id="inputbox-lhs" value=""  />
  </div>
  <div id="non-lhs">
    <input type="text"  onkeypress="update()" id="inputbox" value=""  />
    <button id="submitinput" value="Done" onclick="appendEquation()">Done</button>
    <button id="fold" value="Fold" onclick="foldEquation()">Fold</button>
  </div>
</div>
</div>
<div  id="folding-container">
  <h1> Folding</h1>
  <div id="folding-equation-container"></div>
  <!--<button id="submitinput" value="Done" onclick="storeFolds()">Done</button>--> 
</div><!--
<textarea id="preview">

</textarea>
-->
</body>
</html>