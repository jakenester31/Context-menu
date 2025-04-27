// General
const allMenus = [];
var hover = 0;
const ms = [0,0];
var defaultMenu;
const settings = {state:1};
const openChildren = [];

//Create menus
cmt('default menu');
menuStart("all");
addButton('Delete',0,'trash');
addButton('parent',0,'add','add');
addButton('undo','console.log("undo")','sm');
addButton('download',0,'sm');
addButton('save',0,'add');

cmt('test menu');
menuStart("img");
addButton('M2',0,'add','add')
addButton('M2',0,'trash');
addButton('download',0,'sm');
addButton('save',0,'add');

menuStart('#add');
addButton('save',0,'add');


//functions

// menu creation functions
function menuStart(...selector) {
    const element = document.createElement('div');
    const sel = [];
    for (var i = 0; i < selector.length; i++){
        if (selector[i][0] == '#'){
            sel.splice(i,1);
            const tn = selector[i].slice(1);
            const index = allMenus.find(e => 
                e => e.classList.indexOf('ctm_' + tn) > -1
            )
            if (index != undefined){
                element.id = 'ctmc_' + tn;
            }
        } else {
            sel.push(selector[i]);
        }
    }
    element.className = "menu";
    allMenus.push([element,sel]);
    selector.includes('all') && (defaultMenu = element); //set default menu
    document.querySelector('contextMenu').appendChild(element);
}

function addButton(txt,onclick,icon,parent){
    const element = document.createElement('button');
    icon != undefined && (element.classList.add("ico"),element.style.setProperty('--icon', 'url(menu-ico/' + icon +'.png)'));
    icon == 'sm' && element.style.setProperty('--icon', 'url(menu-ico/' + txt +'.png)');
    const menu = document.querySelector('contextMenu').lastChild.id;
    if (menu.slice(0,5) != "ctmc_") {
        parent != undefined && element.classList.add("parent","ctm_" + parent);
    }
    element.innerHTML= '<p>' + txt + '</p>';
    element.onclick = new Function(onclick);
    document.querySelector('contextMenu').lastChild.appendChild(element);
}

function cmt (txt) {
    document.querySelector('contextMenu').appendChild(document.createComment(txt));
}

// Child menu functions
function childOpen(e) {
    // get child menu
    var id;
    for (var i = 0; i < e.target.classList.length; i++){
        if (e.target.classList[i].includes('ctm_')){
            id = '#ctmc_' + e.target.classList[i].slice(4);
            i = e.target.classList.length;
        }
    }
    // child setup
    const obj = document.querySelector(id);
    openChildren.indexOf(id) == -1 && openChildren.push(id);
    obj.classList.add('open');
    // button info
    const button = {
        rect:e.target.getBoundingClientRect(),
        right:e.target.getBoundingClientRect().right,
        left:e.target.getBoundingClientRect().left - obj.clientWidth,
    }
    // new menu info
    const target = {
        height:obj.getBoundingClientRect().height,
    }
    // position
    const pos = {x:0,y:0};
    // x axis
    pos.x = button.right;
    if (pos.x + obj.clientWidth > document.documentElement.clientWidth){
        pos.x = button.left;
    }
    // y axis
    pos.y = button.rect.top - 10;
    if (pos.y + target.height > document.documentElement.clientHeight){
        pos.y = document.documentElement.clientHeight - target.height;
    }
    // set pos
    obj.style.left = pos.x + 'px'
    obj.style.top = pos.y + 'px'
}

function hideChildren(){
    for (var i = 0; i < openChildren.length; i++){
        const obj = document.querySelector(openChildren[i]);
        obj.classList.remove('open');
    }
}

//Listeners
addEventListener('contextmenu', e => {
    // Is menu on?
    if (['on',1].indexOf(settings.state) == -1){
        return(0);
    }
    // old menu Guard
    try{
        menu.style.left = ''; //LEAVE!!!
        menu.classList.remove('open'); //Your not that guy
        menu = undefined;
    } catch{} //If error, No old menu
    // New menu
    var element;
    try {
        // Info for new menu
        element = document.elementFromPoint(e.clientX, e.clientY).nodeName; //Element type
        menu = defaultMenu;
        const index = allMenus.find(e => (e[1].find(
            e => e.toUpperCase() == element.toUpperCase()
        )))
        index != undefined && (menu = index[0]);
        if (menu == undefined) {
            return(0)
        }
        // use google menu or custom menu?
        ms.splice(0,1);
        ms.push([e.clientX,e.clientY]);
        if (ms[0].toString() != ms[1].toString()) {
            e.preventDefault();
            menu.classList.add('open'); //You are that guy
        } 
        
        // Calc menu position

        // set menu position
        const mdm = [menu.clientWidth,menu.clientHeight], wdm = [window.innerWidth,window.innerHeight], mp = [e.clientX,e.clientY], pos = [];
        for (var i = 0; i < 2; i++){
            // calc
            pos.push(mp[i] + mdm[i] > wdm[i] ? mp[i] - mdm[i] : mp[i]); // set menu position, standard context menu
            pos[i] < 0 && (pos[i] = mp[i] + mdm[i] > wdm[i] ? mp[i] - mdm[i] / 2 : mp[i]); // custom: no space? no problem, just go mouse center
            (pos[i] < 0 || pos[i] + mdm[i] > wdm[i]) && (pos[i] = wdm[i] / 2 - mdm[i] / 2); // custom: still no space? almost no problem, just go to screen center
            // Result
            menu.style[['left','top'][i]] = pos[i] + "px";
        }
    } catch(e){
        if (typeof element == 'undefined'){
            console.error('ContextMenu out of bounds');
        }
    }
})

// click in menu
addEventListener('click', function(){
    try {
        if (hover != 1 && menu.matches('.open')) {
            menu.classList.remove('open');
            hideChildren();
        }
    } catch {}
})

// click outside of menu
addEventListener('mousedown', function(e){
    try{
        if (hover == 0 && menu.matches('.open')) {
            menu.classList.remove('open');
            document.querySelector('html').style.pointerEvents='none';
            hideChildren();
            menu.style.pointerEvents='all'; // Not trash, Im important too! buttons need me!!!!!
        }
    } catch{}
})

addEventListener('mouseup', function(){
    if (window.getComputedStyle(document.querySelector('html')).getPropertyValue("pointer-events") == 'none') {
        document.querySelector('html').style.pointerEvents='';
    }
})

addEventListener('wheel', function(){
    if (hover == 0){
        menu.classList.remove('open');
        // Hover Guard
        hover != 0 && console.log('leave');
        hover = 0;
        hideChildren();
    }
})

addEventListener('transitionend', e => {
    const obj = e.target;
    const op = getComputedStyle(obj).opacity;
    if (op == 0){
        obj.style.left = '';
    }
})

{
    const elements = document.getElementsByClassName('parent');
    // Hover over sub menu parent
    for (var i = 0; i < elements.length; i++){
        elements[i].addEventListener('mouseenter', e => {
            hover = 1;
            childOpen(e);
        })
        elements[i].addEventListener('mouseleave', function() {
            hover = 0;
        })
    }
}

// for (var i = 0; i < allMenus.length; i++){
//     allMenus[i][0].addEventListener('mouseleave', function() {
//         hideChildren();
//     })
// }