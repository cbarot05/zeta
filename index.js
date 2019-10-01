const input = document.querySelector('.tag-container input')
const tagContainer = document.querySelector('.tag-container');
const countires = document.querySelector('.countries');
const select = document.querySelector('#select');
let tags = [];
let allCountries= [];

// getting countries from URL
function getCountries(callback){
    let xhr = new XMLHttpRequest();
    xhr.open('GET','https://restcountries.eu/rest/v2/all', true);
    xhr.onload = function(){
        if(this.status == 200){
            allCountries = JSON.parse(this.responseText);
        } else{
            alert('error getting data from URL- https://restcountries.eu/rest/v2/all');
        }
    }
    xhr.send();
    setTimeout(function(){
        callback();
    },1000)
};
getCountries(loadCountries);

// load countries from URL
function loadCountries(){
    for(let i=0; i < allCountries.length; i++){
        let opt = document.createElement('div');
        opt.setAttribute('class', 'list');
        opt.setAttribute('id', 'list-'+allCountries[i].alpha3Code);
        let cName = document.createElement('span');
        opt.setAttribute('data-code', allCountries[i].alpha3Code)
        cName.innerHTML = allCountries[i].name;
        opt.innerHTML =  ': '+ allCountries[i].alpha3Code;
        opt.prepend(cName);
        select.appendChild(opt);
        cName.style.fontWeight = 'bold';
    }
}

// creating a new tag
function createTag(name){
    let div = document.createElement('div');
    div.setAttribute('class', 'tag');
    let span = document.createElement('span');
    span.innerHTML = name;
    let close = document.createElement('i');
    close.setAttribute('class', 'material-icons close');
    close.setAttribute('data-name', name);
    close.innerHTML = 'close';

    div.appendChild(span);
    div.appendChild(close);
    return div;
}

function resetTags(){
    document.querySelectorAll('.tag').forEach(function(tag){
        tag.parentElement.removeChild(tag);
    });
}

// adding tags
function addTag(){
    resetTags();
    tags.slice().reverse().forEach(function(tag){
        const inputTag = createTag(tag);
        tagContainer.prepend(inputTag);
    })
}

// input box keyup event
input.addEventListener('keyup', function(e){
    select.style.display = 'block';
    let filter = input.value.toUpperCase();
    let list = document.getElementsByClassName("list");
    for (let i = 0; i < list.length; i++) {
        if (document.getElementsByClassName('list')[i].innerText.toUpperCase().indexOf(filter) > -1) {
            list[i].style.display = '';
        } else {
            list[i].style.display = 'none';
        }
    }
    if(input.value === ""){
        select.style.display = 'none';
    }
    if(e.keyCode === 8 && input.value === ""){
        tags.pop();
        addTag();
        countires.innerText= 'Countries: '+JSON.stringify(allCountries.filter(function(cou){
            return tags.indexOf(cou.alpha3Code) !== -1;
        }));
    }
})

document.addEventListener('click', function(e){
    if(e.target.tagName === 'I'){
        const value = e.target.getAttribute('data-name');
        tags = tags.filter(function(tag){
            return tag !== value;
        });
        addTag();
        countires.innerText= 'Countries: '+JSON.stringify(allCountries.filter(function(cou){
            return tags.indexOf(cou.alpha3Code) !== -1;
        }));
    }
});
setTimeout(function(){
    const list = document.querySelector('#select');
    list.addEventListener('click', function(e){
        const code = e.target.parentElement.getAttribute('data-code');
        if(code !== null){
            if(tags.indexOf(code) == -1){
                tags.push(code);
            }
        } else {
            const code = e.target.getAttribute('data-code');
            if(tags.indexOf(code) == -1){
                tags.push(code);
            }
        }
        addTag();
        countires.innerText= 'Countries: '+JSON.stringify(allCountries.filter(function(cou){
            return tags.indexOf(cou.alpha3Code) !== -1;
        }));
        input.value = '';
        let innerList = document.getElementsByClassName("list");
        for (let i = 0; i < innerList.length; i++) {
            innerList[i].style.display = 'block';
        }
        list.style.display = 'none';
        input.focus();
    })
},1000);
