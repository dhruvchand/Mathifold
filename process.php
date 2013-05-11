<?php
header('X-XSS-Protection: 0');
header('Content-Type: text/html; charset=utf-8');

 
 function unicode_escape_sequences($str){
	$working = json_encode($str);
	$working = preg_replace('/\\\u([0-9a-z]{4})/', '&#x$1;', $working);
	return json_decode($working);
}
 
$equations = json_decode(stripslashes($_POST['Equations']));
$references = json_decode(stripslashes(unicode_escape_sequences($_POST['References'])));
$folds = json_decode(stripslashes($_POST['Folds']));
$equationCount=  json_decode(stripslashes($_POST['EquationCount']));
$referencecount=  json_decode(stripslashes($_POST['ReferenceCount']));
$html_code = stripslashes($_POST['HTML']);

$temp=$equations;




echo "<br/>";

//REFERENCE PROCESSING
for($i=0;$i<$referencecount;$i++){	
	
	
}

echo "<html>
<head>
<title>Mathifold Document</title>
<link rel='stylesheet' href='http://code.jquery.com/ui/1.10.0/themes/base/jquery-ui.css' />
<script src='http://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js'></script>
<script src='http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.0/jquery-ui.min.js'></script>
<script type='text/javascript' src='http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=AM_HTMLorMML'></script>
<script src='http://cdnjs.cloudflare.com/ajax/libs/jquery-scrollTo/1.4.3/jquery.scrollTo.min.js'></script>

<style type='text/css'>



</style>
<script type='text/javascript'>
function htmlDecode(input){
  var e = document.createElement('div');
  e.innerHTML = input;
  return e.childNodes[0].nodeValue;
}
  function init()
  {
	  
	  
	  var newIframe = document.getElementById('reference-container');
	 
	  var content = '<!DOCTYPE html><html><head> </head>'
    + '<body>'+ document.getElementById('mathifold-container').innerHTML   +'</body></html>';

newIframe.contentWindow.document.open('text/html', 'replace');
newIframe.contentWindow.document.write(content);
newIframe.contentWindow.document.close();
	  
	  
	  //  $( document ).tooltip({
// open: function( event, ui ) {MathJax.Hub.Queue(['Typeset',MathJax.Hub]);MathJax.Hub.Queue(reference);}
//});
	
	  $( '#dialog').dialog();
	  
	MathJax.Hub.Queue(['Typeset',MathJax.Hub]);MathJax.Hub.Queue(reference);

	  reference();
	  start();
  }
  </script>";



echo '<script type="text/javascript">

var folds=new Array();
var equations=new Array();
var n;
var eqnNumber;
var stepNumber;
var ftree;

var tree;

function start()
{
 var index;
 var stepIndex; '; 

 echo 'folds='.json_encode($folds).';';
 
   for($pindex=0;$pindex<$equationCount;$pindex++)
  {
   echo 'index="'.$pindex.'";';
   echo 'equations[index]=new Array();';
   echo 'equations[index] = '.json_encode($temp[$pindex]).' ; ';
      
   }

echo '}
window.onload=init;

function charToNum()
{
 var index;
 tree[0]=-2;
 for(index=0;index<ftree.length;index++)
 {
  tree[index+1]=ftree[index].charCodeAt(0)-66;
 }
}

function splitButtonId(str)
{
 var str1=str.split("-");
 eqnNumber=str1[1];
 stepNumber=str1[2];
}

function combineEqnId(tempId)
{
 tempId+=2;
 var str2="equation-"+eqnNumber+"-"+tempId;
 return str2;
}

function updateButtons()
{
 var index;
 for(index=1;index<=n;index++)
  if(document.getElementById(combineEqnId(index-1)).style.display=="block")
   document.getElementById(combineEqnId(index)).getElementsByTagName("button")[0].disabled="true";
}
 
function findPosition(v)
{
 var index;
 for(index=1;index<=tree.length;index++)
  if(tree[index]==v)
   break;
 return index; 
}


function show(btnid)
{
 splitButtonId(btnid);

 ftree=folds[eqnNumber-1];
 tree=new Array(ftree.length+1);
 
 charToNum();
 
 n=equations[eqnNumber-1].length-1;
 //alert(n);

 var pos;
 var temp;
 var v;
 
 v=stepNumber-2;

 if(v==n)
  pos=1/2;
 else
  pos=findPosition(v);
  //alert(pos);
  //alert(combineEqnId(tree[2*pos]));
 if(document.getElementById(combineEqnId(tree[2*pos])).style.display=="block")
 {
  temp=2*(2*pos)+1;
  while(document.getElementById(combineEqnId(tree[temp])).style.display=="block")
  {
   temp=2*temp+1;
  }
  document.getElementById(combineEqnId(tree[temp])).style.display="block";
 }
 else
  document.getElementById(combineEqnId(tree[2*pos])).style.display="block";

 updateButtons();
}


</script>';



echo "</head><body><div id='mathifold-container'>

";

echo $html_code;

echo "
</div>
<div id='reference-box'>
<iframe id='reference-container'>

</iframe>
</div>
</body>";

//references
echo "<script type='text/javascript'>
function reference(){
	";
	
for($i=0;$i<$referencecount;$i++){	
echo "var symb".$i." = htmlDecode('".$references[$i][0]."');";
$p = " $('.mi:contains('+symb".$i."+')').attr('title','".$references[$i][1]."');";
echo $p;
}
echo "


$('.mi').click ( function() {
    if($(this).attr ( 'title' )!=='')
	{
		$( '#reference-container' ).dialog('open');
		alert($(this).attr ( 'title' ));
		$('#reference-container').scrollTo('#'+$(this).attr ( 'title' )); 
	}
});

}</script>
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