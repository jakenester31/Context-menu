//test
// General
const allMenus = [];
menuStart('pholder'); //Place holder, don't remove
var hover = 0;
const ms = [0,0];
var defaultMenu;
const settings = {state:1}; // no default menu = many unnecessary error messages
const openChildren = [];
var t = 0
//Create menus
cmt('default menu');
menuStart('all');
addButton('Delete','console.log("test")','trash');
addButton('parent',0,'add','add');
addButton('undo','menu = document.querySelector("ctm_add")','sm');
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

menuStart('?t == 1','?t == 3');
addButton('T1',0,'add');

menuStart('?t == 2');
addButton('T2',0,'close');

//functions

// menu creation functions
function menuStart(...selector) {
    const element = document.createElement('div');
    const sel = [];
    for (var i = 0; i < selector.length; i++){
        if (selector[i][0] == '#'){
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
    typeof menu == 'undefined' && (menu = element);
    selector.includes('all') && (defaultMenu = element); //set default menu
    document.querySelector('contextMenu').appendChild(element);
}

function addButton(txt,onclick,icon,parent){
    if (allMenus.length == 1) {
        console.error('Place Holder menu cannot have items');
        return(0);
    }
    const element = document.createElement('button');
    icon == 'sm' && (icon = txt);
    icon != undefined && (element.classList.add("ico"),element.style.setProperty('--icon', 'url(menu-ico/' + icon +'.png)'));
    const menu = document.querySelector('contextMenu').lastChild.id;
    if (menu.slice(0,5) != "ctmc_") {
        parent != undefined && element.classList.add("parent","ctm_" + parent);
    }
    element.innerHTML = txt;
    element.onclick = new Function(onclick);
    document.querySelector('contextMenu').lastChild.appendChild(element);
}

function cmt (txt) {
    document.querySelector('contextMenu').appendChild(document.createComment(txt));
}

// Child menu functions
function childOpen(e) {
    const child = findChild(e);
    openChildren.indexOf(child.id) == -1 && openChildren.push(child.id);
    child.obj.classList.add('open');
    // info
    const button = e.target.getBoundingClientRect(); //parent button
    const target = child.obj.getBoundingClientRect(); //child menu
    // position
    const pos = {x:0,y:0};
    // x axis
    pos.x = button.right;
    if (pos.x + child.obj.clientWidth > document.documentElement.clientWidth){
        pos.x = button.left - target.width;
        if (button.left < document.documentElement.clientWidth - button.right) {
            pos.x = button.right;
        }
    }
    // experimental x-axis
    pos.x < 0 && (pos.x = 0);
    if (pos.x + target.width > document.documentElement.clientWidth) {
        pos.x = document.documentElement.clientWidth - target.width;
    }
    // y axis
    pos.y = button.top - 10;
    if (pos.y + target.height > document.documentElement.clientHeight){
        pos.y = document.documentElement.clientHeight - target.height;
    }
    // set pos
    child.obj.style.left = pos.x + 'px'
    child.obj.style.top = pos.y + 'px'
}

function findChild (e){
    var id;
    // get child menu
    for (var i = 0; i < e.target.classList.length; i++){
        if (e.target.classList[i].includes('ctm_')){
            id = '#ctmc_' + e.target.classList[i].slice(4);
            i = e.target.classList.length;
        }
    }
    return({obj:document.querySelector(id),id:id});
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
    if (menu != undefined){
        menu.style.left = ''; //LEAVE!!!
        menu.classList.remove('open'); //Your not that guy
    }
    // New menu
    var element;
    // Info for new menu
    element = document.elementFromPoint(e.clientX, e.clientY); //Element type
    if (element == undefined){
        console.error('No element... Out of bounds?');
        return(0);
    } else {
        element = element.nodeName;
    }
    menu = undefined;
    typeof defaultMenu != 'undefined' && (menu = defaultMenu);
    const index = allMenus.find(e => (e[1].find(
        e => e.toUpperCase() == element.toUpperCase()
    )))
    index != undefined && (menu = index[0]);

    for (var i = 0; i < allMenus.length; i++){
        for (var a = 0; a < allMenus[i][1].length; a++){
            if (allMenus[i][1][a][0] == '?') {
                const foo = Function(`{
                    if (${allMenus[i][1][a].slice(1)}){
                        menu = allMenus[${i}][0];
                    }
                }`);
                foo();
            }
        }
    }

    if (menu == undefined) {
        menu = allMenus[0][0];
        menu.classList.add('open');
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
    const mdm = [menu.clientWidth,menu.clientHeight], wdm = [document.documentElement.clientWidth,document.documentElement.clientHeight], mp = [e.clientX,e.clientY], pos = [];
    for (var i = 0; i < 2; i++){
        // calc
        pos.push(mp[i] + mdm[i] > wdm[i] ? mp[i] - mdm[i] : mp[i]); // set menu position, standard context menu
        pos[i] < 0 && (pos[i] = mp[i] + mdm[i] > wdm[i] ? mp[i] - mdm[i] / 2 : mp[i]); // custom: no space? no problem, just go mouse center
        (pos[i] < 0 || pos[i] + mdm[i] > wdm[i]) && (pos[i] = wdm[i] / 2 - mdm[i] / 2); // custom: still no space? almost no problem, just go to screen center
        // Result
        menu.style[['left','top'][i]] = pos[i] + "px";
    }
})

// click in menu
addEventListener('click', e => {
    if (menu == undefined){
        return(0);
    }    
    if (hover != 1 && menu.matches('.open')) {
        menu.classList.remove('open');
    }
    if (findChild(e).obj != null){
        if (Array.from(findChild(e).obj.classList).indexOf('open') > -1){
            hideChildren();
        } else {
            childOpen(e)
        }
    }
})

// click outside of menu
addEventListener('mousedown', function(){
    if (hover == 0 && menu.matches('.open')) {
        document.querySelector('html').style.pointerEvents='none';
        if (menu == undefined){
            return(0);
        }  
        menu.classList.remove('open');
        menu.style.pointerEvents='all'; // Not trash, Im important too! buttons need me!!!!!
        hideChildren();
    }
})

addEventListener('mouseup', function(){
    if (window.getComputedStyle(document.querySelector('html')).getPropertyValue("pointer-events") == 'none') {
        document.querySelector('html').style.pointerEvents='';
    }
})

addEventListener('wheel', function(){
    if (hover == 0){
        if (menu == undefined){
            return(0);
        }  
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
            if (e.target.parentNode.matches('.open')){
                hideChildren();
                childOpen(e);
            }
        })
        elements[i].addEventListener('mouseleave', function() {
            hover = 0;
        })
    }
}
