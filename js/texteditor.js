function showColor()
{
 if(document.getElementById('font_color').style.display=='block')
  document.getElementById('font_color').style.display='none'; 
 else
  document.getElementById('font_color').style.display='block';
}
function Bold()
{
 document.execCommand('bold',false,null);
 document.getElementById('editor').focus();
}
function Italic()
{
 document.execCommand('italic',false,null);
 document.getElementById('editor').focus();
}
function Underline()
{
 document.execCommand('underline',false,null);
 document.getElementById('editor').focus();
}
function Center()
{
 document.execCommand('justifyCenter',false,null);
 document.getElementById('editor').focus();
}
function Justify()
{
 document.execCommand('justifyFull',false,null);
 document.getElementById('editor').focus();
}
function Left()
{
 document.execCommand('justifyLeft',false,null);
 document.getElementById('editor').focus();
}
function Right()
{
 document.execCommand('justifyRight',false,null);
 document.getElementById('editor').focus();
}
function Size(size)
{
 size/=10;
 document.execCommand('fontSize',false,size);
 document.getElementById('editor').focus();
}
function Color(color)
{
 document.execCommand('foreColor',false,color);
 document.getElementById('font_color').style.borderColor=color;
 document.getElementById('editor').focus();
}
function Link()
{
 var url=prompt("Enter the URL : ","http://");
 document.execCommand('CreateLink',false,url);
 document.getElementById('editor').focus();
}
function UnLink()
{
 document.execCommand('UnLink',false,null);
 document.getElementById('editor').focus();
}
function Sub()
{
 document.execCommand('subscript',false,null);
 document.getElementById('editor').focus();
}
function Sup()
{
 document.execCommand('superscript',false,null);
 document.getElementById('editor').focus();
}