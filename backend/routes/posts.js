const express = require('express')
const Post = require('../models/post')
const multer = require('multer')
const router = express.Router()

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg':'jpg',
  'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype]
    let error = new Error("Extensión no valida")
    if(isValid){
      error = null
    }
    cb(error, "backend/images")
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-')
    const ext = MIME_TYPE_MAP[file.mimetype]
    cb(null, name + '-' + Date.now() + '.' + ext)
  }
})


router.post('', multer({storage: storage}).single('image'), (req, res, next) => {
  const url = req.protocol + '://' + req.get('host')
  const post = new Post({
    name: req.body.name,
    lastName: req.body.lastName,
    dateBirth: req.body.dateBirth,
    address: req.body.address,
    number: req.body.number,
    generation: req.body.generation,
    average: req.body.average,
    disability: req.body.disability,
    reports: req.body.reports,
    imagePath: url + "/image/" + req.file.filename
  })
  post.save().then(createdPost => {
    res.status(201).json({
      message: 'Post added successful',
      post:{
        ...createdPost,
        id: createdPost._id
      }
    })
  })
})

router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if(post){
      res.status(200).json(post)
    }else{
      res.status(404).json({message: 'Post no encontrado'})
    }
  })
})

router.delete('/:id', (req, res, next) => {
  id = req.params.id
  Post.findById(id).then((post) => {
  post.remove()
  res.status(201).json({message: 'Post deleted successful'})
  })

})

router.put('/:id', multer({storage: storage}).
single('image'), (req, res, next) => {
  let imagePath = req.body.imagePath
  if(req.file){
    const url = req.protocol + '://' + req.get('host')
    imagePath = url + "/image/" + req.file.filename
  }
  const post = new Post({
    _id: req.body.id,
    name: req.body.name,
    lastName: req.body.lastName,
    dateBirth: req.body.dateBirth,
    address: req.body.address,
    number: req.body.number,
    generation: req.body.generation,
    average: req.body.average,
    disability: req.body.disability,
    reports: req.body.reports,
    imagePath: imagePath
  })
  Post.updateOne({_id: req.params.id}, post).then(result => {
    res.status(200).json({message: "Post Updated Sucessfuly"})
  })
})

router.get('', (req, res , next) => {

  Post.find().then(documents => {
    res.status(200).json({
      message: 'Publicaciones expuestas con exito',
      posts: documents
    })
    console.log(documents)
  })
})

module.exports = router
