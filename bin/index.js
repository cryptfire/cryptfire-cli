#! /usr/bin/env node
const chalk = require('chalk')
const boxen = require('boxen')
const yargs = require("yargs");
const fs = require("fs");
const figlet = require('figlet');
var crypto = require('crypto');
var prompt = require('prompt');

const usage = chalk.keyword('violet')("\nUsage: cryptfire -H \n" + boxen(
  chalk.green("\n" + "Interacts with the Cryptfire Cloud as well as others" + "\n"
), {padding: 1, borderColor: 'green', dimBorder: true}) + "\n");

const options = yargs
      .usage(usage)
      .option("p", {alias:"pricing", describe: "Display Cryptfire Pricing", type: "string", demandOption: false })
      .option("h", {alias:"hostname", describe: "Set Hostname for new instance", type: "string", demandOption: false })
      .option("r", {alias:"register", describe: "Register for an API Key", type: "string", demandOption: false })
      .option("s", {alias:"status", describe: "Show Session Status", type: "string", demandOption: false })
      .option("a", {alias:"apikey", describe: "Register with Cryptfire via Email or Phone", type: "string", demandOption: false })
      .option("y", {alias:"save", describe: "Register with Cryptfire via Email or Phone", type: "string", demandOption: false })
      .option("p", {alias:"premium", describe: "Register with Cryptfire via Email or Phone", type: "string", demandOption: false })
      .option("c", {alias:"creditcard", describe: "Register with Cryptfire via Email or Phone", type: "string", demandOption: false })
      .option("e", {alias:"ethereum", describe: "Register with Cryptfire via Email or Phone", type: "string", demandOption: false })
      .option("d", {alias:"deploy", describe: "Register with Cryptfire via Email or Phone", type: "string", demandOption: false })
      .option("x", {alias:"sshkey", describe: "Add an SSH Public Key", type: "string", demandOption: false })
      .option("x", {alias:"name", describe: "Name", type: "string", demandOption: false })
      .help(true)
      .argv;

// console.log(yargs.argv);
const argv = require('yargs/yargs')(process.argv.slice(2)).argv;
var session = {'apikey': '', 'email': '', 'phone': ''};

const homedir = require('os').homedir();
if (!fs.existsSync(`${homedir}/.cryptfire/session`)) {
  fs.mkdirSync(`${homedir}/.cryptfire`, { recursive: true });
  

  fs.writeFileSync(`${homedir}/.cryptfire/session`, JSON.stringify(session)); 
  console.log(`Spawned new session file`);
} else {
  const contents = fs.readFileSync(`${homedir}/.cryptfire/session`, 'utf8');
  // add aes-256-cbc decryption
  try {
    session = JSON.parse(contents);
  } catch(err) {
    console.log(`corrupt session file: ${err.message}`);
  }
}

const save_session = () => {
  fs.writeFileSync(`${homedir}/.cryptfire/session`, JSON.stringify(session));
};

const read_session = () => {
  return fs.readFileSync(`${homedir}/.cryptfire/session`, 'utf8');
};


if ( argv.status || argv.session ) {
  console.log(read_session());
}

// registration step 1
if ( argv.r || argv.register ) {
  prompt.start();
  prompt.get(['email', 'phone'], async function (err, result) {
    email = result.email;
    phone = result.phone;
    const resp = await fetch("https://api.cryptfire.io/keygen", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email: result.email, phone: result.phone})
    })
    session.email = email;
    session.phone = phone;
    save_session();
    const data = await resp.json();
    if (data.status === 'ok')
      console.log(`validation code sent to ${email}`);
    else
      console.log(data);
  });
}

// registration step 2
if ( argv.register && argv.confirm) {
  prompt.start();
  prompt.get(['code'], async function (err, result) {
    const resp = await fetch(`https://api.cryptfire.io/keygen/validate/${session.email}/${result.code}`, {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    try {
      const data = await resp.json();
    if (data.api_key) {
      session.apikey = data.api_key;
    } else {
      console.log('it didnt work');
    }
    save_session();
    console.log('saved api key to session');
    } catch (err) {
    console.log('err: ', err.message);
    }
  });
}

// public pricing
if ( argv.p || argv.pricing ) {
  fetch(`https://api.cryptfire.io/pricing/cloud`, {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then((resp) => resp.json())
    .then((data) => console.log(data));
}

if ( argv.sshkey && argv.name ) {
  console.log(`saving sshkey ${argv.name} to cryptfire cloud`);
 
  (async () => {
  const resp = await fetch(`https://api.cryptfire.io/account/ssh`, {
      method: "POST",
      headers: {
        'x-cryptfire-api-key': argv.apikey,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }, body: { 'ssh_key': argv.sshkey, 'name': argv.name }
    });
  const data = await resp.json();
  if (data.status === 'ok') {
    console.log(`saved ssh key identifier ${data.payload}`);
  } else {
    console.log(`something went wrong saving ssh key`);
  }
  })()

}

if ( argv.fiat ) {
    fetch(`https://api.cryptfire.io/account/ssh`, {
      method: "POST",
      headers: {
        'x-cryptfire-api-key': argv.apikey,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }, body: { 'sshkey': argv.sshkey }
    })
    .then(function(res){ return res.json(); })
    .then(function(data){ console.log(data) })
}
