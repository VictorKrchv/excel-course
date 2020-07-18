const CODES = {
    A: 65,
    Z: 90
}

function toCel(_, col) {
    return `<div class="cell" data-col="${col + 1}"></div>`
}

function toColumn(col, index) {
    return `
    <div class="column" data-type="resizable"  data-col="${index + 1}">
        ${col}
        <div class="col-resize" data-resize="col"></div>
    </div>
    `
}

function createRow(content, index) {
    const resizer = index
            ? `<div class="row-resize" data-resize="row"></div>`
            : ''
    return `
        <div class="row" data-row="${index + 1}" data-type="resizable"> 
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

export function createTable(rowCount = 15) {
    const colsCount = CODES.Z - CODES.A + 1
    const rows = []

    const cols = new Array(colsCount)
        .fill('')
        .map(toChar)
        .map(toColumn)
        .join('')

    rows.push(createRow(cols))

    for (let i = 0; i < rowCount; i++) {
        const cells = new Array(colsCount)
            .fill('')
            .map(toCel)
            .join('')
        rows.push(createRow(cells, i + 1))
    }

    return rows.join('')
}