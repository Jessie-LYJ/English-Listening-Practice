// initial code
var express = require('express');
var app = express();

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

var handlebars = require("express-handlebars");
app.engine("handlebars", handlebars({ defaultLayout: false }));
app.set("view engine", 'handlebars');

var sqlite3 = require('sqlite3').verbose(); // verbose mode for debugging
var db = new sqlite3.Database("./db.sqlite3");

app.use(express.static('public'));

// 上传发布
var fs = require("fs");
var multer = require("multer");  // npm install multer
var upload = multer({ dest: "uploads/" });  // upload to the "uploads" folder
app.use(express.static('uploads'));  // set the uploads folder as static

// import "express-session" into our program
var session = require("express-session");

// use it in our app
app.use(
    session({
        secret: "some secret code",
        resave: false, // forces sessions to be saved
        saveUninitialized: false // forces uninitialized sessions to be saved
    })
);

app.get('/', function (req, res) {
    if (req.session['username']) {
        res.render('home', {
            layout: 'main',
            username: req.session['username']
        })
    } else {
        res.render("login", {
        });
    };
});

app.post('/login', function (req, res) {
    var username = req.body['username2'];
    var password = req.body['password2'];
    db.get("SELECT * FROM user WHERE username=? AND password=?", [username, password], function (err, row) {
        if (row) {
            req.session['username'] = username;
            res.redirect("/");
        } else {
            res.render("login", {
                message: "Your INFO seems to be wrong!",
            });
        }
    });
});


// 登陆
app.get('/login', function (req, res) {
    res.render('login')
})

// 注册
app.get('/register', function (req, res) {
    res.render('register')
})

app.post("/checkuser", function (req, res) {
    var username = req.query['username'];
    db.get("select * from user where username=?", username, function (err, row) {
        if (row) {
            res.json({
                "avail": false
            })
        } else {
            res.json({
                "avail": ture
            })
        }
    })
})

app.post("/register", function (req, res) {
    var username = req.body['username'];
    var password = req.body['password'];
    console.log(req.body);
    db.run("INSERT INTO user(username, password) VALUES(?,?)", [username, password], function (err) {
        res.render('register', {
            message: "Registration succeeded"
        })
        console.log(err);
    })
})

app.get("/checkUser", function (req, res) {
    var username = req.query['username'];
    db.get("SELECT * FROM user WHERE username=?", username, function (err, row) {
        if (row) {
            res.json({ "available": false });
        } else {
            res.json({ "available": true });
        }
    });
})

//发帖评论区
function limitLength(text, length) {
    if (text.length > length) {
        return text.slice(0, length) + "...";
    }
    return text;
}

app.get('/posts', function (req, res) {
    db.all("SELECT *, DATETIME(time_added, 'localtime') as time_added FROM post ORDER BY time_added DESC", [], function (err, rows) {
        res.render("posts", {
            layout: 'main',
            username: req.session['username'],
            "posts": rows,
            "helpers": {
                "limitLength123": limitLength
            }
        });
    });
});

app.post('/submit-post', function (req, res) {
    var title = req.body['title'];
    var article = req.body['content'];
    var postname = req.session['username']
    db.run('INSERT INTO post(title,content,poster) VALUES(?,?,?)', [title, article, postname], function (err) {
        res.redirect('back');
        console.log(err);
    });
});

app.get("/topic/:id", function (req, res) {
    var postID = req.params['id'];
    db.get("SELECT * FROM post WHERE id=?", [postID], function (err, row) {
        db.all("SELECT *,DATETIME(reply_time, 'localtime') as reply_time FROM comment WHERE post_id=? ORDER BY reply_time DESC", [postID], function (err, rows) {
            res.render("topic", {
                layout: 'main',
                username: req.session['username'],
                "post": row,
                "comments": rows
            });
            console.log(err)
        })
    });
})

app.post('/submit/:id', function (req, res) {
    var comment = req.body['content'];
    var postID = req.params['id'];
    var name = req.session['username']
    var comm
    console.log(postID)
    db.run("INSERT INTO comment(content,post_id,commenter) VALUES(?,?,?)", [comment, postID, name], function (err) {
        res.redirect("back");
        console.log(err);
    });
});

//删帖
app.get("/delete/:id", function (req, res) {
    var username = req.session['username']
    db.run("DELETE FROM post WHERE id=? And poster=?", [req.params['id'], username], function (err) {
        res.redirect("back");
    })
});

app.get("/delete-comment/:id", function (req, res) {
    var username = req.session['username']
    db.run("DELETE FROM comment WHERE id=? And commenter=?", [req.params['id'], username], function (err) {
        res.redirect("back");
    })
});

// 模式选择
app.get('/paradise', function (req, res) {
    res.render('question', {
        layout:"main",
        js:'paradise.js',
        username: req.session['username']
    })
})
app.get('/earth', function (req, res) {
    res.render('question', {
        layout:"main",
        js:'earth.js',
        username: req.session['username']
    })
})
app.get('/hell', function (req, res) {
    res.render('question', {
        layout:"main",
        js:'hell.js',
        username: req.session['username']
    })
})

//个人中心
app.get('/info/:name',function(req,res){
    db.all("SELECT * FROM user Where username=?", [req.params['name']], function (err, rows) {
        res.render("info", {
            layout: 'main',
            username:req.session['username'],
            info:rows
        });
        console.log(rows)
    })
})

app.post('/info_revised',function(req,res){
    console.log(req.body)
    var username=req.session['username']
    var gender=req.body['gender']
    var email=req.body['email']
    var intro=req.body['intro']
    db.run('UPDATE user SET gender = ?, email = ?, intro=? WHERE username = ?',[gender,email,intro,username],function(err){
        res.redirect("back");
        console.log(err);
    })
})

// 注销
app.get('/logout', function (req, res) {
    req.session.destroy();
    res.redirect('/login')
})

app.listen(8000, function () {
    console.log('listening on port 8000!');
});