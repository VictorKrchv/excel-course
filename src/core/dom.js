class Dom {
    constructor(selector) {
        this.$$listeners = {}
        this.$el = typeof selector === 'string'
            ? document.querySelector(selector)
            : selector
    }

    addClass(className) {
        return this.$el.classList.add(className)
    }

    append(node) {
        if (node instanceof Dom) {
            node = node.$el
        }

        if (Element.prototype.append) {
            this.$el.append(node)
        } else {
            this.$el.appendChild(node)
        }
        return this
    }

    attr(name, value) {
        if (value) {
            this.$el.setAttribute(name, value)
            return this
        }
        return this.$el.getAttribute(name)
    }
   
    closest(selector) {
        return $(this.$el.closest(selector))
    }

    css(styles = {}) {
        Object.keys(styles)
            .forEach(key => this.$el.style[key] = styles[key])
        return this
    }

    clear() {
        this.html('')
        return this
    }


    getCoords() {
        return this.$el.getBoundingClientRect()
    }

    getStyles(styles = []) {
        return styles.reduce((res, s) => {
            res[s] = this.$el.style[s]
            return res
        }, {})
    }

    get data() {
        return this.$el.dataset
    }

    get className() {
        return this.$el.className
    }

    focus() {
        this.$el.focus()
        return this
    }

    find(selector) {
        return $(this.$el.querySelector(selector))
    }

    findAll(selector) {
        return this.$el.querySelectorAll(selector)
    }

    on(eventType, fn) {
        this.$el.addEventListener(eventType, fn)
    }

    off(eventType, fn) {
        this.$el.removeEventListener(eventType, fn)
    }


    removeClass(className) {
        return this.$el.classList.remove(className)
    }

    id(parse) {
        if (parse) {
            const parsed = this.id().split(':')
            return {
                row: +parsed[0],
                col: +parsed[1]
            }
        }
        return this.data.id
    }

    html(html) {
        if (typeof html === 'string') {
            this.$el.innerHTML = html
            return this
        }
        return this.$el.outerHTML.trim()
    }

    text(text) {
        if (typeof text !== 'undefined') {
            this.$el.textContent = text
            return this
        }
        if (this.$el.tagName.toLowerCase() === 'input') {
            return this.$el.value.trim()
        }
        return this.$el.textContent.trim()
    }
}


// event target
export function $(selector) {
    return new Dom(selector)
}

$.create = (tagName, classes = '') =>{
    const el = document.createElement(tagName)
    if (classes) {
        el.classList.add(classes)
    }
    return $(el)
}


