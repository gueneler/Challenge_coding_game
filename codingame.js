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
var firstTower = 0;

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
        var maxMine = parseInt(inputs[2]); // used in future leagues
        var structureType = parseInt(inputs[3]); // -1 = No structure, 2 = Barracks
        var owner = parseInt(inputs[4]); // -1 = No structure, 0 = Friendly, 1 = Enemy
        var param1 = parseInt(inputs[5]);
        var param2 = parseInt(inputs[6]);
        sitesState[i] = [siteId, structureType, owner, param1, param2, maxMine]; 
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
    /*var closestEnnemyKnight = arrayUnits(units, 'knight',1);
    //coordsFuite sera direction opposé du closest ennemy knight
    if(closestEnnemyKnight.length !== 0){
        if ((reineAlliee[0] - closestEnnemyKnight[0][0] > 0)){
            coordsFuite[0] = reineAlliee[0] + 60;
        } else {
            coordsFuite[0] = reineAlliee[0] - 60;
        }
        if ((reineAlliee[1] - closestEnnemyKnight[0][1] > 0)){
            coordsFuite[1] = reineAlliee[1] + 60;
        } else {
            coordsFuite[1] = reineAlliee[1] - 60;
        }
    }*/
    var sitePlusProche = closestFreeSite(reineAlliee[0],reineAlliee[1], sitesState, sites);

    var buildMove = [sitePlusProche[0], sitePlusProche[1]];

    //find free barracks
    var toBuild = findFreeBarracks(sitesState);

    var barrackKnight = arrayBuildings(sitesState, 'barrackKnight', 0);
    var barrackArcher = arrayBuildings(sitesState, 'barrackArcher', 0);
    var barrackGiant = arrayBuildings(sitesState, 'barrackGiant', 0);
    var tower = arrayBuildings(sitesState, 'tower', 0);
    var mines = arrayBuildings(sitesState, 'mine', 0);
    
    if (tower.length == 1){
        firstTower = tower[0];
    }

    /*if (firstTower !== 0){
        coordsFuite[0] = firstTower[1];
        coordsFuite[1] = firstTower[2];
    }*/
    //boolean needToBuild
    var NoNeedToBuild = (barrackKnight.length > 0 ) && (barrackArcher.length > 0)&& (barrackGiant.length > 0) && (tower.length > 1);

    /* 
    * Décision Queen
    * si touched && 0 caserne Knight -> build caserne Knight
    * si touched && 0 caserne Archer -> build caserne Archer
    * si touched && 0 caser Giant -> build caserne giant
    * si touched && < 1 tower -> build tower
    * 
    * sinon move
    */
    if (touchedSite == -1 || (touchedSite != -1 && (findStatusforId(touchedSite, sitesState) == 2 || findStatusforId(touchedSite, sitesState) == 1 || findStatusforId(touchedSite, sitesState) === 0))){
        //on bouge, mais où ?
        if(!NoNeedToBuild){
            var upMine = 0;
            if(findStatusforId(touchedSite, sitesState) === 0){
                for(var i = 0; i < sitesState.length; i++){
                    if(sitesState[i][0] == touchedSite && sitesState[i][3] < sitesState[i][5]){
                        upMine = 1;
                    }
                }
            }

            if(upMine !== 0){
                print('BUILD', touchedSite, 'MINE');
            } else {
                print('MOVE',buildMove[0], buildMove[1]);
            }
        } else {
            print('BUILD',/*coordsFuite[0], coordsFuite[1]*/firstTower, "TOWER");
        }
    } else {
        //on build, mais quoi ?
       /* var upMine = 0;
        if(findStatusforId(touchedSite, sitesState) === 0){
            for(var i = 0; i < sitesState.length; i++){
                if(sitesState[i][0] == touchedSite && sitesState[3] < sitesState[5]){
                    upMine = 1;
                }
            }
        }
        
        if(upMine !== 0){
            print('BUILD', touchedSite, 'MINE');
        }
        else */if(barrackKnight.length === 0 ){
            print('BUILD', touchedSite, 'BARRACKS-KNIGHT');
        } else if(mines.length <= 1){
            print('BUILD', touchedSite, 'MINE');
        } else if(tower.length === 0){
            print('BUILD', touchedSite, 'TOWER');
        } else if(barrackGiant.length === 0 ){
            print('BUILD', touchedSite, 'BARRACKS-GIANT');
        } else if(barrackArcher.length === 0 ){
            print('BUILD', touchedSite, 'BARRACKS-ARCHER');
        } else {
            print('BUILD', touchedSite, 'TOWER');
        }
    }

    var archers = arrayUnits(units, 'archer', 0);
    var knights = arrayUnits(units, 'knight', 0);
    var giants = arrayUnits(units, 'giant', 0);

    var towerEnnemy = arrayBuildings(sitesState, 'tower', 1);

    /* 
    * Décision Train
    * si aucun archer -> créer archer
    * si aucun géant -> créer géant && towerEnnemy > 0
    * sinon -> créer knight
    */

    var noNeedArcher = archers.length > 1 || barrackArcher.length === 0;
    var noNeedGiant = giants.length > 0 || barrackGiant.length === 0;
    //var noNeedKnight = knights.length > 6;

    if(toBuild.length != 0){
        var buildString = " ";
        if (gold >= 80 && noNeedArcher && noNeedGiant) {
            for(var i = 0; i < toBuild.length; i++){
                if(barrackKnight.includes(toBuild[i]) && gold >= 80){
                    buildString += String(toBuild[i]) +" ";
                    gold -= 80;
                }
            }
        }
        else if(!noNeedArcher && gold >= 100){
            for(var i = 0; i < toBuild.length; i++){
                if(barrackArcher.includes(toBuild[i]) && gold >= 100){
                    buildString += String(toBuild[i]) +" ";
                    gold -= 100;
                }
            }
        } 
        else if(towerEnnemy.length > 0 &&  !noNeedGiant && noNeedArcher && gold >= 140) {
            for(var i = 0; i < toBuild.length; i++){
                if(barrackGiant.includes(toBuild[i]) && gold >= 140){
                    buildString += String(toBuild[i]) +" ";
                    gold -= 140;
                }
            }
        }
        buildString = buildString.slice(0,-1);
    }

    if(toBuild.length != 0){
        print('TRAIN' + buildString);
    } else {
        print('TRAIN');
    }
}

function closestFreeSite(xReine,yReine, sitesState, sites){
    var close = [20000,20000, -1];
    //var distClose = Math.sqrt(((close[0] - xReine) * (close[0] - xReine)) + ((close[1] - yReine) * (close[1] - yReine)));
    var distClose = getDistance(close[0], close[1], xReine, yReine);
    for(var i = 0; i < sitesState.length; i++){
        if(sitesState[i][1] == -1){
            //find matching coords
            for(var j = 0; j < sitesState.length; j++){
                if(sitesState[i][0] == sites[j][0]){
                   // var distSite =  Math.sqrt(((sites[j][1] - xReine) * (sites[j][1] - xReine)) + ((sites[j][2] - yReine) * (sites[j][2] - yReine)));
                    var distSite = getDistance(sites[j][1], sites[j][2], xReine, yReine);
                    if(distSite <= distClose){
                        close = [sites[j][1], sites[j][2], sites[j][0]];
                        distClose = distSite;
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
        case 'mine':
            toSearch = 0;
            break;
    }
    for(var i = 0; i < sitesState.length; i++){
        if(sitesState[i][1] == toSearch && sitesState[i][2] == side){
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
        if(units[i][2] == side && units[i][3] == toSearch){
            array.push(units[i]);
        }
    }
    return array;
}

function getDistance ( x1, y1, x2, y2 ) {
	
	var 	xs = x2 - x1,
		ys = y2 - y1;		
	
	xs *= xs;
	ys *= ys;
	 
	return Math.sqrt( xs + ys );
};