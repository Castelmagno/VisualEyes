README
=========

Libaries:
=========
Libraries used in this visaulisation.

-d3.js : https://d3js.org
-jQuery : http://jquery.com
-jQueryui : http://jqueryui.com
-jQRangeSlider : http://ghusse.github.io/jQRangeSlider/index.html

Examples:
==========
Arc diagram based on: http://bl.ocks.org/sjengle/5431779
Parallel coordinates based on: http://bl.ocks.org/jasondavies/1341281

Modules:
==========
index.html includes the 3 seperate components which are the arc diagram, the Parallel coordinate view and the node-link view.
The code for these components can be found in the folder scripts.

-The script for the arc diagram is named arcs.js
-The script for the parallel coordinates view is named parcoo.js
-The script for the node-link view is named node.js

The layout is done using CSS3. The css files can be found in de style folder.

-The script for the arc diagram is named style-arcs.css
-The script for the Parallel coordinates view is named style-parcoo.css
-The script for the node-link view is named style-node.css

Datafiles:
==========
Different CSV files are present. These files contain all the data that is visualised.
- conflicts.csv : contains all the conflict data. The values of all the parameters are explained in the IMI-Codebook-1993.doc file. (src: https://www.k-state.edu/polsci/intervention/index.html)
- continent.csv : maps countries on continents (src: https://github.com/lukes/ISO-3166-Countries-with-Regional-Codes/blob/master/all/all.csv)
- list2.csv : contains the country codes of all the countries that are present in the visaulisation. This file is created to avoid the overhead of an extra pre-processing step in the javascript code.
- countrycodes.csv : Contains a mapping of the country code onto the country name. (src: http://cow.dss.ucdavis.edu/data-sets/cow-country-codes)


Set-up:
=========
Upload all the files to your webserver and you are ready to go.