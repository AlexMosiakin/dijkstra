const ROWS = 15
const COLUMNS = 25

export const dijkstra = (cells, startNode, finishNode) => {
      const visitedNodesInOrder = [];

     // setStart({...startNode, distance: 0})
      const cellStartIndex = (startNode.rowKey * 25) + startNode.colKey
      let preparedCells = [...cells]
      preparedCells[cellStartIndex].distance = 0
      
      const unvisitedNodes = getAllNodes(cells)
      while (!!unvisitedNodes.length) {
        sortNodesByDistance(unvisitedNodes);
        const closestNode = unvisitedNodes.shift();
        // If we encounter a wall, we skip it.
        if (closestNode.type === 'wall') continue;
        // If the closest node is at a distance of infinity,
        // we must be trapped and should therefore stop.
        if (closestNode.distance === Infinity) return visitedNodesInOrder;
        closestNode.isVisited = true;
        visitedNodesInOrder.push(closestNode);
        if (closestNode.rowKey === finishNode.rowKey && closestNode.colKey === finishNode.colKey) return visitedNodesInOrder;
        updateUnvisitedNeighbors(closestNode, cells);
      }

}

function sortNodesByDistance(unvisitedNodes) {
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

function updateUnvisitedNeighbors(node, grid) {
  const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
  for (const neighbor of unvisitedNeighbors) {
    neighbor.distance = node?.distance + 1;
    neighbor.previousNode = node;
  }
}

function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const {colKey, rowKey} = node;
  if (rowKey > 0){
      const cellIndex = grid.findIndex(cell => cell.rowKey === rowKey - 1 && cell.colKey === colKey)
      neighbors.push(grid[cellIndex])
  }
  if (rowKey < ROWS - 1){
      const cellIndex = grid.findIndex(cell => cell.rowKey === rowKey + 1 && cell.colKey === colKey)
      neighbors.push(grid[cellIndex])
  }
  if (colKey > 0){
      const cellIndex = grid.findIndex(cell => cell.rowKey === rowKey && cell.colKey === colKey - 1)
      neighbors.push(grid[cellIndex])
  }
  if (colKey < COLUMNS - 1){
      const cellIndex = grid.findIndex(cell => cell.rowKey === rowKey && cell.colKey === colKey + 1)
      neighbors.push(grid[cellIndex])
  }
  
  return neighbors.filter(neighbor => !neighbor.isVisited);
}

function getAllNodes(cells) {
  const nodes = [];
  for(let i = 0; i < cells.length; i++){
      nodes.push(cells[i])
  }
  return nodes;
}
  
  // Backtracks from the finishNode to find the shortest path.
  // Only works when called *after* the dijkstra method above.
  export function getNodesInShortestPathOrder(finishNode) {
    const nodesInShortestPathOrder = [];
    let currentNode = finishNode;
    while (currentNode) {
      nodesInShortestPathOrder.unshift(currentNode);
      currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
  }