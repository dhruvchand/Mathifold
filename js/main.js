 var sel, range, seltext, node;
 var referenceSelection;
var querystring 
 var referenceTempArray;

 function body_load() {
     setTimeout("$('#title').animate({fontSize:'32px',marginTop:'0px',opacity:1},1000); $('#wrapper').fadeIn(700);", 1000);
     $("#editor").keydown(function (e) {
         

         if (e.which == 192&&$('#editor').html().match(new RegExp("`", "gi"))!=null) {
             
             if ($('#editor').html().match(new RegExp("`", "gi")).length%2!=0) {
               
                 setTimeout("rerender()", 2000);
             }
            
         }
     });
 }

 function loadEditor(eqn) {

     if (eqn == null) {
	     document.getElementById('inputbox-lhs').value = "";
         document.getElementById('inputbox').value = "";
         globalEquationCount++;
         subEquationCount = 0;
         Equations[globalEquationCount - 1] = new Array();
         $('#equation-container').fadeIn(1000);
         $('#overlay').fadeIn(1300);
        // var div = document.createElement("div");
        // div.id = 'equation-' + globalEquationCount + "-lhs";
        // div.className = 'lhs';
        // document.getElementById("equation-preview").appendChild(div);
         var div = document.createElement("div");
     div.id = 'equation-' + globalEquationCount + "-" + subEquationCount;
     div.className = "equation-step";
     document.getElementById("equation-preview").appendChild(div);
	     alert('equation-' + globalEquationCount + "-" + subEquationCount);
         //	var div = document.createElement("div");
         //div.id = 'mod-'+globalEquationCount+"-"+subEquationCount;
         //div.innerHTML="<img class='up-down'  src='img/up.png'  onclick='stepUp("+subEquationCount+");'></img> <img class='up-down'  src='img/down.png'  onclick='stepDown("+subEquationCount+");'></img>";
         
     }
 }

 function addStep() {
     if (subEquationCount == 0) {
         $('#lhs').hide();
         $("#non-lhs").show();
          Equations[globalEquationCount - 1][subEquationCount] = document.getElementById('inputbox-lhs').value;
     }
     else
     {
     //Store in Eqn DB
     Equations[globalEquationCount - 1][subEquationCount] = document.getElementById('inputbox').value;
         alert(Equations[globalEquationCount - 1][subEquationCount]);
     }
     //Housekeeping
     document.getElementById('inputbox').value = "";
     subEquationCount++;
     var div = document.createElement("div");
     div.id = 'equation-' + globalEquationCount + "-" + subEquationCount;
     div.className = "equation-step";
     document.getElementById("equation-preview").appendChild(div);
     alert('equation-' + globalEquationCount + "-" + subEquationCount);
     //var div = document.createElement("div");
     //	div.id = 'mod-'+globalEquationCount+"-"+subEquationCount;
     //div.innerHTML="<img class='up-down'  src='img/up.png'  onclick='stepUp("+subEquationCount+");'></img> <img class='up-down'  src='img/down.png'  onclick='stepDown("+subEquationCount+");'></img>";
     document.getElementById("equation-preview").appendChild(div);
 }

 function update() {

     document.getElementById('equation-' + globalEquationCount + "-" + subEquationCount).innerHTML = "`" + document.getElementById('inputbox').value + "`";
     MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
 }

 function rerender() {
     MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
     //MathJax.Hub.Queue(resetCursor);
    // alert($("#editor .MathJax").last().attr("id"));
     checkForNewReference($("#editor .MathJax").last().attr("id"));

 }

 function updatelhs() {
      document.getElementById('equation-' + globalEquationCount + "-" + subEquationCount).innerHTML = "`" + document.getElementById('inputbox-lhs').value + "`";
    // document.getElementById('equation-' + globalEquationCount + "-lhs").innerHTML = "`" + document.getElementById('inputbox-lhs').value + "`";
     MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
 }

 function resetCursor() {
     var t2 = document.getElementById("editor");
     t2.focus();
     t2.value = t2.value;
 }

 function appendFromPalette(arg) {

     if (subEquationCount == 0) {
         document.getElementById('inputbox-lhs').value = document.getElementById('inputbox-lhs').value + arg.getAttribute("data-value") + " ";
         updatelhs();
     } else {
         document.getElementById('inputbox').value = document.getElementById('inputbox').value + arg.getAttribute("data-value") + " ";
         update();
     }
 }

 function appendEquation() {
     Equations[globalEquationCount - 1][subEquationCount] = document.getElementById('inputbox').value;

     document.getElementById('editor').innerHTML = document.getElementById('editor').innerHTML + "<div class='equation'  style='position:inline;height:auto;' id='equation-" + globalEquationCount + "' > " + " " + document.getElementById('equation-preview').innerHTML + "</div><br/>";
     $('#equation-container').fadeOut(1000);
     $('#overlay').fadeOut(1300);
     document.execCommand("enableObjectResizing", false, false);
     document.getElementById('equation-preview').innerHTML = "";
     document.getElementById('inputbox').value = "";
     checkForNewReference(globalEquationCount);
 }




///////////////////////Referencing Logic////////////////////////////

//Obsolete, replaced with new fn haandling compound vars
 function newReferenceObsolete() {
     //reference - symbol,[style NOT IMPLEMENTED]
     referenceData = seltext;
    // alert(seltext);
     var span = document.createElement("span");
     span.id = "reference-" + referenceCount;
     span.class = "reference-placeholder";
     References[referenceCount] = [referenceData, "reference-" + referenceCount,null];
     referenceCount++;
     alert($(node).closest(".MathJax").attr('id'));
     $(node).closest(".MathJax").before(span);
 }

 function newTextReference()
 {
	 referenceData = seltext;
  //  alert(seltext);  
var span = document.createElement("span");
   span.id = "text-reference-" + TextreferenceCount;
  span.class = "text-reference-placeholder";    
    if (window.getSelection) {
        var sel = window.getSelection();
        if (sel.rangeCount) {
            var range = sel.getRangeAt(0).cloneRange();
            range.surroundContents(span);
            sel.removeAllRanges();
            sel.addRange(range);
        }
    }	
     TextReferences[TextreferenceCount] = [referenceData, "text-reference-" + TextreferenceCount];
    TextreferenceCount++;
 
 }

 function isReference(symbol) {
     for (var i = 0; i < referenceCount; i++) {
         if (References[i][0] == symbol) {
             return true;
         }
     }
     return false;
 }


function checkForNewReference(div) {
	  //var done = new Array();
     //var i =0;
     referenceTempArray = new Array();
    //Clear existing reference temp array and destroy any open alerts
    
    
    //get list of mitems added
     $("#equation-" + div).find(".mi").each(function (index, element) {
         //if((!isReference($(element).text(),$(element).css('font-weight')))&&done.indexOf($(element).text())== -1 )
         if (!isReference($(element).text())) {
             //done[i] = $(element).text();
             referenceTempArray.push(element);
             //i++;
         }
     });
     //alert(referenceTempArray.toString());
     if (referenceTempArray.length != 0)
         referenceAlert(referenceTempArray.pop());
 }

 
function addAutoReference(element) {
     alert($(element).text());
     References[referenceCount] = [$(element).text(), "reference-" + referenceCount,".mi:contains("+$(element).text()+")"];

     alert($(element).closest(".MathJax").attr('id'));

     var span = document.createElement("span");
     span.id = "reference-" + referenceCount;
     span.class = "reference-placeholder";

     $(element).closest(".MathJax").before(span);
     referenceCount++;
 }
 

//New General function for compound and simple vars
 function newReference()
{
	$("#preview").text($.selection())
	
	//determine smallest bounding node
	var node;
	//query construction
	 querystring = getQuery($.selection());	 
	 altq= querystring;
 //   alert(($($.selection('html'))[0]).attr('id') );
 //  var parentid = "#"+$(".math",$.selection('html')).attr('id')+" ";
   var parentid = "#" + $(getSelectionParentElement()).parents('.math').attr('id')+" ";
    alert(parentid + ".mi"+querystring);
    
	if($(parentid + ".mi"+querystring).attr("id")!=null)
	{
		node=$(parentid + ".mi"+querystring);
		querystring = ".mi"+querystring;
	}
	else if($(parentid + ".mo"+querystring).attr("id")!=null)
	{
		node=$(parentid + ".mo"+querystring);
		querystring = ".mo"+querystring;
	}
	else if($(parentid + ".msub"+querystring).attr("id")!=null)
	{
		node=$(parentid + ".msub"+querystring);
		querystring = ".msub"+querystring;
	}
	else if($(parentid + ".msup"+querystring).attr("id")!=null)
	{
		node=$(parentid + ".msup"+querystring);
		querystring = ".msup"+querystring;
	}
	else if($(parentid + ".msubsup"+querystring).attr("id")!=null)
	{
		node=$(parentid + ".msubsup"+querystring);
		querystring = ".msubsup"+querystring;
	}
	else if($(parentid + ".mover"+querystring).attr("id")!=null)
	{
		node=$(parentid + ".mover"+querystring);
		querystring = ".mover"+querystring;
	}
	
	alert('selected node id'  + node.attr('id'));
	
	//Add reference to References array and create placeholder
	
	 var span = document.createElement("span");
     span.id = "reference-" + referenceCount;
     span.class = "reference-placeholder";
     References[referenceCount] = [$.selection(), "reference-" + referenceCount,querystring];
     referenceCount++;
     alert(node.closest(".MathJax").attr('id'));
     node.closest(".MathJax").before(span);
		alert($.selection()+ "reference-" + referenceCount+	querystring);
}


 function referenceAlert(element) {
     var size = $(element).css("color");
     $(element).css("color", "#FFF");
     var symbol = $(element).text();
     //$(element).css('font-weight')
     d = document.createElement('div');
     $(d).addClass("bottom-alert")
         .html('Should this ' + symbol + '  be a reference target for all other ' + symbol + ' ?<button id="reference-yes" value="Yes">Yes</button><button id="reference-no" value="No">No</button>')
         .appendTo($("body")) //main div
         .click(function () {
         var temp;
         $(element).css("color", size);
         $(".bottom-alert").remove();
         while (((temp = referenceTempArray.pop()) != null) && isReference($(temp).text(), $(temp).css('font-weight'))) {

         }
         if (temp != null) {

             referenceAlert(temp);
         }
     })
         .hide()
         .slideToggle(300);
     $("#reference-yes").click(function (e) {

         addAutoReference(element);
         var temp;
         $(element).css("color", size);
         $(".bottom-alert").remove();
         while (((temp = referenceTempArray.pop()) != null) && isReference($(temp).text(), $(temp).css('font-weight'))) {

         }
         if (temp != null) {

             referenceAlert(temp);
         }
     });
     $("#reference-no").click(function (e) {
         var temp;
         $(element).css("color", size);
         $(".bottom-alert").remove();
         while (((temp = referenceTempArray.pop()) != null) && isReference($(temp).text(), $(temp).css('font-weight'))) {

         }
         if (temp != null) {

             referenceAlert(temp);
         }
     });

 }




function getSelectionHtml() {

     if (window.getSelection) {
         sel = window.getSelection();
         seltext = sel.toString();
         if (sel.rangeCount) {
             range = sel.getRangeAt(0);
             node = sel.anchorNode;
         }
     } else if (document.selection && document.selection.createRange) {
         range = document.selection.createRange();

     }


 }

function getSelectionParentElement() {
    var parentEl = null;
    if (window.getSelection) {
        var sel = window.getSelection();
        if (sel.rangeCount) {
            parentEl = sel.getRangeAt(0).commonAncestorContainer;
            if (parentEl.nodeType != 1) {
                parentEl = parentEl.parentNode;
            }
        }
    } else if (document.selection && document.selection.type != "Control") {
        parentEl = document.selection.createRange().parentElement();
    }
    return parentEl;
}


//////////////////////////////////////////Save and Export Logic//////////



 function Export() {


   
     /////

     var html = document.getElementById('editor').innerHTML;
     dataObj = {

         "Equations": JSON.stringify(Equations),
         "References": JSON.stringify(References),
         "Folds": JSON.stringify(Folds),
         "HTML": html,
         "EquationCount": globalEquationCount,
         "ReferenceCount": referenceCount,
		 "TextReferenceCount": TextreferenceCount,
		 "TextReferences": JSON.stringify(TextReferences)
     };


     postData("./process.php", dataObj);

 }

function Save()
{
      var html = document.getElementById('editor').innerHTML;
      dataObj = {

         "Equations": JSON.stringify(Equations),
         "References": JSON.stringify(References),
         "Folds": JSON.stringify(Folds),
         "HTML": html,
         "EquationCount": globalEquationCount,
         "ReferenceCount": referenceCount,
		 "TextReferenceCount": TextreferenceCount,
		 "TextReferences": JSON.stringify(TextReferences),
        "subEquationCount":subEquationCount
     };
    
}



function postData(path, params) {
     method = "post";
     var form = document.createElement("form");
     form.setAttribute("method", method);
     form.setAttribute("action", path);

     for (var key in params) {
         if (params.hasOwnProperty(key)) {
             var hiddenField = document.createElement("input");
             hiddenField.setAttribute("type", "hidden");
             hiddenField.setAttribute("name", key);
             hiddenField.setAttribute("value", params[key]);

             form.appendChild(hiddenField);
         }
     }

     document.body.appendChild(form);
     form.submit();
 }

 ////////////////////Folding part starts////////////////////////////////////////////////////////////////////////////////////////

 


 function foldEquation() {
	
     Equations[globalEquationCount - 1][subEquationCount] = document.getElementById('inputbox').value;
     $('#equation-container').fadeOut(500);
     $('#folding-container').fadeIn(500);
     //Use Equations[globalEquationCount-1] array to get the set of steps to fold, store appropriately in a 2d array called Folds, which i will post to php with the other arrays
	 
	 	 var d = document.createElement('div');
		d.innerHTML = "`"+ Equations[globalEquationCount - 1][0] + "`";
		 d.id='equation-' + globalEquationCount + "-0";
		d.className='lhs';
   $('#folding-equation-container').append(d);
     d =  chooseFold(1,subEquationCount,"first",globalEquationCount - 1);
     d.className="rhs";
	 $('#folding-equation-container').append(d);
     MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
     d=document.createElement('div');
     d.innerHTML = $('#folding-equation-container').html();
     d.id = "equation-" + globalEquationCount;
     d.className="equation";
     
     /*
	  $('.up,.down').hide();
 $('.buttonup').click(function(e)
	   {
		  $(this).parent().children('.up').show();
	   });
	   $('.buttondown').click(function(e)
	   {
		  $(this).parent().children('.down').show();
	   });
*/
     $('#editor').append(d);
      $('#folding-container').fadeOut(1000);
     $('#folding-equation-container').html("");
     $('#overlay').fadeOut(1300);
     document.execCommand("enableObjectResizing", false, false);
     document.getElementById('equation-preview').innerHTML = "";
     document.getElementById('inputbox').value = "";
     checkForNewReference(globalEquationCount);
	 $('.buttonup,.buttondown').hide();
	 
 }

function chooseFold( l,  u, type,eqno)
{
    
    if(l==u)
    {
        var d = document.createElement('div');
		if(type=="up")d.className="up";
		else d.className = "down";
		d.innerHTML = "`"+ Equations[eqno][l] + "`"//+ "<button class='buttonup'>▲</buttton><button class='buttondown'>▼</buttton>";
		d.id='equation-' + (Number(eqno)+1) + "-" + l;
		return d;
	}
	else
	{
		var fid = prompt("Enter the fold between" + l + "and" + u); 
		 var d = document.createElement('div');
		if(type=="up")d.className="up";
		else if(type=="down")d.className = "down";
		d.id='equation-' + (Number(eqno)+1) + "-" + fid;
		if(l<= Number(fid)-1)d.appendChild(chooseFold( l,  Number(fid)-1, "up" ,eqno));
        
		d.innerHTML = d.innerHTML + "`" + Equations[eqno][fid] + "`" ;
        if(l<= Number(fid)-1)d.innerHTML = d.innerHTML + "<button class='buttonup'>▲</buttton>";
        if( Number(fid)+1<=u)d.innerHTML = d.innerHTML + "<button class='buttondown'>▼</buttton>";
            
		if( Number(fid)+1<=u)d.appendChild(chooseFold( Number(fid)+1,  u, "down",eqno));
		return d;	
	}
}


 //////////////////////////////Folding part ends//////////////////////////////////////////////////////////
 
 
 
 
 
  ///////////Palette Tools////////////////////////////////////////////////////////////////////////////////

 function appendFromPaletteWithInput(arg) {
     document.getElementById('inputbox').value = document.getElementById('inputbox').value + arg + " ";
     update();
 }


 function fraction() {

     var f = "(" + prompt("Enter the Numerator") + ")/(" + prompt("Enter the Denominator") + ")";
     appendFromPaletteWithInput(f);
 }

 function integration() {
     var f = "int _(" + prompt("Enter the Lower Limit") + ") ^(" + prompt("Enter the Upper Limit") + ") (" + prompt("Enter the function") + ")";
     appendFromPaletteWithInput(f);

 }


 function summation() {
     var f = "sum _(" + prompt("Enter the Lower Limit") + ") ^(" + prompt("Enter the Upper Limit") + ") (" + prompt("Enter the function") + ")";
     appendFromPaletteWithInput(f);

 }

//////////////////////////////////////////////////////////////////////////////////////////////////



function toUnicode(theString) {
  var unicodeString = '';
  for (var i=0; i < theString.length; i++) {
    var theUnicode = theString.charCodeAt(i).toString(16).toUpperCase();
    while (theUnicode.length < 4) {	
      theUnicode = '0' + theUnicode;
    }
    theUnicode = '\\u' + theUnicode;
      if(theUnicode!="\\u0020")
    unicodeString += theUnicode;
  }
  return unicodeString;
}

function getQuery(theString)
{
	
	  var unicodeString = '';
  for (var i=0; i < theString.length; i++) {
    var theUnicode = theString.charCodeAt(i).toString(16)	.toUpperCase();
 
	if(theString.charAt(i)!=" " && theString.charAt(i)!="" && theString.charAt(i)!="\n" && theString.charAt(i)!=undefined){
		
		
    theUnicode = ":contains(" +  theString.charAt(i) + ")";     
    unicodeString += theUnicode;
	}
  }
  return unicodeString.replace(":contains(\r)","").replace(":contains(&nbsp;)","")	;
	
}

