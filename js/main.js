 var sel, range, seltext, node;
 var referenceSelection;
 var modeToggle = 0;
 var referenceTempArray;

 function body_load() {
     setTimeout("$('#title').animate({fontSize:'32px',marginTop:'0px',opacity:1},1000); $('#wrapper').fadeIn(700);", 1000);
     $("#editor").keydown(function (e) {

         if (e.which == 192) {
             if (modeToggle == 1) {

                 setTimeout("rerender()", 2000);
             }
             modeToggle = modeToggle == 1 ? 0 : 1;
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
         var div = document.createElement("div");
         div.id = 'equation-' + globalEquationCount + "-lhs";
         div.className = 'lhs';
         document.getElementById("equation-preview").appendChild(div);
	     alert('equation-' + globalEquationCount + "-" + subEquationCount);
         //	var div = document.createElement("div");
         //div.id = 'mod-'+globalEquationCount+"-"+subEquationCount;
         //div.innerHTML="<img class='up-down'  src='img/up.png'  onclick='stepUp("+subEquationCount+");'></img> <img class='up-down'  src='img/down.png'  onclick='stepDown("+subEquationCount+");'></img>";
         document.getElementById("equation-preview").appendChild(div);
     }
 }

 function addStep() {
     if (subEquationCount == 0) {
         $('#lhs').hide();
         $("#non-lhs").show();
     }
     //Store in Eqn DB
     Equations[globalEquationCount - 1][subEquationCount] = document.getElementById('inputbox').value;
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
     alert($("#editor .MathJax").last().attr("id"));
     checkForNewReference($("#editor .MathJax").last().attr("id"));

 }

 function updatelhs() {
     document.getElementById('equation-' + globalEquationCount + "-lhs").innerHTML = "`" + document.getElementById('inputbox-lhs').value + "`";
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

     document.getElementById('editor').innerHTML = document.getElementById('editor').innerHTML + "<div class='equation'  style='position:inline;height:auto;' id='" + globalEquationCount + "' > " + " " + document.getElementById('equation-preview').innerHTML + "</div><br/>";
     $('#equation-container').fadeOut(1000);
     $('#overlay').fadeOut(1300);
     document.execCommand("enableObjectResizing", false, false);
     document.getElementById('equation-preview').innerHTML = "";
     document.getElementById('inputbox').value = "";
     checkForNewReference(globalEquationCount);
 }




///////////////////////Referencing Logic////////////////////////////


 function newReference() {
     //reference - symbol,style
     referenceData = seltext;
    // alert(seltext);
     var span = document.createElement("span");
     span.id = "reference-" + referenceCount;
     span.class = "reference-placeholder";
     References[referenceCount] = [referenceData, "reference-" + referenceCount, $(node).closest(".mi").css('font-weight')];
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

 function isReference(symbol, style) {
     for (var i = 0; i < referenceCount; i++) {
         if (References[i][0] == symbol && References[i][2] == style) {
             return true;
         }
     }
     return false;
 }

function checkForNewReference(div) {
	  //var done = new Array();
     //var i =0;
     referenceTempArray = new Array();
     $("#" + div).find(".mi").each(function (index, element) {
         //if((!isReference($(element).text(),$(element).css('font-weight')))&&done.indexOf($(element).text())== -1 )
         if (!isReference($(element).text(), $(element).css('font-weight'))) {
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
     alert($(element).text() + $(element).css('font-weight'));
     References[referenceCount] = [$(element).text(), "reference-" + referenceCount, $(element).css('font-weight')];

     alert($(element).closest(".MathJax").attr('id'));

     var span = document.createElement("span");
     span.id = "reference-" + referenceCount;
     span.class = "reference-placeholder";

     $(element).closest(".MathJax").before(span);
     referenceCount++;
 }

 function referenceAlert(element) {
     var size = $(element).css("color");
     $(element).css("color", "#FFF");
     var symbol = $(element).text();
     //$(element).css('font-weight')
     d = document.createElement('div');
     $(d).addClass("bottom-alert")
         .html('Would you like this ' + symbol + ' to be a target of reference of all other ' + symbol + ' ?<button id="reference-yes" value="Yes">Yes</button><button id="reference-no" value="No">No</button>')
         .appendTo($("body")) //main div
     .click(function () {
         var temp;
         if ((temp = referenceTempArray.pop()) != null) {
             $(".bottom-alert").remove();
             referenceAlert(temp);
         }
         $(element).css("color", size);
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

 function Export() {


     /*
	var w=window.open();
    w.document.open();
	 w.document.write('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /><title>Untitled Document</title></head><body>');
    w.document.write(document.getElementById('editor').innerHTML);
	w.document.write('</body></html>');
    w.document.close();
	*/

     ///////adding buttons//
     for (var i = 1; i <= globalEquationCount; i++) {
         for (j = 2; j <= Equations[i - 1].length; j++) {
             if (typeof Folds[i - 1] != 'undefined') {
                 var button = document.createElement("button");

                 /*button.addEventListener('click', function() { 
          alert('OnClick');                                // not working
          }, false);*/

                 /*button.onclick = function(){
          alert('here be dragons');return false;            // not working
          };*/

                 if (j == 2)
                     button.setAttribute('disabled', 'disabled');

                 button.setAttribute('onclick', 'show(this.id);');

                 button.id = 'button-' + i + "-" + j;
                 button.innerHTML = '>';

                 document.getElementById('equation-' + i + "-" + j).appendChild(button);
                 document.getElementById('equation-' + i + "-" + j).style.display = 'none';
             }
         }

         if (typeof Folds[i - 1] != 'undefined') {
             var finalStep = document.createElement("div");
             finalStep.id = 'equation-' + i + "-" + j;
             finalStep.innerHTML = 'Final Step';

             document.getElementById(i).appendChild(finalStep);

             var button = document.createElement("button");

             button.setAttribute('onclick', 'show(this.id);');

             button.id = 'button-' + i + "-" + j;
             button.innerHTML = '>';

             document.getElementById('equation-' + i + "-" + j).appendChild(button);
         }

     }

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

 ////////////////////Folding part starts////////////////////////////////////////////////////////////////////////////////////////

 ////code to generate tree

 var n; // no. of intermediate steps
 var level = 0; // level of the tree
 var treeSize;
 var treeIndex = 1;
 var totalLists = 1;
 var foldIndex;
 var isSelected = new Array(n);
 var tree = new Array(treeSize);
 var color = new Array('red', 'blue', 'green', 'yellow', 'pink', 'brown');
 var eqnNumber;

 function combineSpanId(tempId) {
     var str2 = eqnNumber + "-" + tempId;
     return str2;
 }

 function allSelected() {
     var index;
     var flag = 1;
     for (index = 0; index < n; index++)
         if (!isSelected[index]) {
             flag = 0;
             break;
         }
     return flag;
 }


 function colorUpdate() {
     var index;
     for (index = 0; index < n; index++) {
         var tempObj1 = document.getElementById(combineSpanId(index)).getElementsByTagName('input');
         if (tempObj1.length) {
             document.getElementById(combineSpanId(index)).style.backgroundColor = color[tempObj1[0].name];
         }
     }

 }


 function foldUpdate() {
     var index;
     var flag = 0;
     var temp;
     var nameIndex = 0;

     if (!allSelected()) {
         document.getElementById('msg').innerHTML = 'Select Foldpoints for level ' + (level + 1) + '. Select one from each coloured partition from <font style="text-decoration:underline">top to bottom</font>';
         for (index = 0; index < n; index++) {
             if (isSelected[index]) {
                 document.getElementById(combineSpanId(index)).innerHTML = '';
                 if ((index != 0) && (index != n - 1) && (!isSelected[index + 1])) {
                     for (temp = index - 1; temp >= 0; temp--)
                         if (!isSelected[temp]) {
                             flag = 1;
                             break;
                         }
                     if (flag)
                         nameIndex++;
                 }
                 continue;
             }
             document.getElementById(combineSpanId(index)).innerHTML = '<input type="radio" name="' + nameIndex + '" value="' + nameIndex + '" onclick="selected(this.value);" />'
         }
         totalLists = nameIndex + 1;
     } else {
         var final = '';
         for (i = 1; tree[i] > -2; i++)
             final += (String.fromCharCode(tree[i] + 66));
         alert('Tree: ' + final + '\n' + 'size:' + i + '\n' + 'A=non-existent node');

         Folds[foldIndex] = final;

         $('#folding-container').fadeOut(500);
         appendEquation();
     }
     colorUpdate();
 }


 function selected(nIndex) {
     var index;
     var temp;
     for (index = 0; index < n; index++) {
         var tempObj = document.getElementById(combineSpanId(index)).getElementsByTagName('input');
         if (tempObj.length) {
             if (tempObj[0].name == nIndex) {
                 if (tempObj[0].checked) {
                     temp = index;
                 } else {
                     tempObj[0].disabled = 'true';
                 }
             }
         }
     }
     index = temp;
     isSelected[index] = 1;
     if (allSelected())
         totalLists = 1;
     totalLists--;

     if (level == 0) {
         tree[treeIndex] = index;
         temp = treeIndex;
     } else {
         if (tree[2 * treeIndex] < -1) {
             tree[2 * treeIndex] = index;
             temp = 2 * treeIndex;
         } else if (tree[2 * treeIndex + 1] < -1) {
             tree[2 * treeIndex + 1] = index;
             temp = 2 * treeIndex + 1;
         }
     }

     while (((tree[2 * treeIndex] >= -1) && (tree[2 * treeIndex + 1] >= -1)) || (tree[treeIndex] == -1)) {
         if (tree[treeIndex] == -1) {
             tree[2 * treeIndex] = -1;
             tree[2 * treeIndex + 1] = -1;
         }
         treeIndex++;
     }

     if (index == 0)
         tree[2 * temp] = -1;
     if (index == n - 1)
         tree[2 * temp + 1] = -1;
     if ((index != 0) && (isSelected[index - 1]))
         tree[2 * temp] = -1;
     if ((index != n - 1) && (isSelected[index + 1]))
         tree[2 * temp + 1] = -1;

     if (totalLists < 1) {
         level++;
         foldUpdate();
     }

 }

 ////code to generate tree ends

 function foldEquation() {
     Equations[globalEquationCount - 1][subEquationCount - 1] = document.getElementById('inputbox').value;
     $('#equation-container').fadeOut(500);
     $('#folding-container').fadeIn(500);
     //Use Equations[globalEquationCount-1] array to get the set of steps to fold, store appropriately in a 2d array called Folds, which i will post to php with the other arrays

     var index;
     level = 0;
     treeIndex = 1;
     totalLists = 1;
     eqnNumber = globalEquationCount - 1;


     var parent = document.createElement("div");
     var msgdiv = document.createElement("div");
     msgdiv.id = "msg";
     parent.appendChild(msgdiv);

     n = (Equations[globalEquationCount - 1].length) - 1;
     //alert(n);
     treeSize = Math.pow(2, n);
     foldIndex = globalEquationCount - 1;

     for (var i = 0; i < Equations[globalEquationCount - 1].length; i++) {
         var div = document.createElement("div");
         if (i == 0)
             div.innerHTML = "`" + Equations[globalEquationCount - 1][i] + "`";
         else
             div.innerHTML = "`" + Equations[globalEquationCount - 1][i] + "`" + "<span class='steps' id='" + (globalEquationCount - 1) + "-" + (i - 1) + "'>asad</span>";
         parent.appendChild(div);
     }
     var finalStep = document.createElement("div");
     finalStep.innerHTML = "Final Step";
     parent.appendChild(finalStep);


     $('#folding-equation-container').html(parent);
     MathJax.Hub.Queue(["Typeset", MathJax.Hub]);

     for (index = 0; index < n; index++)
         isSelected[index] = 0;
     for (index = 0; index < treeSize; index++)
         tree[index] = -2;
     document.getElementById('msg').innerHTML = 'Select the first foldpoint';
     for (index = 0; index < n; index++)
         document.getElementById(combineSpanId(index)).innerHTML = '<input type="radio" name="0" value="0" onclick="selected(this.value);" />';


 }



 //////////////////////////////Folding part ends/////
 
 
 
 
 
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
