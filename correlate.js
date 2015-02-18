// Code to universalize interpreter
if (typeof(process) == "object") {
  var print = function(args) {
	console.log(args);
	}
  var write = function(args) {
	process.stdout.write(args);
	}
} else {
  console = new Object();
  console.log = function(args) {
    print(args);
	}
  process = new Object();
  process.stdout = new Object();
  process.stdout.write = function(args) {
    write(args);
    }
  }

// File inclusion doesn't work with node :-(
load('journal.js');

function hasEvent(event, entry) {
  return entry.events.indexOf(event) != -1;
}

function tableFor(event, journal) { // create function tableFor including event, journal
  var table = [0, 0, 0, 0]; // set table to have four ints of zero
  for (var i = 0; i < journal.length; i++) { // set var i = 0 then compare i to journal length and then add 1 to the i (index)
    var entry = journal[i], index = 0; // take the var entry get journal i (index) then set it to 0 
    if (hasEvent(event, entry)) index += 1; // if hasEvent contains event, entry get index and add 1 
    if (entry.squirrel) index += 2;// if entry.squirrel then add 2 to index 
    table[index] += 1; // take table index add 1 to it
  }
  return table; // return table
}

function phi(table) {
  return (table[3] * table[0] - table[2] * table[1]) /
    Math.sqrt((table[2] + table[3]) *
              (table[0] + table[1]) *
              (table[1] + table[3]) *
              (table[0] + table[2]));
}

//print(tableFor("touched tree", JOURNAL));
//print(phi(tableFor("touched tree",JOURNAL)));
print(tableFor("work", JOURNAL));


for (var event in correlations) {
  var correlation = correlations[event];
  if (correlation > 0.1 || correlation < -0.1)
    print(event + ": " + correlation);
}

function gatherCorrelations(journal) {
  var phis = {};
  for (var entry = 0; entry < journal.length; entry++) {
    var events = journal[entry].events;
    for (var i = 0; i < events.length; i++) {
      var event = events[i];
      if (!(event in phis))
        phis[event] = phi(tableFor(event, journal));
    }
  }
  return phis;
}

var correlations = gatherCorrelations(JOURNAL);

for (var event in correlations)
  console.log(event + ": " + correlations[event]);
