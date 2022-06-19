# Modler
Modler is a simple oneclick-like mod installer for Beat Saber mods from Github.

# Installation
### PC/laptop part
1. Unpack `modler.zip` from [releases](https://github.com/StormPacer/Modler/releases/latest) in a separate folder. **THE FOLDER SHOULD NOT CONTAIN ANY SPACES IN IT'S NAME!**

**DON'T RUN MODLER.EXE ON IT'S OWN!**

2. Run `registerProtocol.exe`. This will make a new protocol on your PC/laptop so modler can be opened straight from the browser.
### Browser part
1. Install a userscript manager. It can be either [ViolentMonkey](https://violentmonkey.github.io/get-it/) or [TamperMonkey](https://www.tampermonkey.net/).
2. Install the modler userscript from [GreasyFork](https://greasyfork.org/en/scripts/446675-modler).

# Usage
Now that you've installed everything, you should see an "install mod" button at the top right of any repository. When you press it you will be prompted to open `Windows Command Processor`. When you open it, the app will run and install your mod straight to your Beat Saber directory.

### IF YOU SEE THE FOLLOWING:
![customDirectory](https://raw.githubusercontent.com/StormPacer/Modler/main/images/beatSaberDirectory.png)

Simply copy paste the path to AppData in your windows search bar and open `customDirectory.txt`. Navigate to your custom Beat Saber directory and copy the path to it by clicking on the path in the top:

![Path](https://raw.githubusercontent.com/StormPacer/Modler/main/images/path.png)

Then paste that path in `customDirectory.txt`, save the file and you're done. You can now install mods normally.

# Errors

### ENOENT: No such file or directory

![ENOENT](https://raw.githubusercontent.com/StormPacer/Modler/main/images/error.png)

If you see this error it means you ran `modler.exe` on it's own and it didn't give out an error message because `customDirectory.txt` has already been created. To fix it, follow the [Custom Directory](https://github.com/StormPacer/Modler#if-you-see-the-following) instructions.

#

If you run into any issues you can always open an issue or message me on discord: StormPacer#2871
