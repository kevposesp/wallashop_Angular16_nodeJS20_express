module.exports = (mongoose, uniqueValidator, jwt) => {
    const userSchema = mongoose.Schema({
        username: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            unique: true,
            match: [/\S+@\S+\.\S+/, 'is invalid'],
            index: true
        },
        bio: {
            type: String,
            default: ""
        },
        image: {
            type: String,
            default: "https://100k-faces.glitch.me/random-image"
        },
        favouriteProduct: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }],
        followingUsers: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }]
    },
        {
            timestamps: true
        });

    userSchema.plugin(uniqueValidator);

    userSchema.method("toJSON", function () {
        const { __v, ...object } = this.toObject();
        return object;
    });

    userSchema.methods.generateAccessToken = function () {
        const accessToken = jwt.sign({
            "user": {
                "id": this._id,
                "email": this.email,
                "password": this.password
            }
        },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "1d" }
        );
        return accessToken;
    }

    userSchema.methods.toUserResponse = function (log) {
        if (log) {
            return {
                username: this.username,
                email: this.email,
                bio: this.bio,
                image: this.image,
                token: this.generateAccessToken()
            }
        } else {
            return {
                username: this.username,
                email: this.email,
                bio: this.bio,
                image: this.image,
            }
        }
    };

    // userSchema.methods.toProfileJSON = function (user) {
    //     return {
    //         username: this.username,
    //         bio: this.bio,
    //         image: this.image,
    //         following: user ? user.isFollowing(this._id) : false
    //     }
    // };

    // userSchema.methods.isFollowing = function (id) {
    //     const idStr = id.toString();
    //     for (const followingUser of this.followingUsers) {
    //         if (followingUser.toString() === idStr) {
    //             return true;
    //         }
    //     }
    //     return false;
    // };

    // userSchema.methods.follow = function (id) {
    //     if(this.followingUsers.indexOf(id) === -1){
    //         this.followingUsers.push(id);
    //     }
    //     return this.save();
    // };

    // userSchema.methods.unfollow = function (id) {
    //     if(this.followingUsers.indexOf(id) !== -1){
    //         this.followingUsers.remove(id);
    //     }
    //     return this.save();
    // };

    // userSchema.methods.isFavourite = function (id) {
    //     const idStr = id.toString();
    //     for (const article of this.favouriteArticles) {
    //         if (article.toString() === idStr) {
    //             return true;
    //         }
    //     }
    //     return false;
    // }

    // userSchema.methods.favorite = function (id) {
    //     if(this.favouriteArticles.indexOf(id) === -1){
    //         this.favouriteArticles.push(id);
    //     }

    //     // const article = await Article.findById(id).exec();
    //     //
    //     // article.favouritesCount += 1;
    //     //
    //     // await article.save();

    //     return this.save();
    // }

    // userSchema.methods.unfavorite = function (id) {
    //     if(this.favouriteArticles.indexOf(id) !== -1){
    //         this.favouriteArticles.remove(id);
    //     }

    //     // const article = await Article.findById(id).exec();
    //     //
    //     // article.favouritesCount -= 1;
    //     //
    //     // await article.save();

    //     return this.save();
    // };

    const User = mongoose.model("user", userSchema)
    return User

}