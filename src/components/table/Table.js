import {ExcelComponent} from '../../core/ExcelComponent';
import {createTable} from '@/components/table/table.template';
import {resizeHandler} from '@/components/table/table.resize';
import {$} from '@core/dom';
import {
    isCell,
    matrix,
    nextSelector,
    shouldResize} from '@/components/table/table.functions';
import {TableSelection} from '@/components/table/TableSelection';
import * as actions from '@/redux/actions'
import {defaultStyles} from '@/constants';
import {parse} from '@/core/parse';

export class Table extends ExcelComponent {
    static className = 'excel__table'

    constructor($root, options) {
        super($root, {
            name: 'Table',
            listeners: ['mousedown', 'keydown', 'input'],
            ...options
        })
    }

    toHTML() {
        return createTable(20, this.store.getState())
    }

    prepare() {
        this.selection = new TableSelection()
    }

    init() {
        super.init()
        const $cell = this.$root.find(`[data-id="0:0"]`)
        this.selectCell($cell)
        this.$on('formula:input', text => {
            this.selection.current
                .attr('data-value', text)
                .text(parse(text))
            this.updateTextInStore(text)
        })
        this.$on('formula:done', () => {
            this.selection.current.focus()
        })
        this.$on('toolbar:applyStyle', value => {
            this.selection.applyStyle(value)
            this.$dispatch(actions.applyStyle({
                value,
                ids: this.selection.selectedIds
            }))
        })
    }

    selectCell($cell) {
        this.selection.select($cell)
        this.$emit('table:select', $cell)
        const styles = $cell.getStyles(Object.keys(defaultStyles))
        this.$dispatch(actions.changeStyles(styles))
    }

    async resizeTable(e) {
        try {
            const data = await resizeHandler(this.$root, e)
            this.$dispatch(actions.tableResize(data))
        } catch (error) {
            console.warn('Table -> resizeTable -> error', error)
        }
    }

    onMousedown(e) {
        if (shouldResize(e)) {
            this.resizeTable(e)
        } else if (isCell(e)) {
            const $target = $(e.target)
            if (e.shiftKey) {
                const cells = matrix(this.selection.current, $target)
                    .map(id => this.$root.find(`[data-id="${id}"`))
                this.selection.selectGroup(cells)
            } else {
                this.selectCell($target)
            }
        }
    }

    onKeydown(e) {
        const keys = [
            'Enter',
            'Tab',
            'ArrowLeft',
            'ArrowRight',
            'ArrowDown',
            'ArrowUp'
            ]

        const {key} = e

        if (keys.includes(e.key) && !e.shiftKey) {
            e.preventDefault()
            const id = this.selection.current.id(true)
            const $next = this.$root.find(nextSelector(key, id))
            this.selectCell($next)
        }
    }

    updateTextInStore(value) {
        this.$dispatch(actions.changeText({
            id: this.selection.current.id(),
            value
        }))
    }

    onInput(event) {
        const $target = $(event.target)
        const text = $(event.target).text()
        $target.attr('data-value', text)
        this.updateTextInStore(text)
    }
}


