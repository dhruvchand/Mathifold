var sel, range, seltext, node;
var referenceSelection;
var querystring
var referenceTempArray;
var tempReferenceStorage = new Array();
var invalidReferences = new Array();
var invalidTextReferences = new Array();
var autoSave;
///Equation editor environment variables
var currentStep = 0;
var currentEquation = 0;
var title;
var figureNo = 1;
//End

function body_load() {
	setTimeout("$('#main-title').animate({fontSize:'32px',marginTop:'0px',opacity:1},1000); $('#loading').fadeOut(700);$('#wrapper').fadeIn(700);", 1000);
	$("#editor").keyup(function(e) {

		if (e.which == 192 && $('#editor').html().match(new RegExp("`", "gi")) != null) {
	
			if ($('#editor').html().match(new RegExp("`", "gi")).length % 2 == 0) {
				
	///	alert('jkj');
				setTimeout(function()
				{
					document.getElementById('editor').innerHTML=document.getElementById('editor').innerHTML.replace($('#editor').html().match('`.+`')[0],"<div class='inline-math' id='inline-eqn'>"+$('#editor').html().match('`.+`')[0]+"</div>")
					renderInline();
					$("#editor").append("<br/>");
					$('#inline-eqn').focusEnd();
					$("#inline-eqn").attr("id","");
				}, 100);
			}

		}
	});

	$('#clickme').click(function(e) {
		$('#clickme').remove();
		
	autoSaveInterval = setInterval(autoSave, 10000);
	});

	$('#editor').delegate('.equation-button', 'click', function(e) {

		editEquation(e.target.parentElement.id.replace("equation-", ""));
	});

	$('#editor').delegate('.delete-button', 'click', function(e) {

		e.target.parentElement.innerHTML = "";
		$('#statusbox').text("");
		refreshEquationNumbers();
	});

	$('#editor').delegate('.equation', 'mouseenter', function(e) {
		$('#statusbox').text(e.currentTarget.id);
	});

	$('#editor').delegate('.equation', 'mouseleave', function(e) {
		$('#statusbox').text(" ");
	});

	document.execCommand("enableObjectResizing", false, false);
	
	$('#palette-symbols').accordion({
      collapsible: true,
      speed:10
    });
	
	//AutoSave Intervals
	if(localStorage.autosavedata!=null)
{
		$('#restore').show();
	


//Javascript fallback 

}

}

///////////////////////////////////////////Equations///////////////

function loadEditor() {

	range = window.getSelection().getRangeAt(0);
	document.getElementById('inputbox').value = "";
	globalEquationCount++;
	subEquationCount = 0;
	currentStep = subEquationCount;
	currentEquation = globalEquationCount;
	$('#equation-status').text("Editing equation " + currentEquation + " step " + (currentStep + 1));
	Equations[globalEquationCount - 1] = new Array();
	$('#equation-container').fadeIn(300);
	$('#overlay').fadeIn(500);

	var div = document.createElement("div");
	div.id = 'equation-' + globalEquationCount;
	div.className = "equation";
	document.getElementById("equation-preview").appendChild(div);

	var div = document.createElement("div");
	div.id = 'equation-' + globalEquationCount + "-" + subEquationCount;
	div.className = "equation-step editing";
	document.getElementById('equation-' + globalEquationCount).appendChild(div);

	$('#equation-' + currentEquation + "-" + currentStep).toggleClass('editing');
	$('#equation-container').delegate('.equation-step', 'click', function(e) {
		$('.equation-step').removeClass('editing');
		$(e.target).parents('.equation-step').toggleClass('editing');
		var id = $(e.target).parents('.equation-step').attr('id');
		currentStep = id.replace('equation-' + currentEquation + "-", "");
		document.getElementById('inputbox').value = Equations[currentEquation-1][currentStep].replace('`', '');
		$('#equation-status').text("Editing equation " + currentEquation + " step " + (Number(currentStep) + 1));
		e.stopPropagation();
	});
	

}

function editEquation(eqn) {
	range = window.getSelection().getRangeAt(0);
	//If it's a folded equation, construct unfolded version. Otherwise, copy existing equation form DOM.
	currentEquation = eqn;
	currentStep = Number(Equations[eqn - 1].length) - 1;
	document.getElementById('inputbox').value = Equations[currentEquation-1][currentStep].replace('`', '');
	$('#equation-status').text("Editing equation " + currentEquation + " step " + (Number(currentStep) + 1));
	$('#equation-container').fadeIn(300);
	$('#overlay').fadeIn(500);
	$('#equation-' + currentEquation + " .equation-button").remove();
	$('#equation-' + currentEquation + " .delete-button").remove();
	if ($('#equation-' + currentEquation + " .up,.down").length == 0) {
		$('#equation-preview').append($('#equation-' + currentEquation));
	} else {
		$('#equation-' + currentEquation).html("");
		$.each(Equations[currentEquation - 1], function(index, element) {
			var e = document.createElement('div');
			e.id = "equation-" + currentEquation + "-" + index;
			e.innerHTML = "`" + Equations[currentEquation-1][index] + "`";
			e.className = "equation-step";
			$('#equation-' + currentEquation).append(e);
		});
		$('#equation-preview').append($('#equation-' + currentEquation));
		MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
	}
	$('#equation-' + currentEquation + "-" + currentStep).toggleClass('editing');

	$('#equation-container').delegate('.equation-step', 'click', function(e) {
		$('.equation-step').removeClass('editing');
		$(e.target).parents('.equation-step').toggleClass('editing');
		var id = $(e.target).parents('.equation-step').attr('id');
		currentStep = id.replace('equation-' + currentEquation + "-", "");
		document.getElementById('inputbox').value = Equations[currentEquation-1][currentStep].replace('`', '');
		$('#equation-status').text("Editing equation " + currentEquation + " step " + (Number(currentStep) + 1));
		e.stopPropagation();
	});
}

function closeEditor() {
	if (Equations[currentEquation-1][0] != undefined) {
		d = document.getElementById('equation-' + currentEquation);

		var btn = document.createElement('button');
		btn.className = "equation-button";
		btn.innerHTML = "Edit";
		d.appendChild(btn);
		btn = document.createElement('button');
		btn.className = "delete-button";
		btn.innerHTML = "Remove";
		d.appendChild(btn);
		range.deleteContents();
		// place your span
		range.insertNode(document.createElement('br'));
		range.insertNode(d);
		range.insertNode(document.createElement('br'));
		$('#equation-container').fadeOut(300);
		$('#overlay').fadeOut(500);
		document.execCommand("enableObjectResizing", false, false);
		document.getElementById('equation-preview').innerHTML = "";
		document.getElementById('inputbox').value = "";
	} else {
		Equations[currentEquation - 1] = undefined;
		globalEquationCount--;
		subEquationCount = 0;
	}
	//reset environment
	$('#equation-container').fadeOut(300);
	$('#overlay').fadeOut(500);
	currentEquation = 0;
	currentStep = 0;
}

function addStep() {
	if (document.getElementById('inputbox').value != "")
		Equations[currentEquation - 1][currentStep] = document.getElementById('inputbox').value;
	document.getElementById('inputbox').value = "";
	currentStep = Equations[currentEquation - 1].length;
	$('#equation-status').text("Editing equation " + currentEquation + " step " + (Number(currentStep) + 1));
	var div = document.createElement("div");
	div.id = 'equation-' + currentEquation + "-" + currentStep;
	div.className = "equation-step";
	document.getElementById('equation-' + currentEquation).appendChild(div);
	$('.equation-step').removeClass('editing');
	$('#equation-' + currentEquation + "-" + currentStep).toggleClass('editing');
}

function update() {
	var temp = $('#equation-' + currentEquation + "-" + currentStep + " .up,.down");
	document.getElementById('equation-' + currentEquation + "-" + currentStep).innerHTML = "`" + document.getElementById('inputbox').value + "`";
	$('#equation-' + currentEquation + "-" + currentStep).append(temp);
	MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
}

function rerender() {
	MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
//change this!!
	checkForNewReference($("#editor .MathJax").last().attr("id"));

}

function renderInline(arg)
{
	MathJax.Hub.Queue(["Typeset", MathJax.Hub]);	
	checkForNewReference($("#inline-eqn").attr("id"));
	
}
/*
 function updatelhs() {
 document.getElementById('equation-' + globalEquationCount + "-" + subEquationCount).innerHTML = "`" + document.getElementById('inputbox-lhs').value + "`";
 // document.getElementById('equation-' + globalEquationCount + "-lhs").innerHTML = "`" + document.getElementById('inputbox-lhs').value + "`";
 MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
 }
 */

function appendFromPalette(arg) {

insertInField(document.getElementById('inputbox'),arg.getAttribute("data-value"));
	update();

}

function appendEquation() {
	if (document.getElementById('inputbox').value == '' && currentStep == 0) {
		$('#equation-container').fadeOut(300);
		$('#overlay').fadeOut(500);
		Equations[currentEquation - 1] = undefined;
		globalEquationCount--;
	} else {

		if (document.getElementById('inputbox').value != "")
			Equations[currentEquation - 1][currentStep] = document.getElementById('inputbox').value;
		$('.equation-step').removeClass('editing');
		d = document.getElementById('equation-' + currentEquation);

		var btn = document.createElement('button');
		btn.className = "equation-button";
		btn.innerHTML = "Edit";
		d.appendChild(btn);
		btn = document.createElement('button');
		btn.className = "delete-button";
		btn.innerHTML = "Remove";
		d.appendChild(btn);
		range.deleteContents();
		// place your span
		range.insertNode(document.createElement('br'));
		range.insertNode(d);
		range.insertNode(document.createElement('br'));
		$('#equation-container').fadeOut(300);
		$('#overlay').fadeOut(500);
		document.execCommand("enableObjectResizing", false, false);
		document.getElementById('equation-preview').innerHTML = "";
		document.getElementById('inputbox').value = "";
		checkForNewReference('equation-' + currentEquation);
		refreshEquationNumbers();
	}
	//reset environment
	currentEquation = 0;
	currentStep = 0;
}

function refreshEquationNumbers() {
	//delete empty equations first
	$.each($('.equation'), function(index, obj) {
		if ($(obj).text() == "") {
			obj.remove();
			globalEquationCount--;
			//Equations[index] = new Array();
		}
	});


	$.each($('.equation'), function(index, obj) {

		var EqnNo = $(obj).attr('id');
		EqnNo = EqnNo.replace("equation-", "");
		if ((Number(index) + 1) != EqnNo) {
			//swap array objects
			var theOtherIndex = (Number(index) + 1);
			var temp = Equations[index];
			Equations[index] = Equations[Number(EqnNo) - 1];
			Equations[Number(EqnNo) - 1] = temp;
			//Swap equation references

			$.each($('[data-pointsto=' + EqnNo + ']'), function(index, obj) {
				obj.dataset.pointsto = 'temp';
				$(obj).html('equation ' + theOtherIndex);
			});

			$.each($('[data-pointsto=' + theOtherIndex + ']'), function(index, obj) {
				obj.dataset.pointsto = EqnNo;
				$(obj).html('equation ' + EqnNo);
			});

			$.each($('[data-pointsto=temp]'), function(index, obj) {
				obj.dataset.pointsto = theOtherIndex;
			});

			//swap equation IDs
			$(obj).attr('id', "temp");
			$('#equation-' + (Number(index) + 1)).attr('id', 'equation-' + EqnNo);
			$(obj).attr('id', 'equation-' + theOtherIndex);
			//swap step IDs
			$.each($('[id^=equation-' + theOtherIndex + '-]'), function(index, obj) {
				var temp = $(obj).attr('id');
				temp = temp.replace("equation-" + theOtherIndex + "-", "temp-");
				$(obj).attr('id', temp);
			});

			$.each($('[id^=equation-' + EqnNo + '-]'), function(index, obj) {
				var temp = $(obj).attr('id');
				temp = temp.replace("equation-" + EqnNo + "-", "equation-" + theOtherIndex + "-");
				$(obj).attr('id', temp);
			});

			$.each($('[id^=temp-]'), function(index, obj) {
				var temp = $(obj).attr('id');
				temp = temp.replace("temp-", "equation-" + EqnNo + "-");
				$(obj).attr('id', temp);
			});

			//Phew.
		}
	});

}


function refreshFigureNumbers() {
	//delete empty equations first
	


	$.each($('.figure'), function(index, obj) {

		var figno = $(obj).attr('id');
		figno = figno.replace("figure-", "");
		if ((Number(index) + 1) != figno) {
			alert('dsfsd');
			figureNo--;
			//swap array objects
			var theOtherIndex = (Number(index) + 1);			
			//Swap equation references

			$.each($('[data-figpointsto=' + figno + ']'), function(index, obj) {
				obj.dataset.pointsto = 'temp';
				$(obj).html('figure ' + theOtherIndex);
			});

			$.each($('[data-figpointsto=' + theOtherIndex + ']'), function(index, obj) {
				obj.dataset.pointsto = figno;
				$(obj).html('figure ' + figno);
			});

			$.each($('[data-figpointsto=temp]'), function(index, obj) {
				obj.dataset.pointsto = theOtherIndex;
			});

			//swap equation IDs
			$(obj).attr('id', "temp");
			$(obj).children('.fig-id').html('Figure ' + theOtherIndex);
			
			$('#figure-' + (Number(index) + 1)).attr('id', 'figure-' + figno);
				$('#figure-' + (Number(index) + 1)).children('.fig-id').html('Figure ' + figno);
			$(obj).attr('id', 'figure-' + theOtherIndex);
			

			
		}
	});

}

///////////////////////Referencing Logic////////////////////////////

function genref()
{
	
	
	
}

function EquationReference() {

	var eqnnumber = prompt("Enter the equation number.");
	if(eqnnumber!=null){
	var div = document.createElement("span");
	div.dataset.pointsto = eqnnumber;
	div.className = "equation-reference";
	div.innerHTML = " equation " + eqnnumber;
	range.deleteContents();
	// place your span
	range.insertNode(div);
}
}

function FigureReference() {

	var fig = prompt("Enter the figure number.");
	if(fig!=null){
	var div = document.createElement("span");
	div.dataset.figpointsto = fig;
	div.className = "figure-reference";
	div.innerHTML = " figure " + fig;
	range.deleteContents();
	// place your span
	range.insertNode(div);
}
}

//Obsolete, replaced with new fn handling compound vars
function newReferenceObsolete() {
	//reference - symbol,[style NOT IMPLEMENTED]
	referenceData = seltext;
	// alert(seltext);
	var span = document.createElement("span");
	span.id = "reference-" + referenceCount;
	span.class = "reference-placeholder";
	References[referenceCount] = [referenceData, "reference-" + referenceCount, null];
	referenceCount++;
	// alert($(node).closest(".MathJax").attr('id'));
	$(node).closest(".MathJax").before(span);
}

function newTextReference() {
	referenceData = seltext;
	if(seltext!=''){
	alert("You referenced the word/phrase \'" + seltext + "\'");
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
	$(tempReferenceStorage[0]).css("color", tempReferenceStorage[1]);
	$(".bottom-alert").remove();
	//get list of mitems added
	$("#" + div).find(".mi").each(function(index, element) {
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
	alert("Reference added.");
	References[referenceCount] = [$(element).text(), "reference-" + referenceCount, ".mi:contains(" + $(element).text() + ")"];

	// alert($(element).closest(".MathJax").attr('id'));

	var span = document.createElement("span");
	span.id = "reference-" + referenceCount;
	span.class = "reference-placeholder";

	$(element).closest(".MathJax").before(span);
	referenceCount++;
}

//New General function for compound and simple vars
function newReference() {
	$("#preview").text($.selection())

	//determine smallest bounding node
	var node;
	//query construction
	querystring = getQuery($.selection());
	altq = querystring;
	//   alert(($($.selection('html'))[0]).attr('id') );
	//  var parentid = "#"+$(".math",$.selection('html')).attr('id')+" ";

	if ($(getSelectionParentElement()).parents('.math').attr('id') == undefined && $($.selection("html")).filter('.MathJax').attr('id') == undefined && $(getSelectionParentElement()).parents('.MathJax').attr('id') == undefined) {
		
		
		if( $($.selection("html")).attr("class")!="mi"&& $($.selection("html")).find(".mi").length==0){		
	newTextReference();
		}
		else
		{
			alert("There was an error processing your selection, please try again.");
		}
		
		
		
	} else {
		var parentid = "#" + $(getSelectionParentElement()).parents('.math').attr('id') + " ";
		if ($(getSelectionParentElement()).parents('.math').attr('id') == undefined)
			parentid = "#" + $($.selection("html")).filter('.MathJax').attr('id') + " ";

		alert("You referenced: " + $.selection());

		if ($(parentid + ".mi" + querystring).attr("id") != null) {//refreshEquationNumbers();
			node = $(parentid + ".mi" + querystring);
			querystring = ".mi" + querystring;
		} else if ($(parentid + ".mo" + querystring).attr("id") != null) {
			node = $(parentid + ".mo" + querystring);
			querystring = ".mo" + querystring;
		} else if ($(parentid + ".msub" + querystring).attr("id") != null) {
			node = $(parentid + ".msub" + querystring);
			querystring = ".msub" + querystring;
		} else if ($(parentid + ".msup" + querystring).attr("id") != null) {
			node = $(parentid + ".msup" + querystring);
			querystring = ".msup" + querystring;
		} else if ($(parentid + ".msubsup" + querystring).attr("id") != null) {
			node = $(parentid + ".msubsup" + querystring);
			querystring = ".msubsup" + querystring;
		} else if ($(parentid + ".mover" + querystring).attr("id") != null) {
			node = $(parentid + ".mover" + querystring);
			querystring = ".mover" + querystring;
		}

		//alert('selected node id'  + node.attr('id'));

		//Add reference to References array and create placeholder

		var span = document.createElement("span");
		span.id = "reference-" + referenceCount;
		span.class = "reference-placeholder";
		References[referenceCount] = [$.selection(), "reference-" + referenceCount, querystring];
		referenceCount++;
		// alert(node.closest(".MathJax").attr('id'));
		node.closest(".MathJax").before(span);
		//alert($.selection()+ "reference-" + referenceCount+	querystring);
	}
}

function referenceAlert(element) {
	tempReferenceStorage[0] = element;
	tempReferenceStorage[1] = $(element).css("color");

	var size = $(element).css("color");
	$(element).css("color", "#FFF");
	var symbol = $(element).text();
	//$(element).css('font-weight')
	d = document.createElement('div');
	$(d).addClass("bottom-alert").html('Should this ' + symbol + '  be a reference target for all other ' + symbol + ' ?<button id="reference-yes" value="Yes">Yes</button><button id="reference-no" value="No">No</button>').appendTo($("body"))//main div
	.click(function() {
		var temp;
		$(element).css("color", size);
		$(".bottom-alert").remove();
		while ((( temp = referenceTempArray.pop()) != null) && isReference($(temp).text(), $(temp).css('font-weight'))) {

		}
		if (temp != null) {

			referenceAlert(temp);
		} //refreshEquationNumbers();
	}).hide().slideToggle(300);
	$("#reference-yes").click(function(e) {

		addAutoReference(element);
		var temp;
		$(element).css("color", size);
		$(".bottom-alert").remove();
		while ((( temp = referenceTempArray.pop()) != null) && isReference($(temp).text())) {

		}
		if (temp != null) {

			referenceAlert(temp);
		}
	});
	$("#reference-no").click(function(e) {
		var temp;
		$(element).css("color", size);
		$(".bottom-alert").remove();
		while ((( temp = referenceTempArray.pop()) != null) && isReference($(temp).text())) {

		}
		if (temp != null) {

			referenceAlert(temp);
		}
	});

}

function checkReferences() {

	var i = 0;
	$.each(References, function(index, reference) {
		if ($("#" + reference[1]).length == 0) {
			invalidReferences[i] = reference;
			i++;
		}
	});

	i = 0;
	$.each(TextReferences, function(index, reference) {
		if ($("#" + reference[1]).length == 0) {
			invalidTextReferences[i] = reference;
			i++;
		}
	});

	if (invalidTextReferences.length == 0 && invalidReferences.length == 0)
		return 0;
	else
		return 1;
}

function getSelectionHtml() {

	if (window.getSelection) {
		sel = window.getSelection();
		seltext = sel.toString();
		if (sel.rangeCount) {
			range = sel.getRangeAt(0);
			$('.equation-step').removeClass('editing');
			node = sel.anchorNode;
		}
	} else if (document.selection && document.selection.createRange) {
		range = document.selection.createRange();

	}

}

function fixReferences(fn) {
	var str = "";

	$.each(invalidReferences, function(index, reference) {
		if (index != invalidReferences.length - 1)
			str += reference[0] + "  ";
		else if (invalidReferences.length == 1)
			str += " " + reference[0];
		else
			str += " and " + reference[0];
	});
	var bool1 = str != "" ? confirm("The reference target for " + str + " \n has/have been removed. Click OK to continue exporting without a reference for " + str + " or click cancel to go back to the editor.") : 1;

	$.each(invalidTextReferences, function(index, reference) {
		if (index != invalidTextReferences.length - 1)
			str += reference[0] + "  ";
		else if (invalidTextReferences.length == 1)
			str += " " + reference[0];
		else
			str += " and " + reference[0];
	});

	var bool2 = str != "" ? confirm("The reference target for the text chunks: " + str + " \n has/have been removed. Click OK to continue exporting without a reference for " + str + " or click cancel to go back to the editor.") : 1;

	if (bool1 && bool2) {
		fn("force");
	} else {
		return;
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

function Save(force) {
	if (checkReferences() == 0 || force == "force") {
	if (title == undefined) {
			 title = prompt("Enter the title of your Mathifold document.");
		}
		if(title!=null){

		var html = document.getElementById('editor').innerHTML;
		dataObj = {

			"Equations" : JSON.stringify(Equations),
			"References" : JSON.stringify(References),
			"HTML" : html,
			"EquationCount" : globalEquationCount,
			"ReferenceCount" : referenceCount,
			"TextReferenceCount" : TextreferenceCount,
			"TextReferences" : JSON.stringify(TextReferences),
			"FigureCount" : figureNo,
			"Title" : title
		};
		
		postData("./save.php", dataObj);
		}
	} else {
		fixReferences(arguments.callee);
	}
}

function autoSave()
{
	var currentdate = new Date(); 
var time = currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
		var html = document.getElementById('editor').innerHTML;
		dataObj = {

			"Equations" : JSON.stringify(Equations),
			"References" : JSON.stringify(References),
			"HTML" : html,
			"EquationCount" : globalEquationCount,
			"ReferenceCount" : referenceCount,
			"TextReferenceCount" : TextreferenceCount,
			"TextReferences" : JSON.stringify(TextReferences),
			"FigureCount" : figureNo,
			"SubEquationCount" : subEquationCount
		};
		
		localStorage.autosavedata = JSON.stringify(dataObj);
		$('#statusbox').text("Auto-saved at "+time);
	
}

function autoRestore()
{
		var data = JSON.parse(localStorage.autosavedata);
 Equations =JSON.parse(data.Equations);
 References = JSON.parse(data.References);
 TextReferences = JSON.parse(data.TextReferences);
 globalEquationCount = data.globalEquationCount==null?1:data.globalEquationCount ;
 referenceCount =  data.ReferenceCount==null?0:data.ReferenceCount;
 TextreferenceCount = data.TextReferenceCount==null?0:data.TextReferenceCount;
figureNo = data.FigureCount==null?1:data.FigureCount;
 subEquationCount = data.SubEquationCount==null?0:data.SubEquationCount;

$('#editor').html(data.HTML);
MathJax.Hub.Queue(["Typeset", MathJax.Hub]);

}

function ExportPrint(force) {
	if (checkReferences() == 0 || force == "force") {
		if (title == undefined) {
			 title = prompt("Enter the title of your Mathifold document.");
		}
		if(title!=null){
		var html = document.getElementById('editor').innerHTML;
		dataObj = {

			"Equations" : JSON.stringify(Equations),
			"References" : JSON.stringify(References),
			"HTML" : html,
			"EquationCount" : globalEquationCount,
			"ReferenceCount" : referenceCount,
			"TextReferenceCount" : TextreferenceCount,
			"TextReferences" : JSON.stringify(TextReferences),
			"Title" : title,
			"FigureCount" : figureNo,
			"isPrint":true
		};

		postData("./process.php", dataObj);
		}
	} else {
		fixReferences(arguments.callee);
	}
}

function Open() {

			var form = document.getElementById("file-form");
			var hiddenField = document.createElement("input");
			hiddenField.setAttribute("type", "hidden");
			hiddenField.setAttribute("name", "open");
			hiddenField.setAttribute("value", "true");
			form.appendChild(hiddenField);
			
	 form.submit();
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
	if (document.getElementById('inputbox').value == '' && currentStep == 0) {
		$('#equation-container').fadeOut(1000);
		$('#overlay').fadeOut(1300);
		//reset environment
		Equations[currentEquation - 1] = undefined;
		globalEquationCount--;
		currentEquation = 0;
		currentStep = 0;
	} else {

		if (document.getElementById('inputbox').value != "")
			Equations[currentEquation - 1][currentStep] = document.getElementById('inputbox').value;
		$('#equation-container').fadeOut(500);
		$('#folding-container').fadeIn(500);
		$('.equation-step').removeClass('editing');
		//Use Equations[globalEquationCount-1] array to get the set of steps to fold, store appropriately in a 2d array called Folds, which i will post to php with the other arrays
		$('#folding-equation-container').html("");
		$.each(Equations[currentEquation - 1], function(index, element) {
			var e = document.createElement('div');
			e.id = "fold-" + currentEquation + "-" + index;
			e.innerHTML = "`" + Equations[currentEquation-1][index] + "`";
			e.className = "fold-step";
			$('#folding-equation-container').append(e);
		});
		MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
		$('#equation-' + currentEquation).html("");
		var d = document.createElement('div');
		d.id = 'equation-' + currentEquation + "-0";
		d.className = "equation-step lhs";
		d.innerHTML = "`" + Equations[currentEquation-1][0] + "`";
		$('#equation-' + currentEquation).prepend(d);
		for (var i = 1; i <= Equations[currentEquation - 1].length; i++) {
			var btn = document.createElement("button");
			btn.className = "fold-button";
			btn.id = "fold-" + i;
			btn.innerHTML = "fold here";
			$('#fold-' + currentEquation + "-" + i).append(btn);
		}
		chooseFold(1, Equations[currentEquation - 1].length - 1, "first", currentEquation - 1, document.getElementById('equation-' + currentEquation));
	}
}

function cleanupFolds(eqn) {

	var btn = document.createElement('button');
	btn.className = "equation-button";
	btn.innerHTML = "Edit";
	$('#equation-' + currentEquation).append(btn);
	btn = document.createElement('button');
	btn.className = "delete-button";
	btn.innerHTML = "Remove";

	$('#equation-' + currentEquation).append(btn);

	range.deleteContents();
	// place your span
	range.insertNode(document.createElement('br'));
	range.insertNode(document.getElementById('equation-' + currentEquation));
	range.insertNode(document.createElement('br'));
	$('#folding-container').fadeOut(1000);
	$('#folding-equation-container').html("");
	$('#overlay').fadeOut(1300);
	document.execCommand("enableObjectResizing", false, false);
	document.getElementById('equation-preview').innerHTML = "";
	document.getElementById('inputbox').value = "";
	checkForNewReference("equation-" + currentEquation);
	$('.buttonup,.buttondown').hide();
	//	refreshEquationNumbers();
	MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
	//alert('asdasd');
	console.log("2");
	//reset environment
	currentEquation = 0;
	currentStep = 0;
}

function chooseFold(l, u, type, eqno, div) {
	var d = document.createElement('div');
	if (l == u) {
		$('#fold-' + l).remove();
		//alert("remoive" + '#fold-' + l)
		if (type == "up")
			d.className = "up rhs";
		else
			d.className = "down rhs";
		d.innerHTML = "`" + Equations[eqno][l] + "`";
		d.id = 'equation-' + (Number(eqno) + 1) + "-" + l;
		if (type == "up") {
			$(div).prepend(d);
			//$(div).prepend("<br/>");
		} else {
			$(div).append("<br/>");
		//	$(div).append(d);
		}

		console.log(div);
		//If this is the last fold, cleanup

	} else {
		$('.fold-button').unbind('click');
		$('.fold-button').click(function(e) {
			//alert('called');

			var fid = e.target.id.replace("fold-", "");
			$('#fold-' + fid).remove();
			if (type == "up")
				d.className = "up equation-step rhs";
			else if (type == "down")
				d.className = "down equation-step rhs";

			d.id = 'equation-' + (Number(eqno) + 1) + "-" + fid;

			if (type == "up") {
				$(div).prepend(d);
			//	$(div).prepend("<br/>");
			} else if (type == "down") {
			//	$(div).append("<br/>");
				$(div).append(d);

			} else {
			//	$(div).append("<br/>");
				$(div).append(d);
			}
			if (l <= Number(fid) - 1)
				chooseFold(l, Number(fid) - 1, "up", eqno, d);

			d.innerHTML = d.innerHTML + "`" + Equations[eqno][fid] + "`";
			if (l <= Number(fid) - 1)
				d.innerHTML = d.innerHTML + "<button class='buttonup'>▲</buttton>";
			if (Number(fid) + 1 <= u)
				d.innerHTML = d.innerHTML + "<button class='buttondown'>▼</buttton>";

			if (Number(fid) + 1 <= u)
				chooseFold(Number(fid) + 1, u, "down", eqno, d);
			console.log(div);
			console.log("1");
			if ($('.fold-button').length == 0) {
				//alert('called');
				cleanupFolds(eqno);
				//alert('calledl');
			}
		});

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

function getQuery(theString) {

	var unicodeString = '';
	for (var i = 0; i < theString.length; i++) {
		var theUnicode = theString.charCodeAt(i).toString(16).toUpperCase();

		if (theString.charAt(i) != " " && theString.charAt(i) != "" && theString.charAt(i) != "\n" && theString.charAt(i) != undefined) {

			theUnicode = ":contains(" + theString.charAt(i) + ")";
			unicodeString += theUnicode;
		}
	}
	return unicodeString.replace(":contains(\r)", "").replace(":contains(&nbsp;)", "");

}

function insertInField(obj, text){ obj.value=obj.value.substring(0, obj.selectionStart)+text+obj.value.substring(obj.selectionEnd) }

$.fn.focusEnd = function() {
    $(this).focus();
    var tmp = $('<span />').appendTo($(this)),
        node = tmp.get(0),
        range = null,
        sel = null;

    if (document.selection) {
        range = document.body.createTextRange();
        range.moveToElementText(node);
        range.select();
    } else if (window.getSelection) {
        range = document.createRange();
        range.selectNode(node);
        sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    }
    tmp.remove();
    return this;
}