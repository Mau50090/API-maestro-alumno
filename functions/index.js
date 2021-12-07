const functions = require("firebase-functions");
const admin = require('firebase-admin')
const express = require('express');
const { database } = require("firebase-admin"); 

const app = express()
admin.initializeApp({
    credential: admin.credential.cert('./permissions.json')
})

const db = admin.firestore()


 app.post("/api/alumno", async (req, res)=>{
    await db.collection('alumnos')
    .doc("/" + req.body.id + "/")
    .create({nombre: req.body.nombre});
    return res.status(204).json();
 })

 app.get('/api/alumnos/:id', async (req, res)=> {
     
        try{
            const doc = db.collection("alumnos").doc(req.params.id);
            const item = await doc.get();
            const respons = item.data();
            return res.status(200).json(respons);
         }catch(error){
            return res.status(500).send(error);
         }
 })

 app.get('/api/alumnos/', async (req, res)=> {
     
    try{
        const doc =  await db.collection("alumnos").get();
        let alumnos = []
        doc.forEach(alumno=> {
            alumnos.push(alumno.data())
        })
        return res.status(200).json({alumnos});
     }catch(error){
        return res.status(500).send(error);
     }
})

 app.put('/api/alumnos/', async (req, res)=>{

    try{
        const {id, nombre, matricula, foto, correo} = req.body
        await db.collection("alumnos").doc(id).update({nombre, matricula, foto, correo})
        const doc = db.collection("alumnos").doc(id);
        const item = await doc.get();
        const respons = item.data();
        return res.status(200).json(respons);
     }catch(error){
        return res.status(500).send(error);
     }
 })

app.put('/api/alumnos/materia', async (req, res)=>{
    try{
        const {id, nomateria, califmateria} = req.body
        await db.collection("alumnos").doc(id).update({[nomateria]: califmateria})  
        const doc = db.collection("alumnos").doc(id);
        const item = await doc.get();
        const respons = item.data();
        return res.status(200).json(respons);
     }catch(error){
        return res.status(500).send(error);
     }
})


app.put('/api/maestros/', async (req, res)=>{

    try{
        const {id, nombre, matricula, foto, correo} = req.body
        await db.collection("maestros").doc(id).update({nombre, matricula, foto, correo})
        const doc = db.collection("maestros").doc(id);
        const item = await doc.get();
        const respons = item.data();
        return res.status(200).json(respons);
     }catch(error){
        return res.status(500).send(error);
    }
 })

 app.get('/api/maestros/:id', async (req, res)=> {
     
    try{
        const doc = db.collection("maestros").doc(req.params.id);
        const item = await doc.get();
        const respons = item.data();
        return res.status(200).json(respons);
     }catch(error){
        return res.status(500).send(error);
     }
})

exports.app = functions.https.onRequest(app);
