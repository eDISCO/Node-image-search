const googleImages = require('google-images');
var parse = require('csv-parse');
const fs = require('fs'); // filesystem
const http = require('http');
const dispatcher = require('httpdispatcher');
const util = require("util");

// The api keys here:
// Custom Search Engine ID (google)
const CSE = '';
// app API key (from google dev console)
const API_KEY = '';

client = googleImages(CSE, API_KEY);
/* Uncomment the lines below to execute parsing and create the fs structure  */
// csv file parsing here:
//firstly, try opening a file and listing all search queries:
//var original = fs.readFileSync('data/export.csv');
//parse(original, parsed);

function parsed(err, data) {
    data.forEach(function(current, index, array) {
        // for each line:
        // create new folder in the fs
        // where folder name: current[0]
        if (index == 0) {
            return
        }
        var search_term;
        if (current[1] == '') {
            search_term = current[2] + " " + current[3];
        } else {
            search_term = current[1];
        }
        console.log("the search term: ", search_term);
        var path = "fs/" + current[0] + "/";
        console.log("new path:", path);
        fs.stat(path,
            function(err, stats) {
                if (!err) {
                    if (stats.isDirectory()) {
                        console.log("Directory exists already");
                    }
                } else {
                    fs.mkdir(path,
                        function(exception) {
                            if (!exception) {
                                fs.writeFile(path + 'search_term', search_term,
                                    function(err) {
                                        if (err) throw err;
                                        console.log("File:", path + 'search_term', "was written");
                                    })

                            }

                        });
                }
            });
        // if directory does not exist:
        // ! fs.stat(path, callback)
        // open directory and create 'search_term' file
        // ! fs.mkdir(path, callback)
        // ! fs.open(path, flags, callback) flags = 'r' for reading
        // write search_term to the opened file.
        // ! fs.writeFile(file, data, callback)
        // close file.
        // ! fs.close(fd, callback)

    })
}
function get_dir_listing() {
    items = fs.readdirSync('fs/');
    items.forEach(function(item) {
        var path = 'fs/' + item + '/search_term';
        var result_path = 'fs/' + item + '/result';
        fs.readFile(path, 'utf8',
            function(err, data) {
                if (err) throw err;
                fs.stat(result_path,
                    function(err, stats) {
                        if (!err) {
                            if (stats.isFile()) {
                                console.log("File Exists Already");
                            }
                        } else {
                               console.log('searching for:', result_path);
                            client.search(data).then(function(images) {
                                console.log(err);
                                fs.writeFile(result_path, JSON.stringify(images),
                                    function(err) {
                                        if (err) throw err;
                                        console.log("file:", result_path, "written!");
                                    });
                            });

                        }


                    });
            });


    });


}
// uncomment get_dir_listing() to execute search queries on the fs structure
//get_dir_listing();
