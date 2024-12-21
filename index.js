const params = new URLSearchParams(window.location.search);
var page = params.has("page") ? parseInt(params.get("page")) : 0;
page = page < 0 ? 0 : page;

let btnPrev;
let btnNext;
let search;
let a;

function setup(){
    a = document.getElementById("articles");
    btnPrev = document.getElementById("btnPrev");
    btnNext = document.getElementById("btnNext");
    search = document.getElementById("search");

    btnPrev.onclick = function(){
        page--;
        loadArticles();
    };

    btnNext.onclick = function(){
        page++;
        loadArticles();
    };

    search.addEventListener("keyup", function (event) {
        if (event.code == "Enter") {
            if(search.value == "")
                openUrl("/");
            else
                openUrl("/?title=" + search.value);
        }
    });

    if(params.has("title"))
        search.value = params.get("title");
}

function loadArticles(){
    a.innerHTML = "";

    if(page == 0)
        btnPrev.disabled = true;
    else
        btnPrev.disabled = false

    btnNext.disabled = false;

    let body = {
        title: params.has("title") ? params.get("title") : null,
        origin: params.has("origin") ? params.get("origin") : null,
        dateFrom: params.has("dateFrom") ? params.get("dateFrom") : null,
        dateTo: params.has("dateTo") ? params.get("dateTo") : null,
        tags: params.has("tags") ? params.get("tags").split(",") : null
    };

    fetch("https://infodb.eukon05.ovh/api/v1/articles?page=" + page, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
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