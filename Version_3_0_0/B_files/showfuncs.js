class BibleRef {   //Referance to a bible passage
	constructor(Book, Chap, Verse) {
		this.Book = Book;
		this.Chap = Chap;
		this.Verse = Verse;
	}
	WholeChapElement() {   //cast the whole Chapter as a HTML Element
		var Cbible = document.createElement("div");
		Cbible.dataset.Book = this.Book;
		Cbible.dataset.Chap = this.Chap;
		var Cverse;
		for (var i = 0; i < Bible[this.Book][this.Chap].length; i++) {
			Cverse = new BibleRef(this.Book, this.Chap, i);
			Cbible.appendChild(Cverse.Element());
		}
		return Cbible;
	}
	Element() {   //cast as a HTML Element
		var Cbible = document.createElement("p");
		Cbible.className = "Contents";
		Cbible.dataset.Book = this.Book;  //store some values in the HTML DOM for recall by event handlers
		Cbible.dataset.Chap = this.Chap;
		Cbible.dataset.Verse = this.Verse;
		Cbible.oncontextmenu = ShowThisVerseMenu;
		Cbible.innerHTML = "<SPAN class=VerseNum>" + (this.Verse + 1) + "</SPAN> " + fixItal(Bible[this.Book][this.Chap][this.Verse]);
		return Cbible;
	}
	SearchElement() {   //cast as a HTML search Element
		var Cbible = document.createElement("span");
		Cbible.className = "SearchResult";
		Cbible.dataset.Book = this.Book;  //store some values in the HTML DOM for recall by event handlers
		Cbible.dataset.Chap = this.Chap;
		Cbible.dataset.Verse = this.Verse;
		Cbible.oncontextmenu = ShowThisVerseMenu;
		Cbible.onclick = GoToThisVerse;
		Cbible.innerHTML = "<SPAN class=VerseNum>" + this.Book + " : " + this.Chap + ":" + (this.Verse + 1) + "</SPAN>  " + fixItal(Bible[this.Book][this.Chap][this.Verse]);
		return Cbible;
	}
	SingleVerseText() {   //cast as Text
		return (Bible[Book][Chap][Verse].replace(/[\]\[]/g, "") + " (" + Book + "  " + (Chap) + ":" + (Verse + 1) + ", KJV)");
	}
	VerseText() {   //cast as Text
		return ((Verse + 1) + Bible[Book][Chap][Verse].replace(/[\]\[]/g, ""));
	}
	WholeChapText() {   //cast whole Chapter as Text
		var Cbible = "";
		for (var i = 0; i < Bible[this.Book][this.Chap].length; i++) {
			Cbible += ((Verse + 1) + Bible[Book][Chap][Verse].replace(/[\]\[]/g, "")) + "";
		}
		return Cbible;
	}
};


function GoToThisVerse(event) {
	var Book = event.currentTarget.dataset.Book;
	var Chap = event.currentTarget.dataset.Chap * 1;
	var Verse = event.currentTarget.dataset.Verse * 1;
	GoToVerse(Book, Chap, Verse);
}

function ShowThisVerseMenu(event) {  //****
	var Book = event.currentTarget.dataset.Book;
	var Chap = event.currentTarget.dataset.Chap * 1;
	var Verse = event.currentTarget.dataset.Verse * 1;
	ShowVerseMenu(Book, Chap, Verse);
	event.returnValue = false;
}


function fixItal(_string) {
	return (_string.replace(/\[/g, "<em>").replace(/\]/g, "</em>"))
}

function ShowVerseMenu(Book, Chap, Verse) {
	var theVerse = new BibleRef(Book, Chap, Verse);
	var s = "";
	openNav();
	var TheVerse = document.createElement("div");
	TheVerse.className = "BibleContents";
	TheVerse.appendChild(theVerse.Element());
	TheVerse.innerHTML += "<span class=BibleReference>" + Book + ":" + Verse + ":" + Chap + "</span>";
	s += "<a href='#' onclick='return CopyVerse(" + ['"' + Book + '"', Chap, Verse] + ")'>Copy verse</a>";
	s += "<a href='#' onclick='return FindSimilar(" + ['"' + Book + '"', Chap, Verse] + ")'>Find similar</a>";
	s += "<a href='#' onclick='return ShareVerse(" + ['"' + Book + '"', Chap, Verse] + ")'>Share</a>";
	s += "<a href='#' onclick='return addBookmark(" + ['"' + Book + '"', Chap, Verse] + ")'>Add bookmark</a>";
	HtmlOverlayMenu.appendChild(TheVerse);
	HtmlOverlayMenu.innerHTML += s;
}




class HistoryPlace {
	constructor(Book, Chap, Verse) {
		this.Book = Book || "GENESIS";
		this.Chap = Chap || 1;
		this.Verse = Verse || 0;
		this.length = Bible[this.Book][this.Chap].length;
		//this.toString = ChapToHtmString;
	}
	ShowContent() {
		//alert("It worked!");
		var s = "";
		for (var i = 1; i < Bible[this.Book].length; i++) {
			s += "<OPTION>" + i + "</OPTION>";
		}
		HtmlChapSelector.innerHTML = s;
		s = "";
		for (var i = 0; i < Bible[this.Book][this.Chap].length; i++) {
			s += "<OPTION>" + (i + 1) + "</OPTION>";
		}
		HtmlVerseSelector.innerHTML = s;
		HtmlVerseSelector.selectedIndex = this.Verse;
		HtmlBookSelector.selectedIndex = booksOfTheBible[this.Book];
		HtmlChapSelector.selectedIndex = this.Chap - 1;
		var CurrentBibleChap = new BibleRef(this.Book, this.Chap, this.Verse);

		if (this.Chap == 1) {
			ChangeContentHtml(CurrentBibleChap.WholeChapElement(), this.Book, Bible[this.Book][0], "CHAPTER " + (this.Chap));
		} else {
			ChangeContentHtml(CurrentBibleChap.WholeChapElement(), "", "", "CHAPTER " + (this.Chap));
		}
		HtmlSearchBox.style.display = "none";
		if (this.Verse != 0) {
			window.scrollTo(0, HtmlContent.children[this.Verse].offsetTop - 100);
		} else {
			window.scrollTo(0, 0);
		}
		localStorage.Book = this.Book;
		localStorage.Chap = this.Chap;
		localStorage.Verse = this.Verse;
		HtmlBookSelector.onchange = HtmlBookSet;
		HtmlChapSelector.onchange = HtmlChapSet;
		HtmlVerseSelector.onchange = HtmlVerseSet;
	}
	HistoryElement() {
		var CurrentBible = new BibleRef(this.Book, this.Chap, this.Verse);
		return CurrentBible.SearchElement();
	}
};

function ChangeContentHtml(Content, Header1, Header2, Header3) {
	HtmlH1.innerText = Header1;
	HtmlH2.innerText = Header2;
	HtmlH3.innerText = Header3;
	HtmlContent.innerText = "";
	HtmlContent.appendChild(Content);
}


function ShowMenu() {
	var s = "";
	openNav();
	s += "<a href='#' onclick='return ShowSearchBox();'>Search</a>";
	s += "<a href='#' onclick='return ShowBookmarks();'>Show bookmarks</a>";
	HtmlOverlayMenu.innerHTML = s;
}

function ShowBookmarks() {
	var SearchContent = document.createElement("DIV");
	for (var i = 0; i < this.Bookmarks.length; i++) {
		SearchContent.appendChild(this.Bookmarks[i].Element());
	}
	//document.getElementById("contents").appendChild(SearchContent);
	ChangeContentHtml(SearchContent, "Bookmarks", "", "");
	closeNav();
}

function ShowSearchBox() {
	HtmlSearchBox.style.display = "";
	closeNav();
}


async function ShareVerse(Book, Chap, Verse) {
	try {
		await navigator.share({
			text: (Bible[Book][Chap][Verse].replace(/[\]\[]/g, "") + " (" + Book + "  " + (Chap) + ":" + (Verse + 1) + ", KJV)"),
		})
	} catch (err) {
	}
	closeNav();
}

function addBookmark(Book, Chap, Verse) {
	Bookmarks.push(new Bookmark(Book, Chap, Verse));
	closeNav();
}

function CopyVerse(Book, Chap, Verse) {
	navigator.clipboard.writeText(Bible[Book][Chap][Verse].replace(/[\]\[]/g, "") + " (" + Book + "  " + (Chap) + ":" + (Verse + 1) + ", KJV)");
	closeNav();
}

function openNav() {
	HtmlNavOverlay.style.height = "100%";
}

function closeNav() {
	HtmlOverlayMenu.innerHTML = "";
	HtmlNavOverlay.style.height = "0%";
} 
