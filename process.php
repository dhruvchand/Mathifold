<?php
$title = $_POST["Title"];
header('X-XSS-Protection: 0');
//header('Content-Disposition: attachment; filename="'.$title.".html".'"');
header('Content-Type: text/html; charset=utf-8');

 
 function unicode_escape_sequences($str){
	$working = json_encode($str);
	$working = preg_replace('/\\\u([0-9a-z]{4})/', '&#x$1;', $working);
	return json_decode($working);
}
 
$equations = json_decode(stripslashes($_POST['Equations']));
$references = json_decode(stripslashes(unicode_escape_sequences($_POST['References'])));
$textreferences = json_decode(stripslashes(unicode_escape_sequences($_POST['TextReferences'])));
$equationCount=  json_decode(stripslashes($_POST['EquationCount']));
$referencecount=  json_decode(stripslashes($_POST['ReferenceCount']));
$textreferencecount=  json_decode(stripslashes($_POST['TextReferenceCount']));
$html_code = stripslashes($_POST['HTML']);


//Equation References are enclosed in divs
//$html_code = preg_replace('/[^\"]((equation)|(eqn))[\s-](\d+)/i',"<span class='equation-reference' data-pointsTo='$4'>$0</span>", $html_code);


//Debug
/*
echo implode("-",$equations);
echo  $references[0][0];
echo implode("-",$textreferences ) ;
echo implode("-",$folds) ;
echo $equationCount;
echo $referencecount;
echo $textreferencecount;


*/
//text reference processing [global]
for($k=0;$k<$textreferencecount;$k++)
{
	//echo "reference is".$textreferences[$k][0];
	$html_code = preg_replace('/'.$textreferences[$k][0].'/', '<span class="text-reference">'.$textreferences[$k][0]."</span>",$html_code);
}
?>

<html>
<head>


<title><?php echo $title;?></title>

<link rel='stylesheet' href='js/jquery-ui/themes/base/jquery-ui.css' />
<script src='js/jquery-1.8.3.min.js'></script>
<script src='js/jquery-ui/ui/jquery-ui.js'></script>
<script type='text/javascript' src='mathjax/MathJax.js?config=AM_HTMLorMML'></script>
<script src='js/jquery.scrollTo.min.js'></script>
<!--
<link rel='stylesheet' href='http://code.jquery.com/ui/1.10.0/themes/base/jquery-ui.css' />
<script src='http://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js'></script>
<script src='http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.0/jquery-ui.min.js'></script>
<script type='text/javascript' src='http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=AM_HTMLorMML'></script>
<script src='http://cdnjs.cloudflare.com/ajax/libs/jquery-scrollTo/1.4.3/jquery.scrollTo.min.js'></script>
-->

<style type='text/css'>
.reference:hover
{
background-color:red;
}

.lhs
{
	display:inline-block;
}
.rhs
{
	display:inline-block;
	vertical-align:top;
}
.equation-reference
{
	color:#0000AA;
}

</style>

<script type='text/javascript'>
function htmlDecode(input){
  var e = document.createElement('div');
  e.innerHTML = input;
  return e.childNodes[0].nodeValue;
}

function init()
{	  	

$('.equation-button').remove();
$('.delete-button').remove();
	  var newIframe = document.getElementById('reference-container');	 
	  var content = "<!DOCTYPE html><html><head> </head>"  ;
	   var content = content  + '<body>' ;
		 var content = content  + document.getElementById('mathifold-container').innerHTML   + '</body></html>';

newIframe.contentWindow.document.open('text/html', 'replace');
newIframe.contentWindow.document.write(content);
newIframe.contentWindow.document.close();
    
	 var script   = document.createElement("script");
script.type  = "text/javascript";
script.src   = "http://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js";    
newIframe.contentWindow.document.body.appendChild(script);

    var script   = document.createElement("script");
script.type  = "text/javascript";
script.src   = "http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=AM_HTMLorMML";    
newIframe.contentWindow.document.body.appendChild(script);


	  
    var script   = document.createElement("script");
script.type  = "text/javascript";
script.text  = "MathJax.Hub.Queue(['Typeset',MathJax.Hub]);$('.up,.down').show();$('.buttonup,.buttondown').hide(); "               
newIframe.contentWindow.document.body.appendChild(script);
	  
    
	  //  $( document ).tooltip({
// open: function( event, ui ) {MathJax.Hub.Queue(['Typeset',MathJax.Hub]);MathJax.Hub.Queue(reference);}
//});
	
	  $( '#dialog').dialog();
	  
	MathJax.Hub.Queue(['Typeset',MathJax.Hub]);MathJax.Hub.Queue(reference);

	  reference();
	  
	  
	 
	
}

function initFolding()
{
     init();

 $('.buttonup,.buttondown').show();
  $('.up,.down').hide();
 $('.buttonup').click(function(e)
	   {
		  $(this).parent().children('.up').show();
	   });
	   $('.buttondown').click(function(e)
	   {
		  $(this).parent().children('.down').show();
	   });
	   
	  
}
</script>





</head><body onload='initFolding()'><div id='mathifold-container'>
<?php
echo $html_code;
?>

</div>
<div id='reference-box'>
<iframe id='reference-container'>

</iframe>
</div>
</body>
<?php
//references
echo "<script type='text/javascript'>
function reference(){
	";
	
for($i=0;$i<$referencecount;$i++){	
//echo "var symb".$i." = htmlDecode('".$references[$i][0]."');";
$p = " $(htmlDecode('".$references[$i][2]."')).attr('title','".$references[$i][1]."');";
echo $p;
}
 
$equations = json_decode(stripslashes($_POST['Equations']));
$references = json_decode(stripslashes(unicode_escape_sequences($_POST['References'])));
$textreferences = json_decode(stripslashes(unicode_escape_sequences($_POST['TextReferences'])));
$equationCount=  json_decode(stripslashes($_POST['EquationCount']));
$referencecount=  json_decode(stripslashes($_POST['ReferenceCount']));
$textreferencecount=  json_decode(stripslashes($_POST['TextReferenceCount']));
$html_code = stripslashes($_POST['HTML']);


for($i=0;$i<$textreferencecount;$i++){	
echo "var tsymb".$i." = htmlDecode('".$textreferences[$i][0]."');";
$p = " $('.text-reference:contains('+tsymb".$i."+')').attr('title','".$textreferences[$i][1]."');";
echo $p;
    
}
echo "


$('.mi, .mo, .msub, .msubsup, .mover, .msup').click ( function(event) {
      //Test this

    if($(this).attr ( 'title' )!==undefined)
	{
        event.stopPropagation();
		$( '#reference-container' ).dialog('open');
		//alert($(this).attr ( 'title' ));
		$('#reference-container').scrollTo('#'+$(this).attr ( 'title' )); 
	}
	
});

$('.text-reference').click ( function() {
    if($(this).attr ( 'title' )!=='')
	{
		$( '#reference-container' ).dialog('open');
		//alert($(this).attr ( 'title' ));
		$('#reference-container').scrollTo('#'+$(this).attr ( 'title' )); 
	}
	
	
	
});


$('.equation-reference').click ( function() {
  
		$( '#reference-container' ).dialog('open');
	//	alert('#'+'equation-'+$(this).data( 'pointsto'));
		$('#reference-container').scrollTo('#'+'equation-'+$(this).data( 'pointsto')); 
	 // alert('#'+'equation-'+$(this).data('pointsto'));
	
	
	
});

}
</script>
 <script>
$(function() {
$( '#reference-container' ).dialog({
autoOpen:false	
});
});


</script>

";

echo "</html>";


?>

