/**
 * Created by debasis on 14/9/16.
 */


/**
 * Created by iftekar on 24/5/16.
 */

//var CryptoJS = require("crypto-js");
var CryptoJS = require("crypto-js/aes");


var express = require('express');

//var busboy = require('connect-busboy'); //middleware for form/file upload
//var path = require('path');     //used for file path
//var fs = require('fs-extra');
var app = express();
//app.use(busboy());// create our app w/ express
//var mongoose = require('mongoose'); 				// mongoose for mongodb
var port = process.env.PORT || 1033; 				// set the port
//var database = require('./config/database'); 			// load the database config
//var morgan = require('morgan');
/*var bodyParser = require('body-parser');
 var methodOverride = require('method-override');*/

/*// configuration ===============================================================
 //mongoose.connect(database.localUrl); 	// Connect to local MongoDB instance. A remoteUrl is also available (modulus.io)

 app.use(express.static(__dirname + '/public')); 		// set the static files location /public/img will be /img for users
 //app.use(morgan('dev')); // log every request to the console
 app.use(bodyParser.urlencoded({'extended': 'true'})); // parse application/x-www-form-urlencoded
 app.use(bodyParser.json()); // parse application/json
 app.use(bodyParser.json({type: 'application/vnd.api+json'})); // parse application/vnd.api+json as json
 app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request*/


var http = require('http').Server(app);





var bodyParser = require('body-parser');
app.use(bodyParser.json({ parameterLimit: 10000000,
    limit: '90mb'}));
app.use(bodyParser.urlencoded({ parameterLimit: 10000000,
    limit: '90mb', extended: false}));
var multer  = require('multer');
var datetimestamp='';
var filename='';
var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {

        console.log(file.originalname);
        filename=file.originalname.split('.')[0].replace(/ /g,'') + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1];
        console.log(filename);
        cb(null, filename);
    }
});


var EventEmitter = require('events').EventEmitter;

const emitter = new EventEmitter()
//emitter.setMaxListeners(100)
// or 0 to turn off the limit
emitter.setMaxListeners(0)

var upload = multer({ //multer settings
    storage: storage
}).single('file');


app.use(bodyParser.json({type: 'application/vnd.api+json'})); // parse application/vnd.api+json as json
//app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request*/

/*app.use(bodyParser.json()); // support json encoded bodies
 app.use(bodyParser.urlencoded({ extended: false })); // support encoded bodies*/


// routes ======================================================================
//require('./app/routes.js')(app);

// listen (start app with node nodeserver.js) ======================================

//app.use(express.limit('4M'));


app.use(function(req, res, next) { //allow cross origin requests
    res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});



/** API path that will upload the files */
app.post('/uploads', function(req, res) {
    datetimestamp = Date.now();
    upload(req,res,function(err){

        if(err){
            res.json({error_code:1,err_desc:err});
            return;
        }


        res.json({error_code:0,filename:filename});
    });
});

var mongodb = require('mongodb');
var db;
var url = 'mongodb://localhost:27017/testdb';

var MongoClient = mongodb.MongoClient;

MongoClient.connect(url, function (err, database) {
    if (err) {
        console.log(err);

    }else{
        db=database;

    }});




/*var mysql=require('mysql');

 var connection =mysql.createConnection({
 host:'influxiq.com',
 user:'influxiq_urbanh',
 password:'P@ss7890',
 database:'influxiq_hhealing'

 });

 connection.connect(function(error){

 if(!!error){
 console.log('error')
 } else{
 console.log('connected');
 }

 });*/

app.get('/',function(req,resp){

    /*connection.query("SELECT * FROM contentmanager ",function(error,rows,fields){

     if(!!error) console.log('error in db call ');
     else{

     console.log('success full query');
     //resp.send('Hello'+rows[0].fname);
     resp.send(JSON.stringify(rows));
     }

     });*/




    // Use connect method to connect to the Server
    /* MongoClient.connect(url, function (err, db) {
     if (err) {
     //   console.log('Unable to connect to the mongoDB server. Error:', err);
     } else {*/
    //HURRAY!! We are connected. :)
    //  console.log('Connection established to mongo db', url);


    var collection = db.collection('users');

    //Create some users
    var user1 = {name: 'modulus admin', age: 42, roles: ['admin', 'moderator', 'user']};
    var user2 = {name: 'modulus user', age: 22, roles: ['user']};
    var user3 = {name: 'modulus super admin', age: 92, roles: ['super-admin', 'admin', 'moderator', 'user']};

    // Insert some users
    collection.insert([user1, user2, user3], function (err, result) {
        if (err) {
            //  console.log(err);
            //    console.log('err-----mingo .. vag ');
        } else {
            //console.log('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
            ///resp.send(JSON.stringify(collection.find()));

            /*collection.find({},function(err,docs){

             console.log(docs.name);

             });*/
            var dbresults= [];

            collection.find().toArray(function(err, items) {

                //  console.log(items);
                //   console.log('-----------------------------------');
                //   console.log(items.length);

                var crypto = require('crypto');

                var secret = '123456';
                var hash = crypto.createHmac('sha256', secret)
                    .update('I love cupcakes')
                    .digest('hex');
                resp.send(hash);

                // resp.send(CryptoJS.AES.encrypt("123", "Key1"));

                ///dbresults.push(items);
            });

            /*console.log(dbresults);
             resp.send(JSON.stringify(dbresults));*/

            /*var findRestaurants = function(db, callback) {
             var cursor =collection('users').find();
             //resp.send(JSON.stringify(cursor));
             cursor.each(function(err, doc) {
             assert.equal(err, null);
             if (doc != null) {
             console.log(doc);
             } else {
             console.log('cb again');
             callback();
             }
             });
             };*/
            //db.close();
        }
    });

    // do some work here with the database.

    //Close connection
    //db.close();
    //  }
    //  });

    //resp.send(JSON.stringify('4545'));
});



app.get('/contentlist', function (req, resp) {


    /* MongoClient.connect(url, function (err, db) {
     if (err) {
     //  console.log('Unable to connect to the mongoDB server. Error:', err);
     } else {
     //HURRAY!! We are connected. :)
     // console.log('Connection established to mongo db', url);
     */

    var collection = db.collection('content_table_allanschuman');

    //Create some users
    var user1 = {name: 'modulus admin', age: 42, roles: ['admin', 'moderator', 'user']};
    var user2 = {name: 'modulus user', age: 22, roles: ['user']};
    var user3 = {name: 'modulus super admin', age: 92, roles: ['super-admin', 'admin', 'moderator', 'user']};

    // fetch some users


    collection.find().toArray(function(err, items) {

        //   console.log(items);
        //   console.log('-----------------------------------');
        //    console.log(items.length);
        resp.send(JSON.stringify(items));
        //db.close();
        ///dbresults.push(items);
    });




    // do some work here with the database.

    //Close connection
    //db.close();
    //}
    //});




});


app.get('/contentlistbyid/:id', function (req, resp) {
    /*connection.query("SELECT * FROM contentmanager where id = ? or parentid = ?",[req.params.id,req.params.id],function(error,rows,fields){

     if(!!error) console.log('error in db call ');
     else{

     console.log('success full query');
     //resp.send('Hello'+rows[0].fname);
     resp.send(JSON.stringify(rows));
     }

     });*/


    /*MongoClient.connect(url, function (err, db) {
     if (err) {
     //  console.log('Unable to connect to the mongoDB server. Error:', err);
     } else {
     //HURRAY!! We are connected. :)

     //   console.log('Connection established to mongo db', url);
     */

    var o_id = new mongodb.ObjectID(req.params.id);

    var collection = db.collection('content_table_allanschuman');

    collection.find({$or: [ { _id: o_id }, { parentid: req.params.id } ]}).toArray(function(err, items) {

        //  console.log(items);
        //   console.log('-----------------------------------');
        //  console.log(items.length);
        resp.send(JSON.stringify(items));
        // db.close();

    });


    //  }
    //});
});





app.post('/addcontent', function (req, resp) {



    /* res.header("Access-Control-Allow-Origin", "*");
     res.header("Access-Control-Allow-Headers", "X-Requested-With");
     */

    var content='';
    if(req.body.ctype=='html') content= (req.body.chtml);
    if(req.body.ctype=='text') content= (req.body.ctext);
    if(req.body.ctype=='image') content= req.body.image_url_url;

    ///console.log(JSON.parse(content));
    if(typeof (req.body.parentid)=='undefined') var parentid=0;
    else var parentid=req.body.parentid;
    var addtime=Date.now();

    value1 = {cname: req.body.cname, content: content, ctype: req.body.ctype,description:req.body.description,parentid:parentid,addtime:addtime};
//console.log("Insert command");



    /* MongoClient.connect(url, function (err, db) {
     if (err) {
     //  console.log('Unable to connect to the mongoDB server. Error:', err);
     } else {*/
    //HURRAY!! We are connected. :)
    //  console.log('Connection established to mongo db', url);


    var collection = db.collection('content_table_allanschuman');

    //Create some users
    /*var user1 = {name: 'modulus admin', age: 42, roles: ['admin', 'moderator', 'user']};
     var user2 = {name: 'modulus user', age: 22, roles: ['user']};
     var user3 = {name: 'modulus super admin', age: 92, roles: ['super-admin', 'admin', 'moderator', 'user']};*/

    // Insert some users
    collection.insert([value1], function (err, result) {
        if (err) {
            //   console.log(err);
            //   console.log('err-----mingo .. vag ');
        } else {
            //  console.log('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
            resp.send('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);

            //db.close();
            //db.close();
            /*resp.send((req));*/
        }
    });

    // do some work here with the database.

    //Close connection
    //db.close();
    /* }
     });*/





    /*connection.query('INSERT INTO contentmanager SET ?', value1, function (err,result) {
     if (err) {
     console.log("ERROR IN QUERY");
     } else {
     console.log("Insertion Successful." + result);
     console.log('Inserted ' + result.affectedRows + ' rows');
     resp.send(result);
     }
     });*/
    //resp.send((req));


});

app.post('/addcontact', function (req, resp) {



    /* res.header("Access-Control-Allow-Origin", "*");
     res.header("Access-Control-Allow-Headers", "X-Requested-With");
     */

    var addtime=Date.now();

    value1 = {address: req.body.address, comments: req.body.comments, email: req.body.email,fullname:req.body.fullname,interest:req.body.interest,phone:req.body.phone};
//console.log("Insert command");



    /* MongoClient.connect(url, function (err, db) {
     if (err) {
     // console.log('Unable to connect to the mongoDB server. Error:', err);
     } else {*/
    //HURRAY!! We are connected. :)
    //  console.log('Connection established to mongo db', url);


    var collection = db.collection('contacttable');

    //Create some users
    /*var user1 = {name: 'modulus admin', age: 42, roles: ['admin', 'moderator', 'user']};
     var user2 = {name: 'modulus user', age: 22, roles: ['user']};
     var user3 = {name: 'modulus super admin', age: 92, roles: ['super-admin', 'admin', 'moderator', 'user']};*/

    // Insert some users
    collection.insert([value1], function (err, result) {
        if (err) {
            //  console.log(err);
            //  console.log('err-----mingo .. vag ');
        } else {
            //  console.log('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
            resp.send('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);


            var mailer = require("nodemailer");

            // Use Smtp Protocol to send Email
            var smtpTransport = mailer.createTransport("SMTP",{
                service: "Gmail",
                auth: {
                    user: "itplcc40@gmail.com",
                    pass: "DevelP7@"
                }
            });

            var mail = {
                from: "Support <"+req.body.email+">",
                // to: "debasiskar007@gmail.com,debasis218@gmail.com,lannah@betoparedes.com",
                to: "schumanwebsite@gmail.com",
                subject: "New Contact Form Submission by "+req.body.fullname+" on allanschuman.com",
                //text: "Node.js New world for me",
                html: "<b>Name</b> :   "+req.body.fullname +"<br><b>Email</b> :   "+req.body.email+ "<br><b>Phone Number</b> :   "+req.body.phone +"<br><b>Interest</b> :   "+req.body.interest+"<br><b>Message</b> :   "+req.body.comments
            }

            smtpTransport.sendMail(mail, function(error, response){
                if(error){
                    //  console.log(error);
                }else{
                    //  console.log("Message sent: " + response.message);
                }

                resp.send((response.message));
                smtpTransport.close();
            });

            // console.log('success full query');
            //resp.send('Hello'+rows[0].fname);
            //db.close();
            /*resp.send((req));*/
        }
    });

    // do some work here with the database.

    //Close connection
    //db.close();
    /*   }
     });*/





    /*connection.query('INSERT INTO contentmanager SET ?', value1, function (err,result) {
     if (err) {
     console.log("ERROR IN QUERY");
     } else {
     console.log("Insertion Successful." + result);
     console.log('Inserted ' + result.affectedRows + ' rows');
     resp.send(result);
     }
     });*/
    //resp.send((req));


});





app.post('/rolelist', function (req, resp) {

    /*
     MongoClient.connect(url, function (err, db) {
     if (err) {
     //  console.log('Unable to connect to the mongoDB server. Error:', err);
     } else {
     */
    //HURRAY!! We are connected. :)
    //   console.log('Connection established to mongo db', url);

    var collection = db.collection('user_role');

    collection.find().toArray(function(err, items) {

        //   console.log(items);
        //   console.log('-----------------------------------');
        //  console.log(items.length);
        resp.send(JSON.stringify(items));
        //  db.close();
        ///dbresults.push(items);
    });


    //db.close();
    /*
     }
     });
     */




});
app.post('/contactlist', function (req, resp) {

    /*   MongoClient.connect(url, function (err, db) {
     if (err) {
     // console.log('Unable to connect to the mongoDB server. Error:', err);
     } else {
     */           //HURRAY!! We are connected. :)
    //  console.log('Connection established to mongo db', url);

    var collection = db.collection('contacttable');

    collection.find().toArray(function(err, items) {

        //     console.log(items);
        //     console.log('-----------------------------------');
        //     console.log(items.length);
        resp.send(JSON.stringify(items));
        // db.close();
        ///dbresults.push(items);
    });


    //db.close();
    /*
     }
     });
     */




});

app.post('/articlelist', function (req, resp) {

    /*  MongoClient.connect(url, function (err, db) {
     if (err) {
     //    console.log('Unable to connect to the mongoDB server. Error:', err);
     } else {
     */          //HURRAY!! We are connected. :)
    //   console.log('Connection established to mongo db', url);

    var collection = db.collection('article');

    collection.find().toArray(function(err, items) {

        //   console.log(items);
        //   console.log('-----------------------------------');
        //   console.log(items.length);
        resp.send(JSON.stringify(items));
        //  db.close();
        ///dbresults.push(items);
    });


    //db.close();
    /*
     }
     });
     */




});

app.post('/login', function (req, resp) {

    /*       if (err) {
     //HURRAY!! We are connected. :)
     //  console.log('Connection established to mongo db', url);
     MongoClient.connect(url, function (err, db) {
     //   console.log('Unable to connect to the mongoDB server. Error:', err);
     } else {
     */
    var collection = db.collection('userstable');

    var crypto = require('crypto');

    var secret = req.body.password;
    var hash = crypto.createHmac('sha256', secret)
        .update('password')
        .digest('hex');

    collection.find({email:req.body.email,password:hash}).toArray(function(err, items) {

        //    console.log(items);
        //    console.log('-----------------------------------');
        //    console.log(items.length);
        resp.send(JSON.stringify(items));
        //db.close();
        ///dbresults.push(items);
    });


    //db.close();
    /*       }
     });
     */



});

app.get('/adminlist', function (req, resp) {

    /*MongoClient.connect(url, function (err, db) {
     if (err) {
     //   console.log('Unable to connect to the mongoDB server. Error:', err);
     } else {*/
    //HURRAY!! We are connected. :)
    //  console.log('Connection established to mongo db', url);

    var collection = db.collection('userstable');

    collection.find().toArray(function(err, items) {

        //   console.log(items);
        //   console.log('-----------------------------------');
        //   console.log(items.length);
        resp.send(JSON.stringify(items));
        ///dbresults.push(items);
        //  db.close();
    });


    //db.close();
    /*       }
     });
     */



});


app.get('/medialist', function (req, resp) {

    /*   MongoClient.connect(url, function (err, db) {
     //  var o_id =new mongodb.ObjectID(req.body.video_type);
     var o_id = new mongodb.ObjectID(1);
     if (err) {
     //   console.log('Unable to connect to the mongoDB server. Error:', err);
     } else {
     */           //HURRAY!! We are connected. :)
    //   console.log('Connection established to mongo db', url);

    var collection = db.collection('media_youtube');

    collection.find().sort({'priority':-1}).toArray(function(err, items) {
        //  collection.find({video_type:o_id}).toArray(function(err, items) {

        //       console.log(items);
        //       console.log('-----------------------------------');
        //       console.log(items.length);
        resp.send(JSON.stringify(items));
        // db.close();
        ///dbresults.push(items);
    });


    //db.close();
    /*       }
     });
     */



});

app.get('/probonomedialist', function (req, resp) {
    // MongoClient.connect(url, function (err, db) {            //HURRAY!! We are connected. :)

    //  console.log('Connection established to mongo db', url);


    // var o_id = new mongodb.ObjectID(req.params.id);


    var collection = db.collection('media_youtube');

    collection.find({video_type:2}).toArray(function(err, items) {

        //    console.log(items);
        //      console.log('-----------------------------------');
        //      console.log(items.length);
        resp.send(JSON.stringify(items));
        // db.close();

    });



    /*       if (err) {
     //    console.log('Unable to connect to the mongoDB server. Error:', err);
     } else {
     }
     });*/

});


app.get('/stafflist', function (req, resp) {
    /*
     MongoClient.connect(url, function (err, db) {
     if (err) {
     //   console.log('Unable to connect to the mongoDB server. Error:', err);
     } else {*/
    //HURRAY!! We are connected. :)
    //   console.log('Connection established to mongo db', url);

    var collection = db.collection('staff');

    collection.find().toArray(function(err, items) {

        //      console.log(items);
        //      console.log('-----------------------------------');
        //      console.log(items.length);
        resp.send(JSON.stringify(items));
        //db.close();
        ///dbresults.push(items);
    });


    //db.close();
    // }
    //});




});

app.post('/addrole', function (req, resp) {

    var addtime=Date.now();
    var role_status=1;

    value1 = {role: req.body.role, addtime: addtime, role_status: role_status};
    //   console.log("Insert command");



    /*   MongoClient.connect(url, function (err, db) {
     if (err) {
     //       console.log('Unable to connect to the mongoDB server. Error:', err);
     } else {
     */           //HURRAY!! We are connected. :)
    //        console.log('Connection established to mongo db', url);


    var collection = db.collection('user_role');


    collection.insert([value1], function (err, result) {
        if (err) {
            //            console.log(err);
            //            console.log('err-----mingo .. vag ');
        } else {
            //           console.log('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
            resp.send('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);


            // db.close();
        }
    });


    /*      }
     });
     */

});

app.post('/addadmin', function (req, resp) {

    var addtime=Date.now();
    var role_status=1;

    var crypto = require('crypto');

    var secret = req.body.password;
    var hash = crypto.createHmac('sha256', secret)
        .update('password')
        .digest('hex');

    value1 = {fname: req.body.fname, lname: req.body.lname, email: req.body.email,password:hash,address:req.body.address,phone_no:req.body.phone_no,mobile_no:req.body.mobile_no,status:1,create_time:req.addtime};
    // console.log("Insert command");


    /*   MongoClient.connect(url, function (err, db) {
     if (err) {
     //      console.log('Unable to connect to the mongoDB server. Error:', err);
     } else {
     */            //HURRAY!! We are connected. :)
    //     console.log('Connection established to mongo db', url);


    var collection = db.collection('userstable');


    collection.insert([value1], function (err, result) {
        if (err) {
            //       console.log(err);
            //       console.log('err-----mingo .. vag ');
        } else {
            //      console.log('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
            resp.send('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);


            // db.close();
        }
    });


    /*       }
     });
     */

});
app.post('/addimagegallery', function (req, resp) {



    value1 = {title: req.body.title, status: 1, imagefile: req.body.imagefile,priority:req.body.priority};
    // console.log("Insert command");


    /*   MongoClient.connect(url, function (err, db) {
     if (err) {
     //      console.log('Unable to connect to the mongoDB server. Error:', err);
     } else {
     */           //HURRAY!! We are connected. :)
    //     console.log('Connection established to mongo db', url);


    var collection = db.collection('imagegallery');


    collection.insert([value1], function (err, result) {
        if (err) {
            //       console.log(err);
            //       console.log('err-----mingo .. vag ');
        } else {
            //      console.log('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
            resp.send('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);


            //        db.close();
        }
    });


    /*       }
     });
     */

});



app.post('/addstaff', function (req, resp) {

    var addtime=Date.now();
    var role_status=1;


    value1 = {title: req.body.title, designation: req.body.designation, email: req.body.email,phone:req.body.phone,description:req.body.description,picture:req.body.picture,type:req.body.type,status:1,create_time:req.addtime,featured:req.body.featured,priority:req.body.priority};
    //  console.log("Insert command");


    // MongoClient.connect(url, function (err, db) {
    //     if (err) {
    //    //     console.log('Unable to connect to the mongoDB server. Error:', err);
    //     } else {
    //HURRAY!! We are connected. :)
    //      console.log('Connection established to mongo db', url);


    var collection = db.collection('staff');


    collection.insert([value1], function (err, result) {
        if (err) {
            //           console.log(err);
            //          console.log('err-----mingo .. vag ');
        } else {
            //         console.log('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
            resp.send('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);

            // db.close();

        }
    });


    /*       }
     });
     */

});

app.post('/addarticle', function (req, resp) {

    var addtime=Date.now();
    var role_status=1;

    value1 = {title: req.body.title,description: req.body.description, createdby: req.body.createdby,createdtime:addtime,image: req.body.image,status: 1,video: req.body.video,externallink: req.body.externallink,priority:req.body.priority};


    /*
     MongoClient.connect(url, function (err, db) {
     if (err) {
     //   console.log('Unable to connect to the mongoDB server. Error:', err);
     } else {
     */
    //HURRAY!! We are connected. :)
    //   console.log('Connection established to mongo db', url);


    var collection = db.collection('article');


    collection.insert([value1], function (err, result) {
        if (err) {
            //     console.log(err);
            //    console.log('err-----mingo .. vag ');
        } else {
            //    console.log('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
            resp.send('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);

            //db.close();

        }
    });


    /*
     }
     });
     */


});


app.post('/addmedia', function (req, resp) {

    var addtime=Date.now();
    var role_status=1;

    value1 = {media_name: req.body.media_name,media_file: req.body.media_file, priority: req.body.priority,status: 1,priority: req.body.priority,status: 1,add_time: addtime,video_type:req.body.video_type };
    //  console.log("Insert command");


    /*
     MongoClient.connect(url, function (err, db) {
     if (err) {
     //      console.log('Unable to connect to the mongoDB server. Error:', err);
     } else {
     */
    //HURRAY!! We are connected. :)
    //     console.log('Connection established to mongo db', url);


    var collection = db.collection('media_youtube');


    collection.insert([value1], function (err, result) {
        if (err) {
            //            console.log(err);
            //            console.log('err-----mingo .. vag ');
        } else {
            ///          console.log('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
            resp.send('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);

            //  db.close();

        }
    });


    /*
     }
     });
     */


});


app.get('/roledetails/:id', function (req, resp) {
    /*
     MongoClient.connect(url, function (err, db) {
     if (err) {
     //    console.log('Unable to connect to the mongoDB server. Error:', err);
     } else {
     */
    //HURRAY!! We are connected. :)

    //  console.log('Connection established to mongo db', url);


    var o_id = new mongodb.ObjectID(req.params.id);

    var collection = db.collection('user_role');

    collection.find({_id:o_id}).toArray(function(err, items) {

        //    console.log(items);
        //      console.log('-----------------------------------');
        //      console.log(items.length);
        resp.send(JSON.stringify(items));
        // db.close();

    });


    /*
     }
     });
     */

});
app.post('/admindetails', function (req, resp) {
    /* MongoClient.connect(url, function (err, db) {
     if (err) {
     //       console.log('Unable to connect to the mongoDB server. Error:', err);
     } else {*/
    //HURRAY!! We are connected. :)

    //      console.log('Connection established to mongo db', url);


    var o_id = new mongodb.ObjectID(req.body.id);

    var collection = db.collection('userstable');

    collection.find({_id:o_id}).toArray(function(err, items) {

        //    console.log(items);
        //    console.log('-----------------------------------');
        //    console.log(items.length);
        resp.send(JSON.stringify(items));
        //db.close();

    });

    /*       }
     });
     */
});


app.post('/articledetails', function (req, resp) {
    /*
     MongoClient.connect(url, function (err, db) {
     if (err) {
     //    console.log('Unable to connect to the mongoDB server. Error:', err);
     } else {
     */
    //HURRAY!! We are connected. :)

    //   console.log('Connection established to mongo db', url);


    var o_id = new mongodb.ObjectID(req.body.id);

    var collection = db.collection('article');

    collection.find({_id:o_id}).toArray(function(err, items) {

        console.log(items.length);
        resp.send(JSON.stringify(items));
        // db.close();

    });

    /*
     }
     });
     */

});

app.post('/staffdetails', function (req, resp) {
    /*  MongoClient.connect(url, function (err, db) {
     if (err) {
     //   console.log('Unable to connect to the mongoDB server. Error:', err);
     } else {
     */            //HURRAY!! We are connected. :)

    //   console.log('Connection established to mongo db', url);


    var o_id = new mongodb.ObjectID(req.body.id);

    var collection = db.collection('staff');

    collection.find({_id:o_id}).toArray(function(err, items) {

        //     console.log(items);
        //     console.log('-----------------------------------');
        //    console.log(items.length);
        resp.send(JSON.stringify(items));
        // db.close();

    });

    /*       }
     });
     */
});


app.post('/mediadetails', function (req, resp) {
    /*  MongoClient.connect(url, function (err, db) {
     if (err) {
     //   console.log('Unable to connect to the mongoDB server. Error:', err);
     } else {
     */           //HURRAY!! We are connected. :)

    // console.log('Connection established to mongo db', url);


    var o_id = new mongodb.ObjectID(req.body.id);

    var collection = db.collection('media_youtube');

    collection.find({_id:o_id}).toArray(function(err, items) {

        //    console.log(items);
        //    console.log('-----------------------------------');
        //    console.log(items.length);
        resp.send(JSON.stringify(items));
        //  db.close();

    });

    /*
     }
     });
     */

});



app.post('/deleterole', function (req, resp) {
    /*
     MongoClient.connect(url, function (err, db) {
     if (err) {
     //    console.log('Unable to connect to the mongoDB server. Error:', err);
     } else {
     */
    //HURRAY!! We are connected. :)

    //    console.log('Connection established to mongo db', url);


    var o_id = new mongodb.ObjectID(req.body.id);

    var collection = db.collection('user_role');
    collection.deleteOne({_id: o_id}, function(err, results) {
        if (err){
            resp.send("failed");
            throw err;
        }
        else {
            resp.send("success");
            //   db.close();
        }
    });


    /*
     }
     });
     */

});

app.post('/deletestaff', function (req, resp) {
    /*  MongoClient.connect(url, function (err, db) {
     if (err) {
     //    console.log('Unable to connect to the mongoDB server. Error:', err);
     } else {
     */           //HURRAY!! We are connected. :)

    //    console.log('Connection established to mongo db', url);


    var o_id = new mongodb.ObjectID(req.body.id);

    var collection = db.collection('staff');
    collection.deleteOne({_id: o_id}, function(err, results) {
        if (err){
            resp.send("failed");
            throw err;
        }
        else {
            resp.send("success");
            // db.close();
        }
    });


    /*
     }
     });
     */

});


app.post('/deletearticle', function (req, resp) {
    /*  MongoClient.connect(url, function (err, db) {
     if (err) {
     //  console.log('Unable to connect to the mongoDB server. Error:', err);
     } else {
     */           //HURRAY!! We are connected. :)

    //  console.log('Connection established to mongo db', url);

    var o_id = new mongodb.ObjectID(req.body.id);

    var collection = db.collection('article');
    collection.deleteOne({_id: o_id}, function(err, results) {
        if (err){
            resp.send("failed");
            throw err;
        }
        else {
            resp.send("success");
            // db.close();
        }
    });


    /*       }
     });
     */
});


app.post('/deletemedia', function (req, resp) {
    /*  MongoClient.connect(url, function (err, db) {
     if (err) {
     //    console.log('Unable to connect to the mongoDB server. Error:', err);
     } else {
     */           //HURRAY!! We are connected. :)

    //    console.log('Connection established to mongo db', url);


    var o_id = new mongodb.ObjectID(req.body.id);

    var collection = db.collection('media_youtube');
    collection.deleteOne({_id: o_id}, function(err, results) {
        if (err){
            resp.send("failed");
            throw err;
        }
        else {
            resp.send("success");
            // db.close();
        }
    });


    /*       }
     });
     */
});



app.post('/deleteadmin', function (req, resp) {
    /*  MongoClient.connect(url, function (err, db) {
     if (err) {
     //    console.log('Unable to connect to the mongoDB server. Error:', err);
     } else {*/
    //HURRAY!! We are connected. :)

    //   console.log('Connection established to mongo db', url);


    var o_id = new mongodb.ObjectID(req.body.id);

    var collection = db.collection('userstable');
    collection.deleteOne({_id: o_id}, function(err, results) {
        if (err){
            resp.send("failed");
            throw err;
        }
        else {
            resp.send("success");
            // db.close();
        }
    });


    //     }
    // });

});

app.post('/roleupdates', function (req, resp) {
    /*
     MongoClient.connect(url, function (err, db) {
     if (err) {
     //     console.log('Unable to connect to the mongoDB server. Error:', err);
     } else {
     */
    //HURRAY!! We are connected. :)

    //    console.log('Connection established to mongo db', url);


    var o_id = new mongodb.ObjectID(req.body.id);

    var collection = db.collection('user_role');
    collection.update({_id: o_id}, {$set: {role:req.body.role}},function(err, results) {
        if (err){
            resp.send("failed");
            throw err;
        }
        else {
            resp.send("success");
            //   db.close();

        }
    });


    /*
     }
     });
     */

});

app.post('/adminupdates', function (req, resp) {
    /*  MongoClient.connect(url, function (err, db) {
     if (err) {
     //    console.log('Unable to connect to the mongoDB server. Error:', err);
     } else {
     */          //HURRAY!! We are connected. :)

    //   console.log('Connection established to mongo db', url);


    var o_id = new mongodb.ObjectID(req.body.id);

    var collection = db.collection('userstable');
    collection.update({_id: o_id}, {$set: {fname: req.body.fname, lname: req.body.lname, email: req.body.email,address:req.body.address,phone_no:req.body.phone_no,mobile_no:req.body.mobile_no}},function(err, results) {
        if (err){
            resp.send("failed");
            throw err;
        }
        else {
            resp.send("success");
            // db.close();

        }
    });


    /*       }
     });
     */
});
app.post('/staffupdates', function (req, resp) {
    /*  MongoClient.connect(url, function (err, db) {
     if (err) {
     //     console.log('Unable to connect to the mongoDB server. Error:', err);
     } else {
     */           //HURRAY!! We are connected. :)

    //    console.log('Connection established to mongo db', url);


    var o_id = new mongodb.ObjectID(req.body.id);

    var collection = db.collection('staff');
    collection.update({_id: o_id}, {$set: {description: req.body.description,designation: req.body.designation,email: req.body.email,phone:req.body.phone,picture:req.body.picture,status:req.body.status,title:req.body.title,type:req.body.type,featured:req.body.featured,priority:req.body.priority }},function(err, results) {
        if (err){
            resp.send("failed");
            throw err;
        }
        else {
            resp.send("success");
            //  db.close();

        }
    });


    /*
     }
     });
     */

});


app.post('/mediaupdates', function (req, resp) {
    /*  MongoClient.connect(url, function (err, db) {
     if (err) {
     //     console.log('Unable to connect to the mongoDB server. Error:', err);
     } else {
     */           //HURRAY!! We are connected. :)

    //     console.log('Connection established to mongo db', url);


    var o_id = new mongodb.ObjectID(req.body.id);

    var collection = db.collection('media_youtube');
    collection.update({_id: o_id}, {$set: {media_name: req.body.media_name,media_file: req.body.media_file,priority: parseInt(req.body.priority),video_type:req.body.video_type }},function(err, results) {
        if (err){
            resp.send("failed");
            throw err;
        }
        else {
            resp.send("success");
            // db.close();

        }
    });


    /*       }
     });
     */
});
app.post('/articleupdates', function (req, resp) {
    /*
     MongoClient.connect(url, function (err, db) {
     if (err) {
     //    console.log('Unable to connect to the mongoDB server. Error:', err);
     } else {
     */
    //HURRAY!! We are connected. :)

    //     console.log('Connection established to mongo db', url);


    var o_id = new mongodb.ObjectID(req.body.id);

    var collection = db.collection('article');
    collection.update({_id: o_id}, {$set: {title: req.body.title,description: req.body.description,image: req.body.image,status:req.body.status,createdby:req.body.createdby,video:req.body.video,externallink: req.body.externallink,priority:req.body.priority }},function(err, results) {
        if (err){
            resp.send("failed");
            throw err;
        }
        else {
            resp.send("success");
            //db.close();

        }
    });


    /*
     }
     });
     */

});




app.post('/adminupdatestatus', function (req, resp) {
    /*  MongoClient.connect(url, function (err, db) {
     if (err) {
     //       console.log('Unable to connect to the mongoDB server. Error:', err);
     } else {*/
    //HURRAY!! We are connected. :)

    //       console.log('Connection established to mongo db', url);


    var o_id = new mongodb.ObjectID(req.body.id);

    var collection = db.collection('userstable');
    collection.update({_id: o_id}, {$set: {status: req.body.status}},function(err, results) {
        if (err){
            resp.send("failed");
            throw err;
        }
        else {
            resp.send("success");
            // db.close();

        }
    });


    /*
     }
     });
     */

});

app.post('/articleupdatestatus', function (req, resp) {
    /*
     MongoClient.connect(url, function (err, db) {
     if (err) {
     //     console.log('Unable to connect to the mongoDB server. Error:', err);
     } else {
     */
    //HURRAY!! We are connected. :)

    //      console.log('Connection established to mongo db', url);


    var o_id = new mongodb.ObjectID(req.body.id);

    var collection = db.collection('article');
    collection.update({_id: o_id}, {$set: {status: req.body.status}},function(err, results) {
        if (err){
            resp.send("failed");
            throw err;
        }
        else {
            resp.send("success");
            // db.close();

        }
    });


    /*       }
     });
     */
});
app.post('/staffupdatestatus', function (req, resp) {
    /*
     MongoClient.connect(url, function (err, db) {
     if (err) {
     //       console.log('Unable to connect to the mongoDB server. Error:', err);
     } else {
     */
    //HURRAY!! We are connected. :)

    //      console.log('Connection established to mongo db', url);


    var o_id = new mongodb.ObjectID(req.body.id);

    var collection = db.collection('staff');
    collection.update({_id: o_id}, {$set: {status: req.body.status}},function(err, results) {
        if (err){
            resp.send("failed");
            throw err;
        }
        else {
            resp.send("success");
            //  db.close();

        }
    });


    /*
     }
     });
     */

});


app.post('/mediaupdatestatus', function (req, resp) {
    /*
     MongoClient.connect(url, function (err, db) {
     if (err) {
     //      console.log('Unable to connect to the mongoDB server. Error:', err);
     } else {
     */
    //HURRAY!! We are connected. :)

    //     console.log('Connection established to mongo db', url);


    var o_id = new mongodb.ObjectID(req.body.id);

    var collection = db.collection('media_youtube');
    collection.update({_id: o_id}, {$set: {status: req.body.status}},function(err, results) {
        if (err){
            resp.send("failed");
            throw err;
        }
        else {
            resp.send("success");
            // db.close();

        }
    });


    /*       }
     });
     */
});

/****************Testimonial Module[start]**************/

app.post('/addtestimonial', function (req, resp) {

    var addtime=Date.now();
    var role_status=1;

    value1 = {title: req.body.title,testimonial: req.body.testimonial, testimonial_image: req.body.file,priority: req.body.priority,status: 1,add_time: addtime };
    //  console.log("Insert command");


    /*
     MongoClient.connect(url, function (err, db) {
     if (err) {
     //      console.log('Unable to connect to the mongoDB server. Error:', err);
     } else {
     */
    //HURRAY!! We are connected. :)
    //     console.log('Connection established to mongo db', url);


    var collection = db.collection('testimonial');


    collection.insert([value1], function (err, result) {
        if (err) {
            //            console.log(err);
            //            console.log('err-----mingo .. vag ');
        } else {
            ///          console.log('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
            resp.send('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);

            //  db.close();
        }
    });


    /*       }
     });
     */

});
app.get('/testimoniallist', function (req, resp) {

    /* MongoClient.connect(url, function (err, db) {
     if (err) {
     console.log('Unable to connect to the mongoDB server. Error:', err);
     } else {*/
    //HURRAY!! We are connected. :)
    //  console.log('Connection established to mongo db', url);

    var collection = db.collection('testimonial');

    collection.find().toArray(function(err, items) {

        resp.send(JSON.stringify(items));
        //db.close();
    });


    //db.close();
    /*  }
     });*/




});
app.post('/testimonialdetails', function (req, resp) {
    /*
     MongoClient.connect(url, function (err, db) {
     if (err) {
     console.log('Unable to connect to the mongoDB server. Error:', err);
     } else {
     */
    //HURRAY!! We are connected. :)

    //   console.log('Connection established to mongo db', url);


    var o_id = new mongodb.ObjectID(req.body.id);

    var collection = db.collection('testimonial');

    collection.find({_id:o_id}).toArray(function(err, items) {

        //     console.log(items);
        //     console.log('-----------------------------------');
        //    console.log(items.length);
        resp.send(JSON.stringify(items));
        //  db.close();

    });

    /*       }
     });
     */
});
app.post('/testimonialupdates', function (req, resp) {
    /*   MongoClient.connect(url, function (err, db) {
     if (err) {
     console.log('Unable to connect to the mongoDB server. Error:', err);
     } else {
     */           //HURRAY!! We are connected. :)

    //    console.log('Connection established to mongo db', url);


    var o_id = new mongodb.ObjectID(req.body.id);

    var collection = db.collection('testimonial');
    collection.update({_id: o_id}, {$set: {title: req.body.title,testimonial: req.body.testimonial, testimonial_image: req.body.file,priority: req.body.priority }},function(err, results) {
        if (err){
            resp.send("failed");
            throw err;
        }
        else {
            resp.send("success");
            // db.close();

        }
    });


    /*
     }
     });
     */

});

app.post('/testimonialupdatestatus', function (req, resp) {
    /*   MongoClient.connect(url, function (err, db) {
     if (err) {
     console.log('Unable to connect to the mongoDB server. Error:', err);
     } else {
     */           //HURRAY!! We are connected. :)

    //      console.log('Connection established to mongo db', url);


    var o_id = new mongodb.ObjectID(req.body.id);

    var collection = db.collection('testimonial');
    collection.update({_id: o_id}, {$set: {status: req.body.status}},function(err, results) {
        if (err){
            resp.send("failed");
            throw err;
        }
        else {
            resp.send("success");
            // db.close();

        }
    });


    /*       }
     });
     */
});
app.post('/deletetestimonial', function (req, resp) {
    /*
     MongoClient.connect(url, function (err, db) {
     if (err) {
     console.log('Unable to connect to the mongoDB server. Error:', err);
     } else {
     */
    //HURRAY!! We are connected. :)

    //    console.log('Connection established to mongo db', url);


    var o_id = new mongodb.ObjectID(req.body.id);

    var collection = db.collection('testimonial');
    collection.deleteOne({_id: o_id}, function(err, results) {
        if (err){
            resp.send("failed");
            throw err;
        }
        else {
            resp.send("success");
            // db.close();

        }
    });


    /*       }
     });
     */
});
/****************End  Testimonial Module[End]**************/


/****************Probono Article Module[start]**************/
app.post('/addprobonoarticle', function (req, resp) {

    var addtime=Date.now();
    var status=1;

    value1 = {title: req.body.title,link: req.body.link,priority: req.body.priority,status: status,add_time: addtime };
    //  console.log("Insert command");


    /*
     MongoClient.connect(url, function (err, db) {
     if (err) {
     //      console.log('Unable to connect to the mongoDB server. Error:', err);
     } else {
     */
    //HURRAY!! We are connected. :)
    //     console.log('Connection established to mongo db', url);


    var collection = db.collection('probonoarticle');


    collection.insert([value1], function (err, result) {
        if (err) {
            //            console.log(err);
            //            console.log('err-----mingo .. vag ');
        } else {
            ///          console.log('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
            resp.send('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);

            // db.close();
        }
    });


    /*       }
     });
     */

});
app.get('/probonoarticlelist', function (req, resp) {

    // MongoClient.connect(url, function (err, db) {
    //     if (err) {
    //         console.log('Unable to connect to the mongoDB server. Error:', err);
    //     } else {
    //HURRAY!! We are connected. :)
    //  console.log('Connection established to mongo db', url);

    var collection = db.collection('probonoarticle');

    collection.find().toArray(function(err, items) {

        resp.send(JSON.stringify(items));
        // db.close();
    });


    //db.close();
    /*
     }
     });
     */




});
app.post('/probonoarticledetails', function (req, resp) {
    /*
     MongoClient.connect(url, function (err, db) {
     if (err) {
     console.log('Unable to connect to the mongoDB server. Error:', err);
     } else {
     */
    //HURRAY!! We are connected. :)

    //   console.log('Connection established to mongo db', url);


    var o_id = new mongodb.ObjectID(req.body.id);

    var collection = db.collection('probonoarticle');

    collection.find({_id:o_id}).toArray(function(err, items) {

        //     console.log(items);
        //     console.log('-----------------------------------');
        //    console.log(items.length);
        resp.send(JSON.stringify(items));
        // db.close();

    });

    /*       }
     });
     */
});
app.post('/probonoarticleupdates', function (req, resp) {
    /*
     MongoClient.connect(url, function (err, db) {
     if (err) {
     console.log('Unable to connect to the mongoDB server. Error:', err);
     } else {
     */
    //HURRAY!! We are connected. :)

    //    console.log('Connection established to mongo db', url);


    var o_id = new mongodb.ObjectID(req.body.id);

    var collection = db.collection('probonoarticle');
    collection.update({_id: o_id}, {$set: {title: req.body.title,testimonial: req.body.testimonial, testimonial_image: req.body.file,priority: req.body.priority }},function(err, results) {
        if (err){
            resp.send("failed");
            throw err;
        }
        else {
            resp.send("success");
            // db.close();

        }
    });


    /*
     }
     });
     */

});

app.post('/probonoarticleupdatestatus', function (req, resp) {
    /*   MongoClient.connect(url, function (err, db) {
     if (err) {
     console.log('Unable to connect to the mongoDB server. Error:', err);
     } else {
     */           //HURRAY!! We are connected. :)

    //      console.log('Connection established to mongo db', url);


    var o_id = new mongodb.ObjectID(req.body.id);

    var collection = db.collection('probonoarticle');
    collection.update({_id: o_id}, {$set: {status: req.body.status}},function(err, results) {
        if (err){
            resp.send("failed");
            throw err;
        }
        else {
            resp.send("success");
            // db.close();

        }
    });


    /*
     }
     });
     */

});
app.post('/deleteprobonoarticle', function (req, resp) {
    /*
     MongoClient.connect(url, function (err, db) {
     if (err) {
     console.log('Unable to connect to the mongoDB server. Error:', err);
     } else {
     */
    //HURRAY!! We are connected. :)

    //    console.log('Connection established to mongo db', url);


    var o_id = new mongodb.ObjectID(req.body.id);

    var collection = db.collection('probonoarticle');
    collection.deleteOne({_id: o_id}, function(err, results) {
        if (err){
            resp.send("failed");
            throw err;
        }
        else {
            resp.send("success");
            //db.close();

        }
    });


    /*
     }
     });
     */

});

/****************End  Probono Article Module[End]**************/

app.get('/imagegallerylist', function (req, resp) {

    /*MongoClient.connect(url, function (err, db) {
     if (err) {
     console.log('Unable to connect to the mongoDB server. Error:', err);
     } else {*/
    //HURRAY!! We are connected. :)
    //  console.log('Connection established to mongo db', url);

    var collection = db.collection('imagegallery');

    collection.find().toArray(function(err, items) {

        resp.send(JSON.stringify(items));
        // db.close();
    });


    //db.close();
    /* }
     });*/




});





app.post('/imagegallerydetails', function (req, resp) {
    /*
     MongoClient.connect(url, function (err, db) {
     if (err) {
     console.log('Unable to connect to the mongoDB server. Error:', err);
     } else {
     */
    //HURRAY!! We are connected. :)

    //   console.log('Connection established to mongo db', url);


    var o_id = new mongodb.ObjectID(req.body.id);

    var collection = db.collection('imagegallery');

    collection.find({_id:o_id}).toArray(function(err, items) {

        //     console.log(items);
        //     console.log('-----------------------------------');
        //    console.log(items.length);
        resp.send(JSON.stringify(items));
        // db.close();

    });

    /*       }
     });
     */
});






app.post('/deleteimagegallery', function (req, resp) {
    /*
     MongoClient.connect(url, function (err, db) {
     if (err) {
     console.log('Unable to connect to the mongoDB server. Error:', err);
     } else {
     */
    //HURRAY!! We are connected. :)

    //    console.log('Connection established to mongo db', url);


    var o_id = new mongodb.ObjectID(req.body.id);

    var collection = db.collection('imagegallery');
    collection.deleteOne({_id: o_id}, function(err, results) {
        if (err){
            resp.send("failed");
            throw err;
        }
        else {
            resp.send("success");
            // db.close();

        }
    });


    /*       }
     });
     */
});



/****************[End] Testimonial Module**************/


/****************Banner Module[start]**************/

app.post('/bannerlist', function (req, resp) {

    /* MongoClient.connect(url, function (err, db) {
     if (err) {
     //  console.log('Unable to connect to the mongoDB server. Error:', err);
     } else {
     //HURRAY!! We are connected. :)
     //  console.log('Connection established to mongo db', url);
     */
    var collection = db.collection('banner_db');

    collection.find().toArray(function(err, items) {

        resp.send(JSON.stringify(items));
        //db.close();
    });


    //db.close();
    // }
    //});




});

app.post('/bannerdetails', function (req, resp) {
    /*
     MongoClient.connect(url, function (err, db) {
     if (err) {
     console.log('Unable to connect to the mongoDB server. Error:', err);
     } else {
     */
    //HURRAY!! We are connected. :)

    //   console.log('Connection established to mongo db', url);


    var o_id = new mongodb.ObjectID(req.body.id);

    var collection = db.collection('banner_db');

    collection.find({_id:o_id}).toArray(function(err, items) {

        //     console.log(items);
        //     console.log('-----------------------------------');
        //    console.log(items.length);
        resp.send(JSON.stringify(items));
        //db.close();

    });

    /*       }
     });
     */
});


app.post('/addbanner', function (req, resp) {

    value1 = {bannerfile: req.body.file, priority: req.body.priority,status: 1};

    /*   MongoClient.connect(url, function (err, db) {
     if (err) {
     ///   console.log('Unable to connect to the mongoDB server. Error:', err);
     } else {
     */           //HURRAY!! We are connected. :)
    //  console.log('Connection established to mongo db', url);


    var collection = db.collection('banner_db');


    collection.insert([value1], function (err, result) {
        if (err) {
            resp.send(err);
        } else {
            resp.send('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
            // db.close();
        }
    });


    /*
     }
     });
     */


});

app.post('/bannerupdates', function (req, resp) {
    /*
     MongoClient.connect(url, function (err, db) {
     if (err) {
     //     console.log('Unable to connect to the mongoDB server. Error:', err);
     } else {
     */
    //HURRAY!! We are connected. :)

    //    console.log('Connection established to mongo db', url);


    var o_id = new mongodb.ObjectID(req.body.id);

    var collection = db.collection('banner_db');
    collection.update({_id: o_id}, {$set: {status:req.body.status,bannerfile: req.body.file, priority: req.body.priority }},function(err, results) {
        if (err){
            resp.send("failed");
            throw err;
        }
        else {
            resp.send("success");
            // db.close();

        }
    });


    /*
     }
     });
     */

});
app.post('/imagegalleryupdates', function (req, resp) {
    /*   MongoClient.connect(url, function (err, db) {
     if (err) {
     //     console.log('Unable to connect to the mongoDB server. Error:', err);
     } else {
     */           //HURRAY!! We are connected. :)

    //    console.log('Connection established to mongo db', url);


    var o_id = new mongodb.ObjectID(req.body.id);

    var collection = db.collection('imagegallery');
    collection.update({_id: o_id}, {$set: {status:req.body.status,imagefile: req.body.imagefile, priority: req.body.priority,title: req.body.title }},function(err, results) {
        if (err){
            resp.send("failed");
            throw err;
        }
        else {
            resp.send("success");
            // db.close();

        }
    });


    /*
     }
     });
     */

});





app.post('/bannerupdatestatus', function (req, resp) {
    /*
     MongoClient.connect(url, function (err, db) {
     if (err) {
     //       console.log('Unable to connect to the mongoDB server. Error:', err);
     } else {
     */
    //HURRAY!! We are connected. :)

    //      console.log('Connection established to mongo db', url);


    var o_id = new mongodb.ObjectID(req.body.id);

    var collection = db.collection('banner_db');
    collection.update({_id: o_id}, {$set: {status: req.body.status}},function(err, results) {
        if (err){
            resp.send("failed");
            throw err;
        }
        else {
            resp.send("success");
            //db.close();

        }
    });


    /*
     }
     });
     */

});


app.post('/imagegalleryupdatestatus', function (req, resp) {
    /*
     MongoClient.connect(url, function (err, db) {
     if (err) {
     //       console.log('Unable to connect to the mongoDB server. Error:', err);
     } else {
     */
    //HURRAY!! We are connected. :)

    //      console.log('Connection established to mongo db', url);


    var o_id = new mongodb.ObjectID(req.body.id);

    var collection = db.collection('imagegallery');
    collection.update({_id: o_id}, {$set: {status: req.body.status}},function(err, results) {
        if (err){
            resp.send("failed");
            throw err;
        }
        else {
            resp.send("success");
            //     db.close();

        }
    });


    /*       }
     });
     */
});




app.post('/deletebanner', function (req, resp) {
    /*
     MongoClient.connect(url, function (err, db) {
     if (err) {
     //    console.log('Unable to connect to the mongoDB server. Error:', err);
     } else {
     */
    //HURRAY!! We are connected. :)

    //    console.log('Connection established to mongo db', url);


    var o_id = new mongodb.ObjectID(req.body.id);

    var collection = db.collection('banner_db');
    collection.deleteOne({_id: o_id}, function(err, results) {
        if (err){
            resp.send("failed");
            throw err;
        }
        else {
            resp.send("success");
            // db.close();

        }
    });


    /*
     }
     });
     */

});


/****************Banner Module[end]**************/

/****************Expert Area Module[start]**************/

app.post('/expertarealist', function (req, resp) {

    /*   MongoClient.connect(url, function (err, db) {
     if (err) {
     //  console.log('Unable to connect to the mongoDB server. Error:', err);
     } else {
     */           //HURRAY!! We are connected. :)
    //  console.log('Connection established to mongo db', url);

    var collection = db.collection('expertarea_db');

    collection.find().toArray(function(err, items) {

        resp.send(JSON.stringify(items));
        // db.close();
    });


    //db.close();
    /*       }
     });
     */



});

app.post('/expertareadetails', function (req, resp) {
    // MongoClient.connect(url, function (err, db) {
    //     if (err) {
    //         console.log('Unable to connect to the mongoDB server. Error:', err);
    //     } else {
    //HURRAY!! We are connected. :)

    //   console.log('Connection established to mongo db', url);


    var o_id = new mongodb.ObjectID(req.body.id);

    var collection = db.collection('expertarea_db');

    collection.find({_id:o_id}).toArray(function(err, items) {

        //     console.log(items);
        //     console.log('-----------------------------------');
        //    console.log(items.length);
        resp.send(JSON.stringify(items));
        //  db.close();

    });

    /*       }
     });
     */
});

app.post('/addexpertarea', function (req, resp) {

    value1 = {title: req.body.title,description: req.body.description, priority: req.body.priority,status: 1};

    // MongoClient.connect(url, function (err, db) {
    //     if (err) {
    //         ///   console.log('Unable to connect to the mongoDB server. Error:', err);
    //     } else {
    //         //HURRAY!! We are connected. :)
    //  console.log('Connection established to mongo db', url);


    var collection = db.collection('expertarea_db');


    collection.insert([value1], function (err, result) {
        if (err) {
            resp.send(err);
        } else {
            resp.send('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
            //db.close();
        }
    });


    /*       }
     });
     */

});

app.post('/expertareaupdates', function (req, resp) {
    MongoClient.connect(url, function (err, db) {
        if (err) {
            //     console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            //HURRAY!! We are connected. :)

            //    console.log('Connection established to mongo db', url);


            var o_id = new mongodb.ObjectID(req.body.id);

            var collection = db.collection('expertarea_db');
            collection.update({_id: o_id}, {$set: {status:req.body.status,description: req.body.description, priority: req.body.priority,title: req.body.title }},function(err, results) {
                if (err){
                    resp.send("failed");
                    throw err;
                }
                else {
                    resp.send("success");
                    //db.close();

                }
            });


        }
    });

});

app.post('/expertareaupdatestatus', function (req, resp) {
    /*
     MongoClient.connect(url, function (err, db) {
     if (err) {
     //       console.log('Unable to connect to the mongoDB server. Error:', err);
     } else {
     */
    //HURRAY!! We are connected. :)

    //      console.log('Connection established to mongo db', url);


    var o_id = new mongodb.ObjectID(req.body.id);

    var collection = db.collection('expertarea_db');
    collection.update({_id: o_id}, {$set: {status: req.body.status}},function(err, results) {
        if (err){
            resp.send("failed");
            throw err;
        }
        else {
            resp.send("success");
            // db.close();

        }
    });


    //     }
    // });

});

app.post('/deleteexpertarea', function (req, resp) {
    /*
     MongoClient.connect(url, function (err, db) {
     if (err) {
     //    console.log('Unable to connect to the mongoDB server. Error:', err);
     } else {
     */
    //HURRAY!! We are connected. :)

    //    console.log('Connection established to mongo db', url);


    var o_id = new mongodb.ObjectID(req.body.id);

    var collection = db.collection('expertarea_db');
    collection.deleteOne({_id: o_id}, function(err, results) {
        if (err){
            resp.send("failed");
            throw err;
        }
        else {
            resp.send("success");
            // db.close();

        }
    });


    /*
     }
     });
     */

});



/****************Expert Area Module[end]**************/



app.post('/upload',function(req, res){

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    // console.log(req.body.Filedata);
    //   console.log(JSON.stringify(req));



    var tmp_path = req.files.Filedata.path;
    // set where the file should actually exists
    var target_path = './uploads/' + req.files.Filedata.name;
    // move the file from the temporary location to the intended location
    fs.rename(tmp_path, target_path, function(err) {
        if (err) throw err;
        // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
        fs.unlink(tmp_path, function() {
            if (err) {
                res.send( err);
            }else{
                var profile_pic = req.files.userPhoto.name;
                //use profile_pic to do other stuffs like update DB or write rendering logic here.
            };
        });
    });
});

app.post('/imageresize',function(req, res){

    /*gm('/path/to/image.jpg')
     // /!*.resize(353, 257)*!/
     .resize(req.body.width, req.body.height)
     .autoOrient()
     .write(writeStream, function (err) {
     if (!err) console.log(' hooray! ');
     });
     var gm = require('gm');


     gm('./uploads/'+req.body.image)
     .resize(req.body.width, req.body.height)
     .write('./uploads/thumb_'+req.body.image, function (err) {
     if (!err) console.log('done');
     });*/

    var Jimp = require("jimp");

// open a file called "lenna.png"
    Jimp.read('./uploads/'+req.body.image, function (err, lenna) {
        if (err) throw err;
        lenna.resize(parseInt(req.body.width), parseInt(req.body.height))            // resize
            .quality(90)                 // set JPEG quality
            //.greyscale()                 // set greyscale
            .write('./uploads/thumb/'+req.body.image); // save
    });

    Jimp.read('./uploads/'+req.body.image).then(function (lenna) {
        if (err) throw err;
        lenna.resize(parseInt(req.body.width), parseInt(req.body.height))            // resize
            .quality(90)                 // set JPEG quality
            //.greyscale()                 // set greyscale
            .write('./uploads/thumb/'+req.body.image); // save
    }).catch(function (err) {
        setTimeout(function () {
            res.send({status: 1});
        }, 4000);
    });



})

app.post('/imagecrop',function(req, res){
    console.log(req.body.imagename);
    //console.log(req.body.rawimage);
    var fs = require('fs');

    /*fs.stat('./uploads/thumb/'+req.body.imagename, function (err, stats) {
     console.log(stats);//here we got all information of file in stats variable

     if (err) {
     return console.error(err);
     }

     fs.unlink('./uploads/thumb/'+req.body.imagename,function(err){
     if(err) return console.log(err);
     console.log('file deleted successfully');
     });
     });*/
    var http = require('http'),

        // imgSource = 'http://upload.wikimedia.org/wikipedia/commons/1/15/Jagdschloss_Granitz_4.jpg';
        imgSource = req.body.rawimage;
    //imgname = Math.floor((Math.random() * 10000000) + 1)+'-'+Math.floor((Math.random() * 10000000) + 1)+'.jpg';
    imgname = req.body.imagename;
    console.log(imgname);

    /*http.get(imgSource, function(res) {
     res.pipe(fs.createWriteStream('.uploads/thumb/'+imgname));
     res.send({'status':1});
     });*/
    //require("fs").unlink('./uploads/'+imgname);
    var base64Data = req.body.rawimage.replace(/^data:image\/png;base64,/, "");

    require("fs").writeFile('./uploads/thumb/'+imgname, base64Data, {encoding:'base64',flag:'w+'}, function(err) {
        console.log(err);
        //res.send({filename: 'thumb/'+imgname});
        cropsave(imgname,req.body.width,req.body.height,res);


    });



})
function  cropsave(imgname,w,h,res) {

    var Jimp = require("jimp");

// open a file called "lenna.png"
    Jimp.read('./uploads/thumb/'+imgname, function (err, lenna) {
        if (err) throw err;
        lenna.resize(parseInt(w), parseInt(h))            // resize
            .quality(90)                 // set JPEG quality
            //.greyscale()                 // set greyscale
            .write('./uploads/thumb/'+imgname); // save
    });

    Jimp.read('./uploads/thumb/'+imgname).then(function (lenna) {
        if (err) throw err;
        lenna.resize(parseInt(req.body.width), parseInt(req.body.height))            // resize
            .quality(90)                 // set JPEG quality
            //.greyscale()                 // set greyscale
            .write('./uploads/thumb/'+imgname); // save
    }).catch(function (err) {
        setTimeout(function () {
            res.send({filename: 'thumb/'+imgname});
        }, 4000);
    });

}

app.post('/expertareaupdates', function (req, resp) {
    /*   MongoClient.connect(url, function (err, db) {
     if (err) {
     //     console.log('Unable to connect to the mongoDB server. Error:', err);
     } else {
     */           //HURRAY!! We are connected. :)

    //    console.log('Connection established to mongo db', url);


    var o_id = new mongodb.ObjectID(req.body.id);

    var collection = db.collection('expertarea_db');
    collection.update({_id: o_id}, {$set: {status:req.body.status,description: req.body.description, priority: req.body.priority,title: req.body.title }},function(err, results) {
        if (err){
            resp.send("failed");
            throw err;
        }
        else {
            resp.send("success");
            // db.close();

        }
    });


    /*
     }
     });
     */

});


app.post('/imageresizenew',function(req, res){

    var rwidth = req.body.width;
    var rheight = req.body.height;
    var foldername = req.body.folder;

    var rratio = rwidth/rwidth;

    var Jimp = require("jimp");

    Jimp.read('./uploads/'+req.body.image).then(function (image) {
        var iwidth = image.bitmap.width;
        var iheight = image.bitmap.height;

        var iratio = iwidth/iheight;

        if(iwidth > rwidth && iheight > rheight){

            if(iratio > rratio){
                console.log('height');
                image.resize(Jimp.AUTO, parseInt(rheight))
                    .quality(90)
                    .write('./uploads/'+foldername+'/'+req.body.image);
            }else{
                console.log('width');
                image.resize(parseInt(rwidth),Jimp.AUTO)
                    .quality(90)
                    .write('./uploads/'+foldername+'/'+req.body.image);
            }
        }else{
            console.log('not resized');
            image.resize(parseInt(iwidth), parseInt(iheight))
                .quality(90)
                .write('./uploads/'+foldername+'/'+req.body.image);
        }

        res.send("success");

    }).catch(function (err) {
        console.log(err);
        res.send("error");
    });

})

app.post('/cropnew',function(req, res){
    var imagename = req.body.image;
    var left = req.body.left;
    var right = req.body.right;
    var top = req.body.top;
    var bottom = req.body.bottom;
    var width = req.body.width;
    var height = req.body.height;
    var height1 = -height>0 ? -height : height;

    var foldername = req.body.foldername;


    var Jimp = require("jimp");

    Jimp.read('./uploads/'+imagename).then(function (image) {
        var iwidth = image.bitmap.width;
        var iheight = image.bitmap.height;
        var iratio = iwidth/iheight;

        console.log('cropped');

        image.crop(parseInt(left), parseInt(iheight-top),parseInt(width), parseInt(height1))
            .quality(90)
            .write('./uploads/'+foldername+'/'+req.body.image);

        setTimeout(function () {
            res.send({filename: 'gallery_thumb/'+req.body.image});
        }, 4000);


        // res.send("success");



    }).catch(function (err) {
        console.log(err);
        res.send("error");
    });


})






/*app.post('/cropnew',function(req, res){
 var imagename = req.body.image;
 var left = req.body.left;
 var right = req.body.right;
 var top = req.body.top;
 var bottom = req.body.bottom;
 var width = req.body.width;
 var height = req.body.height;
 var height1 = -height>0 ? -height : height;

 var foldername = req.body.foldername;


 var Jimp = require("jimp");

 Jimp.read('./uploads/'+imagename).then(function (image) {
 var iwidth = image.bitmap.width;
 var iheight = image.bitmap.height;
 var iratio = iwidth/iheight;

 console.log('cropped');

 image.crop(parseInt(left), parseInt(iheight-top),parseInt(width), parseInt(height1))
 .quality(90)
 .write('./uploads/'+foldername+'/'+req.body.image);




 res.send("success");



 }).catch(function (err) {
 console.log(err);
 res.send("error");
 });


 })*/

var server = app.listen(port, function () {

    var host = server.address().address
    var port = server.address().port

    //  console.log("Example app listening at http://%s:%s", host, port)

})

//app.listen(port);

/*app.listen(port);
 console.log("App listening on port " + port);*/
