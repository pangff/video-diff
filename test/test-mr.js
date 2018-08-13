var mapreduce = require('mapred')(); // Leave blank for max performance
//var mapreduce = require('mapred')(1); // 1 = single core version (slowest)
//var mapreduce = require('mapred')(3); // Use a cluster of 3 processes

// Information to process =====================================================

var information = [
  ['primer trozo de informacion para procesado primer trozo'],
  ['segundo trozo de informacion trozo de'],
  ['otro trozo para ser procesado otro otro otro trozo'],
  ['primer trozo de informacion para procesado primer trozo'],
  ['segundo trozo de informacion trozo de'],
  ['otro trozo para ser procesado otro otro otro trozo']
];

// User map implementation =====================================================

var map = function(key, value){
  console.log('key',key)
  console.log('value',value)
  var list = [], aux = {};
  key = key.split(' ');
  key.forEach(function(w){
    aux[w] = (aux[w] || 0) + 1;
  });
  for(var k in aux){
    list.push([k, aux[k]]);
  }
  console.log(list)
  return list;
};

// User reduce implementation =================================================

var reduce = function(key, values){
  var sum = 0;
  values.forEach(function(e){
    sum += e;
  });
  return sum;
};

// MapReduce call =============================================================

mapreduce(information, map, reduce, function(result){
  console.log(result);
});
