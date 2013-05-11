// JavaScript Document
function body_load()
{
	setTimeout("$('#title').animate({fontSize:'32px',marginTop:'0px',opacity:1},1000); $('#wrapper').fadeIn(700);",1000); 
	
}

function update()
{
	document.getElementById('equation-preview').innerHTML="`"+  document.getElementById('inputbox').value +"`";
	MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
}

function appendFromPalette(arg)
{
	document.getElementById('inputbox').value =  document.getElementById('inputbox').value +  arg.getAttribute("data-value") + " ";
	update();
}

function appendEquation()
{
	document.getElementById('editor').innerHTML = document.getElementById('editor').innerHTML + " " + document.getElementById('equation-preview').innerHTML + "<br/>";
	$('#equation-container').fadeOut(1000);$('#overlay').fadeOut(1300);
	document.getElementById('equation-preview').innerHTML="";
	 document.getElementById('inputbox').value="";
	
}