class BibleRefOld {
	constructor(Book, Chap, Verse, Fng, index) {
		this.Book = Book || "GENESIS";
		this.Chap = Chap || 1;
		if (arguments.length < 3) {
			this.toString = ChapToHtmString;
			this.length = Bible[this.Book][this.Chap].length;
			this.ShowContent = function () {
				BookVal = this.Book;
				ChapVal = this.Chap;
			};
		} else {
			this.Verse = Verse || 0;
			this.toString = Fng;
			this.index = index || 1;
			this.ShowContent = function () {
				document.all.contents.innerHTML = this.toString();
			};
		}
	}
}

class BibleRef {
	constructor(Book, Chap, Verse) {
		this.Book = Book || "GENESIS";
		this.Chap = Chap || 1;
		this.Verse = Verse || 0;
	}
	toString() {
		return "<p id=verse class=Contents oncontextmenu='return ShowVerseMenu(" + ['"' + this.Book + '"', this.Chap, this.Verse] + ")'><SPAN class=VerseNum>" + (this.Verse + 1) + "</SPAN> " + fixItal(Bible[this.Book][this.Chap][this.Verse]) + "</p>";
	}
}

class BibleRefShowSearch {
	constructor(Book, Chap, Verse,	Index) {
		this.Book = Book || "GENESIS";
		this.Chap = Chap || 1;
		this.Verse = Verse || 0;
		this.Index = Index || 0;
	}
	toString() {
		return "<span class=SearchResult cite='#verse" + this.Verse + "' oncontextmenu='return ShowVerseMenu(" + ['"' + this.Book + '"', this.Chap, this.Verse] + ")' onclick='return GoToVerse(" + ['"' + this.Book + '"', this.Chap, this.Verse] + ")'><SPAN class=VerseNum>" + this.Book + " : " + this.Chap + ":" + (this.Verse + 1) + "</SPAN>  " + fixItal(Bible[this.Book][this.Chap][this.Verse]) + "</span>";
	}
}

class BibleChapRef {
	constructor(Book, Chap, Verse) {
		this.Book = Book || "GENESIS";
		this.Chap = Chap || 1;
		this.Verse = Verse || 0;
	}
	toString() {
		var aArray = [];
		for (var i = 0; i < Bible[this.Book][this.Chap].length; i++) {
			aArray[i] = new BibleRef(this.Book, this.Chap, i);
		}
		return aArray.join("");
	}
}


function fixItal(_string) {
	return (_string.replace(/\[/g, "<em>").replace(/\]/g, "</em>"))
}


function BibleReftoSearchString() {
	return "<span class=SearchResult cite='#verse" + this.Verse + "' oncontextmenu='return ShowVerseMenu(" + ['"' + this.Book + '"', this.Chap, this.Verse] + ")' onclick='return GoToVerse(" + ['"' + this.Book + '"', this.Chap, this.Verse] + ")'><SPAN class=VerseNum>" + this.Book + " : " + this.Chap + ":" + (this.Verse + 1) + "</SPAN><br>" + fixItal(Bible[this.Book][this.Chap][this.Verse]) + "</span>";
}

function BibleReftoHtmlString() {
	return "<p id=verse class=Contents data-place=" + [ this.Book , this.Chap, this.Verse] + " oncontextmenu='return ShowVerseMenu(" + ['"' + this.Book + '"', this.Chap, this.Verse] + ")'><SPAN class=VerseNum>" + (this.Verse + 1) + "</SPAN> " + fixItal(Bible[this.Book][this.Chap][this.Verse]) + "</p>";
}



function ChapToHtmString() {
	var aArray = [];
	for (var i = 0; i < this.length; i++) {
		aArray[i] = new BibleRefOld(this.Book, this.Chap, i, BibleReftoHtmlString);
	}
	return aArray.join("");
}

function ShowVerseMenu(Book, Chap, Verse) {

	//alert(event.currentTarget.dataset);
	var theVerse = new BibleRefOld(Book, Chap, Verse, BibleReftoHtmlString);
	var s = "";
	openNav();
	s += "<DIV class=BibleContents>" + theVerse.toString() + "<span class=BibleReference>" + Book + ":" + Verse + ":" + Chap + "</span></DIV>";
	s += "<a href='#' onclick='return CopyVerse(" + ['"' + Book + '"', Chap, Verse] + ")'>Copy verse</a>";
	s += "<a href='#' onclick='return FindSimilar(" + ['"' + Book + '"', Chap, Verse] + ")'>Find similar</a>";
	s += "<a href='#' onclick='return ShareVerse(" + ['"' + Book + '"', Chap, Verse] + ")'>Share</a>";
	s += "<a href='#' onclick='return addBookmark(" + ['"' + Book + '"', Chap, Verse] + ")'>Add bookmark</a>";
	document.getElementById("VerseMenu").innerHTML = s;
	event.returnValue = false;
}

function ShowMenu() {
	var s = "";
	openNav();
	s += "<a href='#' onclick='return ShowSearchBox();'>Search</a>";
	s += "<a href='#' onclick='return ShowBookmarks();'>Show bookmarks</a>";
	document.getElementById("VerseMenu").innerHTML = s;
}

function ShowBookmarks(){
	ChangeContent(Bookmarks.join(""),"","","");
	closeNav();
}

function ShowSearchBox(){
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
	document.getElementById("myNav").style.height = "100%";
}

function closeNav() {
	document.getElementById("VerseMenu").innerHTML = "";
	document.getElementById("myNav").style.height = "0%";
} 
