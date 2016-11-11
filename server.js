var express = require('express');
var bodyParser = require('body-parser');
var users = require('./users.json');

var app = express();

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
	if (req.query.age){
		var result = users.filter(function(elem){
			return elem.age === Number(req.query.age);
		})
		res.status(200).json(result);
	} 
	if (req.query.city){
		var result = users.filter(function(elem){
			return elem.city === req.query.city;
		})
		res.status(200).json(result);
	} 
	if (req.query.state){
		var result = users.filter(function(elem){
			return elem.state === req.query.state;
		})
		res.status(200).json(result);
	} 
	if (req.query.gender){
		var result = users.filter(function(elem){
			return elem.gender === req.query.gender;
		})
		res.status(200).json(result);
	} 
	
	res.status(200).json(users);

})

// 3, 4
app.get('/api/users/:id', function(req, res, next){
	if (req.params.id === "admin" || req.params.id === "moderator" || req.params.id === "user"){
		var result = users.filter(function(elem){
			return elem.type === req.params.id;
		})
		res.status(200).json(result);
	} else if (Number(req.params.id) > 0 && Number(req.params.id) <= users.length){
		res.status(200).json(users[req.params.id - 1])
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
	var updated;
	users.forEach(function(elem){
		if (elem.id.toString() === req.params.id){
			elem.language = req.body.language;
			updated = elem;
		}
	})
	res.status(200).json(updated)
})

// 8
app.post('/api/users/forums/:id', function(req, res, next){
	var updated;
	users.forEach(function(elem){
		if (elem.id.toString() === req.params.id){
			elem.favorites.push(req.body.add);
			updated = elem;
		}
	})
	res.status(200).json(updated)
})

// 9
app.delete('/api/users/forums/:id', function(req, res, next){
	var updated;
	users.forEach(function(elem){
		if (elem.id.toString() === req.params.id){
			for (var i = elem.favorites.length-1; i >= 0; i--){
				if (elem.favorites[i] === req.query.favorite){
					elem.favorites.splice(i, 1);
				}
			}
			updated = elem;
		}
	})
	res.status(200).json(updated)
})

// 10
app.delete('/api/users/:id', function(req, res, next){
	for (var i = users.length-1; i >= 0; i--){
		if (users[i].id.toString() === req.params.id){
			users.splice(i,1);
		}
	}
	res.status(200).json(users);
})

// 12
app.put('/api/users/:id', function(req, res, next){
	var updated;
	users.forEach(function(elem){
		if (elem.id.toString() === req.params.id){
			for (var key in req.body){
				elem[key] = req.body[key];
			}
			updated = elem;
		}
	})
	res.status(200).json(updated)
})









app.listen(3000, function(){
	console.log("me listen")
})



module.exports = app;