/**
 * Created by Counter on 6/20/2017.
 */
var mongoose =require('mongoose');
mongoose.connect('mongodb://localhost/nodeauth');
var bcrypt =require('bcrypt');
var db =mongoose.connection;


var UserSchema= mongoose.Schema({
    username:{
        type:String,
        index:true
    },
    password:{
        type:String ,
        bcrypt:true,
        required:true
    },
    email:{
        type:String
    },
    name:{
        type:String
    }
});
var User = module.exports=mongoose.model('User',UserSchema);
module.exports.comparePassword=function(candidatePassword,hash,callback){
    bcrypt.compare(candidatePassword,hash,function (err,isMatch) {
        if(err){
            return callback(err)
        }
        callback(null,isMatch)
        
    })

};

module.exports.getUserById=function(id,callback){

    User.findById(id,callback)
};
module.exports.getUserByUsername=function(username,callback){
    var query= {username:username};
    User.findOne(query,callback)
};

module.exports.createUser=function (newuser , callback) {

    bcrypt.hash(newuser.password,10,function (err,hash) {
        if(err) throw err;

        newuser.password=hash;
        newuser.save(callback)

    })


    
}

