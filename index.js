const params = new URLSearchParams(window.location.search);
var page = params.has("page") ? parseInt(params.get("page")) : 0;
page = page < 0 ? 0 : page;

let btnPrev;
let btnNext;
let search;
let a;
let originAll;
let dateFrom;
let dateTo;
let submit;
const homeUrl = window.location.origin + window.location.pathname;

let reqBody = {
    title: params.has("title") ? params.get("title") : null,
    origins: params.has("origins") ? params.get("origins") : null,
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
    submit = document.getElementById("submit");

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
        let checkboxes = document.getElementsByName("origin");
        if(originAll.checked){
            reqBody.origins = null;
            checkboxes.forEach(t => {
                t.disabled = true;
                t.checked = false;
            })
        }
        else {
            reqBody.origins = [];
            checkboxes.forEach(t => {
                t.disabled = false;
                t.checked = true;
                reqBody.origins.push(t.value);
            })
        }
        submit.disabled = false;
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
        reqBody.origins = [];

        for (var index in data) {
            let origin = document.createElement("input");
            let label = document.createElement("label");

            origin.type = "checkbox";
            origin.name = "origin";
            origin.value = data[index].name;
            origin.disabled = true;

            label.className = "originLabel";
            label.textContent = origin.value;

            origin.onclick = function(){
                if(origin.checked){
                    reqBody.origins.push(origin.value);
                }
                else{
                    reqBody.origins.splice(reqBody.origins.indexOf(origin.value), 1)
                }
                submit.disabled = false;
            }

            if(reqBody.origins.includes(origin.value))
                origin.checked = true;
            
            origins.appendChild(origin);
            origins.appendChild(label);

            reqBody.origins.push(origin.value);
        }
    });
}

function loadArticles(){
    a.innerHTML = "";
    submit.disabled = true;

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