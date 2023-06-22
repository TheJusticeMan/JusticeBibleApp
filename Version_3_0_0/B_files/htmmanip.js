function ChekBx(id, title) {
	return '<INPUT type="checkbox" ID=' + id + '>'
		+ '<label for=' + id + ' class=checkboxspan>' + title + '</label>';
}

function Radio(id, title) {
	title = title;
	var s = '<SPAN ID=' + id + '>';
	for (var i = 0; i < title.length; i++) {
		s += '<INPUT type="radio" name="' + id + '"  id="' + title[i] + '"  value="' + title[i] + '">';
		s += '<label for="' + title[i] + '" class=radiospan>' + title[i] + '</label><br>';
	}
	s += '</SPAN>';
	return s;
}

function HtmMenu(Title, Element, MenuTitles, MenuFunctions) {
	const MenuCase = document.createElement("Div");
	const MenuTitle = document.createElement("Div");
	MenuTitle.innerText = Title;
	//const MenuCase=document.createElement("Div");
	Element.appendChild(MenuCase);
	MenuCase.appendChild(MenuTitle);
	for (var i = 0; i < MenuTitles.length; i++) {
		const para = document.createElement("Div");
		para.innerHTML = MenuTitles[i];
		para.addEventListener("click", MenuFunctions[i]);
		Element.appendChild(para);
	}

}
