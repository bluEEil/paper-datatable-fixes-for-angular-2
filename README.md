Fixes for David Mudlers paper data table so it will work with angular 2 </br>
This repo doesn't work buy itself, but you can take the fixed source code and replace </br>
them with the original ones to get thing working in your angular 2 project </br>
(The original repo: https://github.com/David-Mulder/paper-datatable) </br>
</br>
Here are the fixes that I have done which are must to have the table working in an angular 2 project: </br>
(Notice, some changes remove a few small features from the original paper-table, small price to pay though..) </br>
</br>
1) In paper-datatable-column.html change ready to attached </br>
2) Same file as 1, in _registerEvilFunctions function, put the dataHost line that were outside of the if's </br>
inside an if to check if there is a datahost (I believe this will still cause problem if use the array column feature </br>
but I just didn't use it and eveything was fine) </br>
3) In the paper-datatable-card replace ready with attached, otherwise it doesn't find the table element </br>
</br>
In addition to these fixes to the actual source files I also wrote an angular 2 component to wrap </br>
the table. It reduces the amout of code I needed to get things working with the table and also offers </br>
some extra features like cruds with toolbar buttons (Some of them were based on examples David Mudler wrote </br>
in his original docs but are converted into an angular 2 component). </br>
Please review the table component code to learn more. </br>
