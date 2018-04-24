/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/

var numSites = parseInt(readline());
var sites = [];
for (var i = 0; i < numSites; i++) {
    var inputs = readline().split(' ');
    var siteId = parseInt(inputs[0]);
    var x = parseInt(inputs[1]);
    var y = parseInt(inputs[2]);
    var radius = parseInt(inputs[3]);
    sites[i] = [siteId, x, y, radius];
}

// game loop
while (true) {
    var inputs = readline().split(' ');
    var gold = parseInt(inputs[0]);
    var touchedSite = parseInt(inputs[1]); // -1 if none
    var sitesState = [];
    for (var i = 0; i < numSites; i++) {
        var inputs = readline().split(' ');
        var siteId = parseInt(inputs[0]);
        var ignore1 = parseInt(inputs[1]); // used in future leagues
        var ignore2 = parseInt(inputs[2]); // used in future leagues
        var structureType = parseInt(inputs[3]); // -1 = No structure, 2 = Barracks
        var owner = parseInt(inputs[4]); // -1 = No structure, 0 = Friendly, 1 = Enemy
        var param1 = parseInt(inputs[5]);
        var param2 = parseInt(inputs[6]);
        sitesState[i] = [siteId, structureType, owner, param1, param2]; 
    }
    var numUnits = parseInt(readline());
    var units = [];
    for (var i = 0; i < numUnits; i++) {
        var inputs = readline().split(' ');
        var x = parseInt(inputs[0]);
        var y = parseInt(inputs[1]);
        var owner = parseInt(inputs[2]);
        var unitType = parseInt(inputs[3]); // -1 = QUEEN, 0 = KNIGHT, 1 = ARCHER
        var health = parseInt(inputs[4]);
        units[i] = [x,y,owner,unitType, health];
    }

    // Write an action using print()
    // To debug: printErr('Debug messages...');
    var reineAlliee = findReine(units);
    var coordsFuite = [0,0];
    var closestEnnemyKnight = [];
    //coordsFuite sera direction opposé du closest ennemy knight
    /*if(){

    }*/
    var sitePlusProche = closestFreeSite(reineAlliee[0],reineAlliee[1], sitesState, sites);

    var buildMove = [sitePlusProche[0], sitePlusProche[1]];

    //find free barracks
    var toBuild = findFreeBarracks(sitesState);
    /*if(toBuild.length != 0){
        var buildString = " ";
        for(var i = 0; i < toBuild.length; i++){
            if (gold >= 80){
                buildString += String(toBuild[i]) + " ";
                gold -= 80;
            }
        }
        buildString = buildString.slice(0,-1);
    }*/
    
    /* 
    * Décision Train
    * si aucun archer -> créer archer
    * si aucun géant -> créer géant && towerEnnemy > 0
    * sinon -> créer knight
    * 
    * Décision Queen
    * si touched && 0 caserne Archer -> build caserne Archer
    * si touched && 0 caserne Knight -> build caserne knight
    * si touched && 0 caser Giant -> build caserne giant
    * si touched && < 1 tower -> build tower
    * 
    * sinon move
    */
    var barrackKnight = arrayBuildings(sitesState, 'barrackKnight', 0);
    var barrackArcher = arrayBuildings(sitesState, 'barrackArcher', 0);
    var barrackGiant = arrayBuildings(sitesState, 'barrackGiant', 0);
    var tower = arrayBuildings(sitesState, 'tower', 0);

    //boolean needToBuild
    var needToBuild = (barrackKnight.length) > 0 && b(arrackArcher.length > 0) && (barrackGiant.length > 0) && (tower.length > 1);

    //décision Queen
    if (touchedSite == -1 || (touchedSite != -1 && findStatusforId(touchedSite, sitesState) == 2)){
        //on bouge, mais où ?
        if(needToBuild){
            print('MOVE',buildMove[0], buildMove[1]);
        } else {
            print('MOVE vers fuite')
        }
    } else {
        //on build, mais quoi ?
        if(barrackArcher.length === 0 ){
            print('BUILD', touchedSite, 'BARRACKS-ARCHER');
        } else if(barrackKnight.length === 0 ){
            print('BUILD', touchedSite, 'BARRACKS-KNIGHT');
        } else if(barrackGiant.length === 0 ){
            print('BUILD', touchedSite, 'BARRACKS-GIANT');
        } else {
            print('BUILD', touchedSite, 'TOWER');
        }
    }

    //décision Train
    if(toBuild.length != 0){
        print('TRAIN' + buildString);
    } else {
        print('TRAIN');
    }
}

function closestFreeSite(xReine,yReine, sitesState, sites){
    var close = [2000,2000, -1];
    var distClose = Math.abs(close[0] - xReine) + Math.abs(close[1] - yReine);
    for(var i = 0; i < sitesState.length; i++){
        if(sitesState[i][1] == -1){
            //find matching coords
            for(var j = 0; j < sitesState.length; j++){
                if(sitesState[i][0] == sites[j][0]){
                    var distSite = Math.abs(sites[j][1] - xReine) + Math.abs(sites[j][2] - yReine);
                    if(distSite <= distClose){
                        close = [sites[j][1], sites[j][2], sites[j][0]]; 
                    }
                }
            }
        }
    }
    return close;
}

function findReine(units){
    for(var i = 0; i < units.length; i++){
        if (units[i][2] === 0 && units[i][3] == -1){
            return units[i];    
        }    
    }
}

function findStatusforId(id, sitesState){
    for(var i = 0; i < sitesState.length; i++){
        if(sitesState[i][0] == id){
            return sitesState[i][1];
        }
    }
}

function findFreeBarracks(sitesState){
    var freeBarracks = [];
    for(var i = 0; i < sitesState.length; i++){
        if(sitesState[i][1] == 2 && sitesState[i][2] === 0 && sitesState[i][3] === 0){
            freeBarracks.push(sitesState[i][0]);
        }
    }
    return freeBarracks;
}

function arrayBuildings(sitesState, building, side){
    var toSearch = 0;
    var array = [];
    var builtUnit = "";
    switch(building){
        case 'tower':
            toSearch = 1;
            break;
        case 'barrackKnight':
            toSearch = 2;
            builtUnit = "knight";
            break;
        case 'barrackArcher':
            toSearch = 2;
            builtUnit = "archer";
            break;
        case 'barrackGiant':
            toSearch = 2;
            builtUnit = "giant";
            break;
    }
    for(var i = 0; i < sitesState.length; i++){
        if(sitesState[i][1] == toSearch && sitesState[i][2] === side){
            if(toSearch == 2){
                if((builtUnit === "knight" && sitesState[i][4] === 0) || (builtUnit === "archer" && sitesState[i][4] == 1) || (builtUnit === "giant" && sitesState[i][4] == 2)){
                    array.push(sitesState[i][0]);
                }
            } else {
                array.push(sitesState[i][0]);
            }
        }
    }
    return array;
}

function arrayUnits(units, type, side){
    var toSearch = 0;
    var array = [];
    switch(type){
        case 'reine':
            toSearch = -1;
            break;
        case 'knight':
            toSearch = 0;
            break;
        case 'archer':
            toSearch = 1;
            break;
        case 'giant':
            toSearch = 2;
            break;
    }
    for(var i = 0; i < units.length; i++){
        if(units[i][2] == side && units[i][3] === toSearch){
            array.push(units[i]);
        }
    }
    return array;
}