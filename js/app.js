//On initialise les variables
var col = 7;
var row = 6;
var turnCount = 0;
var downArrow = '<img class="img-fluid" src="https://www.techwalla.com/ui/images/icons/down4.svg" alt="Jouer cette colonne">';
var draw = 0;
var score1 = 0;
var score2 = 0;
var board = $('#board');
var player1;
var player2;

//On initialise les th
for(var i = 0; i < col; i++){
    $('#tableHead').append('<th class="yellow topCol text-center" id="' + i + '">' + downArrow + '</th>');
}

//On initialise la grille de jeu
for(var j = 0; j < row; j++){
    board.append('<tr id="ligne' + j + '">');
    for(var k = 0; k < col; k++){
        $('#ligne' + j).append('<td class="white" id="'+ (k+1) + j  +'"> </td>');
    }
    board.append('</tr>');
}

//Au clic sur le bouton, on lance le jeu
$('#start').click(function (){
    //On récupère les valeur des inputs
    player1 = $('#inputPlayer1').val();
    player2 = $('#inputPlayer2').val();

    //Si rien n'a été entré dans les inputs ou qu'ils font + de 15 caractères, on leur met une valeur par défaut
    if(!player1 || player1.length > 15){
        player1 = 'Joueur 1';
    }
    if(!player2 || player2.length > 15){
        player2 = 'Joueur 2';
    }

    //On initialise les champs qui contiennent les noms des joueurs, on cache les inputs et on "déroule" le jeu
    $('#turnColor').addClass('yellow');
    $('#player').html('À ' + player1 + ' de commencer');
    $('#player1').html(player1);
    $('#player2').html(player2);
    $('#inputs').slideUp();
    $('#game').slideDown();
});

//A chaque clique sur un th
$('.topCol').click(function(){
    //Si le th contient la classe .topCol
    if($('th').hasClass('topCol')) {
        //On s'en servira pour bloquer la boucle qui parcours la colonne
        var trouve = false;
        //On récup le numéro de la colonne via l'id du th
        var ligneId = $(this)[0].id;
        //On s'en servira pour récupérer l'id de la case qui vient d'être "remplie"
        var newPlay;
        //Initialisation du tableau de la colonne jouée
        var array = [];
        //On rempli le tableau avec les id de chaque td (+10 pour éviter la contrainte du '0x' sur la 1ère colonne, cela évitera des conditions fastidieuses plus tard)
        for (var i = row - 1; i > -1; i--) {
            array.push(Number(ligneId + i) + 10);
        }
        //Remplissage de la première case avec la classe .white trouvée dans le tableau grâce au parcours du tableau et la condition !trouve
        //P.s : si la colonne est pleine, rien ne se passe car le compteur de tour ne s'incrémente pas du fait qu'aucune condition n'est remplie
        for (var j = 0; j < row && !trouve; j++) {
            if ($('#' + array[j]).hasClass('white')) {
                //Pour savoir qui a joué
                if (turnCount % 2 === 0) {
                    tour('yellow', 'red', player2);
                } else {
                    tour('red', 'yellow', player1);
                }
                //On récup l'id de la case qu'on vient de "remplir"
                newPlay = array[j];
                //On incrémente le compteur de tours
                turnCount++;
                //On change trouve en true si une case a bien été remplie, donc la boucle s'arrête
                trouve = true;
            }
        }
        //On call la fonction vérification avec l'id de la case qu'on vient de remplir
        verification(newPlay);
    }

    //Fonction appellée dans la boucle pour changer la couleur de la case remplie ainsi que tout ce qui correspond au tour du joueur
    function tour(a, b, c) {
        $('#' + array[j]).removeClass('white').addClass(a);
        $('th').removeClass(a).addClass(b);
        $('#turnColor').removeClass(a).addClass(b);
        $('#player').html('À ' + c + ' de jouer');
    }
});

//Bouton #reset
$('#reset').click(function(){
    reset();
});

//Bouton #hardReset, avec remise à zéro des scores
$('#hardReset').click(function(){
    reset();
    score1 = score2 = draw = 0;
    $('#score1').html(score1);
    $('#score2').html(score2);
    $('#draw').html(draw);
});

//Fonction de vérification des conditions de victoire
function verification(id){
    //On récupère les classes de la case #id (autrement dit, celle qui vient d'être "remplie"
    var casePlayed = $('#'+id).attr('class');

    //On s'en servira pour récup l'id modifié par des calculs pour comparer la case jouée à celles autour
    //De ce fait, les comparaisons partent TOUJOURS de la case qui vient d'être jouée
    //On peut donc jouer sur n'importe quelle taille de grille, la façon de vérifier ne change pas
    function around(idMod){
        return $('#'+idMod).attr('class');
    }

    //Objet qui récupère l'id de la case jouée et fait le calcul pour comparer les cases EN DESSOUS
    var vert = {
        bot3 : Number(id)+3,
        bot2 : Number(id)+2,
        bot1 : Number(id)+1
    };

    //Objet qui récupère l'id de la case jouée et fait le calcul pour comparer les cases EN DIAGONALE
    //Haut Gauche -> Bas Droit en premier
    //Bas Gauche -> Haut Droit en second
    var diag = {
        topLeft3 : Number(id)-33,
        topLeft2 : Number(id)-22,
        topLeft1 : Number(id)-11,

        botRight3 : Number(id)+33,
        botRight2 : Number(id)+22,
        botRight1 : Number(id)+11,

        botLeft3 : Number(id)-27,
        botLeft2 : Number(id)-18,
        botLeft1 : Number(id)-9,

        topRight3 : Number(id)+27,
        topRight2 : Number(id)+18,
        topRight1 : Number(id)+9
    };

    //Objet qui récupère l'id de la case jouée et fait le calcul pour comparer les cases A L'HORIZONTALE du plus à gauche au plus à droite
    var hori = {
        left3 : Number(id)-30,
        left2 : Number(id)-20,
        left1 : Number(id)-10,

        right3 : Number(id)+30,
        right2 : Number(id)+20,
        right1 : Number(id)+10
    };

    //Fonction qui effectue les comparaisons
    function verif(a, b, c, d){
        //d = la case qui vient d'être jouée
        d = casePlayed;
        //On compare 'd' aux 3 autres cases dans toutes les directions et on s'assure qu'elle n'est pas 'undefined' (si la colonne est pleine par ex)
        if(d === a && d === b && d === c && d !== undefined){
            //En cas de condition réussie, on retire la classe .topCol pour rendre inutilisables les th
            $('th').removeClass('topCol');
            //Call de la fonction qui gère les scores
            compteurWin();
            //Pour gérer le cas particulier d'une victoire au 42ème (et dernier possible) coup, on retire 1 au compteur de coups pour éviter
            //un conflit avec le compteur de match nul
            turnCount--;
            //On modifie le texte du bouton de reset
            return $('#reset').html('Recommencer une partie');
        }
    }

    //Vérif des cases en dessous
    return verif(around(vert.bot1), around(vert.bot2), around(vert.bot3)) ||
    //Vérif des cases latérales
    verif(around(hori.left3), around(hori.left2), around(hori.left1)) ||
    verif(around(hori.left2), around(hori.left1), around(hori.right1)) ||
    verif(around(hori.left1), around(hori.right1), around(hori.right2)) ||
    verif(around(hori.right1), around(hori.right2), around(hori.right3)) ||
    //Vérif des cases en diagonales
    verif(around(diag.topLeft3), around(diag.topLeft2), around(diag.topLeft1)) ||
    verif(around(diag.topLeft2), around(diag.topLeft1), around(diag.botRight1)) ||
    verif(around(diag.topLeft1), around(diag.botRight1), around(diag.botRight2)) ||
    verif(around(diag.botRight1), around(diag.botRight2), around(diag.botRight3)) ||
    verif(around(diag.botLeft3), around(diag.botLeft2), around(diag.botLeft1)) ||
    verif(around(diag.botLeft2), around(diag.botLeft1), around(diag.topRight1)) ||
    verif(around(diag.botLeft1), around(diag.topRight1), around(diag.topRight2)) ||
    verif(around(diag.topRight1), around(diag.topRight2), around(diag.topRight3));
}

//Fonction qui gère les scores. Elle se base sur le compteur de tour pour savoir qui gagne.
//Modification des couleurs des th et de #turnColor ainsi qu'incrémentation du score du gagnant.
function compteurWin(){
    if(turnCount % 2 === 0){
        $('th').removeClass('yellow').addClass('red');
        $('#turnColor').removeClass('yellow').addClass('red');
        $('#player').html(player2 + ' a gagné !');
        $('#score2').html(++score2);
    } else {
        $('th').removeClass('red').addClass('yellow');
        $('#turnColor').removeClass('red').addClass('yellow');
        $('#player').html(player1 + ' a gagné !');
        $('#score1').html(++score1);
    }
}

//Fonction call sur le bouton #reset et #hardReset
function reset(){
    //Si le compteur de coups = 42 (maximum possible) et aucune victoire, match nul
    if (turnCount === 42) {
        $('#draw').html(++draw);
    }
    //Reset des td, des th, de #player, du compteur de coups et du texte du bouton #reset
    $('td').removeClass('red yellow').addClass('white');
    $('th').removeClass('red').addClass('yellow topCol');
    $('#player').html('À ' + player1 + ' de commencer');
    turnCount = 0;
    $('#reset').html('Recommencer la partie');
}