// import Specificity from '@bramus/specificity';

const 
doc = document.documentElement,
container = doc.append(document.createElement('contextmenus')),
settings = {
    _openCustom: true,
    set openCustom(val) {
            if (Boolean(this._openCustom) == Boolean(val)) return;
            this._openCustom = Boolean(val);
            if (val) addEventListener('contextmenu',openContext);
            else removeEventListener('contextmenu',openContext);
    },
    get openCustom() { return this._openCustom }
},
selectors = {
    plain: {},
    func: {},
};

for (let i in settings)
    if (i[0] != '_') {
        // a dumb method to trip the setters with self detection
        let save = settings[i];
        settings[i] = !save;
        settings[i] = save;
    }

// helpers
Object.defineProperties(Object.prototype,{
    findKey: {
        value: function(val) {
            return Object.keys(this).find( e => this[e] == val)
        },
        enumerable:false,
        configurable:true
    }
})

// classes
class contextmenu extends HTMLElement {
    static pair = {};
    constructor(id,selector) {
        super();
        if (Object.hasOwn(contextmenu.pair,id))
            throw Error(`There cannot be multiple contextmenus with the id "${id}"`);
        // this.specificity = Specificity.calculate(selector);
        if (typeof selector == 'function')
            selectors.func[selector] = this;
        else
            selectors.plain[selector] = this;


        document.querySelector('contextmenus').appendChild(this);
        contextmenu.pair[id] = this;
    }
} customElements.define('contextmenu-',contextmenu);

class contextblock extends HTMLButtonElement {
    constructor(txt,onclick,icon,parentLink) {
        super();
        Object.assign(this,{onclick,icon,parentLink})
        this.innerText = txt;
    }

    addTo(id) {
        if (contextmenu.pair.findKey(id))
            id.appendChild(this);
        else if (Object.hasOwn(contextmenu.pair,id))
            contextmenu.pair[id].appendChild(this);
        else throw Error(`adding contextmenu block to invalid id/element`)
    }
} customElements.define('contextblock-',contextblock, {extends:'button'});

new contextmenu('main','div');
new contextblock('Button1', e => console.log('hello!'),0,'childOfButton1').addTo('main');

var child = new contextmenu('childOfButton1','button');
new contextblock('Button2', e => console.log('button2')).addTo(child);
new contextblock('Button3', e => console.log('button2')).addTo(child);


// 'div' : selects class div
// '#test' : selects id test
// e => e == 1 : evaluates a conditional, e is the top element

openContext.lastOpen = [];
function openContext(e) {
    const lastOpen = openContext.lastOpen;
    // two opens to open real menu for easy access.
    if (lastOpen[0] == e.clientX && lastOpen[1] == e.clientY) return;
    Object.assign(lastOpen,[e.clientX, e.clientY]);
    
    // var cls = e.target.tagName || e.target.nodeName;
    // var tempatri = e.target.attributes;
    // var atri = {tag:cls};
    // for (let i = 0; i < tempatri.length; i++)
    //     atri[tempatri[i].nodeName] = tempatri[i].nodeValue
    // console.log(atri);

    console.log(selectors);
    var menu = null;
    for (let i in selectors.plain) {
        if (e.target.matches(i)) {
            menu = selectors.plain[i];
        }
    }
    if (menu === null) return;
    console.log(menu);
    


    e.preventDefault();
}

console.log(
    document.querySelector('.aclass[test="1"]')
);