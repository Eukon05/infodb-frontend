const params = new URLSearchParams(window.location.search);

function loadArticles(){
    let a = document.getElementById("articles");

    let page = params.has("page") ? params.get("page") : 0;

    fetch("http://localhost:8080/api/v1/articles/latest?page=" + page)
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