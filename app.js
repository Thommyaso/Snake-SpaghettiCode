document.addEventListener('DOMContentLoaded', () => {
    const whatever = document.querySelectorAll('.game div')
    const startBnt = document.querySelector('#startgame')
    const scoreDisplay = document.querySelector('#score-js') 
    const width = 10
    const divOver = document.createElement('span')
    
    divOver.classList.add('over')
    divOver.innerHTML = 'GAME OVER'

    let random
    let currentSnake = [2,1,0]
    let addBlock
    let score = 0
    let level = 1
    let snakeTail = []
    let intervalTime = 0
    let interval = 0
    let tailHead
    let tryArrForDir = [1]
    let directional = 1
    let direction = tryArrForDir[0]


//STARTS AND RESETS THE GAME AFTER PRESSING 'START' BUTTON 
    function gameStartReset(){
        whatever[0].classList.add('food')                   // creates an food at div 0 to let function generatefood() run correctly
        divOver.remove()                                    // removes game-over message
        snakeTail = []
        for(let q of currentSnake){
            whatever[q].classList.remove('snake')           // removes old snake before starting the game
        }
        intervalTime = 500
        score = 0
        level = 1
        document.querySelector('#level-js').innerHTML = level
        currentSnake = [2,1,0]
        tryArrForDir = [1]
        scoreDisplay.innerHTML = score
        colorSnake()
        runTime()
        for(let f = 0 ; f < whatever.length ; f++){
            whatever[f].classList.remove('border_1', 'border_2', 'border_3', 'border_4', 'border')
        }
        generateFood()
    }

// INTERVAL
    function runTime(){                                             // creates interval wchich controlls speed of the snake
        clearInterval(interval)
        interval = setInterval(()=> moves(), intervalTime)
        levels()
    }

//BORDER STYLE DEPENDING ON LEVEL OF THE GAME
    function levels(){
        if(level === 2){
            let arrBorder = [3,4,5,6,39,49,59,69,96,95,94,93,60,50,40,30]
            for(let f = 0 ; f < whatever.length ; f++){
                whatever[f].classList.remove('border_1', 'border_2', 'border_3', 'border_4', 'border')
                }
            for(let g = 0 ; g < arrBorder.length ; g++){
                if(g < 4){
                    whatever[arrBorder[g]].classList.add('border', 'border_1')
                }else if(g >= 4 && g < 8){
                    whatever[arrBorder[g]].classList.add('border', 'border_2')
                }else if(g >= 8 && g < 12){
                    whatever[arrBorder[g]].classList.add('border', 'border_3')  
                }else if(g >= 12){
                    whatever[arrBorder[g]].classList.add('border', 'border_4')
                }
            }
        }else if(level === 3){
            let arrBorder = [0,1,8,9,9,19,89,99,99,98,91,90,90,80,10,0]
            for(let f = 0 ; f < whatever.length ; f++){
                whatever[f].classList.remove('border_1', 'border_2', 'border_3', 'border_4', 'border')
            }
            for(let g = 0 ; g < arrBorder.length ; g++){
                if(g < 4){
                    whatever[arrBorder[g]].classList.add('border', 'border_1')
                }else if(g >= 4 && g < 8){
                    whatever[arrBorder[g]].classList.add('border', 'border_2')
                }else if(g >= 8 && g < 12){
                    whatever[arrBorder[g]].classList.add('border', 'border_3')  
                }else if(g >= 12){
                    whatever[arrBorder[g]].classList.add('border', 'border_4')
                }
            }
        }else if(level === 4){
            for(let f = 0 ; f < whatever.length ; f++){
                whatever[f].classList.remove('border_1', 'border_2', 'border_3', 'border_4', 'border')
            }
            for(let g = 1 ; g < whatever.length ; g++){
                let hhh = g.toString()
                if(g % width == 0 && g % 2 == 0  && hhh[0] % 2 == 0 ){
                    whatever[g].classList.add('border', 'border_4')
                } 
                if(hhh[hhh.length-1] % width == 9 && hhh[0] % 2 == 0){
                    whatever[g].classList.add('border', 'border_2')
                }
                if(g - width < 0 && g % 2 == 0 ){
                    whatever[g].classList.add('border', 'border_1')
                }
                if(g+ width >= 100 && g % 2 == 0 && !(g == 90) ){
                    whatever[g].classList.add('border', 'border_3') 
                }
            }
        }else if(level === 5){
            for(let f = 0 ; f < whatever.length ; f++){
                whatever[f].classList.remove('border_1', 'border_2', 'border_3', 'border_4', 'border')
                }
            for(let g = 0 ; g < whatever.length ; g++){
                if(g % width == 0 ){
                    whatever[g].classList.add('border', 'border_4')
                } 
                if(g % width == 9){
                    whatever[g].classList.add('border', 'border_2')
                }
                if(g - width < 0){
                    whatever[g].classList.add('border', 'border_1')
                }
                if(g + width >= 100){
                    whatever[g].classList.add('border', 'border_3') 
                }
            }    
        }
    }


// SNAKE MOVEMENT AND REACTION TO COLISIONS
    function moves(){
        if(tryArrForDir.length > 1 && tryArrForDir.length <= 3){
            tryArrForDir.shift()                                            // gets rid of previous direction
        }else if(tryArrForDir.length > 3){                                  // makes sure that max accepted buttons pressed in one go is 2, ignores the rest / also removes previous direction
            tryArrForDir = tryArrForDir.slice(1,3)
        }
        direction = tryArrForDir[0]
//CONDITIONS WHEN SNAKE REACHES END OF THE BOARD AND HITS THE WALL
        if((currentSnake[0] % width === 0 && direction === -1||                             // if snake hits left wall
            currentSnake[0] % width === 9 && direction === 1||                              // if snake hits right wall
            currentSnake[0] - width < 0 && direction === -width||                           // if snake hits bottom wall
            currentSnake[0] + direction >= 100 && direction === width) &&
            whatever[currentSnake[0]].classList.contains('border') === true ||              // if snake hits top wall
            !(snakeTail.indexOf(currentSnake[0]) === -1)){                                  // if snake hits itself
                document.querySelector('#foundyou').appendChild(divOver)                    // shows message 'game over' when one of the conditions is met
                return clearInterval(interval)                                              // stop interval (game ends)
        }else{ 
//CONDITIONS WHEN SNAKE REACHES END OF THE BOARD BUT THERE IS NO WALL
            if(currentSnake[0] + direction >= 100 && direction === width){                  // These commands make sure snakes appears on opposite side of the board when it reaches the end
                tailHead = currentSnake[0] - 90
            }else if(currentSnake[0] - width < 0 && direction === -width){
                tailHead = 90 + currentSnake[0]
            }else if(currentSnake[0] % width === 0 && direction === -1){
                tailHead = 9 + currentSnake[0]
            }else if(currentSnake[0] % width === 9 && direction === 1){
                tailHead = currentSnake[0] - 9
            }else{
                tailHead = currentSnake[0] + direction
            }
            snakeTail = currentSnake.slice(1)
            whatever[currentSnake[currentSnake.length - 1]].classList.remove('snake')    
            addBlock = currentSnake.pop()                                                  //Removes last element of the snake to create movement
            currentSnake.unshift(tailHead)                                                 //Adds block to the head of the snake to create movement
            colorSnake()
            if(whatever[currentSnake[0]].classList.contains('food') === true){             //Calls for function regenerate food, when snake reaches it
                currentSnake.push(addBlock)                                                //adds block to the tail when snake eats it
                colorSnake() 
                generateFood()
                score ++
                document.querySelector('#score-js').innerHTML = score
                if(score % 3 === 0 && score < 15){                                         // Evry 3 pieces of food you eat speed of snake increases. For first 4 levels it gets 50ms faster after level 4 25ms
                    intervalTime -= 50
                    level++
                    runTime()
                }else if(score >= 15 && score % 3 == 0){
                    intervalTime -= 25
                    level++
                    runTime()
                }
                document.querySelector('#level-js').innerHTML = level
            }
        }

    }
//GENERATING NEW FOOD FOR THE BEGINNING OF OF THE GAME AND WHEN SNAKE EATS IT
    function generateFood(){
        do{                                                 // If randomly selected numer. If number is already used by snake regenerates another one
            random = Math.floor(Math.random() * 100)
        }while (!(currentSnake.indexOf(random) === -1))
        let goal = document.querySelectorAll('.food')
        for(let r of goal){
            r.classList.remove('food')                      // Removes food when snake reaches it 
        }               
        whatever[random].classList.add('food')
    }

// COLORING THE SNAKE BY ADDING CSS CLASS .snake
    function colorSnake(){
        for(let z of currentSnake){
            whatever[z].classList.add('snake')
        }
    }


    function reverseOrNot(){
        if(tryArrForDir[tryArrForDir.length - 1]  === -directional){        // If you hit arrow opposite to direction of the snake reverse the snake's direction(instead of crashing the game)
            snakeTail = []
            tryArrForDir = [directional]
            currentSnake.reverse()
            tryArrForDir.push(currentSnake[0] - currentSnake[1])            // Making sure that when reversed snake goes in direction it's tail was pointing
        }else{
            tryArrForDir.push(directional)                                  // if pressed more than one button, both are saved and used in interval(each tame interval calls function move() it uses first element of an array and removes it)
        }
    }

    // REACTING TO INPUT FROM THE KEYBOARD
    function control(e){
        switch(e.code){
            case 'ArrowLeft':
                directional = -1
                break
            case 'ArrowRight':
                directional = 1
                break
            case 'ArrowUp':
                directional = -width
                break
            case 'ArrowDown':
                directional = width
                break
        }
        reverseOrNot()
    }
    document.addEventListener('keydown', control)
    startBnt.addEventListener('click', gameStartReset)
})