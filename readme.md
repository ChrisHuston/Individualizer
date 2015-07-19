Individualizer
======
Import and display up to six fields of information to students individually. Usefull for communicating passwords for simulations or other information that is different for each student. Max of 120 characters per field.


## Usage
0. Click Settings in the Course menu
0. Click the Apps tab
0. Click the View App Configurations button
0. Click Add App
0. For Configuration Type, select By URL
0. Enter the Name that will be selected after changing the assignment type submission to External Tool.
0. Consumer key = YourKey
0. Shared Secret = YourSecret
0. Config URL = https://your_server_url/app/individualizer/config/assignment.xml
0. Click Submit
0. In the assignment, set points equal to a non-zero value (commonly set to 1).
0. Display Grade As = Complete/Incomplete
0. Submission Type = External Tool and select the name entered in step #5 above.
0. Click Update Assignment
0. Enter the field labels. Blank fields are allowed.
0. Click Save Field Labels
0. Click Choose File and select the CSV file that has the data to import. The first row should be headers with columns of: Net ID, Family Name, Given Name, Field 1, Field 2, Field 3, Field 4, Field 5, Field 6. The header names can be different, but the order must match. The students will see a list with Field 1 at the top. Less than 6 fields can be in the CSV file.
0. Re-importing will update the field values and remove any deleted students.