/* Small helpers that let a learner's Java program run from a single file, whatever its class is called.

   Java insists that "public class Main" lives in a file named Main.java. The online compiler always names the
   file prog.java, so a public class there would not compile. prep() removes "public" from top-level classes
   (and only there), which changes nothing else about the program and keeps every line number the same.

   mainClass() finds the class to run: the top-level class that contains "static void main". */
(function (root) {
  const TOP = /^public\s+(?=(?:(?:final|abstract|sealed|strictfp)\s+)*(?:class|interface|enum|record)\b)/gm;
  const prep = code => String(code).replace(TOP, '');
  function mainClass(code) {
    const src = String(code), at = src.search(/static\s+void\s+main\s*\(/);
    const decl = /^(?:(?:public|final|abstract|sealed|strictfp)\s+)*class\s+([A-Za-z_]\w*)/gm;
    let m, best = null, first = null;
    while ((m = decl.exec(src))) { first = first || m[1]; if (at < 0 || m.index < at) best = m[1]; }
    return best || first || 'Main';
  }
  const javaFix = { prep, mainClass };
  if (typeof module !== 'undefined' && module.exports) module.exports = javaFix; else root.javaFix = javaFix;
})(this);
