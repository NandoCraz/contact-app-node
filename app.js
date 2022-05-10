const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const { loadContact, findContact, addContact, cekDuplikat, deleteContact, updateContacts } = require("./utils/contacts");
const { body, validationResult, check } = require("express-validator");
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const req = require("express/lib/request");

const app = express();
const port = 3000;

app.set("view engine", "ejs"); // gunakan ejs
app.use(expressLayouts); // Third-party middleware
app.use(express.static(__dirname + "/public")); // Built-in middleware
app.use(express.urlencoded({ extended: true }));

// konfigurasi flash
app.use(cookieParser('secret'));
app.use(session({
  cookie: { maxAge: 6000 },
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}));
app.use(flash());

app.get("/", (req, res) => {
  const siswa = [
    {
      nama: "Shin Wolfourd",
      email: "shinwolf@gmail.com",
    },
    {
      nama: "Shin Chronous",
      email: "shinchrons@gmail.com",
    },
    {
      nama: "Shin Craz",
      email: "shincraz@gmail.com",
    },
  ];
  res.render("index", {
    nama: "Shin Chronous",
    title: "Halaman Home",
    siswa,
    layout: "layouts/main-layout",
  });
});

app.get("/about", (req, res, next) => {
  res.render("about", {
    title: "Halaman About",
    layout: "layouts/main-layout",
  });
});

app.get("/contact", (req, res) => {
  const contacts = loadContact();
  res.render("contact", {
    title: "Halaman Contact",
    layout: "layouts/main-layout",
    contacts,
    msg: req.flash('msg'),
  });
});

// halaman form tambah data
app.get("/contact/add", (req, res) => {
  res.render("add-contact", {
    title: "Form Tambah Contact",
    layout: "layouts/main-layout",
  });
});

// mengolah proses data contact
app.post(
  "/contact",
  [
    body("nama").custom((value) => {
      const duplikat = cekDuplikat(value);
      if (duplikat) {
        throw new Error("Nama contact sudah terdaftar!");
      }
      return true;
    }),
    check("email", "Email tidak valid!").isEmail(),
    check("nohp", "No. Handphone tidak valid!").isMobilePhone("id-ID"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // return res.status(400).json({ errors: errors.array() });
      res.render("add-contact", {
        title: "Form Tambah Contact",
        layout: "layouts/main-layout",
        errors: errors.array(),
      });
    } else {
      addContact(req.body);
      // kirimkan flash massage
      req.flash('msg', 'Data contact berhasil ditambahkan!');
      res.redirect("/contact");
    }
  }
);

// proses delete contact
app.get('/contact/delete/:nama', (req, res) => {
  const contact = findContact(req.params.nama);

  // jika contact tidak ada
  if(!contact) {
    res.status(404);
    res.send('<h1>404</h1>')
  } else {
    deleteContact(req.params.nama);
    req.flash('msg', 'Data contact berhasil dihapus!');
      res.redirect("/contact");
  }
})

// form ubah data contact
app.get("/contact/edit/:nama", (req, res) => {
  const contacts = findContact(req.params.nama);

  res.render("edit-contact", {
    title: "Form Ubah Contact",
    layout: "layouts/main-layout",
    contacts,
  });
});

// proses ubah data
app.post(
  "/contact/update",
  [
    body("nama").custom((value, { req }) => {
      const duplikat = cekDuplikat(value);
      if (value !== req.body.oldNama && duplikat) {
        throw new Error("Nama contact sudah terdaftar!");
      }
      return true;
    }),
    check("email", "Email tidak valid!").isEmail(),
    check("nohp", "No. Handphone tidak valid!").isMobilePhone("id-ID"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // return res.status(400).json({ errors: errors.array() });
      res.render("edit-contact", {
        title: "Form Ubah Contact",
        layout: "layouts/main-layout",
        errors: errors.array(),
        contacts: req.body,
      });
    } else {
      updateContacts(req.body);
      // kirimkan flash massage
      req.flash('msg', 'Data contact berhasil diubah!');
      res.redirect("/contact");
    }
  }
);

// halaman detail contact
app.get("/contact/:nama", (req, res) => {
  const contact = findContact(req.params.nama);
  res.render("detail", {
    title: "Halaman Detail Contact",
    layout: "layouts/main-layout",
    contact,
  });
});

app.use((req, res) => {
  res.status(404);
});

app.listen(port, () => {
  console.log(`ShinContact app listening on port ${port}`);
});
