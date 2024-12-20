const params = new URLSearchParams(window.location.search);
var page = params.has("page") ? parseInt(params.get("page")) : 0;
page = page < 0 ? 0 : page;

function loadArticles(){
    let a = document.getElementById("articles");

    fetch("https://infodb.eukon05.ovh/api/v1/articles/latest?page=" + page)
    .then(response => response.json())
    .then(data => {;
        console.log(data);
        for(var index in data){
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
    })
}

function openUrl(url){
    location.href = url;
}

function placeButtons(){
    let btnDiv = document.getElementById("buttons");

    let btnPrev = document.createElement("button");
    btnPrev.className="button";
    btnPrev.textContent = "<";
    btnPrev.onclick = openUrl.bind(this, "index.html?page=" + (page - 1));

    btnDiv.appendChild(btnPrev);

    let btnNext = document.createElement("button");
    btnNext.className="button";
    btnNext.textContent = ">";
    btnNext.onclick = openUrl.bind(this, "index.html?page=" + (page + 1));

    btnDiv.appendChild(btnNext);

    if(page <= 0){
        btnPrev.disabled = true;
    }
}