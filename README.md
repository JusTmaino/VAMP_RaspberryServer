# VAMP_RaspberryServer

## Installation de Raspbian sur la carte MicroSD
Pour fonctionner, le Raspberry Pi va avoir besoin d'une carte MicroSD, où se trouvera le système d'exploitation choisi ainsi que tous les fichiers et programmes que l'on aura stocké dessus

1. Commencer par télécharger la dernière version de [Raspbian (Jessie)](https://www.raspberrypi.org/downloads/raspbian/)

2. Utiliser [Etcher](https://etcher.io) pour  l'écriture de l'image sur la carte MicroSD.

Une fois la carte MicroSD prête, on peut l'insérer dans le Raspberry Pi à l'emplacement prévu.

## Se connecter localement en SSH au raspberry
1.  Sur Raspberry Pi, SSH est installé par défaut, mais il est désactivé pour des raisons évidentes de sécurité. Pour l’activer, créer un fichier nommé `ssh` vide et placer le sur la racine de la carte SD

2. Afin de connecter le raspberry à votre réseau, créer un fichier nommé `wpa_supplicant.conf` qui contient la configuration de votre réseau, coller le code ci-dessous et placer le sur la racine de la carte SD.

```sh
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1
network= {
	ssid="SSID"
	psk="PASSWORD"
}
```

3.	Ouvrir le terminal et taper la commande suivante en remplaçant `ip-raspberry` par l'adresse ip sur laquelle le raspberry est connecté à votre réseau

	```sh
	$ ssh pi@ip-raspberry

	# par exemple

	$ ssh pi@192.168.43.48
	```


	__Note!__ utiliser `raspberry` comme mot de passe

4.	Une fois connecté, penser à mettre à jour votre raspberry en tapant les commandes suivantes

	```sh
	$ sudo apt-get update

	$ sudo apt-get upgrade

	$ sudo reboot
	```

##	Configuration du module PICAN2

Depuis le terminal de raspberry

1.	Créer un ficher de configuration pour detecter le PICAN2 au démmarage

	```sh
	$ sudo nano /boot/config.txt

	# dans l'editeur
	dtparam=spi=on
	dtoverlay=mcp2515-can0-overlay,oscillator=16000000,interrupt=25
	dtoverlay=spi-bcm2835-overlay
	```

2.	Redémarrer le rapsberry

	```sh
	$ sudo reboot
	```

## Analyse de trafic dans le bus CAN

1.	Faire monter l'interface avec le bus en tapant

	```sh
	$ sudo /sbin/ip link set can0 up type can bitrate 500000
	```

2.	Connecter le PiCAN2 à votre réseau CAN via le screw terminal ou DB9 et surveiller le trafic en utilisant les commnades suivantes

	```sh
	$ git clone https://github.com/JusTmaino/VAMP_RaspberryServer

	$ cd VAMP_RaspberryServer/can-test

	$ ./candump can0
	```
