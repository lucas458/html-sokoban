// MOVE BOX
// WIN

const AUDIO_SRC = [
    "assets/audio/move_box.ogg",
    "assets/audio/win.ogg"
];






const ITEMS = [
    "slot_brick",
    "slot_void",
    "slot_void_dot",
    "slot_box",
    "slot_box_active"
];
























var game                = document.getElementById("game");
var player              = null;
var audio_toggle_button = document.getElementById("audio_toggle_button");
var counter             = document.getElementById("counter");
var grid_width          = 0;
var grid_height         = 0;
var player_position     = {x: 0, y: 0};
var CURRENT_LEVEL       = 0;
var PLAYER_STEPS        = 0;
var PLAYER_CAN_CONTROL  = true;
var AUDIO_BUFFER        = new Audio();



function setCounter( valor = 0 ){
    PLAYER_STEPS = valor;
    counter.innerHTML = "Movimentos: " + valor;
}




function generateLevel( level_index = 0 ){

    setCounter(0);
    game.innerHTML = '';
    grid_width  = 0;
    grid_height = LEVELS[level_index].length;
    player_position = {x: 0, y: 0};

    for (let i = 0; i < LEVELS[level_index].length; i++){
        let temp = 0;
        for (let j = 0; j < LEVELS[level_index][i].length; j+=2){
            temp += LEVELS[level_index][i][j];
        }
        grid_width = Math.max(grid_width, temp);
    }

    game.style.gridTemplateColumns  = `repeat(${grid_width}, 32px)`;
    game.style.gridTemplateRows     = `repeat(${grid_height}, 32px)`;
    

    // LINE
    LEVELS[level_index].forEach((e, idx) => {

        let count = 0;

        for (let i = 0; i < e.length; i++){
            
            if ( i == 0 ){
                for (let j = 0; j < e[i]; j++){
                    count++;
                    let dummy = document.createElement('div');
                    dummy.classList.add('dummy'); 
                    game.appendChild(dummy);
                }

            }else{

                if ( e[i] == -2 ){
                    player_position.x = count;
                    player_position.y = idx;
                }

                for (let j = 0; j < e[i+1]; j++){
                    count++;
                    if ( e[i] != -1 ){
                        let slot = document.createElement('div');
                        slot.classList.add('slot');
                        if ( e[i] == 3 ){
                            slot.classList.add("slot_void");
                        }
                        else if ( e[i] == 4 ){
                            slot.classList.add("slot_void_dot");
                        }
                        slot.classList.add( ITEMS[ (e[i] < 0)? 1 : e[i] ] );
                        game.appendChild(slot);
                    }else{
                        let dummy = document.createElement('div');
                        dummy.classList.add('dummy');
                        game.appendChild(dummy);
                    }
                }
                i++;
            }


            if ( i >= e.length-1 ){
                for (let j = 0; j < grid_width - count; j++){
                    let dummy = document.createElement('div');
                    dummy.classList.add('dummy');
                    game.appendChild(dummy);
                }
            }


        }
        
    });


    let player_base = document.createElement('div');
    player_base.classList.add('player');
    player_base.id = 'player';
    player_base.style.left  = (player_position.x * 32) + 'px';
    player_base.style.top   = (player_position.y * 32) + 'px';
    game.appendChild(player_base);           
    player = document.getElementById("player");
    document.title = 'Sokoban #' + (level_index + 1);
    PLAYER_CAN_CONTROL = true;

}




window.onload = () => {
    generateLevel( 0 );
    game.style.opacity = 1;
};



function openLevel(index = 0){
    game.style.opacity = 0;
    setTimeout(()=>{
        generateLevel(index);
        setTimeout(()=>{
            game.style.opacity = 1;
        }, 200);
    }, 200);
}



function onClickBackLevel(){
    if ( CURRENT_LEVEL > 0 ){
        CURRENT_LEVEL--;
        openLevel(CURRENT_LEVEL);
    }
}



function onClickNextLevel(){
    if ( CURRENT_LEVEL < LEVELS.length-1 ){
        CURRENT_LEVEL++
        openLevel(CURRENT_LEVEL);
    }
}



function bufferPlay( src ){
    if ( !audio_toggle_button.classList.contains('audio_muted') ){
        AUDIO_BUFFER.src = src;
        AUDIO_BUFFER.play();
    }
}




function moveUp(){

    if ( !PLAYER_CAN_CONTROL ) return;
    let type = getSpriteTypeByPosition(player_position.x, player_position.y-1);
            
    if ( type.indexOf('box') >= 0 ){
        let type_next = getSpriteTypeByPosition(player_position.x, player_position.y-2);
        if ( type_next.indexOf("void") >= 0 &&  type_next.indexOf("box") < 0 ){
            let element_next = getElementSpriteByPosition(player_position.x, player_position.y-2);
            getElementSpriteByPosition(player_position.x, player_position.y-1).classList.remove("slot_box", "slot_box_active");
            element_next.classList.add("slot_box");
            element_next.classList.toggle("slot_box_active", element_next.classList.contains("slot_void_dot"));
            player_position.y--;
            player.style.top = (player.offsetTop - 32) + 'px';
            bufferPlay(AUDIO_SRC[0]);
            setCounter(PLAYER_STEPS+1);
        }
    }

    else if ( type != 'slot_brick' ){
        player_position.y--;
        player.style.top = (player.offsetTop - 32) + 'px';
        //bufferPlay(AUDIO_SRC[0]);
        setCounter(PLAYER_STEPS+1);
    }

    checkGameWin();

}






function moveDown(){

    if ( !PLAYER_CAN_CONTROL ) return;
    let type = getSpriteTypeByPosition(player_position.x, player_position.y+1);

    if ( type.indexOf('box') >= 0 ){
        let type_next = getSpriteTypeByPosition(player_position.x, player_position.y+2);
        if ( type_next.indexOf("void") >= 0 &&  type_next.indexOf("box") < 0 ){
            let element_next = getElementSpriteByPosition(player_position.x, player_position.y+2);
            getElementSpriteByPosition(player_position.x, player_position.y+1).classList.remove("slot_box", "slot_box_active");
            element_next.classList.add("slot_box");
            element_next.classList.toggle("slot_box_active", element_next.classList.contains("slot_void_dot"));
            player_position.y++;
            player.style.top = (player.offsetTop + 32) + 'px';
            bufferPlay(AUDIO_SRC[0]);
            setCounter(PLAYER_STEPS+1);
        }
    }

    else if ( type != 'slot_brick' ){
        player_position.y++;
        player.style.top = (player.offsetTop + 32) + 'px';
        //bufferPlay(AUDIO_SRC[0]);
        setCounter(PLAYER_STEPS+1);
    }

    checkGameWin();

}





function moveLeft(){

    if ( !PLAYER_CAN_CONTROL ) return;
    let type = getSpriteTypeByPosition(player_position.x-1, player_position.y);

    if ( type.indexOf('box') >= 0 ){
        let type_next = getSpriteTypeByPosition(player_position.x-2, player_position.y);
        if ( type_next.indexOf("void") >= 0 &&  type_next.indexOf("box") < 0 ){
            let element_next = getElementSpriteByPosition(player_position.x-2, player_position.y);
            getElementSpriteByPosition(player_position.x-1, player_position.y).classList.remove("slot_box", "slot_box_active");
            element_next.classList.add("slot_box");
            element_next.classList.toggle("slot_box_active", element_next.classList.contains("slot_void_dot"));
            player_position.x--;
            player.style.left = (player.offsetLeft - 32) + 'px';
            bufferPlay(AUDIO_SRC[0]);
            setCounter(PLAYER_STEPS+1);
        }
    }

    else if ( type != 'slot_brick' ){
        player_position.x--;
        player.style.left = (player.offsetLeft - 32) + 'px';
        //bufferPlay(AUDIO_SRC[0]);
        setCounter(PLAYER_STEPS+1);
    }

    checkGameWin();

}





function moveRight(){

    if ( !PLAYER_CAN_CONTROL ) return;
    let type = getSpriteTypeByPosition(player_position.x+1, player_position.y);

    if ( type.indexOf('box') >= 0 ){
        let type_next = getSpriteTypeByPosition(player_position.x+2, player_position.y);
        if ( type_next.indexOf("void") >= 0 &&  type_next.indexOf("box") < 0 ){
            let element_next = getElementSpriteByPosition(player_position.x+2, player_position.y);
            getElementSpriteByPosition(player_position.x+1, player_position.y).classList.remove("slot_box", "slot_box_active");
            element_next.classList.add("slot_box");
            element_next.classList.toggle("slot_box_active", element_next.classList.contains("slot_void_dot"));
            player_position.x++;
            player.style.left = (player.offsetLeft + 32) + 'px';
            bufferPlay(AUDIO_SRC[0]);
            setCounter(PLAYER_STEPS+1);
        }
    }
    else if ( type != 'slot_brick' ){
        player_position.x++;
        player.style.left = (player.offsetLeft + 32) + 'px';
        //bufferPlay(AUDIO_SRC[0]);
        setCounter(PLAYER_STEPS+1);
    }

    checkGameWin();

}




window.onkeydown = (event) => {

    if ( event.key == 'ArrowUp' ){
        moveUp();
    }else if ( event.key == 'ArrowDown' ){
        moveDown();
    }else if ( event.key == 'ArrowLeft' ){
        moveLeft();
    }else if ( event.key == 'ArrowRight' ){
        moveRight();
    }


    if ( !event.repeat ){
        if ( event.key == 'r' ){
            openLevel(CURRENT_LEVEL);
        }else if ( event.key == 'b' ){
            onClickBackLevel();
        }else if ( event.key == 'n' ){
            onClickNextLevel();
        }else if ( event.key == 'm' ){
            audio_toggle_button.classList.toggle('audio_muted');
        }else if ( event.key == 'g' ){
            directional.classList.toggle('directional_hidden');
        }
    }

};






function getSpriteTypeByPosition(x = 0, y = 0){
    if ( player_position.x == x && player_position.y == y ) return 'player';
    let type = game.querySelectorAll('div:not(.player)')[x%grid_width + y*grid_width].classList.value.split('slot ')[1];
    return (type)? type : 'dummy';
}



function getElementSpriteByPosition(x = 0, y = 0){
    return game.querySelectorAll('div:not(.player)')[x%grid_width + y*grid_width];
}



function checkGameWin(){
    if ( PLAYER_CAN_CONTROL ){
        if ( game.querySelectorAll('.slot_void_dot').length == game.querySelectorAll('.slot_box_active').length ){
            PLAYER_CAN_CONTROL = false;
            bufferPlay(AUDIO_SRC[1]);

            if ( CURRENT_LEVEL < LEVELS.length-1 ){
                CURRENT_LEVEL++;
                setTimeout(()=>{
                    openLevel(CURRENT_LEVEL);
                }, 500);
            }
        }
    }
}