

function generateLightningPoints(start, end) {

  var denominatorThing = numPoints;
  

  var points = [];
  points.push(start);

  var deltaX = end.x - start.x;
  var deltaY = end.y - start.y;
  // points.push(createVector(start.x + deltaX * currentPartition/numPoints + random(-variance,variance), start.y + deltaY* currentPartition/numPoints + random(-variance,variance)));
  points.push(createVector(start.x + deltaX * 1/denominatorThing + random(-variance,variance), start.y + deltaY* 1/denominatorThing + random(-variance,variance)));


  for(var i = 0; i < numPoints-2; i++) {
    denominatorThing -= 1;

    deltaX = end.x - points[points.length-1].x;
    deltaY = end.y - points[points.length-1].y;
  
    // points.push(createVector(points[points.length-1].x + deltaX * currentPartition/numPoints + random(-variance,variance), points[points.length-1].y + deltaY * currentPartition/numPoints + random(-variance,variance)));
    points.push(createVector(points[points.length-1].x + deltaX * 1/denominatorThing + random(-variance,variance), points[points.length-1].y + deltaY * 1/denominatorThing + random(-variance,variance)));
  
  }
  
  points.push(end);
  return points;
}


function drawLightning() {
  push();
  stroke(255,180);
  strokeWeight(2);
  for(var i = 0; i < lightnings.length; i++) {
    for (var j = 0; j < lightnings[0].length-1; j++) {
      line(lightnings[i][j].x,lightnings[i][j].y,lightnings[i][j+1].x,lightnings[i][j+1].y);
    }

  }
  pop();
}