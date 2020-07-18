class Dom {
    constructor(selector) {
        this.$$listeners = {}
        this.$el = typeof selector === 'string'
            ? document.querySelector(selector)
            : selector
    }

    html(html) {
        if (typeof html === 'string') {
            this.$el.innerHTML = html
            return this
        }
        return this.$el.innerHTML.trim()
    }

    clear() {
        this.html('')
        return this
    }

    on(eventType, fn) {
        this.$el.addEventListener(eventType, fn)
    }

    off(eventType, fn) {
        this.$el.removeEventListener(eventType, fn)
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

    closest(selector) {
        return $(this.$el.closest(selector))
    }

    getCoords() {
        return this.$el.getBoundingClientRect()
    }

    get data() {
        return this.$el.dataset
    }

    get className() {
        return this.$el.className
    }

    findAll(selector) {
        return this.$el.querySelectorAll(selector)
    }

    css(styles = {}) {
        Object.keys(styles)
            .forEach(key => this.$el.style[key] = styles[key])
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


