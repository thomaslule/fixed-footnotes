hljs.initHighlightingOnLoad();

document.getElementById("code-theme").style.display = "none";

var ffn = fixedFootnotes();

document.getElementById("button-no-theme").onclick = function() {
  document.getElementById("code-theme").style.display = "none";
  document.getElementById("code-no-theme").style.display = "";
  ffn.stop();
  document.getElementById("ffn-theme").setAttribute("href", "fixed-footnotes-1.1.1.css");
  ffn = fixedFootnotes();
}

document.getElementById("button-theme").onclick = function() {
  document.getElementById("code-theme").style.display = "";
  document.getElementById("code-no-theme").style.display = "none";
  ffn.stop();
  document.getElementById("ffn-theme").setAttribute("href", "theme.css");
  ffn = fixedFootnotes({
    fixedContainerLocation: "#column",
    transformNote: function(note) {
      note.getElementsByTagName("span")[0].firstChild.textContent += " and I modified it";
      return note;
    }
  });
}
