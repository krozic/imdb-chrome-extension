let defaultValues = {
	"settings": {
		"prefix": " (",
		"suffix": ")",
		"multiplier": "1",
		"decimals": "0" 
	}
}

chrome.storage.sync.get(Object.keys(defaultValues), function(items) {
	if(Object.keys(items).length === 0 && items.constructor === Object) {
		chrome.storage.sync.set(defaultValues);
	}
});

const fetchSettings = () => {
		return new Promise((resolve) => {
				chrome.storage.sync.get(["settings"], (obj) => {
						resolve(obj["settings"])
				})
		})
}

const changeSettings = (prefix, suffix, multiplier, decimals) => {
	let settings = {
		"prefix": prefix,
		"suffix": suffix,
		"multiplier": multiplier,
		"decimals": decimals
	}

	chrome.storage.sync.set({
		"settings": settings
	}, function() {
		console.log("loaded settings")
	})

	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.reload(tabs[0].id);
	});
}

let settings = await fetchSettings();
document.getElementById("prefix").value = settings["prefix"];
document.getElementById("suffix").value = settings["suffix"];
document.getElementById("multiplier").value = settings["multiplier"];
document.getElementById("decimals").value = settings["decimals"];

document.getElementById("submit-button").addEventListener("click", async function() {
	let prefix = await document.getElementById("prefix").value;
	let suffix = await document.getElementById("suffix").value;
	let multiplier = await document.getElementById("multiplier").value;
	let decimals = await document.getElementById("decimals").value;

	changeSettings(prefix, suffix, multiplier, decimals);
});

document.getElementById("default-button").addEventListener("click", async function() {
	let prefix = " (";
	let suffix = ")";
	let multiplier = "1";
	let decimals= "0";

	changeSettings(prefix, suffix, multiplier, decimals);
});
