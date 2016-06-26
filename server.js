var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var request = require('request');
var cheerio = require('cheerio');

app.use(logger('dev'));
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(express.static('public'));

var PORT = process.env.PORT || 8080;





//Database configuration
mongoose.connect('mongodb://alcreates:tester121@ds021034.mlab.com:21034/techscrape');
var db = mongoose.connection;

db.on('error', function (err) {
console.log('Mongoose Error: ', err);
});
db.once('open', function () {
console.log('Mongoose connection successful.');
});

//Require Schemas
var Note = require('./models/Note.js');
var Article = require('./models/Article.js');


// Routes
app.get('/', function(req, res) {
  res.send(index.html);
});


app.get('/scrape', function(req, res) {
  request('http://www.techcrunch.com/', function(error, response, html) {
    var $ = cheerio.load(html);
    $('.post-title').each(function(i, element) {

				var result = {};

				result.title = $(this).text();
				console.log(result.title)
				result.link = $(this).children('a').attr('href');
				console.log(result.link);
				var entry = new Article (result);

				entry.save(function(err, doc) {
				  if (err) {
				    console.log(err);
				  } else {
				    console.log(doc);
				  }
				});


    });
  });
  res.send("Scrape Complete");
});


app.get('/articles', function(req, res){
	Article.find({}, function(err, doc){
		if (err){
			console.log(err);
		} else {
			res.json(doc);
		}
	});
});


app.get('/articles/:id', function(req, res){
	Article.findOne({'_id': req.params.id})
	.populate('note')
	.exec(function(err, doc){
		if (err){
			console.log(err);
		} else {
			res.json(doc);
			console.log(doc);
		}
	});
});


app.post('/articles/:id', function(req, res){
	var newNote = new Note(req.body);
	console.log("req body " + req.body);
	console.log("new note body " + newNote);
	newNote.save(function(err, doc){
		if(err){
			console.log(err);
		} else {
			console.log("req id " + req.params.id);
			console.log("note id " + doc._id);
			Article.findOneAndUpdate({'_id': req.params.id}, {'note':doc._id})
			.exec(function(err, doc){
				if (err){
					console.log(err);
				} else {
					res.send(doc);
				}
			});

		}
	});
});

app.get('/delete', function(req,res){
Article.find({})
		.populate('note')
		.exec(function(err, doc){
				if (err){
					console.log(err);
				} else {
							var removedArticles = 0;
						 for(i=0;i<doc.length;i++){
							// console.log(doc[i]._id);
							// console.log(doc[i].note);
							//if there is no note, we can remove the article from the db
							//but if there is a note, move on to the next article.
										
										if(doc[i].note==undefined){
												Article.find({'_id' : doc[i]._id}).remove()
												.exec(function(err, doc){
														if (err){
															console.log(err);
														}else{
															++removedArticles;
															console.log(removedArticles+" Total Articles removed");
														}//close else
												})//close .exec
										}//close if
						}//close for
				}//close else 
		})//close .exec
res.end();
});//close dr









// Starts the server to begin listening 
// =============================================================
app.listen(PORT, function(){
	console.log('App listening on PORT ' + PORT);
})