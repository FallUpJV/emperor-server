'use strict';
var fbgraph = require("fbgraph");

module.exports = function(Post) {
	Post.beforeRemote("*", (context, user, next) => {
		console.log(context);
		let FBToken = context.req.query.fbtoken;

		if(typeof FBToken == "undefined" || FBToken == "") {
			context.res.statusCode = 400;
			throw new Error("No FBToken specified !");
		}

		fbgraph.setAccessToken(FBToken);
		fbgraph.get("me", { fields: "friends" }, function(error, response) {
    		let friendsData = response.friends.data;
    		let friendsIDS = [];
    		friendsData.forEach((friend, index) => {
    			friendsIDS.push(friend.id);
    		});

    		context.req.query.filter = { where: { or: [] } };

			friendsIDS.forEach((friend, index) => {
				context.req.query.filter.where.or.push({ addressedTo: friend });
				context.req.query.filter.where.or.push({ author: friend });
			});

			console.log(context.req.query);
			console.log(context.req.query.filter.where.or);

			next();
  		});
	});
};
