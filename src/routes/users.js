const express= require('express')
const User = require('../models/User')
const router= require('express').Router()
const user= require('../models/User')
const passport= require('passport')

router.get('/users/signin', (req, res)=>{
    res.render('./users/signin')
})

router.post('/users/signin', passport.authenticate('local', {
    successRedirect: '/notes',
    failureRedirect: '/users/signin',
    failureFlash: true
}))

router.get('/users/signup', (req, res)=>{
    res.render('./users/signup')
})

router.post('/users/signup',async (req, res)=>{
    const {name, email, password, confirm_password}=req.body
    const errors=[]

    if(name.length <=0){
        errors.push({text: 'El campo de nombre esta vacio'})
    }
    
    if(password != confirm_password){
        errors.push({text: 'Las contraseñas no coinciden'})
    }

    if(password.length < 4){
        errors.push({text: 'La contraseña es menor a 4 caracteres'})
    }

    if(errors.length>0){
        res.render('users/signup', {errors, name, email, password, confirm_password})
    }else{
        const emailUser=await User.findOne({email: email}).lean()
        if(emailUser){
            req.flash('error_msg','Email ya esta registrado')
            res.redirect('/users/signup')
        }
        const newUser= new User({name, email, password})
        newUser.password= await newUser.encryptPassword(password)
        await newUser.save()
        req.flash('success_msg','Usuario Registrado')
        res.redirect('/users/signin')
        
    }
})

router.get('/users/logout', async(req,res)=>{
    req.logout()
    res.redirect('/')
})

module.exports= router