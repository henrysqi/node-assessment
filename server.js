var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var users = require('./users.json');

var app = express();

app.use(cors());
app.use(bodyParser.json());

/////////////////////////////////////////

// 1, 2, 11
app.get('/api/users', function(req, res, next){
	if (req.query.language){
		var result = users.filter(function(elem){
			return elem.language === req.query.language;
		})
		res.status(200).json(result);
	} 
	else if (req.query.age){
		var result = users.filter(function(elem){
			return elem.age === Number(req.query.age);
		})
		res.status(200).json(result);
	} 
	// @@@@@@@@ had to account for lower cased stanton
	else if (req.query.city){
		var result = users.filter(function(elem){
			return elem.city.toLowerCase() === req.query.city.toLowerCase();
		})
		res.status(200).json(result);
	} 
	// @@@@@@@@ had to account for lower cased stanton
	else if (req.query.state){
		var result = users.filter(function(elem){
			return elem.state.toLowerCase() === req.query.state.toLowerCase();
		})
		res.status(200).json(result);
	} 
	// @@@@@@@@ had to account for lower cased stanton
	else if (req.query.gender){
		var result = users.filter(function(elem){
			return elem.gender.toLowerCase() === req.query.gender.toLowerCase();
		})
		res.status(200).json(result);
	} else {
		res.status(200).json(users);
	}

})

// 3, 4 switched from position searching for #12, @@@@@@@@@ had to json(true) for #10 json("not found") didnt work. 
app.get('/api/users/:id', function(req, res, next){
	if (req.params.id === "admin" || req.params.id === "moderator" || req.params.id === "user"){
		var result = users.filter(function(elem){
			return elem.type === req.params.id;
		})
		res.status(200).json(result);
	} else if (!isNaN(req.params.id)){
		var found = false;
		users.forEach(function(elem){
			if (elem.id.toString() === req.params.id){
				res.status(200).json(elem);
				found = true;
			}
		})
		if (!found){
			res.status(404).json(true);
		}
	} else {
		res.status(404).json("not found");
	}
})

// 5
app.post('/api/users', function(req, res, next){
	var lastPerson = users[users.length-1];
	req.body.id = lastPerson.id+1;
	users.push(req.body);
	res.status(200).json(users[users.length-1]);
})

// 6
app.post('/api/users/admin', function(req, res, next){
	var lastPerson = users[users.length-1];
	req.body.id = lastPerson.id+1;
	
	req.body.type = "admin";
	users.push(req.body);
	res.status(200).json(users[users.length-1]);
})

// 7
app.post('/api/users/language/:id', function(req, res, next){
	var found = false;
	users.forEach(function(elem){
		if (elem.id.toString() === req.params.id){
			elem.language = req.body.language;
			res.status(200).json(elem)
			found = true;
		}
	})
	if (!found) {
		res.status(404).json("not found")
	}
})

// 8   @@@@ added conditional if favorites is array, fakeuser has favorites as string
app.post('/api/users/forums/:id', function(req, res, next){
	var found = false;
		users.forEach(function(elem){
			if (elem.id.toString() === req.params.id){
				if (Array.isArray(elem.favorites)){
					elem.favorites.push(req.body.add);
					res.status(200).json(elem);
					var found = true;
				} else {
					elem.favorites = [elem.favorites]
					elem.favorites.push(req.body.add);
					res.status(200).json(elem);
					found = true;
				}
			}
		})
	if (!found) {
		res.status(404).json("not found")
	}
})

// 9
app.delete('/api/users/forums/:id', function(req, res, next){
	var found = false;
	users.forEach(function(elem){
		if (elem.id.toString() === req.params.id){
			for (var i = elem.favorites.length-1; i >= 0; i--){
				if (elem.favorites[i] === req.query.favorite){
					elem.favorites.splice(i, 1);
				}
			}
			res.status(200).json(elem)
			found = true;
		}
	})
	if (!found) {
		res.status(404).json("not found")		
	}
})

// 10
app.delete('/api/users/:id', function(req, res, next){
	var found = false;
	for (var i = users.length-1; i >= 0; i--){
		if (users[i].id.toString() === req.params.id){
			users.splice(i,1);
			res.status(200).json(users);
			found=true;
		}
	}
	if (!found){
		res.status(404).json("user not found");
	}
})

// 12 @@@@@ prob was in get /api/users/:id, not put
app.put('/api/users/:id', function(req, res, next){
	var found = false;
	users.forEach(function(elem){
		if (elem.id.toString() === req.params.id){
			for (var key in req.body){
				elem[key] = req.body[key];
			}
			res.status(200).json(elem)	
			found = true;
		}
	})
	
	if (!found) {
		res.status(404).json("not found")
	}
})









app.listen(3000, function(){
	console.log("me listen")
})


module.exports = app;

