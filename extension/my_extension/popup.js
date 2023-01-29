let defaultValues = {
	"settings": {
		"prefix": " (",
		"suffix": ")",
		"multiplier": "1" 
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

const changeSettings = (prefix, suffix, multiplier) => {
	let settings = {
		"prefix": prefix,
		"suffix": suffix,
		"multiplier": multiplier
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

document.getElementById("submit-button").addEventListener("click", async function() {
	let prefix = await document.getElementById("prefix").value;
	let suffix = await document.getElementById("suffix").value;
	let multiplier = await document.getElementById("multiplier").value;

	changeSettings(prefix, suffix, multiplier);
});

document.getElementById("default-button").addEventListener("click", async function() {
	let prefix = " (";
	let suffix = ")";
	let multiplier = "1";

	changeSettings(prefix, suffix, multiplier);
});
