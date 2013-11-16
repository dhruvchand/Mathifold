<?php
if ($_POST["Key"] != null) {
	try {
		# MySQL with PDO_MYSQL
		$key = $_POST["Key"];
		$name = $_POST["Title"];
		//$DBH = new PDO("mysql:host=mysql4.000webhost.com;dbname=a9466681_math", "a9466681_math", "math1234");
		$DBH = new PDO("mysql:host=localhost;dbname=Mathifold", "root", "panthera");
		$DBH -> setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$STH = $DBH -> prepare("SELECT * FROM Documents WHERE `Key` = :k AND DocName = :n");
		$STH -> execute(array("k" => $key, "n" => $name));
		$result = $STH -> fetch(PDO::FETCH_OBJ);
		$data = unserialize($result -> Data);
		$equations = $data["equations"];
		$references = $data["references"];
		$textreferences = $data["textreferences"];
		$equationCount = $data["equationCount"];
		$referencecount = $data["referencecount"];
		$textreferencecount = $data["textreferencecount"];
		$html_code = $data["html_code"];
	} catch(PDOException $e) {
		echo $e -> getMessage();
	}
}
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<title>Mathifold Home</title>
		<link rel="stylesheet" href="css/style.css" />
		<link href='http://fonts.googleapis.com/css?family=Raleway:200' rel='stylesheet' type='text/css'>
		<link rel="stylesheet" href="css/bootstrap.css" />

		<?php echo '<script type="text/javascript">
var storename ;
var storekey ;
</script>';
	if ($_POST["Key"] != null) {
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
	} else {
		echo '<script src="js/data.js"></script>';
	}
		?>
		<script src="js/jquery-1.8.3.min.js"></script>
		<script src="js/main.js"></script>
		<script src="js/jquery.selection.js"></script>
		<script src="js/jquery.at.caret.min.js"></script>
		<script src="js/bootstrap.min.js"></script>
		<script src="js/jquery.hotkeys.js"></script>
		<script src="js/bootstrap-wysiwyg.js"></script>

		<!--<script type="text/javascript" src="./mathjax/MathJax.js?config=TeX-MML-AM_HTMLorMML "></script>-->
		<!-- <script src='js/jquery-ui/ui/jquery-ui.js'></script> -->
		<script src='http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.0/jquery-ui.min.js'></script>
			<script type="text/javascript" src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-MML-AM_HTMLorMML "></script>
			
			

	</head>

	<body onload="body_load()">
		<div class="container" id="main-container">
			<div class="col-md-12" id="title">
				Mathifold
				<br/>
				<div id="loading">
					loading
				</div>
			</div>
			<div class="col-md-12" id="space"></div>
			<div id="wrapper">
				<div class="col-md-3" id="sidebar">
					<div id="main-menu">
						<div id="standard">
							<button onclick="loadEditor();" title = "Insert an equation">
								+equation
							</button>
							<button onclick="newReference()" title = "Add a new Reference to a symbol">
								+reference
							</button>
							<!--<button onclick="rerender()">
							+rerender
							</button>-->
							<button onclick="newTextReference()" title = "Add a new reference to a word or phrase">
								+teference
							</button>
							<button onclick="EquationReference();" title = "Add a reference link to an existing equation">
								+eference
							</button>
							<button onclick="Export();" title = "Export document as Mathifold HTML">
								&gt;export
							</button>
							<button onclick="ExportPrint();" title = "Export document as Mathifold HTML">
								&gt;print
							</button>
							<button onclick="Open();" title="Open existing Mathifold document">
								&gt;open
							</button>
							<button onclick="Save();" title = "Save your document online.">
								&gt;save
							</button>

						</div>

					</div>

					<div id="symbol-palette">
						<table width="98%" border="0" cellpadding="0" id="symbols">
							<tr>
								<!--
								<td onclick="appendFromPaletteToEditor(this)" data-value="x" >`x`</td>
								<td onclick="appendFromPalette(this)" data-value="y">`y`</td>
								<td onclick="appendFromPalette(this)" data-value="z">`z`</td>
								<td onclick="appendFromPalette(this)" data-value="alpha">`alpha`</td>
								-->
							</tr>
						</table>
					</div>
				</div>
				<br />
				<div class="col-md-9" id="editor-container">
					<div id="toolbar">
						
						 
						  <div class="btn-toolbar" data-role="editor-toolbar" data-target="#editor">
      <div class="btn-group">
        <button class="btn dropdown-toggle" data-toggle="dropdown" title="Font"><i class="icon-font"></i><b class="caret"></b></button>
          <ul class="dropdown-menu">
          </ul>
        </div>
      <div class="btn-group">
        <button class="btn dropdown-toggle" data-toggle="dropdown" title="Font Size"><i class="icon-text-height"></i>&nbsp;<b class="caret"></b></button>
          <ul class="dropdown-menu">
          <li><button  class="btn" data-edit="fontSize 5"><font size="5">Huge</font></button></li>
          <li><button class="btn" data-edit="fontSize 3"><font size="3">Normal</font></button></li>
          <li><button  class="btn" data-edit="fontSize 1"><font size="1">Small</font></button></li>
          </ul>
      </div>
      <div class="btn-group">
        <button class="btn" data-edit="bold" title="Bold (Ctrl/Cmd+B)"><i class="icon-bold"></i></button>
        <button class="btn" data-edit="italic" title="Italic (Ctrl/Cmd+I)"><i class="icon-italic"></i></button>
        <button class="btn" data-edit="strikethrough" title="Strikethrough"><span style="text-shadow:none;text-decoration:line-through;">ABC</span></button>
        <button class="btn" data-edit="underline" title="Underline (Ctrl/Cmd+U)"><span style="text-decoration:underline!important;">U</span></button>
      </div>
      <div class="btn-group">
        <button class="btn" data-edit="insertunorderedlist" title="Bullet list"><span class="icon-list-alt"></span></button>
        <button class="btn" data-edit="insertorderedlist" title="Number list"><span class="icon-list"></span></button>
        <button class="btn" data-edit="outdent" title="Reduce indent (Shift+Tab)"><i class="icon-indent-left"></i></button>
        <button class="btn" data-edit="indent" title="Indent (Tab)"><i class="icon-indent-right"></i></button>
      </div>
      <div class="btn-group">
        <button class="btn" data-edit="justifyleft" title="Align Left (Ctrl/Cmd+L)"><i class="icon-align-left"></i></button>
        <button class="btn" data-edit="justifycenter" title="Center (Ctrl/Cmd+E)"><i class="icon-align-center"></i></button>
        <button class="btn" data-edit="justifyright" title="Align Right (Ctrl/Cmd+R)"><i class="icon-align-right"></i></button>
        <button class="btn" data-edit="justifyfull" title="Justify (Ctrl/Cmd+J)"><i class="icon-align-justify"></i></button>
      </div>
      <div class="btn-group">
		  <button class="btn dropdown-toggle" data-toggle="dropdown" title="Hyperlink"><i class="icon-link">lnk</i></button>
		    <div class="dropdown-menu input-append">
			    <input class="span2" placeholder="URL" type="text" data-edit="createLink"/>
			    <button class="btn" type="button">Add</button>
        </div>
        <button class="btn" data-edit="unlink" title="Remove Hyperlink"><i class="icon-cut">unlnk</i></button>

      </div>
      
      <div class="btn-group">
        <button class="btn" title="Insert picture (or just drag & drop)" id="pictureBtn"><i class="icon-picture"></i></button>
        <input type="file" data-role="magic-overlay" data-target="#pictureBtn" data-edit="insertImage" />
      </div>
      <div class="btn-group">
        <button class="btn" data-edit="undo" title="Undo (Ctrl/Cmd+Z)"><i class="icon-chevron-left"></i></button>
        <button class="btn" data-edit="redo" title="Redo (Ctrl/Cmd+Y)"><i class="icon-chevron-right"></i></button>
      </div>
     
    </div>
						
						
						 
						 
						 
						 
					</div>
					<!--end of div#toolbar-->
					<div name="editor" id="editor" contenteditable="true" onmouseout="getSelectionHtml()"  >
						<?php
						if ($html_code != null) {
							echo $html_code;
						}
						?>

						<div id="clickme">
							Click here to begin
						</div>

					</div>
					<div id='statusbox'></div>
					<div class = 'qs'>
						<a href="./Mathifold.pdf" target="_blank" >Quick Start Guide ↗</a> &nbsp;&nbsp;&nbsp;<a href="./asciimath.html" target="_blank" >ASCIIMathML Examples ↗</a>
						<br/>
						<br/>

						<span class="small right">teference - Text Reference
							<br/>
							eference - Equation Reference</span>
					</div>
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
			<div id = 'close' onclick="closeEditor()">
				Close
			</div>
			<div id='equation-status'></div>
			<div  class="palette">
				<span onclick="addStep();" style="cursor:pointer;" id="plus-step">+add step</span>
				palette
				<div id = "palette-symbols">
					<h3>alphabet </h3>
					<div class="palette-category">
						<span onclick="appendFromPalette(this)" data-value="a">`a`</span>
						<span onclick="appendFromPalette(this)" data-value="b">`b`</span>
						<span onclick="appendFromPalette(this)" data-value="c">`c`</span>
						<span onclick="appendFromPalette(this)" data-value="x" >`x`</span>
						<span onclick="appendFromPalette(this)" data-value="y">`y`</span>
						<span onclick="appendFromPalette(this)" data-value="z">`z`</span>
						<br/>
						<span onclick="appendFromPalette(this)" data-value="alpha">`alpha`</span>
						<span onclick="appendFromPalette(this)" data-value="beta">`beta`</span>
						<span onclick="appendFromPalette(this)" data-value="gamma">`gamma`</span>
						<span onclick="appendFromPalette(this)" data-value="delta">`delta`</span>
						<span onclick="appendFromPalette(this)" data-value="epsilon">`epsilon`</span>
						<span onclick="appendFromPalette(this)" data-value="zeta">`zeta`</span>
						<span onclick="appendFromPalette(this)" data-value="eta">`eta`</span>
						<span onclick="appendFromPalette(this)" data-value="theta">`theta`</span>
						<span onclick="appendFromPalette(this)" data-value="iota">`iota`</span>
						<span onclick="appendFromPalette(this)" data-value="kappa">`kappa`</span>
						<span onclick="appendFromPalette(this)" data-value="lambda">`lambda`</span>
						<span onclick="appendFromPalette(this)" data-value="mu">`mu`</span>
						<span onclick="appendFromPalette(this)" data-value="nu">`nu`</span>
						<span onclick="appendFromPalette(this)" data-value="xi">`xi`</span>
						<span onclick="appendFromPalette(this)" data-value="pi">`pi`</span>
						<span onclick="appendFromPalette(this)" data-value="rho">`rho`</span>
						<span onclick="appendFromPalette(this)" data-value="sigma">`sigma`</span>
						<span onclick="appendFromPalette(this)" data-value="tau">`tau`</span>
						<span onclick="appendFromPalette(this)" data-value="upsilon">`upsilon`</span>
						<span onclick="appendFromPalette(this)" data-value="phi">`phi`</span>
						<span onclick="appendFromPalette(this)" data-value="chi">`chi`</span>
						<span onclick="appendFromPalette(this)" data-value="psi">`psi`</span>
						<span onclick="appendFromPalette(this)" data-value="omega">`omega`</span>
						<br/>
						<span onclick="appendFromPalette(this)" data-value="Gamma">`Gamma`</span>
						<span onclick="appendFromPalette(this)" data-value="Delta">`Delta`</span>
						<span onclick="appendFromPalette(this)" data-value="Theta">`Theta`</span>
						<span onclick="appendFromPalette(this)" data-value="Lambda">`Lambda`</span>
						<span onclick="appendFromPalette(this)" data-value="Xi">`Xi`</span>
						<span onclick="appendFromPalette(this)" data-value="Pi">`Pi`</span>
						<span onclick="appendFromPalette(this)" data-value="Sigma">`Sigma`</span>
						<span onclick="appendFromPalette(this)" data-value="Phi">`Phi`</span>
						<span onclick="appendFromPalette(this)" data-value="Psi">`Psi`</span>
						<span onclick="appendFromPalette(this)" data-value="Omega">`Omega`</span>

					</div>

					<h3>unary/binary operators </h3>
					<div class="palette-category">
						<span onclick="appendFromPalette(this)" data-value="+">`+`</span>
						<span onclick="appendFromPalette(this)" data-value="-">`-`</span>
						<span onclick="appendFromPalette(this)" data-value="*">`*`</span>
						<span onclick="appendFromPalette(this)" data-value="/">`/`</span>
						<span onclick="appendFromPalette(this)" data-value="times">`times`</span>						
						<span onclick="appendFromPalette(this)" data-value="**">`**`</span>
						<span onclick="appendFromPalette(this)" data-value="o+">`o+`</span>
						<span onclick="appendFromPalette(this)" data-value="ox">`ox`</span>
						<span onclick="appendFromPalette(this)" data-value="//">`//`</span>
						<span onclick="appendFromPalette(this)" data-value="\\">`\\`</span>
						<span onclick="appendFromPalette(this)" data-value="and">`and`</span>
						<span onclick="appendFromPalette(this)" data-value="or">`or`</span>
						<span onclick="appendFromPalette(this)" data-value="^^">`^^`</span>
						<span onclick="appendFromPalette(this)" data-value="vv">`vv`</span>
						<span onclick="appendFromPalette(this)" data-value="nn">`nn`</span>
						<span onclick="appendFromPalette(this)" data-value="uu">`uu`</span>
						<span onclick="appendFromPalette(this)" data-value="^^">`^^`</span>
					</div>
					

					<h3>functions </h3>
					<div class="palette-category">
						<span onclick="appendFromPalette(this)" data-value="|x|">`|x|`</span>
						<span onclick="appendFromPalette(this)" data-value="sqrt">`sqrt`</span>
						<span onclick="appendFromPalette(this)" data-value="root a b">`root a b`</span>
						<span onclick="appendFromPalette(this)" data-value="sin">`sin`</span> 
<span onclick="appendFromPalette(this)" data-value="cos">`cos`</span> 
<span onclick="appendFromPalette(this)" data-value="tan">`tan`</span> 
<span onclick="appendFromPalette(this)" data-value="csc">`csc`</span> 
<span onclick="appendFromPalette(this)" data-value="sec">`sec`</span> 
<span onclick="appendFromPalette(this)" data-value="cot">`cot`</span> 
<span onclick="appendFromPalette(this)" data-value="sinh">`sinh`</span> 
<span onclick="appendFromPalette(this)" data-value="cosh">`cosh`</span> 
<span onclick="appendFromPalette(this)" data-value="tanh">`tanh`</span> 
<span onclick="appendFromPalette(this)" data-value="log">`log`</span> 
<span onclick="appendFromPalette(this)" data-value="ln">`ln`</span> 
<span onclick="appendFromPalette(this)" data-value="det">`det`</span> 
<span onclick="appendFromPalette(this)" data-value="lim">`lim`</span> 
<span onclick="appendFromPalette(this)" data-value="mod">`mod`</span> 
<span onclick="appendFromPalette(this)" data-value="gcd">`gcd`</span> 
<span onclick="appendFromPalette(this)" data-value="lcm">`lcm`</span> 

					</div>
		<h3>relations </h3>
	<div class="palette-category">
						<span onclick="appendFromPalette(this)" data-value="=">`=`</span>
						<span onclick="appendFromPalette(this)" data-value="ne">`ne`</span>
						<span onclick="appendFromPalette(this)" data-value="~~">`~~`</span>
						<span onclick="appendFromPalette(this)" data-value="<">`<`</span>
						<span onclick="appendFromPalette(this)" data-value="<=">`<=`</span>
						<span onclick="appendFromPalette(this)" data-value=">">`>`</span>
						<span onclick="appendFromPalette(this)" data-value=">=">`>=`</span>
						<span onclick="appendFromPalette(this)" data-value="-<">`-<`</span>
						<span onclick="appendFromPalette(this)" data-value="->">`->`</span>
						<span onclick="appendFromPalette(this)" data-value="in">`in`</span>
						<span onclick="appendFromPalette(this)" data-value="!in">`!in`</span>
						<span onclick="appendFromPalette(this)" data-value="sub">`sup`</span>
						<span onclick="appendFromPalette(this)" data-value="sube">`sube`</span>
						<span onclick="appendFromPalette(this)" data-value="sup">`sup`</span>
						<span onclick="appendFromPalette(this)" data-value="supe">`supe`</span>						
						<span onclick="appendFromPalette(this)" data-value="_=">`_=`</span>
						<span onclick="appendFromPalette(this)" data-value="~=">`~=`</span>
						<span onclick="appendFromPalette(this)" data-value="prop">`prop`</span>
	
						
						</div>
					
						<h3>logic </h3>
	<div class="palette-category">
						<span onclick="appendFromPalette(this)" data-value="\and">`\and`</span>
						<span onclick="appendFromPalette(this)" data-value="\or">`\or`</span>
						<span onclick="appendFromPalette(this)" data-value="\not">`\not`</span>
						<span onclick="appendFromPalette(this)" data-value="=>">`=>`</span>
						<span onclick="appendFromPalette(this)" data-value="if">`if`</span>
						<span onclick="appendFromPalette(this)" data-value="iff">`iff`</span>
						<span onclick="appendFromPalette(this)" data-value="AA">`AA`</span>
						<span onclick="appendFromPalette(this)" data-value="EE">`EE`</span>
						<span onclick="appendFromPalette(this)" data-value="_|_">`_|_`</span>
						<span onclick="appendFromPalette(this)" data-value="TT">`TT`</span>
						<span onclick="appendFromPalette(this)" data-value="|--">`|--`</span>
						<span onclick="appendFromPalette(this)" data-value="|==">`|==`</span>
	
						
						</div>
					
						<h3>misc symbols </h3>
	<div class="palette-category">
					<span onclick="appendFromPalette(this)" data-value="int">`int`</span> 
<span onclick="appendFromPalette(this)" data-value="oint">`oint`</span> 
<span onclick="appendFromPalette(this)" data-value="del">`del`</span> 
<span onclick="appendFromPalette(this)" data-value="grad">`grad`</span> 
<span onclick="appendFromPalette(this)" data-value="+-">`+-`</span> 
<span onclick="appendFromPalette(this)" data-value="O/">`O/`</span> 
<span onclick="appendFromPalette(this)" data-value="oo">`oo`</span> 
<span onclick="appendFromPalette(this)" data-value="aleph">`aleph`</span> 
<span onclick="appendFromPalette(this)" data-value="...">`...`</span> 
<span onclick="appendFromPalette(this)" data-value="cdots">`cdots`</span> 
<span onclick="appendFromPalette(this)" data-value="quad">`quad`</span> 
<span onclick="appendFromPalette(this)" data-value="qquad">`qquad`</span> 
<span onclick="appendFromPalette(this)" data-value="diamond">`diamond`</span> 
<span onclick="appendFromPalette(this)" data-value="square">`square`</span> 
<span onclick="appendFromPalette(this)" data-value="|_ _|">`|_ _|`</span> 
<span onclick="appendFromPalette(this)" data-value="|~ ~|">`|~ ~|`</span> 
<span onclick="appendFromPalette(this)" data-value="CC">`CC`</span> 
<span onclick="appendFromPalette(this)" data-value="NN">`NN`</span> 
<span onclick="appendFromPalette(this)" data-value="QQ">`QQ`</span> 
<span onclick="appendFromPalette(this)" data-value="RR">`RR`</span> 
<span onclick="appendFromPalette(this)" data-value="ZZ">`ZZ`</span> 
	
						
						</div>
					
					
					<h3>arrows </h3>
					<div class="palette-category">
					<span onclick="appendFromPalette(this)" data-value="uarr">`uarr`</span> 
<span onclick="appendFromPalette(this)" data-value="darr">`darr`</span> 
<span onclick="appendFromPalette(this)" data-value="rarr">`rarr`</span> 
<span onclick="appendFromPalette(this)" data-value="->">`->`</span> 
<span onclick="appendFromPalette(this)" data-value="larr">`larr`</span> 
<span onclick="appendFromPalette(this)" data-value="harr">`harr`</span> 
<span onclick="appendFromPalette(this)" data-value="rArr">`rArr`</span> 
<span onclick="appendFromPalette(this)" data-value="lArr">`lArr`</span> 
<span onclick="appendFromPalette(this)" data-value="hArr">`hArr`</span> 
					</div>
					
					<h3>accents </h3>
					<div class="palette-category">
<span onclick="appendFromPalette(this)" data-value="hatx">`hatx`</span> 
<span onclick="appendFromPalette(this)" data-value="barx">`barx`</span> 
<span onclick="appendFromPalette(this)" data-value="ulx">`ulx`</span> 
<span onclick="appendFromPalette(this)" data-value="vecx">`vecx`</span> 
<span onclick="appendFromPalette(this)" data-value="dotx">`dotx`</span> 
<span onclick="appendFromPalette(this)" data-value="ddotx">`ddotx`</span> 
					</div>

					
					<h3>matrices </h3>
					<div class="palette-category">
						<span onclick="appendFromPalette(this)" data-value="[[a,b],[c,d]]">`[[a,b],[c,d]]`</span> 
<span onclick="appendFromPalette(this)" data-value="((1,0),(0,1))">`((1,0),(0,1))`</span> 
					</div>

					
					
					<h3>tools </h3>
					<div class="palette-category">
						<span onclick="fraction()" data-value="x/y">`x/y`</span>
						<span onclick="summation()" data-value="sum _(x=1) ^(oo)">`sum _(x=1) ^(oo)`</span>
						<span onclick="integration(this)" data-value="int _a ^b dx">`int _a ^b dx`</span>
					</div>

				
				</div>

			</div>
			<div   id="equation-preview" ></div>
			<!--
			<div id="lhs">
			<p> Enter the LHS</p>
			<input type="text"  onkeypress="updatelhs()" id="inputbox-lhs" value=""  />
			</div>

			-->
			<div id="non-lhs">
				<input type="text"  onchange="update()" onkeypress = "this.onchange();"onpaste="this.onchange();" oninput= "this.onchange();" id="inputbox" value=""  />
				<button id="submitinput" value="Done" onclick="appendEquation()">
					Done
				</button>
				<button id="fold" value="Fold" onclick="foldEquation()">
					Fold
				</button>
			</div>
		</div>
		</div>
		<div  id="folding-container">
			<h1>Equation Folding</h1>
			<div id="folding-equation-container"></div>
			<!--<button id="submitinput" value="Done" onclick="storeFolds()">Done</button>-->
		</div>
		
		
		<script>
  $(function(){
    function initToolbarBootstrapBindings() {
      var fonts = ['Serif', 'Sans', 'Arial', 'Arial Black', 'Courier', 
            'Courier New', 'Comic Sans MS', 'Helvetica', 'Impact', 'Lucida Grande', 'Lucida Sans', 'Tahoma', 'Times',
            'Times New Roman', 'Verdana'],
            fontTarget = $('[title=Font]').siblings('.dropdown-menu');
      $.each(fonts, function (idx, fontName) {
          fontTarget.append($('<li><a data-edit="fontName ' + fontName +'" style="font-family:\''+ fontName +'\'">'+fontName + '</a></li>'));
      });
      $('a[title]').tooltip({container:'body'});
    	$('.dropdown-menu input').click(function() {return false;})
		    .change(function () {$(this).parent('.dropdown-menu').siblings('.dropdown-toggle').dropdown('toggle');})
        .keydown('esc', function () {this.value='';$(this).change();});

      $('[data-role=magic-overlay]').each(function () { 
        var overlay = $(this), target = $(overlay.data('target')); 
        overlay.css('opacity', 0).css('position', 'absolute').offset(target.offset()).width(target.outerWidth()).height(target.outerHeight());
      });
     
	};
	function showErrorAlert (reason, detail) {
		var msg='';
		if (reason==='unsupported-file-type') { msg = "Unsupported format " +detail; }
		else {
			console.log("error uploading file", reason, detail);
		}
		$('<div class="alert"> <button type="button" class="close" data-dismiss="alert">&times;</button>'+ 
		 '<strong>File upload error</strong> '+msg+' </div>').prependTo('#alerts');
	};
    initToolbarBootstrapBindings();  
	$('#editor').wysiwyg({ fileUploadError: showErrorAlert} );
    window.prettyPrint && prettyPrint();
  });
</script>
	</body>
</html>
