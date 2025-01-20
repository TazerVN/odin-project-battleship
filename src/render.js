import { ship } from "./objectConstructor";

function renderGameboard(gameboard){
    const gameboardNode = document.querySelector("div.game-container")
    const gridcontainer = document.createElement("div")
    const container = document.createElement("div")
    
    gridcontainer.classList.add("grid-container")
    gameboard.forEach((row, rowid) => {
        const rowNode = document.createElement("div")
        row.forEach((box, boxid) =>{
            const button = document.createElement("button")
            button.classList.add("grid-button")
            if(box instanceof ship){
                button.setAttribute("id", "grid-button-ship")
                rowNode.appendChild(button)
            }
            rowNode.appendChild(button)
        })
        gridcontainer.appendChild(rowNode)
    });
    gameboardNode.appendChild(gridcontainer)
}

export {renderGameboard}