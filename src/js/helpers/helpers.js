const getStyles = (elem, property) => {
    const raw = window.getComputedStyle(elem).getPropertyValue(property).split('px')[0]
    return parseFloat(parseFloat(raw).toFixed(2))
}

const getCookie = (cookieName) => {
    let decodeCookie = decodeURIComponent(document.cookie)
    let cookiesArray = decodeCookie ? decodeCookie.split(';') : []

    for (let i = 0; i < cookiesArray.length; i++) {
        let cookie = cookiesArray[i]
        let cookieNew = cookie.replace(' ', '')
        let isExist = cookieNew.includes(cookieName)
        if (isExist) {
            return cookieNew.split('=')[1];
        }

    }
    return null
}

const setCookie = (cookieName, cookieValue, options = {}) => {
    let cookieExpires = ''
    if (options.expires) {
        cookieExpires = "; expires=" + (new Date(options.expires)).toUTCString()
        delete options.expires
    }

    let cookieOptions = ''

    if (options) {
        let cookieKeys = Object.keys(options)
        let cookieValues = Object.values(options)
        for (let i = 0; i < cookieValues.length; i++) {
            cookieOptions += "; " + cookieKeys[i] + "=" + cookieValues[i]
        }
    }
    document.cookie = cookieName + "=" + cookieValue + ";" + cookieExpires + cookieOptions
}

const getParent = (element, selector) => {
    if (element.matches(selector)) {
        return element
    }
    while (element.parentElement) {
        if (element.parentElement.matches(selector)) {
            return element.parentElement
        }

        element = element.parentElement
    }
}

const getChildren = (element, selector) => {
    let el = null
    element.childNodes.forEach(elem => {
        if (elem.classList.contains(selector)) {
            el = elem
        }
    })
    return el
}

const previewImage = (input, box, child, create = false, callback = null) => {
    if (input.files) {
        let files = input.files
        for (let i = 0; i < files.length; i++) {
            let reader = new FileReader()
            let boxElem = getParent(input, box)
            reader.onload = (e) => {
                if (callback) {
                    callback.call(this, e.target.result)
                }
                if (create) {
                    let img = document.createElement('img')
                    img.src = e.target.result
                    img.alt = ''
                    img.classList.add(child)
                    boxElem.appendChild(img)
                } else {
                    getChildren(boxElem, child).src = e.target.result
                }
            }

            reader.readAsDataURL(files[i])
        }
    }
}

const ucFirst = (string) => {
    return string.toLowerCase().charAt(0).toUpperCase() + string.slice(1);
}

function getCategories(categories, id = 0, object = {}, text = '') {
    if(!object.childrens) {
        object.childrens = [] 
    }
    if(categories) {
        categories.forEach((c, i) => {
            if (c.parent_id === id) {
                let cateObject = {}
                cateObject.category = c
                cateObject.text = text
                cateObject.childrens = []
                object.childrens.push(cateObject)
                getCategories(categories, c.id, cateObject, text + '--')
            }
        })
    }
    return object
}

function getArrFromObject(object, id, arr = []) {
    let parseId = parseInt(id)
    if(object) {
        object.forEach(child => {
            if(child.parent_id === parseId) {
                arr.push(child.id)
                getArrFromObject(object, child.id, arr)
            } 
        })
    }
    return arr
}

function decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

export {
    getStyles,
    getCookie,
    setCookie,
    getParent,
    getChildren,
    previewImage,
    ucFirst,
    getCategories,
    getArrFromObject,
    decodeHtml,

}