const NASA_API_KEY = "DEMO_KEY";
const LIBRARY_QUERIES = ["nebula", "galaxy", "supernova", "mars", "black hole", "aurora"];

// bg switcher: block w apod w library
const bgLayer = document.getElementById("bg-layer");
const infoText = document.getElementById("info-text");
const modeBtns = document.querySelectorAll(".mode-btn");

function setActiveButton(mode)
{
	modeBtns.forEach(function (btn)
	{
		btn.classList.toggle("active", btn.dataset.mode === mode);
	});
}

function applyBlock()
{
	bgLayer.style.backgroundImage = "none";
	infoText.textContent = "MODE: BLOCK — NO SOURCE DATA";
}

async function applyApod()
{
	infoText.textContent = "MODE: APOD — LOADING...";

	// cache per day, not hammering nasa's servers
	const today = new Date().toISOString().slice(0, 10);
	const cacheKey = "ctrlt-apod-cache";
	const cached = JSON.parse(localStorage.getItem(cacheKey) || "null");

	if (cached && cached.date === today)
	{
		renderApod(cached.data);
		return;
	}

	try
	{
		const res = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`);
		if (!res.ok) throw new Error("apod fetch failed");
		const data = await res.json();
		localStorage.setItem(cacheKey, JSON.stringify({ date: today, data: data }));
		renderApod(data);
	}
	catch (err)
	{
		infoText.textContent = "MODE: APOD — FETCH FAILED, FALLING BACK TO BLOCK";
		applyBlock();
		setActiveButton("block");
	}
}

function renderApod(data)
{
	// apod's sometimes a video, bail to block
	if (data.media_type !== "image")
	{
		infoText.textContent = `MODE: APOD — TODAY IS A VIDEO (${data.title.toUpperCase()}), NO IMAGE`;
		applyBlock();
		setActiveButton("block");
		return;
	}

	bgLayer.style.backgroundImage = `url(${data.hdurl || data.url})`;
	infoText.textContent = `MODE: APOD — ${data.title.toUpperCase()} (${data.date})`;
}

async function applyLibrary()
{
	infoText.textContent = "MODE: NASA.LIB — LOADING...";

	const query = LIBRARY_QUERIES[Math.floor(Math.random() * LIBRARY_QUERIES.length)];

	try
	{
		const res = await fetch(`https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}&media_type=image`);
		if (!res.ok) throw new Error("library fetch failed");
		const data = await res.json();

		const items = data.collection.items.filter(function (item)
		{
			return item.links && item.links[0] && item.links[0].href;
		});

		if (items.length === 0) throw new Error("no results");

		const pick = items[Math.floor(Math.random() * items.length)];
		const title = (pick.data && pick.data[0] && pick.data[0].title) || query.toUpperCase();

		bgLayer.style.backgroundImage = `url(${pick.links[0].href})`;
		infoText.textContent = `MODE: NASA.LIB — "${title.toUpperCase()}" (QUERY: ${query.toUpperCase()})`;
	}
	catch (err)
	{
		infoText.textContent = "MODE: NASA.LIB — FETCH FAILED, FALLING BACK TO BLOCK";
		applyBlock();
		setActiveButton("block");
	}
}

function setMode(mode)
{
	setActiveButton(mode);
	localStorage.setItem("ctrlt-mode", mode);

	if (mode === "block") applyBlock();
	else if (mode === "apod") applyApod();
	else if (mode === "library") applyLibrary();
}

modeBtns.forEach(function (btn)
{
	btn.addEventListener("click", function ()
	{
		setMode(btn.dataset.mode);
	});
});

// restore last mode, default block
const savedMode = localStorage.getItem("ctrlt-mode") || "block";
setMode(savedMode);