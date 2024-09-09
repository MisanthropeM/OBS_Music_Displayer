# OBS_Music_Info_Scroller
Display music informations on auto-scrolling text if it is longer than the width of the box.
This project does not play music, it only reads informations on txt files !

Node.js is required for this to work. Install it here : https://nodejs.org/en/download/prebuilt-installer/current


HOW TO :

Once Node.js is installed and the repository is downloaded, you need to launch the script, either manually or automatically (OBS can launch scripts at startup) : ./run_tests in a cmd prompt

Create a browser source on OBS and put « http://localhost:3000 » as URL.

![image](https://github.com/user-attachments/assets/34e7ccd1-f369-4f4f-8530-9f018afec8ce)

Couple this with Tuna which puts music info in files and you have an automated music info scroller :

https://github.com/user-attachments/assets/d2fbebce-0b4f-4f28-848c-f57e50c3c9c0

Prompt on the cmd window :

![image](https://github.com/user-attachments/assets/186c3490-7ffc-4a2e-bc04-baf5fcaeeb3b)

You can change the look of the box in : client/style.css

And the speed of the scolling text in : client/script.js (lines 2, 3 and 4)
