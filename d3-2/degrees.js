
    <style>
      .legend {                                                    
        font-size: 12px;                                           
      }                                                            
      rect {                                                       
        stroke-width: 2;                                           
      }                                                            
    </style>

    <div id="chart"></div>
    <script src="d3.js"></script>
    <script>
      (function(d3) {
        'use strict';

var list = [];
var a = 0;
var b = 0;
var c = 0;
var d = 0;
var m = 0;

d3.csv("Education.csv", function(data) {
  data.forEach(function(d) {  
    list.push(d.degree);
  });
  for (var i = 0; i < list.length; i++) {
    switch(list[i]) {
      case "Associates":
        a++;
        break;
      case "Bachelor":
        b++;
        break;
      case "Certificate":
        c++;
        break;
      case "Doctorate":
        d++;
        break;
      case "Masters":
        m++;
        break;
      default:
        break;
    }
  }
  makePie();
});

function makePie() {

      var dataset = [
  {label: 'Associates', count: a},
  {label: 'Bachelor', count: b},
  {label: 'Certificate', count: c},
  {label: 'Doctorate', count: d},
  {label: 'Masters', count: m}
  ];


        var width = 360;
        var height = 360;
        var radius = Math.min(width, height) / 2;
        var donutWidth = 75;
        var legendRectSize = 18;                                  
      var legendSpacing = 4;                                    
       var color = d3.scale.category20b();

        var svg = d3.select('#chart')
          .append('svg')
          .attr('width', width)
          .attr('height', height)
          .append('g')
          .attr('transform', 'translate(' + (width / 2) + 
            ',' + (height / 2) + ')');

        var arc = d3.svg.arc()
          .innerRadius(radius - donutWidth)
          .outerRadius(radius);

        var pie = d3.layout.pie()
          .value(function(d) { return d.count; })
          .sort(null);

        var path = svg.selectAll('path')
          .data(pie(dataset))
          .enter()
          .append('path')
          .attr('d', arc)
          .attr('fill', function(d, i) { 
            return color(d.data.label);
          });

        var legend = svg.selectAll('.legend')                     
        .data(color.domain())                                   
        .enter()                                                
        .append('g')                                            
        .attr('class', 'legend')                                
        .attr('transform', function(d, i) {                     
          var height = legendRectSize + legendSpacing;          
          var offset =  height * color.domain().length / 2;     
          var horz = -2 * legendRectSize;                       
          var vert = i * height - offset;                       
          return 'translate(' + horz + ',' + vert + ')';        
        });                                                     
       legend.append('rect')                                     
        .attr('width', legendRectSize)                          
        .attr('height', legendRectSize)                         
        .style('fill', color)                                   
        .style('stroke', color);                                
        
        legend.append('text')                                     
        .attr('x', legendRectSize + legendSpacing)              
        .attr('y', legendRectSize - legendSpacing)              
        .text(function(d) { return d; });     
        }                  
     })(window.d3);

    </script>
