//var Word=/("[^"]+"|'[^']+'|[^ ]*[a-zA-Z_]+[^ ]*)/g;
const Word = /("[^"]+"|'[^']+'|[^ ]*[a-zA-Z_]+[^ ]*)/g;
const nWord = /[^"]*?(?=[^ ]*[a-zA-Z_]+[^ ]*|"[^"]+"|'[^']+')/g;
const DRegExp = /([](\\\.)?^$|\*\+{}[])/g;
var RegExpOn = false;
var UseWholeWords = true;
var ready = false;
var SearchText;
var tags;
var SearchFor;
var SearchType = "";//"Phrase", "Any word","All words"

function FindSimilar(Book, Chap, Verse) {
	closeNav();
	var TempbibleSearch = new BibleSearchf();
	//SearchText=Bible[BookVal].toString();
	TempbibleSearch.Tags = "";
	TempbibleSearch.SearchFor = "";
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
	HtmlSearchInput.value = s;
	//searchin=se
	TempbibleSearch.RegExpOn = false;
	TempbibleSearch.Tags = "i";
	//alert(searchin);
	TempbibleSearch.SearchType = "Any word";
	TempbibleSearch.UseWholeWords = true;
	TempbibleSearch.SearchFor = s;
	TempbibleSearch.Status=1;
	TempbibleSearch.SetupSearch();
	TempbibleSearch.DoSearch();
	History.push(TempbibleSearch);
	event.returnValue = false;
}

class LogicalSearch {
	constructor(Find, flags) {
		const DoubleWd = /this\.WdList\[i\+\+\]\.test\(s\)[ ]+this\.WdList\[i\+\+\]\.test\(s\)/g;
		this.Find = Find;
		this.WdList = Find.match(Word);
		var LogiTests = "";
		if (SearchType == "All words") {
			LogiTests = "this.WdList[i++].test(s)";
			for (var i = 1; i < this.WdList.length; i++) {
				LogiTests += " && this.WdList[i++].test(s)";
			}
		} else {
			LogiTests = Find.replace(Word, "this.WdList[i++].test(s)");
			while ((DoubleWd).test(LogiTests)) {
				LogiTests = LogiTests.replace(DoubleWd, "this.WdList[i++].test(s) + this.WdList[i++].test(s)");
			}
		}
		try {
			for (var i = 0; i < this.WdList.length; i++) {
				var s = this.WdList[i].toString();
				if (s.charAt(0) == '"' || s.charAt(0) == "'") {
					s = s.substring(1, s.length - 1);
				}
				if (!RegExpOn)
					s = s.replace(DRegExp, "\\$1");

				else
					s = s;
				if (UseWholeWords) {
					s = "\\b" + s + "\\b";
				}
				this.WdList[i] = RegExp(s, flags);
				this.WdList[i].compile(s, flags);
			}
		} catch (e) {
			alert("Search error:  " + e.description);
			this.test = function test(s) { return false; };
		}
		var Temp = "this.test=function test(s){";
		Temp += "var i=0;";
		Temp += "return (" + LogiTests + ");";
		Temp += "}";
		try {
			eval(Temp);
		} catch (e) {
			prompt("Search error:  " + e.description + "\r\n" + Temp, "Search error:  " + e.description + "\r\n" + Temp);

			this.test = function test(s) { return false; };
		}
		this.toString = function ToString() { return this.Find; };
	}
}

function SortSearch(r1, r2) {
	return r2.index - r1.index
}

function SearchPoss() {
	if (event.keyCode == 13) {
		HtmlSearchInput.value = HtmlSearchInput.value.replace(/[\r\n]/g, " ");
		document.getElementById("searchButton").click();
	}
}

function HighLightSearch() {
	if (event.keyCode != 13) {
		var s = "";
		//document.getElementById("contents").innerText=ShowAll(event,"\r\n",1);
		s = event.srcElement.value;
		s = s.replace(Word, "<SPAN class=does>$1</SPAN>");
		document.getElementById("SearchHighLight").innerHTML = s;
	}
}

function SearchButton() {
	if (HtmlSearchInput.value.length >= 1) {
		var TempbibleSearch = new BibleSearchf();
		TempbibleSearch.GetSearch();
		TempbibleSearch.SetupSearch();
		TempbibleSearch.DoSearch();
		HtmlSearchBox.style.display = "none";
		History.push(TempbibleSearch);
	} else {
		HtmlSearchInput.value = "help";
	}
}

class BibleSearchf {   //Propertys of a search
	constructor() {
		this.SearchType = "";
		this.RegExpOn = false;
		this.UseWholeWords = false;
		this.SearchFor = "";
		this.SearchForCpt = "";
		this.Tags = "";
		this.FoundVerses = [];
		this.NoMatches = 0;
		this.Status = 0;//0 for nothing, 1 for data collected, 2 for set up, 3 for Searched, 4 for showen
	}
	GetSearch() {
		//alert(this.GetSearch);
		//BookVal = document.all.Books[document.getElementById("Books").selectedIndex].innerText;
		this.SearchFor = HtmlSearchInput.value;
		this.RegExpOn = false;
		this.UseWholeWords = false;
		this.Tags = "";
		if (document.getElementById("RegExpSearch").checked) this.RegExpOn = true;
		if (document.getElementById("WholeWord").checked) this.UseWholeWords = true;
		if (!document.getElementById("MatchCase").checked) this.Tags = "i";
		//alert("GetSearch");
		try {
			this.SearchType = document.querySelector('input[name="SearchType"]:checked').value;
		} catch (e) {
			alert(e);
		}
		this.Status = 1;
		//alert(SearchType);
		//alert("end GetSearch");
	}
	SetupSearch() {
		//alert(this.SetupSearch);
		if (this.Status < 1) // get data if not already done
			this.GetSearch();
		//document.getElementById("BookHead").style.display = "none" //
		HtmlSearchBox.style.display = "none";
		this.SearchForCpt = this.SearchFor;
		if (this.SearchType == "Phrase") {
			if (!this.RegExpOn)
				this.SearchForCpt = this.SearchForCpt.replace(DRegExp, "\\$1");
			if (this.UseWholeWords)
				this.SearchForCpt = "\\b" + this.SearchForCpt + "\\b";
			this.SearchForCpt = new RegExp(this.SearchForCpt, tags);
		} else {
			this.SearchForCpt = new LogicalSearch(this.SearchForCpt, tags);
		}
		this.Status = 2;
		//alert("end SetupSearch");
	}
	DoSearch() {
		//alert(this.DoSearch);
		if (this.Status < 2) // set up if not already done
			this.SetupSearch();
		//alert("Got Past Create!"+SearchForCpt.test);
		this.FoundVerses = [];
		this.NoMatches = 0;
		for (Book in BibleSearch) {     //Books
			if (this.SearchForCpt.test(BibleSearch[Book].toString()) > 0) {     //Book
				//window.status = this.NoMatches + ":  " + Book;
				for (var C = 1; C < BibleSearch[Book].length; C++) {     //Chaps
					if (this.SearchForCpt.test(BibleSearch[Book][C].toString()) > 0) {
						for (var V = 0; V < BibleSearch[Book][C].length; V++) {     //Verse
							if (this.SearchForCpt.test(BibleSearch[Book][C][V].toString()) > 0) {
								//this.FoundVerses.push(new BibleRefOld(Book, C, V, BibleReftoSearchString, SearchForCpt.test(BibleSearch[Book][C][V].toString())));
								this.FoundVerses.push(new BibleRef(Book, C, V));
								this.FoundVerses[this.FoundVerses.length - 1].index = this.SearchForCpt.test(BibleSearch[Book][C][V].toString());
								this.NoMatches++;
							}
						}
					}
				}
			}
		}
		this.FoundVerses.sort(SortSearch);
		this.Status = 3;
		//alert("end DoSearch");
	}
	ShowContent() {
		//alert(this.ShowContent);
		if (this.Status < 3) // search if not already done
			this.DoSearch();
		//alert("this.ShowContent");
		window.status = this.NoMatches;
		//document.getElementById("BookNm").innerText = "Search";
		//document.getElementById("BookHedr").innerText = "Results for: '" + this.SearchFor + "'";
		//document.getElementById("ChapNo").innerText = "";
		//document.getElementById("contents").innerText = "";
		var SearchContent = document.createElement("DIV");
		for (var i = 0; i < this.FoundVerses.length; i++) {
			SearchContent.appendChild(this.FoundVerses[i].SearchElement());
		}
		//document.getElementById("contents").appendChild(SearchContent);
		ChangeContentHtml(SearchContent,"Search","Results for: '" + this.SearchFor + "'","");
		window.scrollTo(0, 0);
		//ready = false;
		this.Status = 4;
	}

}
