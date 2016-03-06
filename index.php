<?php

?>
<!doctype html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7" lang=""> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8" lang=""> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9" lang=""> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js" lang=""> <!--<![endif]-->
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title>SurViva</title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="apple-touch-icon" href="apple-touch-icon.png">

        <link rel="stylesheet" href="css/normalize.min.css">
        <link rel="stylesheet" href="css/main.css">

        <script src="js/vendor/modernizr-2.8.3-respond-1.4.2.min.js"></script>
        
    </head>
    <body>
        <!--[if lt IE 8]>
            <p class="browserupgrade">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
        <![endif]-->

<!--
        <div class="header-container">
            <header class="wrapper clearfix">
                <h1 class="title">Nutrients</h1>
                <nav>
                    <ul>
                        <li><a href="index.html">Game</a></li>
                        <li><a href="nutrients.html">Nutrients</a></li>
                        <li><a href="#">Shop</a></li>
                    </ul>
                </nav>
            </header>
        </div>
        -->

        <div class="main-container">
            <div class="main wrapper clearfix">
                <article>
                    <h3 id="turn-count"></h3>
                </article>
                <article id="game-container">
                    <canvas id="nutrient-levels-canvas"></canvas>
                    <canvas id="health-level-canvas" class="healthBar"></canvas>
                    <br/><br/>
                </article>
                <h3>Choose one of found foods:</h3>
                <article id="food-container">
                </article>
                <!--
                <aside>
                    <h3>Legend</h3>
                    <p style="background-color:#2094ee">WATER</p>
                    <p style="background-color:#64ee20">VITAMINS</p>
                    <p style="background-color:#c7c7c7">MINERALS</p>
                    <p style="background-color:#ee2024">CARBONHYDRATES</p>
                    <p style="background-color:#a856ed">PROTEIN</p>
                    <p style="background-color:#ee9e20">FAT</p>
                </aside>
                -->
                <article>
                    <canvas id="nutrients-line-levels-canvas" style="padding-top: 200px"></canvas>
                </article>
                 <article>
                    -------------------------CHEATS-------------------------
                    <br/><br/>
                    <button onclick="game.DrawLineChart(1)">Update</button>
                    <button onclick="game.startAi()">START AI</button>
                    <button onclick="game.stopAi()">STOP AI</button>
                    <p id="money-count">Available € this turn: </p>
                    <input id="steps-input" type="text" width="50" value="20"/><button onclick="game.DrawLineChart( document.getElementById('steps-input').value )">Draw</button>
                    <div id="cart"></div>

                </article>

                

            </div> <!-- #main -->
        </div> <!-- #main-container -->

        <!--
        <div class="footer-container">
            <footer class="wrapper">
                <h3>footer</h3>
            </footer>
        </div>
        -->

        <script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
        <script>window.jQuery || document.write('<script src="js/vendor/jquery-1.11.2.min.js"><\/script>')</script>
        <script src="js/jqueryphp/jquery.php.js" type="text/javascript"></script>

<?php
$version = file_get_contents( "version" );

$jsInc = '<script src="js/chart/Chart.Core.js?v='. $version .'"></script>' .
        '<script src="js/chart/Chart.Doughnut.js?v='. $version .'"></script>' .
        '<script src="js/chart/Chart.Bar.js?v='. $version .'"></script>' .
        '<script src="js/chart/Chart.Line.js?v='. $version .'"></script>' .
        '<script src="js/chart/Chart.Radar.js?v='. $version .'"></script>' .
        '<script src="js/Stats.js?v='. $version .'"></script>' .
        '<script src="js/Ai.js?v='. $version .'"></script>' .
        '<script src="js/NutrientLevelValues.js?v='. $version .'"></script>' .
        '<script src="js/FoodGenerator.js?v='. $version .'"></script>' .
        '<script src="js/DrawFood.js?v='. $version .'"></script>' .
        '<script src="js/Game.js?v='. $version .'"></script>' .
        '<script src="js/main.js?v='. $version .'"></script>';

print $jsInc;

?>
        

        <!-- Google Analytics: change UA-XXXXX-X to be your site's ID. -->
        <script>
            /*(function(b,o,i,l,e,r){b.GoogleAnalyticsObject=l;b[l]||(b[l]=
            function(){(b[l].q=b[l].q||[]).push(arguments)});b[l].l=+new Date;
            e=o.createElement(i);r=o.getElementsByTagName(i)[0];
            e.src='//www.google-analytics.com/analytics.js';
            r.parentNode.insertBefore(e,r)}(window,document,'script','ga'));
            ga('create','UA-XXXXX-X','auto');ga('send','pageview');
            */
        </script>
    </body>
</html>