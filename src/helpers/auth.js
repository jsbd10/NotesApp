const helpers={}


helpers.isAuthenticated=(req,res, next)=>{
    if(req.isAuthenticated()){
        return next()
    }
    req.flash('error_msg','Not Autherized')
    res.redirect('/users/signin')
}

module.exports=helpers