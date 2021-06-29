const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/test',{
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        useCreateIndex: true,
});

// // Menambah 1 data
// const contact1 = new Contact({
//     nama: 'Akhmad william',
//     nohp: '08190389786',
//     email: 'willly@gmail.com',
// });

// // Simpan ke Collection
// contact1.save().then((contact) => console.log(contact));
