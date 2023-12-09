# Cryptfire Cli

The Cryptfire CLI is a prelimiary tool to let you interact with the Cryptfire API.

```bash
cryptfire --register --email e@cryptfire.io;
cryptfire --set-password e@cryptfire.io;
cryptfire --set-password e@cryptfire.io --password "foobar";
cryptfire --register --confirm --email e@cryptfire.io;
cryptfire --sshkey --apikey ...;
cryptfire --rapid-deploy smalldev --apikey ...;
cryptfire --list-ccs;
cryptfire --fund --cc 0x01 USD100;
cryptfire --ssh -n sampleKey --key="$(cat ~/.ssh/id_rsa.pub)"

```

![cloud](https://github.com/cryptfire/cryptfire-cli/assets/114028070/af325aaa-f9ca-4c64-8a81-3ad33365c6bc)
