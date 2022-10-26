import { FC, useEffect, useMemo, useState } from "react";
import { dijkstra, getNodesInShortestPathOrder } from "../../algo/dejkstra";

interface Cell {
    rowKey: number,
    colKey: number,
    type: string,
    distance: number,
}

export const Grid:FC = () => {
    const ROWS = 15
    const COLUMNS = 25
    let map = []
    for(let i = 0; i < ROWS; i++){
        for(let j = 0; j < COLUMNS; j++){
            map.push({
                rowKey: i,
                colKey: j,
                type: 'normal',
                distance: Infinity,
            })
        }
    }

    const [cells, setCells] = useState([])

    useEffect(() => {
        if(map.length){
            setCells(map)
        }
    },[])

    const [start, setStart] = useState<Cell>(null)
    const [finish, setFinish] = useState<Cell>(null)
    const [endOfCalc, setEndOfCalc] = useState<number>(null)

    const chooseStartAndFinish = (target) => {
        const cellRow = Number(target.getAttribute('data-rowkey'))
        const cellCol = Number(target.getAttribute('data-colkey'))
        const cellIndex = (cellRow * 25) + cellCol
        if(!start){
            setStart({
                rowKey: cellRow,
                colKey: cellCol,
                type: 'start',
                distance: Infinity,
            })
            let preparedCells = [...cells]
            preparedCells[cellIndex].type = 'start'
            setCells(preparedCells)
        }
        else{
            if(!finish){
                setFinish({
                    rowKey: cellRow,
                    colKey: cellCol,
                    type: 'finish',
                    distance: Infinity,
                })
                let preparedCells = [...cells]
                preparedCells[cellIndex].type = 'finish'
                setCells(preparedCells)
            }
        }
    }

    const [mouseDown, setMouseDown] = useState<boolean>()

    const writeWalls = (target) => {
        if(start && finish){
            if(mouseDown){
                const cellRow = Number(target.getAttribute('data-rowkey'))
                const cellCol = Number(target.getAttribute('data-colkey'))
                const cellIndex = (cellRow * 25) + cellCol
                if(start.colKey !== cellCol || start.rowKey !== cellRow || finish.colKey !== cellCol || finish.rowKey !== cellRow){
                    let preparedCells = [...cells]
                    preparedCells[cellIndex].type = 'wall'
                    setCells(preparedCells)
                }
            }
        }
    }

    const getCellClass = (item) => {
        if(item.type === 'normal'){
            if(!start){
                return 'noStart'
            }
            else{
                if(!finish){
                    return 'noFinish'
                }else{
                    return 'noWalls'
                }
            }
        }
        if(item.type === 'start'){
            return 'start'
        }
        if(item.type === 'finish'){
            return 'finish'
        }
        if(item.type === 'visited'){
            return 'visited'
        }
        if(item.type === 'wall'){
            return 'wall'
        }
        if(item.type === 'shortest'){
            return 'shortest'
        }
    }

    const findPath = async (cells, startNode, finishNode) => {
        if(start && finish){
            const path = dijkstra(cells,startNode,finishNode)
            
            for(let i = 0; i < path.length; i++){
                if(i === (path.length - 1)){
                    const shortestPath = getNodesInShortestPathOrder(cells[(finishNode.rowKey * 25) + finishNode.colKey]);
                    setTimeout(() => {
                        for(let i = 0; i < shortestPath.length; i++){
                            setTimeout(() => {
                                const cellIndex = (shortestPath[i].rowKey * 25) + shortestPath[i].colKey
                                let preparedCells = [...cells]
                                preparedCells[cellIndex].type = 'shortest'
                                setCells(preparedCells)

                                if(i === shortestPath.length - 1){
                                    setEndOfCalc(shortestPath[i].distance)
                                }
                            }, 100 * i)
                        }
                    }, 10 * i)
                }

                setTimeout(() => {
                    const cellIndex = (path[i].rowKey * 25) + path[i].colKey
                    let preparedCells = [...cells]
                    preparedCells[cellIndex].type = 'visited'
                    setCells(preparedCells)
                }, 10 * i)
            }
        }
        else{
            alert('Choose start and finish points!')
        }
    }

    const headerPhrase = (start, finish, endOfCalc) => {
        if(!start){
            return 'Choose start point'
        }else{
            if(!finish){
                return 'Choose finish point'
            }else{
                if(!endOfCalc){
                    return 'Draw walls or click "Find it!" button'
                }else{
                    return `Shortest path is ${endOfCalc} cells! Click "Reload!" to try again`
                }
                
            }
        }
    }


    return(
        <>
        <h3 className='appHeader'>{headerPhrase(start, finish, endOfCalc)}</h3>
        <div className='gridWrapper' 
            onClick={e => chooseStartAndFinish(e.target)} 
            onMouseOver={e => writeWalls(e.target)}
            onMouseDown={() => setMouseDown(true)}
            onMouseUp={() => setMouseDown(false)}>
            <>
            {cells.map((item:Cell) =>  
                    <div key={item.rowKey + '/' + item.colKey} className={'cell ' + getCellClass(item)} data-rowkey={item.rowKey} data-colkey={item.colKey}></div>
                )
            }
            </>
        </div>
        <div className="btnsWrapper">
            <button className='button start' onClick={() => findPath(cells, start, finish)}>
                <span>Find it!</span>
            </button>
            <button className='button reload' onClick={() => window.location.reload()}>
                <span>Reload!</span>
            </button>
        </div>
        </>
    )
}