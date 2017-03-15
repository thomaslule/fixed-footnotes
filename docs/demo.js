hljs.initHighlightingOnLoad();
document.getElementById("code-theme").style.display = "none";
var ffn = fixedFootnotes();

document.getElementById("button-no-theme").onclick = function() {
  document.getElementById("code-theme").style.display = "none";
  document.getElementById("code-no-theme").style.display = "";
  ffn.stop();
  ffn = fixedFootnotes();
}

document.getElementById("button-theme").onclick = function() {
  document.getElementById("code-theme").style.display = "";
  document.getElementById("code-no-theme").style.display = "none";
  ffn.stop();
  ffn = fixedFootnotes({
    fixedContainerLocation: "#column",
    fixedContainerId: "fixedContainer"
  });
}
