import {DomListener} from '@core/DomListener'

export class ExcelComponent extends DomListener {
    constructor($root, options = {}) {
        super($root, options.listeners)
        this.name = options.name || ''
        this.emitter = options.emitter
        this.subscribe = options.subscribe || []
        this.unsubscribers = []
        this.store = options.store
        this.prepare()
    }

    // настраиваем наш компонент до Init
    prepare() { }

    // Возвращает шаблон компонента
    toHTML() {
        return ''
    }

    // Уведомляем слушаетелей про событие event
    $emit(event, ...args) {
        this.emitter.emit(event, ...args)
    }
    
    // Сюда приходят только изменение по тем полям, на которые мы подписались
    storeChanged() {}

    isWatching(key) {
        return this.subscribe.includes(key)
    }

    // Подписываемся на событие Event
    $on(event, fn) {
        const unsub = this.emitter.subscribe(event, fn)
        this.unsubscribers.push(unsub)
    }

    $dispatch(action) {
        this.store.dispatch(action)
    }

    // инициализируем компонент
    // добавляем ДОМ слушателей
    init() {
        this.initDomListeners()
    }

    // удаляем компонент
    // чистим слушателей
    destroy() {
        this.removeDomListeners()
        this.unsubscribers.forEach(unsub => unsub())
    }
}
