// General
const defaultMenu = document.getElementById('menu1');
var hover = 0;
const allMenus = [];


//Create menus
cmt('default menu');
menuStart('menu1',"all");
addButton('parent',0,'add','add')
addButton('Delete',0,'trash');
addButton('undo','console.log("undo")','sm');
addButton('download',0,'sm');
addButton('save',0,'add','save');

cmt('test menu');
menuStart('menu2',"img");
addButton('parent',0,'add','add')
addButton('M2',0,'trash');
addButton('undo','console.log("undo")','sm');
addButton('download',0,'sm');
addButton('save',0,'add','save');


//functions
function menuStart(name,selector) {
    const element = document.createElement('div');
    element.id = name;
    element.className = "menu";
    allMenus.push([element,selector]);
    document.querySelector('contextMenu').appendChild(element);
}

function addButton(txt,onclick,icon,parent){
    const element = document.createElement('button');
    icon != undefined && (element.classList.add("ico"),element.style.setProperty('--icon', 'url(menu-ico/' + icon +'.png)'));
    icon == 'sm' && element.style.setProperty('--icon', 'url(menu-ico/' + txt +'.png)');
    parent != undefined && (element.classList.add("parent"), element.id = "ctm_" + parent);
    element.innerText=txt;
    element.onclick = new Function(onclick);
    document.querySelector('contextMenu').lastChild.appendChild(element);
}

function cmt (txt) {
    document.querySelector('contextMenu').appendChild(document.createComment(txt));
}


//Listeners
addEventListener('contextmenu', e => {
    // prevent default menu
    e.preventDefault();
    // menu setup
    try{menu.style.pointerEvents="none";} catch{}
    const element = document.elementFromPoint(e.clientX, e.clientY).nodeName; //Element type
    try{menu.classList.remove('open');} catch{}
    menu = allMenus.find(newMenu=> newMenu[1] == 'all')[0]; //Default menu
    const index = allMenus.find(newMenu=> newMenu[1].toUpperCase() == element.toUpperCase()); //Menu not... Default?
    index != undefined && (menu = index[0]); //Set menu if not defualt
    menu.style.pointerEvents='';
    console.log(element);
    menu.classList.add('open');
    // menu position
    // let x = e.clientX + menu.clientWidth > window.innerWidth ? e.clientX - menu.clientWidth : e.clientX;
    let x = e.clientX + menu.clientWidth > window.innerWidth ? window.innerWidth - menu.clientWidth : e.clientX;
    // let y = e.clientY + menu.clientHeight > window.innerHeight ? e.clientY - menu.clientHeight : e.clientY;
    let y = e.clientY + menu.clientHeight > window.innerHeight ? window.innerHeight - menu.clientHeight : e.clientY;
    menu.style.left = x + "px";
    menu.style.top = y + "px";
})

// click in menu
addEventListener('click', function(){
    if (hover != 2 && menu.matches('.open')) {
        menu.classList.remove('open');
    }
})

// click outside of menu
addEventListener('mousedown', function(){
    try{
        if (hover == 0 && menu.matches('.open')) {
            menu.classList.remove('open');
            document.querySelector('html').style.pointerEvents='none';
            menu.style.pointerEvents='all';
        }
    } catch{console.log('ignore md')}
})

addEventListener('mouseup', function(){
    if (window.getComputedStyle(document.querySelector('html')).getPropertyValue("pointer-events") == 'none') {
        document.querySelector('html').style.pointerEvents='';
    }
})

addEventListener('transitionend', e => {
    const obj = e.target;
    const op = getComputedStyle(obj).opacity;
    if (op == 0){
        obj.style.left = '-1000px';
    }
})


//Hover detection
// Enter menu
for (var i = 0; i < allMenus.length; i++){
    allMenus[i][0].addEventListener('mouseenter', function() {
        // hover != 1 && console.log('enter');
        hover = 1;
    })
}

// Hover over menu
{
    const elements = document.getElementsByClassName('parent');
    for (var i = 0; i < elements.length; i++){
        elements[i].addEventListener('mouseleave', function() {
            // hover != 1 && console.log('hover menu');
            hover = 1;
        })
    }
}

// Hover over sub menu parent
{
    const elements = document.getElementsByClassName('parent');
    for (var i = 0; i < elements.length; i++){
        elements[i].addEventListener('mouseenter', function() {
            // hover != 2 && console.log('hover parent');
            hover = 2;
        })
    }
}

// leave menu
for (var i = 0; i < allMenus.length; i++){
    allMenus[i].onmouseleave = function() {
        // hover != 0 && console.log('leave');
        hover = 0;
    }
}

addEventListener('wheel', function(){
    if (hover == 0){
        menu.classList.remove('open');
        // Hover Guard
        hover != 0 && console.log('leave');
        hover = 0;
    }
})

setInterval(test,250)

function test() {
    document.getElementById('box').innerHTML=hover;
}