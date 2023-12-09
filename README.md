# Cryptfire Cli

The Cryptfire CLI is a prelimiary tool to let you interact with the Cryptfire API.

Your session is stored AES-256-CBC encrypted on disk. It requires a password to decrypt.

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

Right now this is a bit of a copycat of [Vultr CLI](https://github.com/vultr/vultr-cli) and the pricing is actually a passthru.
But we have our own backend infrastructure deployed, and are working on Cryptfire Cloud.

<img width="1392" alt="Screenshot 2023-12-09 at 22 35 28" src="https://github.com/cryptfire/cryptfire-cli/assets/114028070/b4e816a4-9d85-4122-85cd-51e225051750">



![cloud](https://github.com/cryptfire/cryptfire-cli/assets/114028070/af325aaa-f9ca-4c64-8a81-3ad33365c6bc)
