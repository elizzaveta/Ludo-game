let last_user_roll;

let houses_void_user = [];
let houses_available_comp = ["00000","000000","0000000","00000000"];
let houses_void_comp = [];

function roll_the_cube(player){
    if(game.type_of_move===0){
        let number = Math.floor(Math.random() * 6 +1);
        imitate_roll(number);

        last_user_roll = number;
        game.type_of_move = 1;
        document.getElementById("tips").innerText = "move";


        if (!board.check_all_positions(1)) {
            document.getElementById("tips").innerText = "roll the cube";
            game.type_of_move = 0;
            document.getElementById("tips").innerText = "roll the cube";
            opponent_move();
        }
        let show_last_numb = document.getElementById("user_last_cube_numb");
        show_last_numb.textContent = "Your last cube roll: "+last_user_roll;
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


    if(game.type_of_move === 1){
        let color = document.getElementById(idd).style.background;
        let id = Number(idd);
        if((color !== "#3cbf3c" && color!=="rgb(60, 191, 60)" )&& id!==0) return;


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

        if(board.check_for_win(1)) return;
        if(last_user_roll === 6)return;

    }
    let more_moves = opponent_move();

    if(board.check_for_win(2)) return;

    while(more_moves){
        more_moves = opponent_move();
    }
}


function opponent_move(){
    let ai_player = new Ai_player();
    let roll = ai_player.make_move();

    if(ai_player.has_moves){
        let take = ai_player.take;
        let put = ai_player.put;

        if(take===0){
            take = houses_available_comp.pop();
            houses_void_comp.push(take);
        }
        let item = document.getElementById(String(take));
        if(Number(take)!==0) item.style.background = "#9e9287";
        else item.style.background = "khaki";

        document.getElementById(String(put)).style.background = "#d5c853";

        if(roll===6) return true;
        else return false;

    }


}
 function show_game_over(player){
    let elem = document.getElementById("game_over");
    let text;
    if(player === 1)text = "Game over! You win.";
    else text = "Game over! You lose.";

    elem.textContent = text;
    elem.style.visibility = "visible";
 }


function color_house_stone_back(idd, player){
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
                this.update_position(idd,idd+last_user_roll,1, true);
            }
            else{
                this.houses[idd-1+last_user_roll - 20] = 1;
                this.update_position(idd,idd+last_user_roll,1, true);
                game.user_has_stones_on_board--;
            }

            return idd+last_user_roll;
        }
        else{
            this.board_taken_stones[0] = player;
            if(player===1) game.user_has_stones_on_board+=1;
            this.update_position(0,1,1, true);
            this.put_on_opponents_stone(1,1);
            return 1;
        }
    }
    make_move_user(take, number,if_undo){ //so far just for user
        if(take>0){
            this.board_taken_stones[take-1]=0;
            if(take+number < 21 ){
                this.board_taken_stones[take-1+number] = 1;
                this.update_position(take,take+number,1, false);
            }
            else{
                this.houses[take-1+number - 20] = 1;
                this.update_position(take,take+number,1, false);
                game.user_has_stones_on_board--;
            }

        }
        else{
            if(if_undo){
                this.board_taken_stones[take-1+number]=1;
                this.update_position(0,take+number,1, false);
            }
            else{
                this.board_taken_stones[0] = 1;
                this.update_position(0,1,1, false);

            }
            game.user_has_stones_on_board+=1;
        }
    }
    make_move_for_comp(take, put, if_real_move, if_just_first_move){//принимает в нотации юзера
        if(take !== 0){
            this.board_taken_stones[take-1]=0;
        }
        if(put < 21){
            if(if_real_move)this.put_on_opponents_stone(put,2);
            this.board_taken_stones[put-1]=2;   //double code in undo for user
        }
        else this.houses[put-21]=1;// or =2(?)

       this.update_position(take,put,2,if_just_first_move);

    }
    check_if_on_op_stone(put,player){
        if(put<=20){
            let op_stone_id;
            if(player===1) op_stone_id = 2;
            else op_stone_id = 1;
            if(this.board_taken_stones[put-1]===op_stone_id){
                return true;
            }
        }
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
                    houses_available_comp.push(id);
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
    update_position(take, put, player,if_just_first_move){//принимает в нотации юзера
        if(player === 1){
            for(let i = 0; i< 4;i++){
                if(this.positions[i]===take){
                    this.positions[i]=put;
                    return;
                }
            }
        }
        if(player===2){
            if(take===0){
            }
            else if(take >21){

            }
            else take = translate_take(take);

            if(take===0 && if_just_first_move){
                put=1;
            }
            else if(put>20){
            }
            else if(put ===0){
            }
            else if(put < 11){
                put+=10;
            }else{
                put-=10
            }

            for(let i = 4; i< 8;i++){
                if(this.positions[i]===take){
                    if(take === 0 && if_just_first_move)this.positions[i] = 1;
                    else this.positions[i] = put;
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
                alert("game over");
                show_game_over(1);
                return true;
            }
        }else{
            for(let i = 4; i< 8;i++){
                if(this.positions[i] < 21 )return false;
            }
            alert("game over");
            show_game_over(2);
            return true;
        }
    }
    get_possible_moves_(number){
        let result_array = [];
        for(let i = 4; i< 8;i++){
            if(this.positions[i]<21){
                let sum_position = this.positions[i] +number;
                if(sum_position === 6 && this.board_taken_stones[10]!==2 ) result_array.push(this.positions[i]);
                else if(sum_position > 20 && sum_position<25 && this.houses[4+sum_position-21]===0) {
                    result_array.push(this.positions[i]);
                }
                else if(sum_position>10 && sum_position<21 && this.board_taken_stones[sum_position-11]!==2) {
                    result_array.push(this.positions[i]);
                }
                else if(sum_position<11 && sum_position !== number && this.board_taken_stones[sum_position+9]!==2){
                    result_array.push(this.positions[i]);
                }
            }

        }
        return result_array;
    }
    get_possible_moves_for_user_with_cube(number){ //return real positions of stones
        let result_array = [];
        for(let i = 0; i< 4;i++){
            let sum_position = number + this.positions[i];
            if(sum_position === 6 && this.board_taken_stones[0]!==1 ) result_array.push(this.positions[i]);
            else if(sum_position > 20 && sum_position<21 && this.houses[sum_position-21]===0) {
                result_array.push(this.positions[i]);
            }
            else if(sum_position>10 && sum_position<21 && this.board_taken_stones[sum_position-1]!==1) {
                result_array.push(this.positions[i]);
            }
            else if(sum_position<11 && sum_position !== number && this.board_taken_stones[sum_position-1]!==1){
                result_array.push(this.positions[i]);
            }
        }
        return result_array;
    }
    if_possible_user(take){

        let result_array = [];
        for(let i = 1; i< 7;i++){
            let sum_position = take + i;
            if(sum_position === 6 && this.board_taken_stones[0]!==1 ) result_array.push(i);
            else if(sum_position > 20 && sum_position<25 && this.houses[sum_position-21]===0) {
                result_array.push(i);
            }
            else if(sum_position>10 && sum_position<21 && this.board_taken_stones[sum_position-1]!==1) {
                result_array.push(i);
            }
            else if(sum_position<11 && sum_position !== i && this.board_taken_stones[sum_position-1]!==1){
                result_array.push(i);
            }
        }
        return result_array;


    }
    if_move_possible_comp(take){
        let result_array = [];
        for(let i = 1; i< 7;i++){
            let sum_position = take + i;
            if(sum_position === 6 && this.board_taken_stones[10]!==2 ) result_array.push(i);
            else if(sum_position > 20 && sum_position<25 && this.houses[4+sum_position-21]===0) {
                result_array.push(i);
            }
            else if(sum_position>10 && sum_position<21 && this.board_taken_stones[sum_position-11]!==2) {
                result_array.push(i);
            }
            else if(sum_position<11 && sum_position !== i && this.board_taken_stones[sum_position+9]!==2){
                result_array.push(i);
            }
        }
        return result_array;
    }
    get_available_stones_take_positions(player){
        let i = 0, a = 4;
        if(player===2)  i = 4; a = 8;

        let result_array = [];

        for(i; i<a; i++){
            if(this.positions[i]<21) result_array.push(this.positions[i]);
        }
        return result_array;
    }
    count_value_player_left(){
        let sum = 0;
        for(let i = 0; i<4;i++){
            if(this.positions[i]<21){
                sum+=21-this.positions[i];
            }
        }
        for(let i = 4; i<8; i++){
            sum+=this.positions[i];             //может условие если больше 21
        }
        return sum;
    }
    undo_move_for_comp(take, put, if_opponent){ // в нотации юзера
        if(take<21 && take !== 0){
            if(if_opponent){
                //let u_put = translate_put(take,put-take);
                this.make_move_user(0,take,true);
            }
            else this.board_taken_stones[take-1]=0;
        }
        else if(take>20) this.houses[put-21]=0;

        if(put !== 0){
            //let u_put = translate_put(take,put-take);
            this.board_taken_stones[put-1]=2;
        }

        this.update_position(take,put,2, !if_opponent);
    }
    undo_user_move(taken, put, if_opponent){
        if(taken === 0){
            this.update_position(1,0,1, false);
            game.user_has_stones_on_board-=1;

            if(if_opponent){
                this.board_taken_stones[0] = 2;
                this.make_move_for_comp(0,put,false,!if_opponent);
            }
            else this.board_taken_stones[0] = 0; // or = 2 -  trek what was there
            //if 2 this.put_on_opponents_stone(1,1);
        }
        else{
            this.board_taken_stones[taken-1]=1;
            if(put < 21){
                //this.board_taken_stones[taken-1]=1;
                if(if_opponent){
                    //let c_put = translate_put(taken,put-taken);
                    this.make_move_for_comp(0,put, false, !if_opponent);
                }
                else this.board_taken_stones[put-1] = 0;

                this.update_position(put,taken,1, false);

            }else{
                this.houses[put - 21] = 0;
                this.update_position(put,taken,1, false);
                game.user_has_stones_on_board++;
            }
        }


    }
    if_stones_in_start_comp(){
        for(let i = 4; i<8; i++){
            if(this.positions[i]===0)return true;
        }
        return false;
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


class Ai_player{
    constructor() {
        this.take;
        this.put;
        this.has_moves = false;
    }
    make_move(){
        let number = Math.floor(Math.random() * 6 +1);
        imitate_roll(number);

        this.take = this.maximize(number,0);


        if(this.take >= 0){
            this.has_moves = true;


            this.put = translate_put(this.take, number);
            this.take= translate_take(this.take);


            if(this.take!==0 && board.board_taken_stones[10]!==2 && !board.check_if_on_op_stone(this.take,2) && number===6 && board.if_stones_in_start_comp()){
                //alert("on op");
                this.take = 0;
                this.put = 11;
            }


            board.make_move_for_comp(this.take,this.put, true, true);

        }

        return number;


    }

    maximize(number, depth){

        let best = -Infinity;
        let best_ind = -1;

        let possible_moves = board.get_possible_moves_(number);
        // console.log("позиции с которых доступен ход на "+number+": "+possible_moves);
        for(let i = 0; i<possible_moves.length;i++){
            let take_position = possible_moves[i];

            let comp_take = translate_take(take_position);
            let comp_put = translate_put(take_position, number);


            let opponent = board.check_if_on_op_stone(comp_put,2);
            board.make_move_for_comp(comp_take, comp_put, false, true);
            if(opponent) board.update_position(comp_put,0,1, false);


            let value = this.chance(take_position,"max",depth+1);

            board.undo_move_for_comp(comp_put,comp_take ,opponent);

            if(best<value){
                best_ind = take_position;
                best = Math.max(best, value);
            }
        }

        if(best_ind >= 0) console.log("FOUND BEST MAX COST " + best+" take " +best_ind);


        return best_ind;


    }
    chance(take,min_or_max, depth){
        //

        let sum = 0;

        for(let cube_number = 1; cube_number<7; cube_number++){
            let sum_position = take + cube_number;

            let value;

            console.log("______________"+cube_number);

            value = this.minimize(depth+1, cube_number);


            sum+= value;
        }
        return (sum/6);
    }
    minimize(depth, number){
        let available_stones = board.get_possible_moves_for_user_with_cube(number);
        // console.log("available stones positions   "+available_stones);

        let best = Infinity;

        for(let i = 0; i<available_stones.length;i++){
            let take = available_stones[i];
            let put = take+number;

            let opponent = board.check_if_on_op_stone(put,1);
            board.make_move_user(take, number, false);
            if(opponent) board.update_position(put,0,2, false);


            let value = board.count_value_player_left();


            board.undo_user_move(take,put,opponent);


            best = Math.min(best, value);

        }
        return best;
    }





}






function translate_take(take){
    if(take===0){}
    else if (take < 11) {
        take += 10;

    } else if(take>10) {
        take -= 10;
    }
    return take;
}

function translate_put(take, number){
    let put = take+number;
    if(take===0){
        put=11;
    }
    else if(put>20){
        put+=4;
    }
    else if(put < 11){
        put+=10;
    }else{
        put-=10
    }
    return put;
}

let board = new Board();
let game = new Game();























