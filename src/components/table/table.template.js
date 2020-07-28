import {toInlineStyles} from '@/core/utils'
import {defaultStyles} from '@/constants'
import {parse} from '@/core/parse'

const CODES = {
    A: 65,
    Z: 90
}

const DEFAULT_WIDTH = 120
const DEFAULT_HEIGHT = 24

function toCell(state, row) {
    return function(_, col) {
        const id = `${row}:${col}`
        const width = getWidth(state.colState, col)
        const textContent = getTextContent(state.dataState, id)
        const styles = toInlineStyles({
            ...defaultStyles, ...state.stylesState[id]
        })
        return `<div 
                    class="cell" 
                    data-col="${col}" 
                    data-type="cell"
                    data-id="${row}:${col}"
                    contenteditable
                    style="${styles}; width: ${width}"
                    data-value="${textContent}"
                    >
                    ${parse(textContent) || ''}
                </div>`
    }
}

function toColumn({col, index, width}) {
    return `
    <div 
        class="column" data-type="resizable"  
        data-col="${index}" style="width:${width}">
        ${col}
        <div class="col-resize" data-resize="col"></div>
    </div>
    `
}

function createRow(content, index, state) {
    const height = (state[index] || DEFAULT_HEIGHT) + 'px'
    const resizer = index
            ? `<div class="row-resize" data-resize="row"></div>`
            : ''
    return `
        <div
         class="row" data-row="${index}" data-type="resizable"
         style="height: ${height}"
         > 
            <div class="row-info">${index ? index : ''}
                ${resizer}
            </div>
            <div class="row-data">${content}</div>
        </div>
    `
}

function toChar(_, index) {
    return String.fromCharCode(CODES.A + index)
}

function getWidth(state, index) {
    return (state[index] || DEFAULT_WIDTH) + 'px'
}

function getTextContent(state, id) {
    return state[id] ? state[id] : ''
}

function withWidthFrom(state) {
    return function(col, index) {
          return {
              col, index, width: getWidth(state.colState, index)
          }
    }
}

export function createTable(rowCount = 15, state = {}) {
    const colsCount = CODES.Z - CODES.A + 1
    const rows = []

    const cols = new Array(colsCount)
        .fill('')
        .map(toChar)
        .map(withWidthFrom(state))
        .map(toColumn)
        .join('')

    rows.push(createRow(cols, 0, state.rowState))

    for (let row = 0; row < rowCount; row++) {
        const cells = new Array(colsCount)
            .fill('')
            .map(toCell(state, row))
            .join('')
        rows.push(createRow(cells, row + 1, state.rowState))
    }

    return rows.join('')
}
