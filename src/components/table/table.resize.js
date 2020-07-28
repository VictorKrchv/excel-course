import {$} from '@core/dom';

export function resizeHandler($root, e) {
    return new Promise(resolve => {
        const $resizer = $(e.target)
        const $parent = $resizer.closest('[data-type="resizable"]')
        const coords = $parent.getCoords()
        const type = $resizer.data.resize
        const sideProp = type === 'col' ? 'bottom' : 'right'
        let value
    
        document.onselectstart = () => false
    
        $resizer.css({
            opacity: 1,
            [sideProp]: '-5000px'
        })
    
        document.onmousemove = e => {
            if (type === 'row') {
                const delta = e.pageY - coords.bottom
                value = coords.height + delta
                $resizer.css({bottom: -delta + 'px'})
            } else {
                const delta = e.pageX - coords.right
                value = coords.width + delta
                $resizer.css({right: -delta + 'px'})
            }
        }
    
        document.onmouseup = () => {
            document.onselectstart = () => true
            document.onmousemove = null
            document.onmouseup = null
    
            if (type === 'row') {
                $parent.css({height: value + 'px'})
            } else {
                $parent.css({width: value + 'px'})
                $root.findAll(`[data-col="${$parent.data.col}"]`)
                    .forEach(cel => cel.style.width = value + 'px')
            }
            
            $resizer.css({
                opacity: 0,
                right: 0,
                bottom: 0
            })

            resolve({
                value,
                type,  
                id: $parent.data[type]
            })
        }
    })
}
