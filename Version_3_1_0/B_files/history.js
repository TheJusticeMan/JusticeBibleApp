var History = new Object();
var CurrentHistoryItem
History.length = 0;
History.pop = function popHistoryItem(num) {
	if (this.length != num) {
		this.length -= num;
		this[this.length - 1].ShowContent();
		CurrentHistoryItem = this[this.length - 1]
	}
}
History.push = function pushHistoryItem(object) {
	this[this.length] = object;
	this[this.length].ShowContent();
	CurrentHistoryItem = this[this.length]
	this.length++;
}
function ShowHistory() {
	var HistoryList = document.createElement("DIV");
	var Cbible = {};
	for (var i = 0; i < History.length; i++) {
		Cbible = document.createElement("span");
		Cbible.className = "SearchResult";
		Cbible.dataset.HistorySlot = i;  //store some values in the HTML DOM for recall by event handlers
		Cbible.onclick = GoToThisHistory;
		Cbible.innerHTML = History[i].HistoryText();
		HistoryList.appendChild(Cbible);
	}
	ChangeContentHtml(HistoryList, "History", "", "");
	closeNav();
}
function GoToThisHistory(event) {
	var a = event.currentTarget.dataset.HistorySlot;
	History.length = a;
	History[History.length].ShowContent();
	CurrentHistoryItem = History[History.length]
	this.length++;
	//History[a]=
}