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
