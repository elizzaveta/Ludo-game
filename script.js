let last_user_roll;

let houses_void_user = [];
let houses_avaliable_comp = ["00000","000000","0000000","00000000"];
let houses_void_comp = [];

function roll_the_cube(player){
    if(game.type_of_move===0){
        let number = Math.floor(Math.random() * 6 +1);
        imitate_roll(number);

        if(player===1) {
            last_user_roll = number;
            game.type_of_move = 1;
            document.getElementById("tips").innerText = "move";
            //console.log("type of move " + game.type_of_move);


            let been_here = 0;

            if (game.user_has_stones_on_board === 0 && last_user_roll !== 6) {
                game.type_of_move = 0;
                document.getElementById("tips").innerText = "roll the cube";
                //.log("BUT type of move " + game.type_of_move);

                been_here++;
                opponent_move();
            }
            if (!board.check_all_positions(1)) {
                //console.log("BUT type of move " + game.type_of_move);
                document.getElementById("tips").innerText = "roll the cube";
                game.type_of_move = 0;



                if(been_here ===0 )opponent_move();
            }
        }


    }
}

function imitate_roll(number){
    let hide_dots = get_dots_to_hide(number);
    for(let i = 0; i<9;i++){
        if(hide_dots[i] === 0){
            let elem_name = "cube"+(i+1);
            let dot = document.getElementById(elem_name);
            dot.style.visibility = "hidden"
        }
        else if(hide_dots[i] === 1){
            let elem_name = "cube"+(i+1);
            let dot = document.getElementById(elem_name);
            dot.style.visibility = "visible"
        }
    }
}

function get_dots_to_hide(number){
    switch (number){
        case 1: return [0,-1,0,0,1,0,0,-1,0]; break;
        case 2: return [1,-1,0,0,0,0,0,-1,1]; break;
        case 3: return [1,-1,0,0,1,0,0,-1,1]; break;
        case 4: return [1,-1,1,0,0,0,1,-1,1]; break;
        case 5: return [1,-1,1,0,1,0,1,-1,1]; break;
        case 6: return [1,-1,1,1,0,1,1,-1,1]; break;
    }
}


function move_the_user_stone(idd){
    //console.log("game.user "+ game.user_has_stones_on_board+"    last roll "+last_user_roll);

    if(game.user_has_stones_on_board ===0 && last_user_roll !== 6){
        game.type_of_move = 0;
        document.getElementById("tips").innerText = "roll the cube";
       // console.log("type of move "+game.type_of_move);
        return;
    }

    if(game.type_of_move === 1){
        let color = document.getElementById(idd).style.background;
        //console.log(Number(idd));
        //console.log(color);

        let id = Number(idd);
        if((color !== "#3cbf3c" && color!=="rgb(60, 191, 60)" )&& id!==0) return;
        //console.log("move");


        if(board.check_if_move_is_possible(id,1)){

            if(Number(idd)===0) houses_void_user.push(idd);

            let item = document.getElementById(idd);
            if(id === 0) item.style.background ="lightgreen";
            else item.style.background = "#9e9287";



            let where_to_put = board.make_move(id, 1);




            let new_item = document.getElementById(String(where_to_put));
            new_item.style.background = "#3cbf3c";


            game.type_of_move = 0;
            document.getElementById("tips").innerText = "roll the cube";

        }
        else{
            return;
        }

        board.check_for_win(1);

        if(last_user_roll === 6)return;



    }
    console.log("moveeeeeeeeeeeeeeeeeeeeee func")
    opponent_move();
}


function opponent_move(){
    let ai_player = new Ai_player();
    ai_player.make_move();

    if(ai_player.has_moves){
        let take = ai_player.take;
        let put = ai_player.put;

        if(take===0){
            take = houses_avaliable_comp.pop();
            houses_void_comp.push(take);
        }
        let item = document.getElementById(String(take));
        if(Number(take)!==0) item.style.background = "#9e9287";
        else item.style.background = "khaki";

        document.getElementById(String(put)).style.background = "#d5c853";

    }

}

function color_house_stone_back(idd, player){
    console.log(idd+"baaaaaaaack***")
    let item = document.getElementById(idd);
    if(player===1)item.style.background ="#3cbf3c";
    else item.style.background ="#d5c853";

}

//player: 2-comp
//        1-user
class Board{
    constructor() {
        this.houses = [0,0,0,0,
            0,0,0,0];
        this.positions = [0,0,0,0,
            0,0,0,0];
        this.board_taken_stones = [0,0,0,0,0,0,0,0,0,0,
                                    0,0,0,0,0,0,0,0,0,0];
    }
    check_if_move_is_possible(idd, player){ //so far just for user
        if(idd===0 && last_user_roll !==6) return false;
        if(idd===0 && last_user_roll ===6 && this.board_taken_stones[0]===1)return false;
        if(idd===0 && last_user_roll ===6 && this.board_taken_stones[0]!==1) return true;
        if(idd>20) return false;
        let sum_position = idd + last_user_roll;
        if(sum_position>24)return false;
        if(sum_position > 20){
            if(this.houses[sum_position-21] === 0)return true;
            return false;
        }else{
            if(this.board_taken_stones[sum_position-1]!==1) return true;
            return false;
        }

    }
    make_move(idd,player){ //so far just for user
        if(idd>0){
            this.board_taken_stones[idd-1]=0;
            if(idd+last_user_roll < 21 ){
                this.put_on_opponents_stone(idd+last_user_roll,1);
                this.board_taken_stones[idd-1+last_user_roll] = player;
                this.update_position(idd,idd+last_user_roll,1);
            }
            else{
                this.houses[idd-1+last_user_roll - 20] = 1;
                this.update_position(idd,idd+last_user_roll,1);
                game.user_has_stones_on_board--;
            }

            return idd+last_user_roll;
        }
        else{
            this.board_taken_stones[0] = player;
            if(player===1) game.user_has_stones_on_board+=1;
            this.update_position(0,1,1);
            this.put_on_opponents_stone(1,1);
            return 1;
        }
    }
    make_move_for_comp(take, put){
        if(take !== 0){
            this.board_taken_stones[take-1]=0;
        }
        if(put < 21){
            this.put_on_opponents_stone(put,2);
            this.board_taken_stones[put-1]=2;
        }
        else this.houses[put-21]=1;// or =2(?)

    }
    put_on_opponents_stone(put, player){
        if(put<=20){
            let op_stone_id;
            if(player===1) op_stone_id = 2;
            else op_stone_id = 1;
            if(this.board_taken_stones[put-1]===op_stone_id){
                if(player===2){
                    color_house_stone_back(houses_void_user.pop(),1);
                    game.user_has_stones_on_board--;
                }else{
                    let id = houses_void_comp.pop();
                    houses_avaliable_comp.push(id);
                    color_house_stone_back(id,2);
                }
                alert("put "+put);
                this.roll_back_to_house(put,player);

                console.log("updated --------------------- positions: "+board.positions);
                //!!!!!!!!!!!color the house stone and change positions
            }
        }
    }
    roll_back_to_house(take, op_player){
        let i = 0,a = 4;
        if(op_player === 1){
            i =4;
            a = 8;
            if(take<11)take+=10;
            else take-=10;
        }
        for(i;i<a;i++){
            if(this.positions[i]===take){
                this.positions[i]=0;
                return;
            }
        }
    }
    make_move_for_comp1(idd, number){
        if(idd>0) {
            if (idd < 11) {
                idd -= 10;
                this.board_taken_stones[idd - 1] = 0;

            } else {
                idd += 10;
                this.board_taken_stones[idd - 1] = 0;

            }
            let sum_position = idd + number;
            if (sum_position < 11) {
                sum_position += 10;
                this.board_taken_stones[sum_position - 1] = 2;
            } else {
                sum_position -= 10;
                this.board_taken_stones[sum_position - 1] = 2;
            }

        }
        else if(idd === 0){
            board.board_taken_stones[10] = 2;

        }


    }
    update_position(take, put, player){//make less code
        if(player === 1){
            for(let i = 0; i< 4;i++){
                if(this.positions[i]===take){
                    this.positions[i]=put;
                    return;
                }
            }
        }
        if(player===2){
            for(let i = 4; i< 8;i++){
                if(this.positions[i]===take){
                    this.positions[i]=put;
                    return;
                }
            }
        }
    }
    check_all_positions(player){
        if(player===1){
            for(let i = 0; i< 4;i++){
                if( this.check_if_move_is_possible(this.positions[i]))return true
            }
            return false;
        }
    }
    check_for_win(player){
        if(player===1){
            if(player===1){
                for(let i = 0; i< 4;i++){
                    if(this.positions[i] < 21 )return false;
                }
                alert("game over")
                return true;
            }
        }
    }
    get_possible_moves_(number){
        let result_array = [];
        for(let i = 4; i< 8;i++){
            if(this.positions[i]<21){
                let sum_position = this.positions[i] +number;
                if(sum_position === 6 && this.board_taken_stones[10]!==2 ) result_array.push(i-4);
                else if(sum_position > 20 && sum_position<25 && this.houses[4+sum_position-21]===0) {
                    console.log("+++++++++++++++++++++++++2 checked houses " +(4+sum_position-21));
                    result_array.push(i - 4);
                }
                else if(sum_position>10 && sum_position<21 && this.board_taken_stones[sum_position-11]!==2) {
                    console.log("+++++++++++++++++++++++++3 checked board_taken_stones " +(sum_position-11));
                    result_array.push(i - 4);
                }
                else if(sum_position<11 && sum_position !== number && this.board_taken_stones[sum_position+10]!==2){
                    console.log("+++++++++++++++++++++++++4 checked board_taken_stones " +(sum_position+10));
                    result_array.push(i-4);
                }
            }

        }
        return result_array;
    }
}

//type of move: 0-roll the cube
//              1-stone move
class Game{
    constructor() {
        this.type_of_move = 0;
        this.user_has_stones_on_board = 0;
        this.comp_has_stones_on_board = 0;
        this.who_moves = 1;
    }

}

let board = new Board();
let game = new Game();

class Ai_player{
    constructor() {
        this.take;
        this.put;
        this.has_moves = false;

    }
    make_move(){

        this.example_random_move();

    }

    example_random_move(){

        let number = Math.floor(Math.random() * 6 +1);
        imitate_roll(number);
        console.log(number+"---------- here fuck")

        let possible_moves = board.get_possible_moves_(number);

        if(possible_moves.length > 0){
            this.has_moves = true;
            console.log(possible_moves);
            let take_index = Math.floor(Math.random() * possible_moves.length);
            this.take = board.positions[possible_moves[take_index]+4];



            if(this.take === 0)board.positions[possible_moves[take_index]+4] = 1;
            else board.positions[possible_moves[take_index]+4] = this.take+number;


            let sum_position = this.take +number;

            if(this.take===0){

            }
            else if (this.take < 11) {
                this.take += 10;

            } else if(this.take>10) {
                this.take -= 10;
            }


            if(this.take===0){
                sum_position=11;
            }
            else if(sum_position>20){
                sum_position+=4;
            }
            else if(sum_position < 11){
                sum_position+=10;
            }else{
                sum_position-=10
            }

            this.put = sum_position;

            // if(this.take===0) this.put = 11;
            // else this.put = number + this.take;
            //
            // if(this.put>20) this.put+=4;


            console.log("chosen random index = "+take_index+" move from = "+this.take+"  move to = " + this.put);

            board.make_move_for_comp(this.take,this.put);

            console.log("positions: "+board.positions);
            console.log("houses: "+board.houses);
            console.log("all board: "+board.board_taken_stones);
        }

    }
}


























