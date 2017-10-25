var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    var embeddedStr = '<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">5-year-old: We don&#39;t have pizza enough.<br><br>Me: We had it three days in a row.<br><br>5: I know.</p>&mdash; James Breakwell (@XplodingUnicorn) <a href="https://twitter.com/XplodingUnicorn/status/922829170664792064?ref_src=twsrc%5Etfw">October 24, 2017</a></blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>';
    embeddedStr += '<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">When’s the best time to eat pizza?</p>&mdash; Jack&#39;s Pizza (@JacksPizza) <a href="https://twitter.com/JacksPizza/status/922981776552857600?ref_src=twsrc%5Etfw">October 25, 2017</a></blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>';
    embeddedStr += '<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Guys and gals which Pizza is the best???</p>&mdash; Ty🏄🏽 (@VillaTyler21) <a href="https://twitter.com/VillaTyler21/status/922978057299697666?ref_src=twsrc%5Etfw">October 25, 2017</a></blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>';
    embeddedStr += '<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">I, literally, love pizza! When ordering <a href="https://twitter.com/PapaJohnsHousTx?ref_src=twsrc%5Etfw">@PapaJohnsHousTx</a> on game days, enter code ALTUVE for a chance to meet me! <a href="https://t.co/AWjRMjVXkH">pic.twitter.com/AWjRMjVXkH</a></p>&mdash; Jose Altuve (@JoseAltuve27) <a href="https://twitter.com/JoseAltuve27/status/922649377411420161?ref_src=twsrc%5Etfw">October 24, 2017</a></blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>';
    res.render('index', { title: 'Twizza', twitterResults: embeddedStr });
});

router.get('/:sentiment', function(req, res, next) {
    var embeddedStr = '<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">5-year-old: We don&#39;t have pizza enough.<br><br>Me: We had it three days in a row.<br><br>5: I know.</p>&mdash; James Breakwell (@XplodingUnicorn) <a href="https://twitter.com/XplodingUnicorn/status/922829170664792064?ref_src=twsrc%5Etfw">October 24, 2017</a></blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>';
    embeddedStr += '<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">When’s the best time to eat pizza?</p>&mdash; Jack&#39;s Pizza (@JacksPizza) <a href="https://twitter.com/JacksPizza/status/922981776552857600?ref_src=twsrc%5Etfw">October 25, 2017</a></blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>';
    embeddedStr += '<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Guys and gals which Pizza is the best???</p>&mdash; Ty🏄🏽 (@VillaTyler21) <a href="https://twitter.com/VillaTyler21/status/922978057299697666?ref_src=twsrc%5Etfw">October 25, 2017</a></blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>';
    embeddedStr += '<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">I, literally, love pizza! When ordering <a href="https://twitter.com/PapaJohnsHousTx?ref_src=twsrc%5Etfw">@PapaJohnsHousTx</a> on game days, enter code ALTUVE for a chance to meet me! <a href="https://t.co/AWjRMjVXkH">pic.twitter.com/AWjRMjVXkH</a></p>&mdash; Jose Altuve (@JoseAltuve27) <a href="https://twitter.com/JoseAltuve27/status/922649377411420161?ref_src=twsrc%5Etfw">October 24, 2017</a></blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>';
    res.render('index', { title: 'Twizza', twitterResults: embeddedStr });
});

module.exports = router;
