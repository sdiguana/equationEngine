function setParent(child, parent) {
    if(parent.children.contains(child.name)) {
        alert("child and parent attempted to be set in circular relationship. Action Aborted");
    }
    else
    {
        child.parent = parent;
    }
}