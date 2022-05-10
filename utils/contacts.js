const fs = require("fs");

// Membuat folder data jika belum ada
const directory = "./data";
if (!fs.existsSync(directory)) {
  fs.mkdirSync(directory);
}

// Membuat file json jika belum ada
const file = "./data/contact.json";
if (!fs.existsSync(file)) {
  fs.writeFileSync(file, "[]", "utf-8");
}

// ambil semua data di contact.json
const loadContact = () => {
  const file = fs.readFileSync("data/contact.json", "utf-8");
  const contacts = JSON.parse(file);
  return contacts;
};

// cari contact berdasarkan nama
const findContact = (nama) => {
  const contacts = loadContact();
  const contact = contacts.find((contact) => contact.nama === nama);
  return contact;
};

// menuliskan / menimpa file contacts.json dengan data yang baru
const saveContacts = (contacts) => {
  fs.writeFileSync('data/contact.json', JSON.stringify(contacts));
} 

// menmbahkan data contact baru
const addContact = (contact) => {
  const contacts = loadContact();
  contacts.push(contact);
  saveContacts(contacts);
}

// cek nama duplikat
const cekDuplikat = (nama) => {
  const contacts = loadContact();
  return contacts.find((contact) => contact.nama === nama)
}

// hapus contact
const deleteContact = (nama) => {
  const contacts = loadContact();
  const filteredContacts = contacts.filter((contact) => contact.nama !== nama);
  saveContacts(filteredContacts);
}

// mengubah contacts
const updateContacts = (contactsBaru) => {
  const contacts = loadContact();

  // hilangkan contact lama yang namanya sama dengan oldNama
  const filteredContacts = contacts.filter((contact) => contact.nama !== contactsBaru.oldNama);
  delete contactsBaru.oldNama;
  filteredContacts.push(contactsBaru);
  saveContacts(filteredContacts);
}

module.exports = { loadContact, findContact, addContact, cekDuplikat, deleteContact, updateContacts };
