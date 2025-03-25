@echo off
:: Activate Anaconda environment
call C:\Users\LITHESH\anaconda3\Scripts\activate.bat base

:: Change directory to where app.py is located
cd /d "D:\vs_toxic_comments_detection"

:: Run the Python application
python app.py

:: Keep the console open
pause