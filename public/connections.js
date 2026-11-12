/* Connections puzzles: sixteen tiles hide four groups of four.

   Each puzzle:  { id, name, groups: [ { title, items: [4 tiles], note } x 4 ] }
   - List the groups from EASIEST to HARDEST: they are coloured yellow, green, blue, purple in that order.
   - Every tile in a puzzle must be different, and the puzzle must have exactly one solution. A tile may *look* like
     it belongs elsewhere (that is the fun), as long as the other group can still only be completed one way.
   - note: one sentence shown once the group is found. It is where the learning happens, so say something true
     and useful about the languages involved.
   tests/connections.test.js checks the shape of every puzzle. */
window.CONNECTIONS = [
  { id: 'hello', name: 'Hello, World', groups: [
    { title: 'Ways to print', items: ['print()', 'console.log()', 'printf()', 'System.out.println()'],
      note: 'The same job in Python, JavaScript, C and Java. Printing is the first thing you learn in every language.' },
    { title: 'Only in Python', items: ['elif', 'def', 'pass', 'None'],
      note: 'Python spells "else if" as elif, defines functions with def, uses pass for "do nothing", and calls its empty value None.' },
    { title: 'C memory management', items: ['malloc', 'free', 'sizeof', 'realloc'],
      note: 'In C you ask for memory yourself (malloc), resize it (realloc), measure things (sizeof) and must hand it back (free).' },
    { title: 'Special values in JavaScript', items: ['undefined', 'NaN', 'null', 'Infinity'],
      note: 'JavaScript has two kinds of "nothing" (undefined and null), a "not a number" number (NaN), and 1 / 0 is Infinity rather than a crash.' },
  ] },

  { id: 'whose', name: 'Whose line is it?', groups: [
    { title: 'Python', items: ['lambda', 'yield', 'for x in range', 'Best for AI / ML'],
      note: 'lambda makes a one-line function, yield makes a generator, and Python\'s huge data libraries made it the language of machine learning.' },
    { title: 'C++', items: ['cout', 'template', 'std::max', 'Game engines'],
      note: 'cout prints, templates write code that works for any type, std:: is the standard library, and most big game engines are C++.' },
    { title: 'C', items: ['malloc', 'typedef', '& (address of)', 'int main() {'],
      note: 'These work in C++ too, but they are the heart of C: manual memory, type nicknames and pointers to addresses.' },
    { title: 'Java', items: ['synchronized', 'extends', 'volatile', 'Everything is a class'],
      note: 'extends is inheritance; synchronized and volatile control threads. And in Java even "Hello World" has to live inside a class.' },
  ] },

  { id: 'spelling', name: 'Same idea, different spelling', groups: [
    { title: 'Declare a variable', items: ['let', 'var', 'const', 'val'],
      note: 'let and const are JavaScript (let is also Swift and Rust), var appears in many languages, and val is Kotlin\'s "cannot change".' },
    { title: 'Define a function', items: ['def', 'function', 'fn', 'func'],
      note: 'Python and Ruby say def, JavaScript and PHP say function, Rust says fn, and Go and Swift say func.' },
    { title: 'Nothing here', items: ['None', 'nil', 'NULL', 'nullptr'],
      note: 'Python\'s None, nil in Ruby, Go and Swift, C\'s NULL and C++\'s nullptr all mean "this points at nothing".' },
    { title: 'Else if', items: ['elif', 'else if', 'elsif', 'elseif'],
      note: 'Python: elif. C, Java and JavaScript: else if. Ruby: elsif. PHP also accepts elseif. Four spellings of one idea.' },
  ] },

  { id: 'wordplay', name: 'Hidden in plain sight', groups: [
    { title: 'Classic bugs', items: ['Stack overflow', 'Null pointer', 'Off by one', 'Infinite loop'],
      note: 'Runaway recursion, following a pointer to nothing, looping one time too many or too few, and a loop that never ends.' },
    { title: 'Starting with a keyword', items: ['While away', 'For sale', 'Break dance', 'Return ticket'],
      note: 'while, for, break and return are keywords in almost every language on this site.' },
    { title: 'Starting with a programming language', items: ['Rust belt', 'Ruby slippers', 'Swift exit', 'Java chip'],
      note: 'Rust (fast and memory-safe), Ruby (web apps), Swift (iPhone apps) and Java (Android, business software).' },
    { title: 'Ending with a data type', items: ['Root beer float', 'Body double', 'Silly string', 'Arctic char'],
      note: 'float and double hold decimal numbers, a string holds text, and a char holds a single character.' },
  ] },

  { id: 'symbols', name: 'Signs and symbols', groups: [
    { title: 'Comparisons', items: ['==', '===', '!=', '<='],
      note: '== asks "equal?", != asks "different?". JavaScript adds ===, which also checks the type, so 5 === "5" is false.' },
    { title: 'Change a variable', items: ['+=', '-=', '++', '*='],
      note: 'x += 5 is short for x = x + 5, and ++ adds one. Python has += but, unusually, no ++.' },
    { title: 'And, or, not', items: ['&&', '||', 'and', 'not'],
      note: 'C, Java and JavaScript use the symbols && and ||. Python uses the plain words and, or and not.' },
    { title: 'Start a comment', items: ['//', '#', '--', '<!--'],
      note: '// in C, Java and JavaScript, # in Python and Ruby, -- in SQL, and <!-- in HTML. (In C, -- also subtracts one.)' },
  ] },

  { id: 'world', name: 'Around the languages', groups: [
    { title: 'File extensions', items: ['.py', '.rs', '.kt', '.go'],
      note: 'Python, Rust, Kotlin and Go. The extension tells your tools which language a file is written in.' },
    { title: 'Package managers', items: ['pip', 'npm', 'cargo', 'gem'],
      note: 'They download other people\'s code for you: pip for Python, npm for JavaScript, cargo for Rust and gem for Ruby.' },
    { title: 'Language mascots', items: ['Gopher', 'Crab', 'Elephant', 'Coffee cup'],
      note: 'Go has a gopher, Rust a crab called Ferris, PHP an elephant, and Java is named after coffee.' },
    { title: 'Language creators', items: ['Guido van Rossum', 'Dennis Ritchie', 'Brendan Eich', 'James Gosling'],
      note: 'The people behind Python, C, JavaScript and Java. Brendan Eich wrote the first JavaScript in about ten days.' },
  ] },

  { id: 'containers', name: 'Where data lives', groups: [
    { title: 'Python collections', items: ['list', 'dict', 'tuple', 'set'],
      note: 'A list is ordered and changeable, a tuple is ordered and fixed, a set has no duplicates, and a dict maps keys to values.' },
    { title: 'Java collections', items: ['ArrayList', 'HashMap', 'HashSet', 'LinkedList'],
      note: 'Java names say how they work inside: ArrayList is Python\'s list, and HashMap is its dict.' },
    { title: 'Built into JavaScript', items: ['Array', 'Object', 'JSON', 'Promise'],
      note: 'Arrays and Objects hold data, JSON turns them into text and back, and a Promise is a value that arrives later.' },
    { title: 'C++ standard library', items: ['vector', 'unordered_map', 'deque', 'pair'],
      note: 'vector is the growable array, unordered_map the hash map, deque grows at both ends, and pair holds exactly two values.' },
  ] },

  { id: 'keywords', name: 'Keyword soup', groups: [
    { title: 'Handling errors', items: ['try', 'catch', 'finally', 'throw'],
      note: 'Try something risky, catch the error if it happens, and finally clean up either way. throw raises an error yourself.' },
    { title: 'Changing direction', items: ['break', 'continue', 'return', 'goto'],
      note: 'break leaves a loop, continue skips a round, return leaves a function, and goto (C) jumps anywhere and is best avoided.' },
    { title: 'Who can see it?', items: ['public', 'private', 'protected', 'internal'],
      note: 'Access modifiers in Java, C++ and C#. internal is C#\'s "only inside this project".' },
    { title: 'Rust keywords', items: ['fn', 'mut', 'impl', 'match'],
      note: 'fn defines a function, mut marks a variable as changeable (they are fixed by default), impl adds methods, and match is a powerful switch.' },
  ] },
];
