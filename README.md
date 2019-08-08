# VSTS Unity Build Task
![](images/unity_logo.png)

## Overview
This is VSTS extension for building Unity projects.

## Scripts
Adding Environment Variables [ [.ps1](scripts/demands.ps1) | [.sh](scripts/demands.sh) ]

`PowerShell` script will automatically find all Unity.exe instances and add environment variables in the format:
```
['unity'] = C:\Program Files\Unity_2017.3.0p1\Editor\Unity.exe
['unity_5.3.4p1'] = C:\Program Files\Unity_5.3.4p1\Editor\Unity.exe
['unity_2017.1.0p5'] = C:\Program Files\Unity_2017.1.0p5\Editor\Unity.exe
['unity_2017.3.0p1'] = C:\Program Files\Unity_2017.3.0p1\Editor\Unity.exe
```
Script should be run as administrator.

`Bash` script finds the running VSTS-Agents and adds the following variables to the `.env` files:
```
unity=/Applications/Unity_2017.3.0p1/Unity.app/Contents/MacOS/Unity
unity_5.3.4p1=/Applications/Unity_5.3.4p1/Unity.app/Contents/MacOS/Unity
unity_2017.2.1f1=/Applications/Unity_2017.2.1f1/Unity.app/Contents/MacOS/Unity
unity_2017.3.0p1=/Applications/Unity_2017.3.0p1/Unity.app/Contents/MacOS/Unity
```
Download [demands.sh](scripts/demands.sh) file with `wget` and run it on the macOS build server command:
```
wget <URL>
./demands.sh
```
You can get debugging information by adding the argument `debug`:
```
./demands.sh debug
```
To override the variables in an `.env` file just add the `reset`:
```
./demands.sh reset
```
Arguments can also be combined:
```
./demands.sh reset debug
```

<div id="traceRules">

## Trace Rules

Rules must be in JSON format.

Schema of Mute, CompilerOut:
```JSON
{
    "type": "string",
    "pattern": "string",
    "reason": "string",
    "muteSection": "string",
    "countLine": "boolean"
}
```

Schema of Critical, Error, Warning, Info, Normal, Command:
```JSON
{
    "type": "string",
    "pattern": "string"
}
```

Example:
```JSON
[
    {
        "type": "mute",
        "pattern": "^\\s*$",
        "ruleId": "muteEmptyLines",
        "countLine": false
    },
    {
        "type": "error",
        "pattern": "Could Not Create Action: .+ \\(Maybe the script was removed\\?\\)"
    },
    {
        "type": "info",
        "pattern": "NuGet Package Manager can not support "
    },
    {
        "type": "normal",
        "pattern": "Failed to unload '.+'"
    }
]
```


## Node and Npm:

**Windows and Mac OSX**: Download and install node from [nodejs.org](http://nodejs.org/)

From a terminal ensure at least node 6.11.0 and npm 4.6.1:
```
node -v && npm -v
v6.11.0
4.6.1
```

To install npm separately:
```
npm install npm@4.6.1 -g
npm -v
4.6.1
```

## Make Dependencies
This must be done in the root path of the repo:
```
npm install
gulp install
```

## Build and Package
```
gulp make
```

## Visual Studio Code
Launch VS Code Quick Open (`Ctrl+P`), and paste the following command:

To make TypeScript
```
task make
```

To create .vsix package
```
task build
```
Task will be create a .vsix package in the _bin directory.

## Developing
 
Unity Build compiles as optimized, minified packages using tsproject, requirejs, and gulp.

To setup:

```
npm i -g tsproject
npm i -g gulp
npm update
```

Then to compile and bundle, run:

```
gulp build
```

To package so you can test in your Visual Studio Team Services account, install the [Team Services CLI](https://github.com/Microsoft/tfs-cli) and run:

```
tfx extension create --publisher myPublisherId
```
