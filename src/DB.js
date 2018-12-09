var mongo = require("mongodb").MongoClient;
var log = require("disnode-logger");
this.db = null;
module.exports.Connect = (config) => {
    var self = this;
    self.dbConfig = config;
    return new Promise(function (resolve, reject) {
        mongo.connect("mongodb://" + config.username + ":" + config.pass + "@" + config.host).then(function(db){
            if(self.int != null){
                clearInterval(self.int);
                self.int = null;
            }
            self.db = db;
            self.db.on('close', function () {
                log.Error("DB", "Disconnect", "Disconnected from DB! Attempting Reconnect!");
                self.AttemptReconnect();
            });
            log.Success("DB", "Connect", "Connected to DB!");
            resolve();
        })
    });
}
module.exports.Update = (collection, identifier, newData) => {
    var self = this;
    return new Promise(function (resolve, reject) {
        var _collection = self.db.collection(collection);
	    _collection.updateOne(identifier, {$set : newData}, {upsert: true}, function (err, result) {
		    if(err){
                reject(err);
                return;
            }
			resolve(result);
		});
	});
}
module.exports.Find = (collection, search) => {
    var self = this;
    return new Promise(function (resolve, reject) {
        var _collection = self.db.collection(collection);
        _collection.find(search, function (err, docs) {
            if(err){
                reject(err);
                return;
            }
            resolve(docs.toArray());
        });
    });
}
module.exports.FindSort = (collection, search, sort) => {
    var self = this;
    return new Promise(function (resolve, reject) {
        var _collection = self.db.collection(collection);
        _collection.find(search).sort(sort).toArray(function (err, docs) {
            if(err){
                reject(err);
                return;
            }
            resolve(docs);
        });
    });
}
module.exports.AttemptReconnect = () => {
  var self = this;
  this.int = setInterval(() => {
      log.Success("DB", "Reconnect", "Attempting to reconnect.");
      this.Connect(self.dbConfig);
  }, 5000);
}
exports.Insert = (collection, data) => {
		var self = this;
		return new Promise(function (resolve, reject) {
      var _collection = self.db.collection(collection);
			_collection.insert(data, function (err, result) {
				if(err){
          reject(err);
          return;
        }
				resolve(result);
			});
		});
}
exports.InsertMany = (collection, data) => {
		var self = this;
		return new Promise(function (resolve, reject) {
      var _collection = self.db.collection(collection);
			_collection.insertMany(data,{forceServerObjectId: true}, function (err, result) {
				if(err){
          reject(err);
          return;
        }
				resolve(result);
			});
		});
}
exports.Delete = (collection, search) => {
		var self = this;

    return new Promise(function (resolve, reject) {
      var _collection = self.db.collection(collection);
			_collection.deleteOne(search, function (err, docs) {
				if(err){
          reject(err);
          return;
        }
				resolve();
			});
		});
	}
  exports.Drop = (collection, search) => {
  		var self = this;

      return new Promise(function (resolve, reject) {
        var _collection = self.db.collection(collection);
  			resolve(_collection.drop())
  		});
  	}
module.exports.GetDB = () => {
    return this.db;
}
