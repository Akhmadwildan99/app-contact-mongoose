const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const{ body, check, validationResult} = require('express-validator');

require('./utils/db');
const Contact = require('./model/contact');

const session = require('express-session');
const cookieParser = require("cookie-parser");
const flash = require('connect-flash');

const app = express();
const port = 3000;


app.set('view engine', 'ejs'); // Gunakan ejs
app.use(expressLayouts); // Third-Party Midleware
app.use(express.static('public')); // Built-in Midleware
app.use(express.urlencoded({extended: true})); // Built-in Midleware

// Konfigurasi flash
app.use(cookieParser('secret'));
app.use(
    session({
        cookie: {maxAge: 6000},
        secret: 'secret',
        resave: true,
        saveUninitialized: true,
    })
);

app.use(flash());


// Halaman Home

app.get('/', (req, res)=>{
    const kariyawan = 
    [
        {
        nama: 'akhmad',
        nik: '234'
        },
        {
        nama: 'wildan',
        nik: '234'
        },
        {
        nama: 'arthur',
        nik: '234'
        }
    ]
    res.render('index', {
        layout: 'layouts/main-layouts',
        title: 'Halaman index',
        kariyawan,
    });
});

// Halaman about

app.get('/about', (req, res)=>{
    // res.sendFile('./about.html', {root:__dirname});
    res.render('about', {
        layout: 'layouts/main-layouts',
        title: 'view about'
    });
});

// Halaman Contact

app.get('/contact', async (req, res)=>{
    // Contact.find().then((contact)=> {
    //     res.send(contact);
    // });
    const contacts = await Contact.find();
    res.render('contact', {
        layout: 'layouts/main-layouts',
        title: 'halaman contact',
        contacts,
        msg: req.flash('msg'),
    });
});

// Halaman Tambah Contact
app.get('/contact/add', (req, res)=>{
    res.render('contact-add',{
        layout: 'layouts/main-layouts',
        title: 'Halaman tambah contact'
    });
});

// Proses Tambah data contact
app.post('/contact', [
    body('nama').custom( async (value)=>{
        const duplikat = await Contact.findOne({ nama: value });
        if(duplikat){
            throw new Error('Nama contact sudah digunakan!');
        }
        return true;
    }),
    check('email', 'Email tidak valid!').isEmail(), 
    check('nohp', 'No HP tidak valid!').isMobilePhone('id-ID')
    ], 
    (req, res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.render('contact-add',{
            layout: 'layouts/main-layouts',
            title: 'Halaman tambah contact',
            errors: errors.array()
        });
    } else {
        Contact.insertMany(req.body, (error, result)=>{
            // kirim masage singkat
            req.flash('msg', 'Data contact bersail ditambahkan!');
            res.redirect('/contact');
        });
    }
}
);

// Proses delete Contact
app.get('/contact/delete/:nama', async (req, res)=>{
    const contact = await Contact.findOne({ nama: req.params.nama });
    if(!contact){
        res.status(404);
        res.send('<h1>404</h1>');
    } else {
        Contact.deleteOne({_id: contact._id}).then((result)=>{
            req.flash('msg', 'Data contact bersail dihapus!');
            res.redirect('/contact');
        });
    }
});

// Halaman detail contact
app.get('/contact/:nama', async (req, res)=>{
    const contact = await Contact.findOne({ nama: req.params.nama });
    res.render('detail', {
        layout: 'layouts/main-layouts',
        title: 'halaman detail contact',
        contact,
    });
});

app.listen(port, ()=>{
    console.log(`Mongo contact app | listen at http://localhost:${port}`);
});