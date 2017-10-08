var col = 7;
var row = 6;
var turnCount = 0;
var downArrow = '<img class="img-fluid" src="https://www.techwalla.com/ui/images/icons/down4.svg" alt="Jouer cette colonne">';
var draw = 0;
var score1 = 0;
var score2 = 0;
var board = $('#board');

for(var i = 0; i < col; i++){
    $('#tableHead').append('<th class="yellow topCol text-center" id="' + i + '">' + downArrow + '</th>');
}

for(var j = 0; j < row; j++){
    board.append('<tr id="ligne' + j + '">');
    for(var k = 0; k < col; k++){
        $('#ligne' + j).append('<td class="white" id="'+ (k+1) + j  +'"> </td>');
    }
    board.append('</tr>');
}

$('.topCol').click(function(){
    if($('th').hasClass('topCol')) {
        var trouve = false;
        var ligneId = $(this)[0].id;
        var newPlay;

        var array = [];
        for (var i = row - 1; i > -1; i--) {
            array.push(Number(ligneId + i) + 10);
        }

        for (var j = 0; j < row && !trouve; j++) {
            if ($('#' + array[j]).hasClass('white')) {
                if (turnCount % 2 === 0) {
                    tour('yellow', 'red', 'Joueur 2');
                } else {
                    tour('red', 'yellow', 'Joueur 1');
                }
                newPlay = array[j];
                turnCount++;
                trouve = true;
            }
        }
        verification(newPlay);
    }

    function tour(a, b, c) {
        $('#' + array[j]).removeClass('white').addClass(a);
        $('th').removeClass(a).addClass(b);
        $('#player').html(c);
    }
});

$('#reset').click(function(){
    reset();
});

$('#hardReset').click(function(){
    reset();
    score1 = score2 = 0;
    $('#score1').html(score1);
    $('#score2').html(score2);
});

function verification(id){
    var casePlayed = $('#'+id).attr('class');

    function around(idMod){
        return $('#'+idMod).attr('class');
    }

    var vert = {
        bot3 : Number(id)+3,
        bot2 : Number(id)+2,
        bot1 : Number(id)+1
    };

    var diag = {
        topLeft3 : Number(id)-33,
        topLeft2 : Number(id)-22,
        topLeft1 : Number(id)-11,

        topRight3 : Number(id)+27,
        topRight2 : Number(id)+18,
        topRight1 : Number(id)+9,

        botLeft3 : Number(id)-27,
        botLeft2 : Number(id)-18,
        botLeft1 : Number(id)-9,

        botRight3 : Number(id)+33,
        botRight2 : Number(id)+22,
        botRight1 : Number(id)+11
    };

    var hori = {
        left3 : Number(id)-30,
        left2 : Number(id)-20,
        left1 : Number(id)-10,

        right3 : Number(id)+30,
        right2 : Number(id)+20,
        right1 : Number(id)+10
    };

    //A modifier, en cas de win sur 42eme coup, mauvais fonctionnement
    function verif(a, b, c, d){
        d = casePlayed;
        if(d === a && d === b && d === c && d !== undefined){
                compteurWin();
                $('th').toggleClass('topCol');
            }
        if (turnCount === 42) {
                $('#draw').html(++draw);
                alert('Match Nul !');
            }

    }

    //Cases en dessous
    return verif(around(vert.bot1), around(vert.bot2), around(vert.bot3)) ||
    //Cases latérales
    verif(around(hori.left3), around(hori.left2), around(hori.left1)) ||
    verif(around(hori.left2), around(hori.left1), around(hori.right1)) ||
    verif(around(hori.left1), around(hori.right1), around(hori.right2)) ||
    verif(around(hori.right1), around(hori.right2), around(hori.right3)) ||
    //Cases diagonales
    verif(around(diag.topLeft3), around(diag.topLeft2), around(diag.topLeft1)) ||
    verif(around(diag.topLeft2), around(diag.topLeft1), around(diag.botRight1)) ||
    verif(around(diag.topLeft1), around(diag.botRight1), around(diag.botRight2)) ||
    verif(around(diag.botRight1), around(diag.botRight2), around(diag.botRight3)) ||
    verif(around(diag.botLeft3), around(diag.botLeft2), around(diag.botLeft1)) ||
    verif(around(diag.botLeft2), around(diag.botLeft1), around(diag.topRight1)) ||
    verif(around(diag.botLeft1), around(diag.topRight1), around(diag.topRight2)) ||
    verif(around(diag.topRight1), around(diag.topRight2), around(diag.topRight3));
}

function compteurWin(){
    if(turnCount % 2 === 0){
        alert('Joueur 2 a gagné !');
        $('#score2').html(++score2);
    } else {
        $('#score1').html(++score1);
        alert('Joueur 1 a gagné !');
    }
}

function reset(){
    $('td').removeClass('red yellow').addClass('white');
    $('th').removeClass('red').addClass('yellow');
    $('#player').html('Joueur 1');
    turnCount = 0;
}