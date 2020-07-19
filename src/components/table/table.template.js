const CODES = {
    A: 65,
    Z: 90
}

function toCel(row) {
    return function(_, col) {
        return `<div 
                    contenteditable="true"
                    class="cell" 
                    data-col="${col}" 
                    data-type="cell"
                    data-id="${row}:${col}">
                </div>`
    }
}

function toColumn(col, index) {
    return `
    <div class="column" data-type="resizable"  data-col="${index}">
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
        <div class="row" data-row="${index}" data-type="resizable"> 
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

    for (let row = 0; row < rowCount; row++) {
        const cells = new Array(colsCount)
            .fill('')
            .map(toCel(row))
            .join('')
        rows.push(createRow(cells, row + 1))
    }

    return rows.join('')
}
