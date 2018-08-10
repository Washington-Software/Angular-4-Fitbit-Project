# ANGULAR 4 TO CORDOVA/PHONEGAP

Basic instructions on how to convert a functional Angular 4 project into a functioning Cordova project. This assumes you already have the working Angular 4 project.

## Angular 4 Project Structure

A typical Angular 4 Project might look something like this:

![File tree](tree.png)

This would be from a typical Angular 4 project with the actual app stored in `src`, end-to-end tests in `e2e`, and various config files such as `tsconfig.json` and `package-lock.json`; `karma` files are used in the `karma` unit test system, and can be safely deleted if unit tests aren't used.

## Preparing the Environment

Preparing Angular and Cordova from scratch.

### Angular
Skip this if you already have a working Angular setup.

#### Ubuntu and other \*nix systems
Typically, `nodejs` and `npm` already exist in official repositories, so simply run the package manager of your choice to obtain both. For example, in Ubuntu run
```bash
sudo apt install nodejs
sudo apt install npm
```

If you'll need packages that require compilation, make sure you have `base-devel`/`buid-essential` or your \*nix's flavour installed.

#### OS X
Install the Xcode set of command-line tools:
```sh
% xcode-select --install
```

Install the `brew` package manager for OS X:
```sh
% ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

Install `node` with brew:
```sh
brew install node
```
Brew will automagically pull in node and npm.

#### Windows
Install the chocolatey package manager from [the chocolatey site](https://chocolatey.org/install). Install `node` with
```
C:\> choco install nodejs
```

Check the installed versions with
```sh
C:\> nodejs -v
C:\> npm -v
```

### Cordova
Install the Cordova CLI globally using `npm`:
On Windows, do:
```
C:\> npm install -g cordova
```

On OS X and Linux, do:
```sh
% sudo npm install -g cordova
```

### Android Build Environment

## Setting up a Cordova Project

Create a new Cordova project first:
```sh
cordova create <path> <id> <name>
```
where `path` is a new folder to put the app in, `id` is the reversed domain identifier for the app (i.e. `com.example.myapp`), and `name` is the name used for the app.

Move into the newly created folder, and add the platforms that you're targeting, which could be `android`, `ios`, or `browser`:
```sh
% cordova platform add android
% cordova platform add ios
```

You can check what platforms have been added with
```sh
% cordova platform ls
```

Now, ensure that all of the required dependencies for building have been installed. Run
```sh
cordova requirements
```
and make sure the output shows no errors.

## Moving Angular Code into Cordova

### Moving Angular Source
To move the Angular code over into the Cordova project, simply select all of your sorce files from the root of your Angular project, and copy-paste it into the root directory of the Cordova project:
```sh
cp -R <angular-project>/* <cordova-project>/
```

Cordova builds the app out of the `www` directory, so we need to redirect the Angular build output to that folder. Assuming you build from the command line with `ng`, edit `.angular-cli.json` and change `outDir` to `www`. Now, executing `ng build` should output into the `www` folder instead of `dist`.

That's it for the basics! If you now try `cordova run browser`, you should see the Angular app show up in a browser window!

## Advanced Things

### Cordova Plugins

It is possible to install a variety of Cordova
