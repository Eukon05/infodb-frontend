const params = new URLSearchParams(window.location.search);
var page = params.has("page") ? parseInt(params.get("page")) : 0;
page = page < 0 ? 0 : page;

let btnPrev;
let btnNext;
let search;
let a;
let originAll;
const homeUrl = window.location.origin + window.location.pathname;

let reqBody = {
    title: params.has("title") ? params.get("title") : null,
    origin: params.has("origin") ? params.get("origin") : null,
    dateFrom: params.has("dateFrom") ? params.get("dateFrom") : null,
    dateTo: params.has("dateTo") ? params.get("dateTo") : null,
    tags: params.has("tags") ? params.get("tags").split(",") : null
};

function setup(){
    a = document.getElementById("articles");
    btnPrev = document.getElementById("btnPrev");
    btnNext = document.getElementById("btnNext");
    search = document.getElementById("search");
    originAll = document.getElementById("originAll");

    btnPrev.onclick = function(){
        page--;
        loadArticles();
    };

    btnNext.onclick = function(){
        page++;
        loadArticles();
    };

    search.addEventListener("keyup", function (event) {
        if (event.key == "Enter") {
            if(search.value == "")
                reqBody.title = null;
            else
                reqBody.title = search.value;

            page = 0;
            loadArticles();
        }
    });

    originAll.onclick = function(){
        if(originAll.checked){
            reqBody.origin = null;
            page = 0;
            loadArticles();
        }
    }

    if(reqBody.title != null)
        search.value = params.get("title");
}

function loadOrigins(){
    originAll.checked = true;

    fetch("https://infodb.eukon05.ovh/api/v1/sources")
    .then(response => response.json())
    .then(data => {
        let origins = document.getElementById("origins");
        for (var index in data) {
            let origin = document.createElement("input");
            let label = document.createElement("label");

            origin.type = "radio";
            origin.name = "origin";
            origin.id = "origin" + data[index].name
            origin.value = data[index].name;

            label.className = "originLabel";
            label.textContent = data[index].name;

            origin.onclick = function(){
                if(origin.checked){
                    reqBody.origin = origin.value;
                    page = 0;
                    loadArticles();
                }
            }

            if(reqBody.origin == data[index].name)
                origin.checked = true;
            
            origins.appendChild(origin);
            origins.appendChild(label);
        }
    });
}

function loadArticles(){
    a.innerHTML = "";

    if(page == 0)
        btnPrev.disabled = true;
    else
        btnPrev.disabled = false

    btnNext.disabled = false;

    fetch("https://infodb.eukon05.ovh/api/v1/articles?page=" + page, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(reqBody)
    })
    .then(response => response.json())
    .then(data => {
        if(data.length == 0){
            btnNext.disabled = true;
            return;
        }

        for (var index in data) {
            let article = document.createElement("div");
            article.className = "article";

            let img = document.createElement("img");
            img.setAttribute("src", data[index].imageUrl);
            article.appendChild(img);

            let title = document.createElement("h5");
            title.textContent = data[index].title;

            article.onclick = openUrl.bind(this, data[index].url);

            article.appendChild(title);
            a.appendChild(article);
        }
    });
}

function openUrl(url){
    location.href = url;
}