1.To create start_server.bat file:

@echo off
:: Activate Anaconda environment(activates the python environment on which we want to execute file)
call C:\Users\LITHESH\anaconda3\Scripts\activate.bat base 

:: Change directory to where app.py is located
cd /d "D:\vs_toxic_comments_detection"

:: Run the Python application
python app.py

:: Keep the console open
pause



2.Load Your Chrome Extension:
Open Google Chrome.
Go to chrome://extensions/.
Enable Developer Mode (top right corner).
Click Load unpacked and select the chrome-extension folder.
Click on the extension icon in the toolbar and use the popup.

Note:Start the Flask server by running start_server.bat before turning on and using the extension.