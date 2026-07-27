let materials = [];

const input = document.getElementById("searchInput");
const results = document.getElementById("searchResults");


// odstranění diakritiky + malá písmena
function normalize(text){

    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

}

// odstranění diakritiky + malá písmena
function normalize(text){

    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

}


// kontrola přesné shody celého slova
function containsWord(text, search){

    return text
        .split(/\s+/)
        .some(word => word === search);

}


// zvýraznění hledaného textu
function highlight(text, search){

    if(!text) return "";

    const regex = new RegExp(
        `(${search})`,
        "gi"
    );

    return text.replace(regex, "<mark>$1</mark>");

}

// zvýraznění hledaného textu
function highlight(text, search){

    if(!text) return "";

    const regex = new RegExp(
        `(${search})`,
        "gi"
    );

    return text.replace(regex, "<mark>$1</mark>");

}



fetch("data/materials.json")
.then(response => response.json())
.then(data => {

    materials = data;

})
.catch(error => {

    console.error("Nepodařilo se načíst materials.json", error);

});



input.addEventListener("input", function(){


    const search = normalize(this.value.trim());


    results.innerHTML = "";


    if(search === ""){

        results.style.display="none";
        return;

    }


    // příliš krátké hledání
    if(search.length < 2){

        results.innerHTML=`
        <div class="result">
            Napiš alespoň 2 znaky.
        </div>
        `;

        results.style.display="block";
        return;

    }



    const found = materials.map(item=>{


        let score = 0;


        const title = normalize(item.title || "");
        const subject = normalize(item.subject || "");
        const grade = normalize(item.grade || "");
        const keywords = normalize(
            (item.keywords || []).join(" ")
        );


// Název

if(title === search){

    score += 120;

}

else if(containsWord(title, search)){

    score += 100;

}

else if(title.startsWith(search)){

    score += 70;

}

else if(title.includes(search)){

    score += 20;

}
       // Klíčová slova

const keywordList = (item.keywords || [])
    .map(word => normalize(word));


// přesné klíčové slovo
if(keywordList.includes(search)){

    score += 80;

}


// klíčové slovo začíná hledáním
else if(keywordList.some(word => word.startsWith(search))){

    score += 40;

}


// hledání uvnitř slova
else if(keywordList.some(word => word.includes(search))){

    score += 10;

}



        // Předmět
        if(subject.includes(search)){

            score += 15;

        }



        // Ročník
        if(grade.includes(search)){

            score += 10;

        }



        return {

            ...item,
            score

        };


    })


    // odstranění výsledků bez shody
    .filter(item => item.score > 0)


    // nejlepší výsledky nahoru
    .sort((a,b)=> b.score - a.score)


    // maximálně 8 výsledků
    .slice(0,8);




    if(found.length===0){

        results.innerHTML=`
        <div class="result">
            Nic nenalezeno.
        </div>
        `;

        results.style.display="block";

        return;

    }




    found.forEach(item=>{


        const div=document.createElement("div");

        div.className="result";


        let ending = "";

        if (item.interactiveTest) {

            ending = " • Interaktivní test";

        }

        else if (item.review) {

            ending = " • Opakování";

        }



        div.innerHTML=`

            <strong>
                ${highlight(item.title, search)}
            </strong>

            <small>
                ${item.subject} • ${item.grade}${ending}
            </small>

        `;



        div.onclick=function(){

            window.location.href=item.url;

        };


        results.appendChild(div);



    });



    results.style.display="block";



});



document.addEventListener("click",function(e){


    if(!e.target.closest(".search-container")){

        results.style.display="none";

    }


});
