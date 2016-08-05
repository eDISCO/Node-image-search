var express = require('express');
var router = express.Router();
var fs = require('fs');
const filepath = '/home/edo/node/fs/';
/* GET home page. */
router.get('/index/:itemid',
function(req, res, next) {
    // here we need to build a list of
    // image urls to be passed to the viewer
    // 1. open the result file, (check if it's a number?)
    var id = req.params.itemid;
    var out = '';
    fs.readFile(filepath + id + '/' + 'result',
    function(err, data) {
        if (err) throw err;
        object = JSON.parse(data);
        out = data;
        var query = fs.readFileSync(filepath + id + '/' + 'search_term');
        //console.log(object);
        res.render('index_item', {
            title: 'Express',
            itemid: id,
            object: object,
            out: data,
            query: query
        });
    });



});
router.get('/index',
function(req, res, next) {
    res.render('index', {
        title: 'Express'
    });
});
router.get('/indexstart',
function(req, res, next) {
    // need to get the first item that does not have done file:
    // get directory listing
    // iterate all items, try opening (done)
    // if (done) does not exist and (results) exist, redirect!
    // /home/edo/node/fs
    // this fails miserably if no items meet the requirements!!!!!!
    var stop = false;
    var itemid;
    var check = true;
    items = fs.readdirSync(filepath);
    items.forEach(function(glob) {
        var item = glob;
        if (!stop) {
            fs.stat(filepath + item + '/' + 'result',
            function(err, stats) {
                if (!err) {
                    fs.stat(filepath + item + '/' + 'done',
                    function(err, stats) {
                        if (err) {
                            stop = true;
                            itemid = item;

                        }
                    });
                }
            });
        }
    });
    var interval = setInterval(function() {
        if (stop && check) {
            res.redirect('/index/' + itemid);
            check = false;
            clearInterval(interval);
        }
    },
    25);

});
router.get('/next',
function(req, res, next) {
    //parse the get arguments,
    // write the done file (skipped or fileurl)
    // redirect to next item
    id = req.query.id;
    skipped = req.query.skipped;
    files = req.query.files;
    if (id == null) {
        res.end('Hi, no id!');
        return;
    }
    var path = filepath + id + '/' + 'done';
    if (skipped != null) {
        // skipped
        var data = 'skipped';
        console.log('skipping');
    } else {
        var data = files
        console.log('writting!');
    }
    fs.writeFile(path, data,
    function(err) {
        if (err) throw err;
        console.log("File:", path, "was written");
    });
    res.redirect('/indexstart');
});
module.exports = router;