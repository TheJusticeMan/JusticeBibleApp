//var Word=/("[^"]+"|'[^']+'|[^ ]*[a-zA-Z_]+[^ ]*)/g;
var Word = /("[^"]+"|'[^']+'|[^ ]*[a-zA-Z_]+[^ ]*)/g;
var nWord = /[^"]*?(?=[^ ]*[a-zA-Z_]+[^ ]*|"[^"]+"|'[^']+')/g;
var DRegExp = /([](\\\.)?^$|\*\+{}[])/g;
var RegExpOn = false;
var UseWholeWords = true;
var BibleReftoStringers;
var ready = false;
var SearchText;
var tags;
var SearchFor;
var SearchType = "";//"Phrase", "Any word","All words"

function fixItal(_string) {
	return _string.replace(/\[/g, "<em>").replace(/\]/g, "</em>")
}


function BibleReftoSearchString() {
	return "<span class=SearchResult cite='#verse" + this.Verse + "' oncontextmenu='return FindSimilar(" + ['"' + this.Book + '"', this.Chap, this.Verse] + ")' onclick='return GoToVerse(" + ['"' + this.Book + '"', this.Chap, this.Verse] + ")'><SPAN class=VerseNum>" + this.Book + " : " + this.Chap + ":" + (this.Verse + 1) + "</SPAN>  " + fixItal(Bible[this.Book][this.Chap][this.Verse]) + "</span>";
}

function BibleReftoHtmlString() {
	//GoToVerse(this.Book,this.Chap,this.Verse);
	return "<p id=verse class=Contents><SPAN class=VerseNum>" + (this.Verse + 1) + "</SPAN> " + fixItal(Bible[this.Book][this.Chap][this.Verse]) + "</p>";
	//"<INPUT id=verse class=Hidd>"+Bible[BookVal][ChapVal].join("<br><INPUT id=verse class=Hidd>")+""
}

function ChapToHtmString() {
	var aArray = [];
	for (var i = 0; i < this.length; i++) {
		aArray[i] = new BibleRef(this.Book, this.Chap, i, 0);
		//alert(this.Book + " : " + this.Chap + " : " + i);
	}
	//alert(new BibleRef("GENESIS",1,1,0));
	return aArray.join("");
}



function DoSearch() {
	document.all.BookHead.style.display = "none"
	document.all.Search.style.display = "none"
	if (!ready)
		GetSearch();
	if (SearchType == "Phrase") {
		if (!RegExpOn)
			SearchFor = SearchFor.replace(DRegExp, "\\$1");
		if (UseWholeWords)
			SearchFor = "\\b" + SearchFor + "\\b";
		SearchFor = new RegExp(SearchFor, tags);
	} else {
		SearchFor = new LogicalSearch(SearchFor, tags);
	}
	//alert("Got Past Create!"+SearchFor.test);
	var MyFound = [];
	var NoMatches = 0;
	for (Book in BibleSearch) {     //Books
		if (SearchFor.test(BibleSearch[Book].toString()) > 0) {     //Book
			//window.status = NoMatches + ":  " + Book;
			for (var C = 1; C < BibleSearch[Book].length; C++) {     //Chaps
				if (SearchFor.test(BibleSearch[Book][C].toString()) > 0) {
					for (var V = 0; V < BibleSearch[Book][C].length; V++) {     //Verse
						if (SearchFor.test(BibleSearch[Book][C][V].toString()) > 0) {
							MyFound.push(new BibleRef(Book, C, V, 1, SearchFor.test(BibleSearch[Book][C][V].toString())));
							NoMatches++;
						}
					}
				}
			}
		}
	}
	MyFound.sort(SortSearch)
	window.status = NoMatches;
	//prompt(MyFound,MyFound)
	var ShowResults = true;
	if (NoMatches > 999) {
		ShowResults = confirm("Many matches might crash computer:  " + NoMatches + " were found.  Preparing to show them.");
	}
	var Obj = new Object();
	Obj.content = MyFound;
	Obj.ShowContent = function () {
		//return this.content.join("");
		document.all.BookNm.innerText = "";
		document.all.BookHedr.innerText = "";
		document.all.ChapNo.innerText = "";
		document.all.contents.innerHTML = this.content.join("");
	}
	if (ShowResults)
		History.push(Obj);
	window.scrollTo(0, 0);
	//document.all.status.style.top=document.body.scrollTop;
	//document.all.alll.onscroll()
	//document.all.contents.innerHTML=MyFound.toString();//.replace(/\r\n/g,"<BR>");
	ready = false;
}

function FindSimilar(Book, Chap, Verse) {
	BookVal = "";
	//SearchText=Bible[BookVal].toString();
	tags = "";
	SearchFor = "";
	var searchin = Bible[Book][Chap][Verse].toLowerCase().split(/\W/g);
	searchin = searchin.sort();
	var lastWord = "";
	var a = [];
	var s = "";
	var currnum = 0;
	var sum = 0;
	for (var i = 0; i < searchin.length; i++) {
		if (searchin[i] != lastWord) {
			currnum = Math.round(256 / words[searchin[i]]);
			currnum = currnum || 0;
			sum += currnum;
			if (currnum != 0) {
				a.push("( " + searchin[i] + " * " + currnum + " )");
			}
		}
		lastWord = searchin[i];
	}
	s = a.join(" + ") + " - " + (sum / 4)
	//alert(s);
	document.all.searchBox.value = s;
	//searchin=se
	RegExpOn = false;
	tags = "i";
	//alert(searchin);
	SearchType = "Any word";
	UseWholeWords = true;
	event.returnValue = false;
	ready = true;
	SearchFor = s;
	DoSearch();
}

function GetSearch() {
	BookVal = document.all.Books[document.all.Books.selectedIndex].innerText;
	SearchFor = document.all.searchBox.value;
	RegExpOn = false;
	UseWholeWords = false;
	tags = "";
	if (document.all.RegExpSearchVL.checked) RegExpOn = true;
	if (document.all.WholeWordVL.checked) UseWholeWords = true;
	if (!document.all.MatchCaseVL.checked) tags = "i";
	SearchType = document.all.SearchType.name;
}

BibleReftoStringers = [BibleReftoHtmlString, BibleReftoSearchString];

function LogicalSearch(Find, flags) {
	var zWord = eval(Word.toString());
	var DoubleWd = /this\.WdList\[i\+\+\]\.test\(s\)[ ]+this\.WdList\[i\+\+\]\.test\(s\)/g
	this.Find = Find;
	var WdList = [];
	this.WdList = Find.match(zWord);
	var LogiTests = "";
	if (SearchType == "All words") {
		LogiTests = "this.WdList[i++].test(s)";
		for (var i = 1; i < this.WdList.length; i++) {
			LogiTests += " && this.WdList[i++].test(s)";
		}
	} else {
		LogiTests = Find.replace(zWord, "this.WdList[i++].test(s)");
		while ((/this\.WdList\[i\+\+\]\.test\(s\)[ ]+this\.WdList\[i\+\+\]\.test\(s\)/).test(LogiTests)) {
			LogiTests = LogiTests.replace(/this\.WdList\[i\+\+\]\.test\(s\)[ ]+this\.WdList\[i\+\+\]\.test\(s\)/g, "this.WdList[i++].test(s) + this.WdList[i++].test(s)");
		}
	}
	try {
		for (var i = 0; i < this.WdList.length; i++) {
			if (this.WdList[i].charAt(0) == '"' || this.WdList[i].charAt(0) == "'") {
				this.WdList[i] = this.WdList[i].substring(1, this.WdList[i].length - 1);
			}
			if (!RegExpOn)
				WdList[i] = this.WdList[i].replace(DRegExp, "\\$1");
			else
				WdList[i] = this.WdList[i];
			if (UseWholeWords) {
				WdList[i] = "\\b" + WdList[i] + "\\b";
			}
			this.WdList[i] = RegExp(WdList[i], flags);
			this.WdList[i].compile(WdList[i], flags);
		}
	} catch (e) {
		alert("Search error:  " + e.description);
		this.test = function test(s) { return false };
	}
	var Temp = "this.test=function test(s){";
	Temp += "var i=0;";
	Temp += "return (" + LogiTests + ");";
	Temp += "}";
	try {
		eval(Temp);
	} catch (e) {
		prompt("Search error:  " + e.description + "\r\n" + Temp, "Search error:  " + e.description + "\r\n" + Temp);

		this.test = function test(s) { return false };
	}
	this.toString = function ToString() { return this.Find };
}

function BibleRef(Book, Chap, Verse, Fng, index) {
	this.Book = Book || "GENESIS";
	this.Chap = Chap || 1;
	if (arguments.length < 3) {
		this.toString = ChapToHtmString;
		this.length = Bible[this.Book][this.Chap].length;
		this.ShowContent = function () {
			BookVal = this.Book;
			ChapVal = this.Chap;
			//document.all.contents.innerHTML = this.toString();
			//SetHtmJs();
		}
	} else {
		this.Verse = Verse || 0;
		this.toString = BibleReftoStringers[Fng];
		this.index = index || 1;
		//alert("ChapToHtmString"+arguments.length)
		this.ShowContent = function () {
			document.all.contents.innerHTML = this.toString();
		}
	}
}

function SortSearch(r1, r2) {
	return r2.index - r1.index
}

function SearchPoss() {
	if (event.keyCode == 13) {
		document.all.searchBox.value = document.all.searchBox.value.replace(/[\r\n]/g, " ");
		if (document.all.searchBox.value.length >= 1) {
			document.all.searchButton.click();
			document.all.Search.style.display = "none"
		}
	}
}

function HighLightSearch() {
	if (event.keyCode != 13) {
		var s = "";
		//document.all.contents.innerText=ShowAll(event,"\r\n",1);
		s = event.srcElement.value;
		s = s.replace(Word, "<SPAN class=does>$1</SPAN>");
		document.all.SearchHighLight.innerHTML = s;
	}
}

